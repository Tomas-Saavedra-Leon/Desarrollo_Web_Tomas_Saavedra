document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.querySelector("form");
    const selectRegion = document.getElementById("region-voluntario");
    const selectComuna = document.getElementById("comuna-voluntario");

    if (selectRegion && selectComuna) {
        const todasLasComunas = Array.from(selectComuna.querySelectorAll("option")).slice(1);
        const valorInicialComuna = selectComuna.value;

        function filtrarComunas(mantenerSeleccion) {
            const regionId = selectRegion.value;
            const seleccionActual = mantenerSeleccion ? valorInicialComuna : "";

            selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

            if (regionId !== "") {
                todasLasComunas.forEach(opcion => {
                    if (opcion.dataset.region === regionId) {
                        const nuevaOpcion = document.createElement("option");
                        nuevaOpcion.value = opcion.value;
                        nuevaOpcion.textContent = opcion.textContent;
                        nuevaOpcion.dataset.region = opcion.dataset.region;
                        if (opcion.value === seleccionActual) {
                            nuevaOpcion.selected = true;
                        }
                        selectComuna.appendChild(nuevaOpcion);
                    }
                });
            }
        }

        selectRegion.addEventListener("change", function() {
            filtrarComunas(false);
        });

        if (selectRegion.value !== "") {
            filtrarComunas(true);
        }
    }

    if (formulario) {
        formulario.addEventListener("submit", function(evento) {
            let errores = [];

            const inputNombre = document.getElementById("nombre-voluntario");
            const inputEmail = document.getElementById("email-voluntario");
            const inputTelefono = document.getElementById("telefono-voluntario");

            const nombre = inputNombre ? inputNombre.value.trim() : "";
            const email = inputEmail ? inputEmail.value.trim() : "";
            const telefono = inputTelefono ? inputTelefono.value.trim() : "";
            const region = selectRegion ? selectRegion.value : "";
            const comuna = selectComuna ? selectComuna.value : "";

            if (nombre.length < 3) {
                errores.push("Error: El nombre debe tener al menos 3 caracteres.");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errores.push("Error: Ingrese un correo electrónico válido.");
            }

            if (telefono.length < 8) {
                errores.push("Error: Ingrese un teléfono de contacto válido.");
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