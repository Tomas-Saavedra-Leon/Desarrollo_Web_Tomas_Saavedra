document.addEventListener("DOMContentLoaded", () => {
    let voluntariosGuardados = [];
    let avistamientosGuardados = [];

    const formVoluntario = document.getElementById("form-voluntario");
    if (formVoluntario) {
        formVoluntario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const validadorTexto = (texto) => texto && texto.trim().length > 2;
            const validadorEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const validadorSelect = (opcion) => opcion !== "";

            let inputNombre = document.getElementById("nombre-voluntario");
            let inputEmail = document.getElementById("email-voluntario");
            let inputRegion = document.getElementById("region-voluntario");
            let inputComuna = document.getElementById("comuna-voluntario");

            let esValido = true;

            if (!validadorTexto(inputNombre.value)) {
                document.getElementById("error-nombre-vol").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-nombre-vol").classList.remove("visible");
            }

            if (!validadorEmail(inputEmail.value)) {
                document.getElementById("error-email-vol").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-email-vol").classList.remove("visible");
            }

            if (!validadorSelect(inputRegion.value)) {
                document.getElementById("error-region-vol").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-region-vol").classList.remove("visible");
            }

            if (!validadorTexto(inputComuna.value)) {
                document.getElementById("error-comuna-vol").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-comuna-vol").classList.remove("visible");
            }

            if (esValido) {
                voluntariosGuardados.push({
                    nombre: inputNombre.value.trim(),
                    email: inputEmail.value,
                    region: inputRegion.value,
                    comuna: inputComuna.value.trim()
                });

                actualizarMetricas();
                alert("Registro de voluntario exitoso.");
                formVoluntario.reset();
            }
        });
    }

    const formAvistamiento = document.getElementById("form-avistamiento");
    if (formAvistamiento) {
        formAvistamiento.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const validadorTexto = (texto) => texto && texto.trim().length > 0;
            const validadorFecha = (fechaStr) => {
                if (!fechaStr) return false;
                const fechaIngresada = new Date(fechaStr);
                const fechaActual = new Date();
                fechaActual.setHours(0,0,0,0);
                return fechaIngresada <= fechaActual;
            };

            let inputTipo = document.getElementById("tipo-ave");
            let inputNombre = document.getElementById("nombre-ave");
            let inputLugar = document.getElementById("lugar-ave");
            let inputFecha = document.getElementById("fecha-ave");
            let inputHora = document.getElementById("hora-ave");
            let inputFile = document.getElementById("archivo-ave");

            let esValido = true;

            if (!validadorTexto(inputTipo.value)) {
                document.getElementById("error-tipo-ave").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-tipo-ave").classList.remove("visible");
            }

            if (!validadorTexto(inputNombre.value)) {
                document.getElementById("error-nombre-ave").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-nombre-ave").classList.remove("visible");
            }

            if (!validadorTexto(inputLugar.value)) {
                document.getElementById("error-lugar-ave").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-lugar-ave").classList.remove("visible");
            }

            if (!validadorFecha(inputFecha.value)) {
                document.getElementById("error-fecha-ave").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-fecha-ave").classList.remove("visible");
            }

            if (!validadorTexto(inputHora.value)) {
                document.getElementById("error-hora-ave").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-hora-ave").classList.remove("visible");
            }

            if (inputFile.files.length === 0) {
                document.getElementById("error-archivo-ave").classList.add("visible");
                esValido = false;
            } else {
                document.getElementById("error-archivo-ave").classList.remove("visible");
            }

            if (esValido) {
                avistamientosGuardados.push({
                    tipo: inputTipo.value.trim(),
                    nombre: inputNombre.value.trim(),
                    lugar: inputLugar.value.trim(),
                    fecha: inputFecha.value,
                    hora: inputHora.value,
                    archivo: inputFile.files[0].name
                });

                renderizarLista();
                actualizarMetricas();
                alert("Avistamiento registrado correctamente.");
                formAvistamiento.reset();
            }
        });
    }

    let paginaActual = 1;
    const itemsPorPagina = 2;

    const filtroTipo = document.getElementById("filtro-tipo");
    const ordenLista = document.getElementById("orden-lista");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const contenedorPaginado = document.getElementById("contenedor-paginado");
    const textoPagina = document.getElementById("texto-pagina");

    const renderizarLista = () => {
        if (!contenedorPaginado) return;

        let listaFiltrada = avistamientosGuardados.filter(a => {
            const textoFiltro = filtroTipo.value.toLowerCase().trim();
            return textoFiltro === "" || a.tipo.toLowerCase().includes(textoFiltro);
        });

        listaFiltrada.sort((a, b) => {
            if (ordenLista.value === "fecha-desc") {
                return new Date(b.fecha) - new Date(a.fecha);
            } else if (ordenLista.value === "fecha-asc") {
                return new Date(a.fecha) - new Date(b.fecha);
            } else if (ordenLista.value === "lugar-asc") {
                return a.lugar.localeCompare(b.lugar);
            }
            return 0;
        });

        const totalPaginas = Math.ceil(listaFiltrada.length / itemsPorPagina) || 1;
        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const itemsPagina = listaFiltrada.slice(inicio, fin);

        contenedorPaginado.innerHTML = "";

        itemsPagina.forEach(item => {
            const divItem = document.createElement("div");
            divItem.className = "registro-item";

            const info = document.createElement("p");
            info.innerText = `Ave: ${item.nombre} (${item.tipo}) | Lugar: ${item.lugar} | Fecha: ${item.fecha} a las ${item.hora}`;

            const fileInfo = document.createElement("small");
            fileInfo.innerHTML = `<a href="#" style="color:blue;">Ver archivo adjunto: ${item.archivo}</a>`;
            fileInfo.style.display = "block";

            divItem.appendChild(info);
            divItem.appendChild(fileInfo);
            contenedorPaginado.appendChild(divItem);
        });

        textoPagina.innerText = `Página ${paginaActual} de ${totalPaginas}`;
        btnAnterior.disabled = paginaActual === 1 || totalPaginas === 0;
        btnSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
    };

    if (filtroTipo) filtroTipo.addEventListener("input", () => { paginaActual = 1; renderizarLista(); });
    if (ordenLista) ordenLista.addEventListener("change", () => { paginaActual = 1; renderizarLista(); });
    if (btnAnterior) btnAnterior.addEventListener("click", () => { if (paginaActual > 1) { paginaActual--; renderizarLista(); } });
    if (btnSiguiente) btnSiguiente.addEventListener("click", () => { if (paginaActual < Math.ceil(avistamientosGuardados.length / itemsPorPagina)) { paginaActual++; renderizarLista(); } });

    const actualizarMetricas = () => {
        const totalAvesElem = document.getElementById("total-metricas-aves");
        const contenedorGraficoAves = document.getElementById("grafico-avistamientos");

        if (totalAvesElem && contenedorGraficoAves) {
            const totalAves = avistamientosGuardados.length;
            totalAvesElem.innerText = totalAves;

            const conteoAves = {};
            avistamientosGuardados.forEach(ave => {
                let tipoLower = ave.tipo.toLowerCase();
                conteoAves[tipoLower] = (conteoAves[tipoLower] || 0) + 1;
            });

            contenedorGraficoAves.innerHTML = "";

            for (let tipo in conteoAves) {
                let cantidad = conteoAves[tipo];
                let porcentaje = totalAves === 0 ? 0 : Math.round((cantidad / totalAves) * 100);

                let divFila = document.createElement("div");
                divFila.style.marginBottom = "10px";

                let label = document.createElement("div");
                label.innerText = `${tipo.toUpperCase()}: ${cantidad} (${porcentaje}%)`;
                label.style.fontSize = "0.85em";

                let barraFondo = document.createElement("div");
                barraFondo.style.backgroundColor = "#ecf0f1";
                barraFondo.style.height = "20px";
                barraFondo.style.borderRadius = "3px";

                let barraColor = document.createElement("div");
                barraColor.style.backgroundColor = "#3498db";
                barraColor.style.height = "100%";
                barraColor.style.width = `${porcentaje}%`;
                barraColor.style.borderRadius = "3px";

                barraFondo.appendChild(barraColor);
                divFila.appendChild(label);
                divFila.appendChild(barraFondo);
                contenedorGraficoAves.appendChild(divFila);
            }
        }

        const totalVolElem = document.getElementById("total-metricas-voluntarios");
        const contenedorGraficoVol = document.getElementById("grafico-voluntarios");

        if (totalVolElem && contenedorGraficoVol) {
            const totalVol = voluntariosGuardados.length;
            totalVolElem.innerText = totalVol;

            const conteoRegiones = {};
            voluntariosGuardados.forEach(vol => {
                conteoRegiones[vol.region] = (conteoRegiones[vol.region] || 0) + 1;
            });

            contenedorGraficoVol.innerHTML = "";

            for (let region in conteoRegiones) {
                let cantidad = conteoRegiones[region];
                let porcentaje = totalVol === 0 ? 0 : Math.round((cantidad / totalVol) * 100);

                let divFila = document.createElement("div");
                divFila.style.marginBottom = "10px";

                let label = document.createElement("div");
                label.innerText = `${region}: ${cantidad} (${porcentaje}%)`;
                label.style.fontSize = "0.85em";

                let barraFondo = document.createElement("div");
                barraFondo.style.backgroundColor = "#ecf0f1";
                barraFondo.style.height = "20px";
                barraFondo.style.borderRadius = "3px";

                let barraColor = document.createElement("div");
                barraColor.style.backgroundColor = "#2ecc71";
                barraColor.style.height = "100%";
                barraColor.style.width = `${porcentaje}%`;
                barraColor.style.borderRadius = "3px";

                barraFondo.appendChild(barraColor);
                divFila.appendChild(label);
                divFila.appendChild(barraFondo);
                contenedorGraficoVol.appendChild(divFila);
            }
        }
    };

    renderizarLista();
    actualizarMetricas();
});