package br.com.techservices.controller;

import br.com.techservices.dto.SolicitacaoDtos.SolicitacaoRequest;
import br.com.techservices.dto.SolicitacaoDtos.SolicitacaoResponse;
import br.com.techservices.service.SolicitacaoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    /** GET /api/solicitacoes/{login} → solicitações do cliente em ordem cronológica. */
    @GetMapping("/{login}")
    public List<SolicitacaoResponse> listar(@PathVariable String login) {
        return solicitacaoService.listarPorLogin(login);
    }

    /**
     * PUT /api/solicitacoes/{login} → substitui a lista completa do cliente.
     * Uma lista vazia remove todas as solicitações.
     */
    @PutMapping("/{login}")
    public List<SolicitacaoResponse> atualizar(@PathVariable String login,
                                               @RequestBody @NotNull List<@Valid SolicitacaoRequest> itens) {
        return solicitacaoService.substituirLista(login, itens);
    }
}
