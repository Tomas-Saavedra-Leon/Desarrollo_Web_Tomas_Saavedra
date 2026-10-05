from Sistema.models import db
from datetime import datetime

class Voluntario(db.Model):
    __tablename__ = 'voluntario'

    id = db.Column(db.Integer, primary_key=True)

    nombre = db.Column(db.String(255), nullable=False)

    email = db.Column(db.String(80), nullable=False)

    telefono = db.Column(db.String(15), nullable=False)

    fecha_registro = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)