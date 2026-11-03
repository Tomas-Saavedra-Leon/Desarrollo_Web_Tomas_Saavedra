document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.querySelector("form");
    const selectRegion = document.getElementById("region-voluntario");
    const selectComuna = document.getElementById("comuna-voluntario");

    if (selectRegion && selectComuna) {
        const todasLasComunas = Array.from(selectComuna.querySelectorAll("option"));

        selectRegion.addEventListener("change", function() {
            const regionId = this.value;

            selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

            if (regionId !== "") {
                todasLasComunas.forEach(opcion => {
                    if (opcion.dataset.region === regionId) {
                        selectComuna.appendChild(opcion.cloneNode(true));
                    }
                });
            }
        });
    }

    if (formulario) {
        formulario.addEventListener("submit", function(evento) {
            let errores = [];

            const nombre = document.getElementById("nombre-voluntario").value.trim();
            const email = document.getElementById("email-voluntario").value.trim();
            const region = selectRegion ? selectRegion.value : "";
            const comuna = selectComuna ? selectComuna.value : "";

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
    }
});