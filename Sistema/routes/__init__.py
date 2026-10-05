
def registrar_rutas(app):

    from Sistema.routes.inicio import inicio_bp

    from Sistema.routes.voluntarios import voluntarios_bp

    from Sistema.routes.avistamientos import avistamientos_bp

    app.register_blueprint(inicio_bp)

    app.register_blueprint(voluntarios_bp)

    app.register_blueprint(avistamientos_bp)