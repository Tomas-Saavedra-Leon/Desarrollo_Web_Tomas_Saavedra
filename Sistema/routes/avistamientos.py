from flask import Blueprint, render_template, request, flash, redirect, url_for
from datetime import datetime
from Sistema.models import db
from Sistema.models.avistamiento import Avistamiento
from Sistema.models.registro import Registro
from Sistema.models.voluntario import Voluntario
from Sistema.models.ave import Ave
from Sistema.utils.validadores import sanitizar_texto
from Sistema.utils.archivos import guardar_archivo

avistamientos_bp = Blueprint('avistamientos_bp', __name__)


@avistamientos_bp.route('/agregar-avistamiento', methods=['GET', 'POST'])
def registrar():
    voluntarios_db = Voluntario.query.all()
    aves_db = Ave.query.order_by(Ave.nombre.asc()).all()

    if request.method == 'POST':
        voluntario_id = request.form.get('voluntario-id')
        ave_id = request.form.get('ave-avistamiento')
        lugar_seguro = sanitizar_texto(request.form.get('lugar-avistamiento'))
        fecha_hora_str = request.form.get('fecha-hora')
        descripcion_segura = sanitizar_texto(request.form.get('descripcion-avistamiento'))
        archivo = request.files.get('foto-video')

        errores = []

        if not voluntario_id or not ave_id or not lugar_seguro or not fecha_hora_str:
            errores.append("Faltan campos obligatorios por rellenar.")

        if not archivo or archivo.filename == '':
            errores.append("Debe subir una foto o video como evidencia.")

        if errores:
            for error in errores:
                flash(error, "error")
            return render_template('avistamientos/registro.html', voluntarios=voluntarios_db, aves=aves_db)

        try:
            fecha_hora_dt = datetime.strptime(fecha_hora_str, '%Y-%m-%dT%H:%M')
        except ValueError:
            flash("Formato de fecha inválido.", "error")
            return render_template('avistamientos/registro.html', voluntarios=voluntarios_db, aves=aves_db)

        nombre_archivo_guardado = guardar_archivo(archivo)
        if not nombre_archivo_guardado:
            flash("Error al procesar el archivo o extensión no permitida.", "error")
            return render_template('avistamientos/registro.html', voluntarios=voluntarios_db, aves=aves_db)

        nuevo_avistamiento = Avistamiento(
            voluntario_id=int(voluntario_id),
            ave_id=int(ave_id),
            lugar=lugar_seguro,
            fecha_hora=fecha_hora_dt,
            descripcion=descripcion_segura if descripcion_segura else None
        )

        db.session.add(nuevo_avistamiento)
        db.session.commit()

        nuevo_registro = Registro(
            ruta_archivo=nombre_archivo_guardado,
            nombre_archivo=archivo.filename,
            avistamiento_id=nuevo_avistamiento.id
        )

        db.session.add(nuevo_registro)
        db.session.commit()

        return redirect(url_for('avistamientos_bp.listado'))

    return render_template('avistamientos/registro.html', voluntarios=voluntarios_db, aves=aves_db)


@avistamientos_bp.route('/listado')
def listado():
    page = request.args.get('page', 1, type=int)
    avistamientos_paginados = Avistamiento.query.order_by(Avistamiento.fecha_hora.desc()).paginate(page=page,
                                                                                                   per_page=5,
                                                                                                   error_out=False)
    return render_template('avistamientos/listado.html', paginacion=avistamientos_paginados)