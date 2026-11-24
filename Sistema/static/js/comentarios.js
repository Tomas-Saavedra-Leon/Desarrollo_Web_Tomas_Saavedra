document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-comentario');
    const listado = document.getElementById('listado-comentarios');
    const avistamientoIdInput = document.getElementById('comentario-avistamiento-id');
    const feedback = document.getElementById('mensaje-feedback');

    if (!form || !listado || !avistamientoIdInput) {
        return;
    }

    const avistamientoId = avistamientoIdInput.value;

    const mostrarFeedback = (mensaje, tipo) => {
        if (!feedback) return;
        feedback.textContent = mensaje;
        feedback.className = `mensaje-feedback mensaje-feedback-${tipo}`;
    };

    const limpiarFeedback = () => {
        if (!feedback) return;
        feedback.textContent = '';
        feedback.className = 'mensaje-feedback-oculto';
    };

    const cargarComentarios = () => {
        fetch(`/api/comentarios/${encodeURIComponent(avistamientoId)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al consultar comentarios');
                }
                return res.json();
            })
            .then(data => {
                listado.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    const sinComentarios = document.createElement('p');
                    sinComentarios.textContent = 'Aún no hay comentarios registrados.';
                    listado.appendChild(sinComentarios);
                    return;
                }
                data.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'item-comentario';

                    const cabecera = document.createElement('div');
                    cabecera.className = 'cabecera-comentario';

                    const autor = document.createElement('strong');
                    autor.textContent = c.nombre;

                    const separador = document.createTextNode(' ');

                    const fecha = document.createElement('small');
                    fecha.textContent = `(${c.fecha})`;

                    cabecera.appendChild(autor);
                    cabecera.appendChild(separador);
                    cabecera.appendChild(fecha);

                    const cuerpo = document.createElement('p');
                    cuerpo.className = 'texto-comentario';
                    cuerpo.textContent = c.texto;

                    div.appendChild(cabecera);
                    div.appendChild(cuerpo);
                    listado.appendChild(div);
                });
            })
            .catch(() => {
                listado.innerHTML = '';
                const errorMsg = document.createElement('p');
                errorMsg.textContent = 'Error al cargar los comentarios.';
                listado.appendChild(errorMsg);
            });
    };

    cargarComentarios();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarFeedback();

        const inputNombre = document.getElementById('comentario-nombre');
        const inputTexto = document.getElementById('comentario-texto');

        const nombre = inputNombre ? inputNombre.value.trim() : '';
        const texto = inputTexto ? inputTexto.value.trim() : '';

        if (nombre.length < 3 || nombre.length > 50 || texto.length < 5 || texto.length > 300) {
            mostrarFeedback('Los datos no cumplen con los requisitos (nombre entre 3 y 50 caracteres, comentario entre 5 y 300).', 'error');
            return;
        }

        fetch('/api/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avistamiento_id: avistamientoId,
                nombre: nombre,
                texto: texto
            })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(errData => {
                    throw new Error(errData.error || 'Error en validación del servidor');
                });
            }
            return res.json();
        })
        .then(data => {
            form.reset();
            mostrarFeedback(data.mensaje || 'Comentario publicado correctamente.', 'exito');
            cargarComentarios();
        })
        .catch(error => {
            mostrarFeedback(error.message || 'Error al procesar la solicitud.', 'error');
        });
    });
});