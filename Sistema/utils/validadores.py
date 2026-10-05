from markupsafe import escape


def sanitizar_texto(texto):

    if not texto:
        return ""

    return str(escape(texto.strip()))


def validar_longitud(texto, min_len=1, max_len=100):

    if not texto:
        return False

    texto_limpio = texto.strip()
    return min_len <= len(texto_limpio) <= max_len


def es_correo_valido(email):

    if not email:
        return False

    email_limpio = email.strip()
    return '@' in email_limpio and '.' in email_limpio.split('@')[-1]