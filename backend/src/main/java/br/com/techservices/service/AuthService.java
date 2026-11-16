package br.com.techservices.service;

import br.com.techservices.dto.AuthDtos.LoginRequest;
import br.com.techservices.dto.AuthDtos.TrocaSenhaRequest;
import br.com.techservices.exception.ApiException;
import br.com.techservices.model.Cliente;
import br.com.techservices.repository.ClienteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(ClienteRepository clienteRepository, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Retorna {@code true} se o login existir e a senha conferir. */
    @Transactional(readOnly = true)
    public boolean autenticar(LoginRequest req) {
        return clienteRepository.findByLoginIgnoreCase(req.login().trim())
                .map(c -> passwordEncoder.matches(req.senha(), c.getSenha()))
                .orElse(false);
    }

    @Transactional
    public void trocarSenha(TrocaSenhaRequest req) {
        Cliente cliente = clienteRepository.findByLoginIgnoreCase(req.login().trim())
                .orElseThrow(() -> ApiException.naoAutorizado("Login ou senha atual inválidos."));

        if (!passwordEncoder.matches(req.senhaAtual(), cliente.getSenha())) {
            throw ApiException.naoAutorizado("Login ou senha atual inválidos.");
        }
        if (req.senhaAtual().equals(req.novaSenha())) {
            throw ApiException.requisicaoInvalida("A nova senha deve ser diferente da senha atual.");
        }

        PoliticaSenha.validar(req.novaSenha());
        cliente.setSenha(passwordEncoder.encode(req.novaSenha()));
    }
}
