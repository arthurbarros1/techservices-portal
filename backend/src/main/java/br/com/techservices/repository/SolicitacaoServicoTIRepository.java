package br.com.techservices.repository;

import br.com.techservices.model.Cliente;
import br.com.techservices.model.SolicitacaoServicoTI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SolicitacaoServicoTIRepository extends JpaRepository<SolicitacaoServicoTI, Long> {

    @Query("select s from SolicitacaoServicoTI s join fetch s.servico "
         + "where s.cliente = :cliente order by s.dataPedido asc, s.id asc")
    List<SolicitacaoServicoTI> findByClienteOrdenado(@Param("cliente") Cliente cliente);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from SolicitacaoServicoTI s where s.cliente = :cliente")
    void deleteByCliente(@Param("cliente") Cliente cliente);
}
