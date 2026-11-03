from flask import jsonify
from sqlalchemy import func
from Sistema.models import db
from Sistema.models.ave import Ave
from Sistema.models.comuna import Comuna
from Sistema.models.voluntario import Voluntario
from flask import Blueprint, render_template


from Sistema.models.avistamiento import Avistamiento


inicio_bp = Blueprint('inicio_bp', __name__)


@inicio_bp.route('/')
def portada():

    ultimos_avistamientos = Avistamiento.query.order_by(Avistamiento.id.desc()).limit(2).all()

    return render_template('inicio/portada.html', avistamientos=ultimos_avistamientos)

@inicio_bp.route('/estadisticas')
def estadisticas():
    return render_template('inicio/estadisticas.html')


@inicio_bp.route('/api/estadisticas')
def api_estadisticas():
    avistamientos_por_dia = db.session.query(
        func.date(Avistamiento.fecha_hora).label('fecha'),
        func.count(Avistamiento.id)
    ).group_by('fecha').order_by('fecha').all()

    datos_lineas = [[str(a[0]), a[1]] for a in avistamientos_por_dia]

    avistamientos_por_ave = db.session.query(
        Ave.nombre,
        func.count(Avistamiento.id)
    ).join(Avistamiento).group_by(Ave.nombre).all()

    datos_torta = [{"name": a[0], "y": a[1]} for a in avistamientos_por_ave]

    voluntarios_por_comuna = db.session.query(
        Comuna.nombre,
        func.count(Voluntario.id)
    ).join(Voluntario).group_by(Comuna.nombre).all()

    datos_barras = {
        "comunas": [v[0] for v in voluntarios_por_comuna],
        "totales": [v[1] for v in voluntarios_por_comuna]
    }

    return jsonify({
        "lineas": datos_lineas,
        "torta": datos_torta,
        "barras": datos_barras
    })
