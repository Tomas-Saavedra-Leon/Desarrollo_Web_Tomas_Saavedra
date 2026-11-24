import os
from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from datetime import datetime
from Sistema.models import db
from Sistema.models.avistamiento import Avistamiento
from Sistema.models.registro import Registro
from Sistema.models.voluntario import Voluntario
from Sistema.models.ave import Ave
from Sistema.models.comentario import Comentario
from Sistema.utils.validadores import sanitizar_texto
from Sistema.utils.archivos import guardar_archivo, extension_valida

avistamientos_bp = Blueprint('avistamientos_bp', __name__)

@avistamientos_bp.route('/agregar-avistamiento', methods=['GET', 'POST'])
def registrar():
    voluntarios_db = Voluntario.query.order_by(Voluntario.nombre.asc()).all()
    aves_db = Ave.query.order_by(Ave.nombre.asc()).all()

    if request.method == 'POST':
        voluntario_id_str = request.form.get('voluntario-id')
        ave_id_str = request.form.get('ave-avistamiento')
        lugar_seguro = sanitizar_texto(request.form.get('lugar-avistamiento'))
        fecha_hora_str = request.form.get('fecha-hora')
        descripcion_segura = sanitizar_texto(request.form.get('descripcion-avistamiento'))
        archivos = request.files.getlist('foto-video')
        archivos_validos = [f for f in archivos if f and f.filename.strip() != '']

        errores = []

        if not voluntario_id_str:
            errores.append("Debe seleccionar un voluntario responsable.")
        if not ave_id_str:
            errores.append("Debe seleccionar el ave avistada.")
        if not lugar_seguro or len(lugar_seguro) < 3:
            errores.append("El lugar del avistamiento debe tener al menos 3 caracteres.")
        if not fecha_hora_str:
            errores.append("Debe ingresar la fecha y hora del avistamiento.")

        if len(archivos_validos) < 1 or len(archivos_validos) > 5:
            errores.append("Debe adjuntar entre 1 y 5 archivos (fotos o videos).")
        else:
            for archivo in archivos_validos:
                if not extension_valida(archivo.filename):
                    errores.append(f"Archivo no permitido: {archivo.filename}. Extensiones válidas: png, jpg, jpeg, gif, mp4, avi, mov, webm.")
                    break

        voluntario_obj = None
        ave_obj = None

        if voluntario_id_str:
            try:
                voluntario_obj = Voluntario.query.get(int(voluntario_id_str))
                if not voluntario_obj:
                    errores.append("El voluntario seleccionado no existe en el sistema.")
            except (ValueError, TypeError):
                errores.append("Identificador de voluntario inválido.")

        if ave_id_str:
            try:
                ave_obj = Ave.query.get(int(ave_id_str))
                if not ave_obj:
                    errores.append("El ave seleccionada no existe en el sistema.")
            except (ValueError, TypeError):
                errores.append("Identificador de ave inválido.")

        fecha_hora_dt = None
        if fecha_hora_str:
            try:
                fecha_hora_dt = datetime.strptime(fecha_hora_str, '%Y-%m-%dT%H:%M')
            except ValueError:
                errores.append("Formato de fecha y hora inválido.")

        voluntario_sel = int(voluntario_id_str) if voluntario_id_str and voluntario_id_str.isdigit() else None
        ave_sel = int(ave_id_str) if ave_id_str and ave_id_str.isdigit() else None

        if errores:
            for error in errores:
                flash(error, "error")
            return render_template(
                'avistamientos/registro.html',
                voluntarios=voluntarios_db,
                aves=aves_db,
                voluntario_seleccionado=voluntario_sel,
                ave_seleccionada=ave_sel,
                lugar=lugar_seguro,
                fecha_hora=fecha_hora_str,
                descripcion=descripcion_segura
            )

        archivos_guardados = []
        try:
            nuevo_avistamiento = Avistamiento(
                voluntario_id=voluntario_obj.id,
                ave_id=ave_obj.id,
                lugar=lugar_seguro,
                fecha_hora=fecha_hora_dt,
                descripcion=descripcion_segura if descripcion_segura else None
            )
            db.session.add(nuevo_avistamiento)
            db.session.flush()

            for archivo in archivos_validos:
                nombre_guardado = guardar_archivo(archivo)
                if not nombre_guardado:
                    raise ValueError(f"No se pudo guardar el archivo {archivo.filename}")
                archivos_guardados.append(nombre_guardado)

                nuevo_registro = Registro(
                    ruta_archivo=nombre_guardado,
                    nombre_archivo=archivo.filename,
                    avistamiento_id=nuevo_avistamiento.id
                )
                db.session.add(nuevo_registro)

            db.session.commit()
            flash("¡Avistamiento registrado exitosamente!", "exito")
            return redirect(url_for('inicio_bp.portada'))

        except Exception as e:
            db.session.rollback()
            carpeta_destino = os.path.join('Sistema', 'static', 'archivos_subidos')
            for guardado in archivos_guardados:
                ruta_borrar = os.path.join(carpeta_destino, guardado)
                if os.path.exists(ruta_borrar):
                    try:
                        os.remove(ruta_borrar)
                    except OSError:
                        pass
            flash("Ocurrió un error al registrar el avistamiento. Intente nuevamente.", "error")
            return render_template(
                'avistamientos/registro.html',
                voluntarios=voluntarios_db,
                aves=aves_db,
                voluntario_seleccionado=voluntario_sel,
                ave_seleccionada=ave_sel,
                lugar=lugar_seguro,
                fecha_hora=fecha_hora_str,
                descripcion=descripcion_segura
            )

    voluntario_preseleccionado = request.args.get('voluntario_id', type=int)
    return render_template(
        'avistamientos/registro.html',
        voluntarios=voluntarios_db,
        aves=aves_db,
        voluntario_seleccionado=voluntario_preseleccionado
    )

@avistamientos_bp.route('/listado')
def listado():
    page = request.args.get('page', 1, type=int)
    avistamientos_paginados = Avistamiento.query.order_by(Avistamiento.fecha_hora.desc()).paginate(
        page=page,
        per_page=5,
        error_out=False
    )
    return render_template('avistamientos/listado.html', paginacion=avistamientos_paginados)

@avistamientos_bp.route('/api/comentarios/<int:avistamiento_id>', methods=['GET'])
def obtener_comentarios(avistamiento_id):
    comentarios = Comentario.query.filter_by(avistamiento_id=avistamiento_id).order_by(Comentario.fecha.desc()).all()
    data = [{
        'id': c.id,
        'nombre': c.nombre,
        'texto': c.texto,
        'fecha': c.fecha.strftime('%Y-%m-%d %H:%M:%S')
    } for c in comentarios]
    return jsonify(data)

@avistamientos_bp.route('/api/comentarios', methods=['POST'])
def agregar_comentario():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Cuerpo de solicitud inválido'}), 400

    avistamiento_id = data.get('avistamiento_id')
    nombre = sanitizar_texto(data.get('nombre', ''))
    texto = sanitizar_texto(data.get('texto', ''))

    if not avistamiento_id:
        return jsonify({'error': 'Identificador de avistamiento requerido'}), 400

    try:
        avistamiento_id_int = int(avistamiento_id)
        avistamiento = Avistamiento.query.get(avistamiento_id_int)
        if not avistamiento:
            return jsonify({'error': 'Avistamiento no encontrado'}), 404
    except (ValueError, TypeError):
        return jsonify({'error': 'Identificador de avistamiento inválido'}), 400

    if not nombre or len(nombre) < 3 or len(nombre) > 50:
        return jsonify({'error': 'Nombre inválido (debe tener entre 3 y 50 caracteres)'}), 400

    if not texto or len(texto) < 5 or len(texto) > 300:
        return jsonify({'error': 'Texto inválido (debe tener entre 5 y 300 caracteres)'}), 400

    nuevo_comentario = Comentario(
        nombre=nombre,
        texto=texto,
        avistamiento_id=avistamiento_id_int,
        fecha=datetime.now()
    )
    db.session.add(nuevo_comentario)
    db.session.commit()

    return jsonify({'mensaje': 'Comentario agregado exitosamente'}), 201

@avistamientos_bp.route('/avistamiento/<int:id>')
def detalle(id):
    avistamiento = Avistamiento.query.get_or_404(id)
    return render_template('avistamientos/detalle.html', avistamiento=avistamiento)