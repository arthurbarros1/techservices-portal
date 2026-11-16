package br.com.techservices.dto;

import br.com.techservices.model.Cliente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** DTOs do cadastro de clientes. A senha nunca é devolvida nas respostas. */
public final class ClienteDtos {

    private ClienteDtos() {
    }

    public record ClienteRequest(
            @NotBlank(message = "Informe o nome.") @Size(max = 120) String nome,
            @NotBlank(message = "Informe o login.") @Email(message = "Login deve ser um e-mail válido.")
            @Size(max = 120) String login,
            @NotBlank(message = "Informe a senha.") String senha,
            @Size(max = 14) String cpf,
            LocalDate dataNascimento,
            @Size(max = 20) String telefone,
            @Size(max = 20) String estadoCivil,
            @Size(max = 30) String escolaridade) {
    }

    public record ClienteResponse(Long id, String nome, String login) {
        public static ClienteResponse de(Cliente c) {
            return new ClienteResponse(c.getId(), c.getNome(), c.getLogin());
        }
    }
}
