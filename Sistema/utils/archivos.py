import os
import uuid


from werkzeug.utils import secure_filename

EXTENSIONES_PERMITIDAS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'mov', 'webm'}


def extension_valida(nombre_archivo):

    return '.' in nombre_archivo and \
        nombre_archivo.rsplit('.', 1)[1].lower() in EXTENSIONES_PERMITIDAS


def guardar_archivo(archivo):

    if not archivo or archivo.filename == '':
        return None

    if not extension_valida(archivo.filename):
        return None

    nombre_seguro = secure_filename(archivo.filename)

    nombre_unico = f"{uuid.uuid4().hex}_{nombre_seguro}"

    carpeta_destino = os.path.join('Sistema', 'static', 'archivos_subidos')

    os.makedirs(carpeta_destino, exist_ok=True)

    ruta_completa = os.path.join(carpeta_destino, nombre_unico)
    archivo.save(ruta_completa)


    return nombre_unico