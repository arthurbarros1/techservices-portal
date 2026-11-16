package br.com.techservices.service;

import br.com.techservices.exception.ApiException;

/**
 * Mesmas regras de composição de senha validadas no frontend (AV1),
 * repetidas no servidor para não depender apenas do cliente.
 */
public final class PoliticaSenha {

    private static final String PERMITIDOS = "@#$%&*!?/\\|-_+.=";
    private static final String PROIBIDOS = "¨{}[]´`~^:;<>,\"'";

    private PoliticaSenha() {
    }

    public static void validar(String senha) {
        if (senha == null || senha.length() < 6) {
            throw ApiException.requisicaoInvalida("A senha deve ter no mínimo 6 caracteres.");
        }
        if (senha.chars().noneMatch(Character::isDigit)) {
            throw ApiException.requisicaoInvalida("A senha deve conter pelo menos um número.");
        }
        if (senha.chars().noneMatch(c -> c >= 'A' && c <= 'Z')) {
            throw ApiException.requisicaoInvalida("A senha deve conter pelo menos uma letra maiúscula.");
        }
        if (senha.chars().noneMatch(c -> PERMITIDOS.indexOf(c) >= 0)) {
            throw ApiException.requisicaoInvalida("A senha deve conter pelo menos um caractere especial permitido.");
        }
        if (senha.chars().anyMatch(c -> PROIBIDOS.indexOf(c) >= 0)) {
            throw ApiException.requisicaoInvalida("A senha contém caracteres não permitidos.");
        }
    }
}
