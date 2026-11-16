package br.com.techservices.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "servico_ti")
public class ServicoTI {

    /** Chave primária com autoincremento (IDENTITY → coluna identity no PostgreSQL). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal preco;

    /** Prazo de atendimento em dias corridos. */
    @Column(name = "prazo_dias", nullable = false)
    private Integer prazoDias;

    public ServicoTI() {
    }

    public ServicoTI(String nome, String descricao, BigDecimal preco, Integer prazoDias) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.prazoDias = prazoDias;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public Integer getPrazoDias() { return prazoDias; }
    public void setPrazoDias(Integer prazoDias) { this.prazoDias = prazoDias; }
}
