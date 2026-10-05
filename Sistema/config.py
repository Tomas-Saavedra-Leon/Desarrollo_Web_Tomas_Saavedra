import os

class Config:

    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super_secreto_desarrollo_web'


    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'


    SQLALCHEMY_TRACK_MODIFICATIONS = False