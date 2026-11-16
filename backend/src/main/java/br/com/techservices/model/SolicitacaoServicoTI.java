package br.com.techservices.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "solicitacao_servico_ti")
public class SolicitacaoServicoTI {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "servico_ti_id", nullable = false)
    private ServicoTI servico;

    /** Número exibido ao cliente (ex.: 2026-0001). */
    @Column(nullable = false, length = 20)
    private String numero;

    @Column(name = "data_pedido", nullable = false)
    private LocalDate dataPedido;

    @Column(nullable = false, length = 30)
    private String status;

    /** Preço praticado no momento do pedido (pode divergir do preço atual do serviço). */
    @Column(name = "preco_cobrado", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoCobrado;

    @Column(name = "data_prevista", nullable = false)
    private LocalDate dataPrevista;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public ServicoTI getServico() { return servico; }
    public void setServico(ServicoTI servico) { this.servico = servico; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public LocalDate getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDate dataPedido) { this.dataPedido = dataPedido; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getPrecoCobrado() { return precoCobrado; }
    public void setPrecoCobrado(BigDecimal precoCobrado) { this.precoCobrado = precoCobrado; }

    public LocalDate getDataPrevista() { return dataPrevista; }
    public void setDataPrevista(LocalDate dataPrevista) { this.dataPrevista = dataPrevista; }
}
