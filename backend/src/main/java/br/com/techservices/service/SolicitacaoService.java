package br.com.techservices.service;

import br.com.techservices.dto.SolicitacaoDtos.SolicitacaoRequest;
import br.com.techservices.dto.SolicitacaoDtos.SolicitacaoResponse;
import br.com.techservices.exception.ApiException;
import br.com.techservices.model.Cliente;
import br.com.techservices.model.ServicoTI;
import br.com.techservices.model.SolicitacaoServicoTI;
import br.com.techservices.repository.ClienteRepository;
import br.com.techservices.repository.ServicoTIRepository;
import br.com.techservices.repository.SolicitacaoServicoTIRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    public static final String STATUS_INICIAL = "EM ELABORAÇÃO";

    private final ClienteRepository clienteRepository;
    private final ServicoTIRepository servicoRepository;
    private final SolicitacaoServicoTIRepository solicitacaoRepository;

    public SolicitacaoService(ClienteRepository clienteRepository,
                              ServicoTIRepository servicoRepository,
                              SolicitacaoServicoTIRepository solicitacaoRepository) {
        this.clienteRepository = clienteRepository;
        this.servicoRepository = servicoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarPorLogin(String login) {
        Cliente cliente = buscarCliente(login);
        return solicitacaoRepository.findByClienteOrdenado(cliente).stream()
                .map(SolicitacaoResponse::de)
                .toList();
    }

    /**
     * Substitui todas as solicitações do cliente pela lista recebida:
     * remove as antigas e grava as novas na mesma transação.
     */
    @Transactional
    public List<SolicitacaoResponse> substituirLista(String login, List<SolicitacaoRequest> itens) {
        Cliente cliente = buscarCliente(login);
        Map<Long, ServicoTI> servicos = carregarServicos(itens);

        solicitacaoRepository.deleteByCliente(cliente);

        List<SolicitacaoServicoTI> novas = new ArrayList<>();
        int sequencia = 1;
        for (SolicitacaoRequest item : itens) {
            ServicoTI servico = servicos.get(item.servicoId());
            LocalDate dataPedido = item.dataPedido() != null ? item.dataPedido() : LocalDate.now();

            SolicitacaoServicoTI s = new SolicitacaoServicoTI();
            s.setCliente(cliente);
            s.setServico(servico);
            s.setDataPedido(dataPedido);
            s.setNumero(textoOuPadrao(item.numero(),
                    "%d-%04d".formatted(dataPedido.getYear(), sequencia)));
            s.setStatus(textoOuPadrao(item.status(), STATUS_INICIAL));
            s.setPrecoCobrado(item.precoCobrado() != null ? item.precoCobrado() : servico.getPreco());
            s.setDataPrevista(item.dataPrevista() != null
                    ? item.dataPrevista()
                    : dataPedido.plusDays(servico.getPrazoDias()));
            novas.add(s);
            sequencia++;
        }

        solicitacaoRepository.saveAll(novas);
        return solicitacaoRepository.findByClienteOrdenado(cliente).stream()
                .map(SolicitacaoResponse::de)
                .toList();
    }

    private Cliente buscarCliente(String login) {
        return clienteRepository.findByLoginIgnoreCase(login.trim())
                .orElseThrow(() -> ApiException.naoEncontrado("Cliente não encontrado: " + login));
    }

    private Map<Long, ServicoTI> carregarServicos(List<SolicitacaoRequest> itens) {
        Set<Long> ids = itens.stream().map(SolicitacaoRequest::servicoId).collect(Collectors.toSet());
        Map<Long, ServicoTI> encontrados = servicoRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(ServicoTI::getId, Function.identity()));

        ids.stream()
                .filter(id -> !encontrados.containsKey(id))
                .findFirst()
                .ifPresent(id -> {
                    throw ApiException.requisicaoInvalida("Serviço de TI inexistente: id " + id + ".");
                });
        return encontrados;
    }

    private static String textoOuPadrao(String valor, String padrao) {
        return (valor == null || valor.isBlank()) ? padrao : valor.trim();
    }
}
