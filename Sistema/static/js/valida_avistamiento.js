document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.querySelector("form");
    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", function(evento) {
        let errores = [];

        const voluntario = document.getElementById("voluntario-id");
        const ave = document.getElementById("ave-avistamiento");
        const lugar = document.getElementById("lugar-avistamiento");
        const fechaHora = document.getElementById("fecha-hora");
        const inputArchivos = document.getElementById("foto-video");

        if (!voluntario || voluntario.value === "") {
            errores.push("Debe seleccionar un voluntario responsable.");
        }

        if (!ave || ave.value === "") {
            errores.push("Debe seleccionar el ave avistada.");
        }

        if (!lugar || lugar.value.trim().length < 3) {
            errores.push("El lugar del avistamiento debe tener al menos 3 caracteres.");
        }

        if (!fechaHora || fechaHora.value === "") {
            errores.push("Debe ingresar la fecha y hora del avistamiento.");
        }

        if (!inputArchivos || inputArchivos.files.length === 0) {
            errores.push("Debe adjuntar al menos un archivo (foto o video) como evidencia.");
        } else if (inputArchivos.files.length > 5) {
            errores.push("Solo se permite un máximo de 5 archivos por avistamiento.");
        } else {
            const extensionesValidas = /\.(png|jpg|jpeg|gif|mp4|avi|mov|webm)$/i;
            for (let i = 0; i < inputArchivos.files.length; i++) {
                const nombreArchivo = inputArchivos.files[i].name.toLowerCase();
                if (!nombreArchivo.match(extensionesValidas)) {
                    errores.push(`El archivo "${inputArchivos.files[i].name}" tiene una extensión no permitida.`);
                    break;
                }
            }
        }

        if (errores.length > 0) {
            evento.preventDefault();
            alert(errores.join("\n"));
        }
    });
});