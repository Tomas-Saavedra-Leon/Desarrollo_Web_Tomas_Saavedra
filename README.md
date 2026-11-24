# Desarrollo_Web_Tomas_Saavedra



```bash
cat << 'EOF' > ~/PycharmProjects/Desarrollo_Web_Tomas_Saavedra/README.md
# Sistema de Avistamiento de Aves

Proyecto web compuesto por la aplicación principal en Flask (`Sistema/`) y el módulo de búsqueda y evaluación en Spring Boot (`Sistema/buscador/`).

## Ejecución

1. Cargar la tabla de notas en MySQL/MariaDB:
   ```bash
   mysql -u cc5002 -pprogramacionweb tarea2 < SQL/tabla-nota.sql

```

2. Levantar el sistema principal (puerto 5000):
```bash
python run.py

```


3. Levantar el buscador (puerto 8080):
```bash
cd Sistema/buscador && mvn spring-boot:run

```



## Decisiones Técnicas

* **Backend (Spring Boot + JPA):** Se organizó en `model`, `repositorio` y `controlador`, usando `JOIN FETCH` para evitar consultas N+1 al filtrar por ave, voluntario o comuna, y `ddl-auto=none` para mantener intactas las tablas de `tarea2`.
* **Búsqueda y seguridad (XSS):** La búsqueda usa `fetch` en tiempo real y resalta coincidencias con `<mark>` y `document.createTextNode` en lugar de `innerHTML` para evitar inyección de código.
* **Evaluaciones:** Se valida tanto en cliente como en servidor que la nota sea un entero entre 1 y 7, recalculando el promedio con `AVG` en SQL y actualizando la tabla en pantalla sin recargar la página.
* **Estándares:** Todo el CSS y JS va en archivos externos cumpliendo las validaciones W3C de HTML5 y CSS3.
EOF

```

```