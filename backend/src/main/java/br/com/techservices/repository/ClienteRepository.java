package br.com.techservices.repository;

import br.com.techservices.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByLoginIgnoreCase(String login);

    boolean existsByLoginIgnoreCase(String login);
}
