package br.com.techservices.controller;

import br.com.techservices.dto.ClienteDtos.ClienteRequest;
import br.com.techservices.dto.ClienteDtos.ClienteResponse;
import br.com.techservices.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /** POST /api/clientes → 201; 409 se o login já estiver cadastrado. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteResponse cadastrar(@Valid @RequestBody ClienteRequest req) {
        return clienteService.cadastrar(req);
    }

    /**
     * GET /api/clientes/{login} — endpoint auxiliar (além do spec) usado pelo
     * painel do cliente para exibir o nome do usuário logado. Não expõe a senha.
     */
    @GetMapping("/{login}")
    public ClienteResponse buscar(@PathVariable String login) {
        return clienteService.buscarPorLogin(login);
    }
}
