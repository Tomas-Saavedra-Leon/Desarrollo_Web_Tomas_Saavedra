document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-comentario');
    const listado = document.getElementById('listado-comentarios');
    const avistamientoId = document.getElementById('comentario-avistamiento-id').value;
    const feedback = document.getElementById('mensaje-feedback');

    const cargarComentarios = () => {
        fetch(`/api/comentarios/${avistamientoId}`)
            .then(res => res.json())
            .then(data => {
                listado.innerHTML = '';
                if (data.length === 0) {
                    listado.innerHTML = '<p>No hay comentarios</p>';
                    return;
                }
                data.forEach(c => {
                    const div = document.createElement('div');
                    div.style.borderBottom = '1px solid #ccc';
                    div.style.marginBottom = '10px';
                    div.style.paddingBottom = '10px';
                    div.innerHTML = `<strong>${c.nombre}</strong> <small>(${c.fecha})</small><p style="margin-top: 5px;">${c.texto}</p>`;
                    listado.appendChild(div);
                });
            });
    };

    cargarComentarios();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('comentario-nombre').value.trim();
        const texto = document.getElementById('comentario-texto').value.trim();

        if (nombre.length < 3 || nombre.length > 50 || texto.length < 5) {
            feedback.style.display = 'block';
            feedback.style.backgroundColor = '#f8d7da';
            feedback.style.color = '#721c24';
            feedback.innerText = 'Los datos no cumplen con los requisitos';
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
            if (!res.ok) throw new Error('error en validación del servidor');
            return res.json();
        })
        .then(data => {
            form.reset();
            feedback.style.display = 'block';
            feedback.style.backgroundColor = '#d4edda';
            feedback.style.color = '#155724';
            feedback.innerText = data.mensaje;
            cargarComentarios();
        })
        .catch(error => {
            feedback.style.display = 'block';
            feedback.style.backgroundColor = '#f8d7da';
            feedback.style.color = '#721c24';
            feedback.innerText = 'error al procesar la solicitud.';
        });
    });
});