package br.com.techservices.service;

import br.com.techservices.dto.ClienteDtos.ClienteRequest;
import br.com.techservices.dto.ClienteDtos.ClienteResponse;
import br.com.techservices.exception.ApiException;
import br.com.techservices.model.Cliente;
import br.com.techservices.repository.ClienteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ClienteResponse cadastrar(ClienteRequest req) {
        String login = req.login().trim().toLowerCase();

        if (clienteRepository.existsByLoginIgnoreCase(login)) {
            throw ApiException.conflito("Já existe um cliente cadastrado com o login " + login + ".");
        }
        PoliticaSenha.validar(req.senha());

        Cliente c = new Cliente();
        c.setNome(req.nome().trim().replaceAll("\\s+", " "));
        c.setLogin(login);
        c.setSenha(passwordEncoder.encode(req.senha()));
        c.setCpf(req.cpf());
        c.setDataNascimento(req.dataNascimento());
        c.setTelefone(req.telefone());
        c.setEstadoCivil(req.estadoCivil());
        c.setEscolaridade(req.escolaridade());

        try {
            return ClienteResponse.de(clienteRepository.saveAndFlush(c));
        } catch (DataIntegrityViolationException e) {
            // Corrida entre duas requisições simultâneas com o mesmo login
            throw ApiException.conflito("Já existe um cliente cadastrado com o login " + login + ".");
        }
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorLogin(String login) {
        return clienteRepository.findByLoginIgnoreCase(login.trim())
                .map(ClienteResponse::de)
                .orElseThrow(() -> ApiException.naoEncontrado("Cliente não encontrado: " + login));
    }
}
