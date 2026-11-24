document.addEventListener("DOMContentLoaded", function() {
    const filas = document.querySelectorAll(".fila-avistamiento");
    filas.forEach(function(fila) {
        fila.addEventListener("click", function(evento) {
            if (evento.target.tagName !== "A") {
                const destino = fila.getAttribute("data-href");
                if (destino) {
                    window.location.href = destino;
                }
            }
        });
        fila.addEventListener("keydown", function(evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                const destino = fila.getAttribute("data-href");
                if (destino) {
                    window.location.href = destino;
                }
            }
        });
    });
});
