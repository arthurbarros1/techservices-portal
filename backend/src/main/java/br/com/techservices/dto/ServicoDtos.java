package br.com.techservices.dto;

import br.com.techservices.model.ServicoTI;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/** DTOs do catálogo de serviços de TI. */
public final class ServicoDtos {

    private ServicoDtos() {
    }

    public record ServicoRequest(
            @NotBlank(message = "Informe o nome do serviço.")
            @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.") String nome,
            @NotBlank(message = "Informe a descrição do serviço.")
            @Size(min = 10, max = 500, message = "A descrição deve ter entre 10 e 500 caracteres.") String descricao,
            @NotNull(message = "Informe o preço.")
            @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero.")
            @Digits(integer = 10, fraction = 2, message = "Preço com no máximo 2 casas decimais.") BigDecimal preco,
            @NotNull(message = "Informe o prazo.")
            @Min(value = 1, message = "O prazo deve ser de pelo menos 1 dia.")
            @Max(value = 365, message = "O prazo deve ser de no máximo 365 dias.") Integer prazoDias) {
    }

    public record ServicoResponse(Long id, String nome, String descricao, BigDecimal preco, Integer prazoDias) {
        public static ServicoResponse de(ServicoTI s) {
            return new ServicoResponse(s.getId(), s.getNome(), s.getDescricao(), s.getPreco(), s.getPrazoDias());
        }
    }
}
