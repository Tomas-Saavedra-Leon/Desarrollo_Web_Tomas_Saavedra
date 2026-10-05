document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.querySelector("form");

    formulario.addEventListener("submit", function(evento) {
        let errores = [];

        const voluntario = document.getElementById("voluntario_id").value;
        const ave = document.getElementById("ave_id").value;
        const lugar = document.getElementById("lugar").value.trim();
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;

        const archivo = document.getElementById("archivo").files[0];

        if (voluntario === "") errores.push("Debe seleccionar un voluntario responsable.");
        if (ave === "") errores.push("Debe seleccionar el ave avistada.");

        if (lugar.length < 3) errores.push("El lugar del avistamiento debe ser más descriptivo (mín. 3 letras).");

        if (fecha === "") errores.push("Debe ingresar la fecha del avistamiento.");
        if (hora === "") errores.push("Debe ingresar la hora del avistamiento.");

        if (!archivo) {
            errores.push("Es obligatorio adjuntar una foto o video como evidencia.");
        } else {
            const nombreArchivo = archivo.name.toLowerCase();
            const extensionesValidas = /\.(png|jpg|jpeg|gif|mp4|avi|mov|webm)$/;

            if (!nombreArchivo.match(extensionesValidas)) {
                errores.push("El archivo no es válido. Solo se permiten imágenes (png, jpg, gif) o videos (mp4, avi, mov).");
            }
        }

        if (errores.length > 0) {
            evento.preventDefault();
            alert(errores.join("\n"));
        }
    });
});