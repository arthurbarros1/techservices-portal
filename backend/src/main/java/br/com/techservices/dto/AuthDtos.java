package br.com.techservices.dto;

import jakarta.validation.constraints.NotBlank;

/** DTOs dos endpoints de autenticação. */
public final class AuthDtos {

    private AuthDtos() {
    }

    public record LoginRequest(
            @NotBlank(message = "Informe o login.") String login,
            @NotBlank(message = "Informe a senha.") String senha) {
    }

    public record TrocaSenhaRequest(
            @NotBlank(message = "Informe o login.") String login,
            @NotBlank(message = "Informe a senha atual.") String senhaAtual,
            @NotBlank(message = "Informe a nova senha.") String novaSenha) {
    }
}
