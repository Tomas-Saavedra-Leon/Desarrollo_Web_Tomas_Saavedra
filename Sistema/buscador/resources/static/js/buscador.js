document.addEventListener("DOMContentLoaded", function() {
    const campoBusqueda = document.getElementById("campo-busqueda");
    const formBusqueda = document.getElementById("form-busqueda");
    const mensajeEstado = document.getElementById("mensaje-estado");
    const tablaResultados = document.getElementById("tabla-resultados");
    const cuerpoResultados = document.getElementById("cuerpo-resultados");

    const modalEvaluar = document.getElementById("modal-evaluar");
    const formEvaluacion = document.getElementById("form-evaluacion");
    const modalDescripcion = document.getElementById("modal-descripcion-avistamiento");
    const feedbackEvaluacion = document.getElementById("feedback-evaluacion");
    const evaluarAvistamientoId = document.getElementById("evaluar-avistamiento-id");
    const selectorNota = document.getElementById("selector-nota");
    const btnCancelarNota = document.getElementById("btn-cancelar-nota");

    if (formBusqueda) {
        formBusqueda.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    }

    function escaparRegExp(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function crearNodoResaltado(textoCompleto, terminoBusqueda) {
        const contenedor = document.createElement("span");
        if (!textoCompleto) {
            return contenedor;
        }

        const terminoLimpio = terminoBusqueda ? terminoBusqueda.trim() : "";
        if (terminoLimpio === "") {
            contenedor.textContent = textoCompleto;
            return contenedor;
        }

        const patron = new RegExp(escaparRegExp(terminoLimpio), "gi");
        let indiceActual = 0;
        let coincidencia;

        while ((coincidencia = patron.exec(textoCompleto)) !== null) {
            if (coincidencia.index > indiceActual) {
                const fragmentoTexto = textoCompleto.substring(indiceActual, coincidencia.index);
                contenedor.appendChild(document.createTextNode(fragmentoTexto));
            }

            const elementoMark = document.createElement("mark");
            elementoMark.className = "resaltado-busqueda";
            elementoMark.textContent = coincidencia[0];
            contenedor.appendChild(elementoMark);

            indiceActual = patron.lastIndex;
        }

        if (indiceActual < textoCompleto.length) {
            const restoTexto = textoCompleto.substring(indiceActual);
            contenedor.appendChild(document.createTextNode(restoTexto));
        }

        return contenedor;
    }

    function abrirModalEvaluacion(id, voluntario, ave) {
        evaluarAvistamientoId.value = id;
        selectorNota.value = "";
        modalDescripcion.textContent = `Evaluando avistamiento de "${ave}" registrado por "${voluntario}".`;
        feedbackEvaluacion.className = "mensaje-feedback-oculto";
        feedbackEvaluacion.textContent = "";
        modalEvaluar.className = "modal-overlay";
        selectorNota.focus();
    }

    function cerrarModalEvaluacion() {
        modalEvaluar.className = "modal-overlay modal-oculto";
        evaluarAvistamientoId.value = "";
        selectorNota.value = "";
        feedbackEvaluacion.className = "mensaje-feedback-oculto";
        feedbackEvaluacion.textContent = "";
    }

    if (btnCancelarNota) {
        btnCancelarNota.addEventListener("click", cerrarModalEvaluacion);
    }

    if (modalEvaluar) {
        modalEvaluar.addEventListener("click", function(e) {
            if (e.target === modalEvaluar) {
                cerrarModalEvaluacion();
            }
        });
    }

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modalEvaluar && !modalEvaluar.classList.contains("modal-oculto")) {
            cerrarModalEvaluacion();
        }
    });

    if (formEvaluacion) {
        formEvaluacion.addEventListener("submit", function(e) {
            e.preventDefault();

            const avistamientoId = parseInt(evaluarAvistamientoId.value, 10);
            const nota = parseInt(selectorNota.value, 10);

            if (!avistamientoId || isNaN(avistamientoId)) {
                feedbackEvaluacion.className = "mensaje-feedback-error";
                feedbackEvaluacion.textContent = "Identificador de avistamiento inválido.";
                return;
            }

            if (isNaN(nota) || nota < 1 || nota > 7) {
                feedbackEvaluacion.className = "mensaje-feedback-error";
                feedbackEvaluacion.textContent = "Debe seleccionar una nota válida entre 1 y 7.";
                return;
            }

            fetch("/api/evaluar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    avistamientoId: avistamientoId,
                    nota: nota
                })
            })
            .then(function(res) {
                if (!res.ok) {
                    return res.json().then(function(errData) {
                        throw new Error(errData.error || "Error al procesar la evaluación");
                    });
                }
                return res.json();
            })
            .then(function(data) {
                const celdaPromedio = document.getElementById("promedio-avistamiento-" + avistamientoId);
                if (celdaPromedio) {
                    celdaPromedio.textContent = data.nuevoPromedio;
                }
                cerrarModalEvaluacion();
            })
            .catch(function(err) {
                feedbackEvaluacion.className = "mensaje-feedback-error";
                feedbackEvaluacion.textContent = err.message || "Error al registrar la evaluación.";
            });
        });
    }

    let tiempoEspera = null;

    function ejecutarBusqueda() {
        const termino = campoBusqueda.value.trim();

        if (termino === "") {
            tablaResultados.className = "tabla-avistamientos tabla-oculta";
            cuerpoResultados.innerHTML = "";
            mensajeEstado.style.display = "block";
            mensajeEstado.textContent = "Ingrese un término para buscar avistamientos (por ave, voluntario o comuna).";
            return;
        }

        fetch("/api/buscar?q=" + encodeURIComponent(termino))
            .then(function(res) {
                if (!res.ok) {
                    throw new Error("Error en la consulta al servidor");
                }
                return res.json();
            })
            .then(function(avistamientos) {
                cuerpoResultados.innerHTML = "";

                if (!Array.isArray(avistamientos) || avistamientos.length === 0) {
                    tablaResultados.className = "tabla-avistamientos tabla-oculta";
                    mensajeEstado.style.display = "block";
                    mensajeEstado.textContent = "No se encontraron avistamientos que coincidan con la búsqueda.";
                    return;
                }

                mensajeEstado.style.display = "none";
                tablaResultados.className = "tabla-avistamientos";

                avistamientos.forEach(function(item) {
                    const fila = document.createElement("tr");
                    fila.id = "fila-avistamiento-" + item.id;

                    const celdaVoluntario = document.createElement("td");
                    celdaVoluntario.appendChild(crearNodoResaltado(item.voluntario, termino));

                    const celdaDia = document.createElement("td");
                    celdaDia.textContent = item.dia;

                    const celdaAve = document.createElement("td");
                    celdaAve.appendChild(crearNodoResaltado(item.ave, termino));

                    const celdaComuna = document.createElement("td");
                    celdaComuna.appendChild(crearNodoResaltado(item.comuna, termino));

                    const celdaPromedio = document.createElement("td");
                    celdaPromedio.className = "celda-promedio";
                    const spanPromedio = document.createElement("span");
                    spanPromedio.id = "promedio-avistamiento-" + item.id;
                    spanPromedio.textContent = item.promedio;
                    celdaPromedio.appendChild(spanPromedio);

                    const celdaAccion = document.createElement("td");
                    const btnEvaluar = document.createElement("button");
                    btnEvaluar.type = "button";
                    btnEvaluar.className = "btn-evaluar";
                    btnEvaluar.textContent = "Evaluar";
                    btnEvaluar.setAttribute("aria-label", `Evaluar avistamiento de ${item.ave}`);

                    btnEvaluar.addEventListener("click", function() {
                        abrirModalEvaluacion(item.id, item.voluntario, item.ave);
                    });

                    celdaAccion.appendChild(btnEvaluar);

                    fila.appendChild(celdaVoluntario);
                    fila.appendChild(celdaDia);
                    fila.appendChild(celdaAve);
                    fila.appendChild(celdaComuna);
                    fila.appendChild(celdaPromedio);
                    fila.appendChild(celdaAccion);

                    cuerpoResultados.appendChild(fila);
                });
            })
            .catch(function() {
                tablaResultados.className = "tabla-avistamientos tabla-oculta";
                cuerpoResultados.innerHTML = "";
                mensajeEstado.style.display = "block";
                mensajeEstado.textContent = "Error al conectar con el servidor de búsqueda.";
            });
    }

    if (campoBusqueda) {
        campoBusqueda.addEventListener("input", function() {
            clearTimeout(tiempoEspera);
            tiempoEspera = setTimeout(ejecutarBusqueda, 150);
        });
    }
});
