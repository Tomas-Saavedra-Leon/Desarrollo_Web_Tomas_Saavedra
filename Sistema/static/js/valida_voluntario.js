document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.querySelector("form");

    formulario.addEventListener("submit", function(evento) {

        let errores = [];

        const nombre = document.getElementById("nombre-voluntario").value.trim();
        const email = document.getElementById("email-voluntario").value.trim();
        const region = document.getElementById("region-voluntario").value;
        const comuna = document.getElementById("comuna-voluntario").value;

        if (nombre.length < 3) {
            errores.push("Error: El nombre debe tener al menos 3 caracteres.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errores.push("Error: Ingrese un correo electrónico válido.");
        }

        if (region === "") {
            errores.push("Error: Debe seleccionar una región.");
        }
        if (comuna === "") {
            errores.push("Error: Debe seleccionar una comuna.");
        }

        if (errores.length > 0) {
            evento.preventDefault();

            alert(errores.join("\n"));
        }
    });
});