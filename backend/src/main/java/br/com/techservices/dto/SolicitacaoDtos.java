package br.com.techservices.dto;

import br.com.techservices.model.SolicitacaoServicoTI;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/** DTOs das solicitações de serviço (carrinho do cliente). */
public final class SolicitacaoDtos {

    private SolicitacaoDtos() {
    }

    /**
     * Item da lista enviada no PUT. Apenas {@code servicoId} é obrigatório; os demais
     * campos, se ausentes, são preenchidos pelo backend (data de hoje, status
     * "EM ELABORAÇÃO", preço e prazo vigentes do serviço).
     */
    public record SolicitacaoRequest(
            @Size(max = 20) String numero,
            @NotNull(message = "Informe o serviço da solicitação.") Long servicoId,
            LocalDate dataPedido,
            @Size(max = 30) String status,
            @DecimalMin(value = "0.00", message = "Preço cobrado não pode ser negativo.") BigDecimal precoCobrado,
            LocalDate dataPrevista) {
    }

    public record SolicitacaoResponse(
            Long id,
            String numero,
            Long servicoId,
            String servicoNome,
            LocalDate dataPedido,
            String status,
            BigDecimal precoCobrado,
            LocalDate dataPrevista) {

        public static SolicitacaoResponse de(SolicitacaoServicoTI s) {
            return new SolicitacaoResponse(
                    s.getId(),
                    s.getNumero(),
                    s.getServico().getId(),
                    s.getServico().getNome(),
                    s.getDataPedido(),
                    s.getStatus(),
                    s.getPrecoCobrado(),
                    s.getDataPrevista());
        }
    }
}
