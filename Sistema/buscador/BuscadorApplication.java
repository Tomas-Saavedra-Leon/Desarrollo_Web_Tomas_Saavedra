import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"controlador", "model", "repositorio"})
@EnableJpaRepositories(basePackages = "repositorio")
@EntityScan(basePackages = "model")
public class BuscadorApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuscadorApplication.class, args);
    }
}