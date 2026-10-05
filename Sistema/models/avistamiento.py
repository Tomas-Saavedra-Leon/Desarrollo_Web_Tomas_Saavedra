from Sistema.models import db


class Avistamiento(db.Model):

    __tablename__ = 'avistamiento'


    id = db.Column(db.Integer, primary_key=True)

    voluntario_id = db.Column(db.Integer, db.ForeignKey('voluntario.id'), nullable=False)

    ave_id = db.Column(db.Integer, db.ForeignKey('ave.id'), nullable=False)

    fecha_hora = db.Column(db.DateTime, nullable=False)


    lugar = db.Column(db.String(200), nullable=False)

    descripcion = db.Column(db.Text)

    ave = db.relationship('Ave', backref='avistamientos')

    voluntario = db.relationship('Voluntario', backref='avistamientos')

    registros = db.relationship('Registro', backref='avistamiento')