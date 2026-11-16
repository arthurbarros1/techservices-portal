package br.com.techservices.controller;

import br.com.techservices.dto.AuthDtos.LoginRequest;
import br.com.techservices.dto.AuthDtos.TrocaSenhaRequest;
import br.com.techservices.dto.MensagemResponse;
import br.com.techservices.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** POST /api/auth/login → corpo da resposta: {@code true} ou {@code false}. */
    @PostMapping("/login")
    public boolean login(@Valid @RequestBody LoginRequest req) {
        return authService.autenticar(req);
    }

    /** PUT /api/auth/password → 200 em caso de sucesso; 401 se a senha atual não conferir. */
    @PutMapping("/password")
    public MensagemResponse trocarSenha(@Valid @RequestBody TrocaSenhaRequest req) {
        authService.trocarSenha(req);
        return new MensagemResponse("Senha alterada com sucesso.");
    }
}
