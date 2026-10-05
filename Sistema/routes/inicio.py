
from flask import Blueprint, render_template


from Sistema.models.avistamiento import Avistamiento


inicio_bp = Blueprint('inicio_bp', __name__)


@inicio_bp.route('/')
def portada():

    ultimos_avistamientos = Avistamiento.query.order_by(Avistamiento.id.desc()).limit(2).all()

    return render_template('inicio/portada.html', avistamientos=ultimos_avistamientos)