
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from Sistema.models.region import Region

from Sistema.models.comuna import Comuna

from Sistema.models.ave import Ave

from Sistema.models.voluntario import Voluntario

from Sistema.models.avistamiento import Avistamiento

from Sistema.models.registro import Registro