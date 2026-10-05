from flask import Flask
from Sistema.models import db
from Sistema.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    from Sistema.routes import registrar_rutas
    registrar_rutas(app)

    return app