package repositorio;

import model.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("SELECT a FROM Avistamiento a " +
           "JOIN FETCH a.ave ave " +
           "JOIN FETCH a.voluntario vol " +
           "JOIN FETCH vol.comuna com " +
           "WHERE LOWER(ave.nombre) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(vol.nombre) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(com.nombre) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "ORDER BY a.fechaHora DESC")
    List<Avistamiento> buscarPorTexto(@Param("q") String q);
}