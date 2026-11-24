package controlador;

import model.Avistamiento;
import model.Nota;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import repositorio.AvistamientoRepository;
import repositorio.NotaRepository;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Controller
public class BuscadorController {

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public BuscadorController(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/")
    public String index() {
        return "buscador";
    }

    @GetMapping("/api/buscar")
    @ResponseBody
    public ResponseEntity<?> buscar(@RequestParam(name = "q", required = false, defaultValue = "") String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Avistamiento> avistamientos = avistamientoRepository.buscarPorTexto(q.trim());
        List<Object> resultados = new ArrayList<>();

        for (Avistamiento a : avistamientos) {
            Double promedio = notaRepository.calcularPromedioPorAvistamientoId(a.getId());
            String promedioStr = (promedio != null) ? String.format(Locale.US, "%.1f", promedio) : "-";
            String dia = (a.getFechaHora() != null) ? a.getFechaHora().format(dateFormatter) : "-";
            String voluntario = (a.getVoluntario() != null) ? a.getVoluntario().getNombre() : "-";
            String ave = (a.getAve() != null) ? a.getAve().getNombre() : "-";
            String comuna = (a.getVoluntario() != null && a.getVoluntario().getComuna() != null)
                    ? a.getVoluntario().getComuna().getNombre() : "-";

            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("id", a.getId());
            fila.put("voluntario", voluntario);
            fila.put("dia", dia);
            fila.put("ave", ave);
            fila.put("comuna", comuna);
            fila.put("promedio", promedioStr);

            resultados.add(fila);
        }

        return ResponseEntity.ok(resultados);
    }

    @PostMapping("/api/evaluar")
    @ResponseBody
    public ResponseEntity<?> evaluar(@RequestBody Map<String, Object> payload) {
        if (payload == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Cuerpo de solicitud requerido."));
        }

        Object idObj = payload.containsKey("avistamientoId") ? payload.get("avistamientoId") : payload.get("avistamiento_id");
        Object notaObj = payload.get("nota");

        if (idObj == null || notaObj == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Identificador y nota requeridos."));
        }

        Integer avistamientoId;
        Integer nota;
        try {
            avistamientoId = Integer.valueOf(idObj.toString());
            nota = Integer.valueOf(notaObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Valores numéricos inválidos."));
        }

        if (nota < 1 || nota > 7) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "La nota debe ser un número entero entre 1 y 7."));
        }

        Optional<Avistamiento> avistamientoOpt = avistamientoRepository.findById(avistamientoId);
        if (avistamientoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "El avistamiento no existe."));
        }

        Nota nuevaNota = new Nota();
        nuevaNota.setAvistamiento(avistamientoOpt.get());
        nuevaNota.setNota(nota);
        notaRepository.save(nuevaNota);

        Double nuevoPromedio = notaRepository.calcularPromedioPorAvistamientoId(avistamientoId);
        String nuevoPromedioStr = (nuevoPromedio != null) ? String.format(Locale.US, "%.1f", nuevoPromedio) : "-";

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("avistamientoId", avistamientoId);
        respuesta.put("nuevoPromedio", nuevoPromedioStr);
        respuesta.put("mensaje", "Evaluación registrada correctamente.");

        return ResponseEntity.ok(respuesta);
    }
}
