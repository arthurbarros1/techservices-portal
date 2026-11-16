package br.com.techservices.controller;

import br.com.techservices.dto.ServicoDtos.ServicoRequest;
import br.com.techservices.dto.ServicoDtos.ServicoResponse;
import br.com.techservices.service.ServicoTIService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
public class ServicoTIController {

    private final ServicoTIService servicoService;

    public ServicoTIController(ServicoTIService servicoService) {
        this.servicoService = servicoService;
    }

    /** POST /api/servicos → 201 com o serviço criado (id gerado por autoincremento). */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServicoResponse cadastrar(@Valid @RequestBody ServicoRequest req) {
        return servicoService.cadastrar(req);
    }

    /** GET /api/servicos → todos os serviços de TI cadastrados. */
    @GetMapping
    public List<ServicoResponse> listar() {
        return servicoService.listarTodos();
    }
}
