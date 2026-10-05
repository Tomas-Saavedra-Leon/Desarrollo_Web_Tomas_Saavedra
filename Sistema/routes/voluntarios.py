from flask import Blueprint, render_template, request, flash

from Sistema.models import db
from Sistema.models.voluntario import Voluntario

from Sistema.models.region import Region
from Sistema.models.comuna import Comuna

from Sistema.utils.validadores import sanitizar_texto, es_correo_valido

voluntarios_bp = Blueprint('voluntarios_bp', __name__)


@voluntarios_bp.route('/registrar_voluntario', methods=['GET', 'POST'])
def registrar():
    regiones_db = Region.query.all()
    comunas_db = Comuna.query.all()

    if request.method == 'POST':

        nombre_seguro = sanitizar_texto(request.form.get('nombre-voluntario'))
        email_seguro = sanitizar_texto(request.form.get('email-voluntario'))
        telefono_seguro = sanitizar_texto(request.form.get('telefono-voluntario'))
        region_id = request.form.get('region-voluntario')
        comuna_id = request.form.get('comuna-voluntario')
        errores = []

        if not nombre_seguro or len(nombre_seguro) < 3:
            errores.append("Error: El nombre es obligatorio y debe tener al menos 3 caracteres.")
        if not es_correo_valido(email_seguro):
            errores.append("Error: Debe ingresar un correo electrónico válido.")


        if not telefono_seguro:
            errores.append("Error: Debe ingresar su número de teléfono.")

        if not region_id or not comuna_id:
            errores.append("Error: Debe seleccionar obligatoriamente una región y una comuna.")

        if errores:
            for error in errores:
                flash(error, "error")

            return render_template('voluntarios/registro.html',
                                   nombre=nombre_seguro,
                                   email=email_seguro,
                                   telefono=telefono_seguro,
                                   regiones=regiones_db,
                                   comunas=comunas_db)


        nuevo_voluntario = Voluntario(
            nombre=nombre_seguro,
            email=email_seguro,
            telefono=telefono_seguro,
            comuna_id=int(comuna_id)
        )

        db.session.add(nuevo_voluntario)
        db.session.commit()

        return render_template('voluntarios/exito.html', voluntario=nuevo_voluntario)


    return render_template('voluntarios/registro.html', regiones=regiones_db, comunas=comunas_db)