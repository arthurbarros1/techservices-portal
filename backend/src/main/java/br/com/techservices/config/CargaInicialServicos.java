package br.com.techservices.config;

import br.com.techservices.model.ServicoTI;
import br.com.techservices.repository.ServicoTIRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/** Cadastra o catálogo da AV1 na primeira execução (tabela de serviços vazia). */
@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class CargaInicialServicos implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CargaInicialServicos.class);

    private final ServicoTIRepository repository;

    public CargaInicialServicos(ServicoTIRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }
        List<ServicoTI> catalogo = List.of(
                new ServicoTI("Manutenção de Servidores",
                        "Manutenção preventiva e corretiva de servidores físicos e virtuais.",
                        new BigDecimal("1200.00"), 3),
                new ServicoTI("Instalação de Redes",
                        "Projeto e instalação de redes cabeadas e sem fio corporativas.",
                        new BigDecimal("2500.00"), 7),
                new ServicoTI("Consultoria Cloud",
                        "Planejamento e migração de ambientes locais para a nuvem.",
                        new BigDecimal("3800.00"), 10),
                new ServicoTI("Backup Corporativo",
                        "Implantação de rotinas de backup e recuperação de desastres.",
                        new BigDecimal("900.00"), 2),
                new ServicoTI("Segurança da Informação",
                        "Políticas de proteção de dados, firewall e antivírus corporativo.",
                        new BigDecimal("4200.00"), 14));
        repository.saveAll(catalogo);
        log.info("Catálogo inicial com {} serviços de TI cadastrado.", catalogo.size());
    }
}
