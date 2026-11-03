from flask import Blueprint, render_template, request, flash, redirect, url_for
from datetime import datetime
from Sistema.models import db
from Sistema.models.avistamiento import Avistamiento
from Sistema.models.registro import Registro
from Sistema.models.voluntario import Voluntario
from Sistema.models.ave import Ave
from Sistema.utils.validadores import sanitizar_texto
from Sistema.utils.archivos import guardar_archivo
from Sistema.models.comentario import Comentario
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

@avistamientos_bp.route('/api/comentarios/<int:avistamiento_id>', methods=['GET'])
def obtener_comentarios(avistamiento_id):
    comentarios = Comentario.query.filter_by(avistamiento_id=avistamiento_id).order_by(Comentario.fecha.desc()).all()
    data = [{
        'nombre': c.nombre,
        'texto': c.texto,
        'fecha': c.fecha.strftime('%Y-%m-%d %H:%M:%S')
    } for c in comentarios]
    return jsonify(data)

@avistamientos_bp.route('/api/comentarios', methods=['POST'])
def agregar_comentario():
    data = request.get_json()
    avistamiento_id = data.get('avistamiento_id')
    nombre = data.get('nombre')
    texto = data.get('texto')

    if not nombre or len(nombre) < 3 or len(nombre) > 50:
        return jsonify({'error': 'Nombre inválido'}), 400

    if not texto or len(texto) < 5:
        return jsonify({'error': 'Texto inválido'}), 400

    nuevo_comentario = Comentario(
        nombre=nombre,
        texto=texto,
        avistamiento_id=int(avistamiento_id),
        fecha=datetime.now()
    )
    db.session.add(nuevo_comentario)
    db.session.commit()

    return jsonify({'mensaje': 'Comentario agregado'}), 201

@avistamientos_bp.route('/avistamiento/<int:id>')
def detalle(id):
    avistamiento = Avistamiento.query.get_or_404(id)
    return render_template('avistamientos/detalle.html', avistamiento=avistamiento)