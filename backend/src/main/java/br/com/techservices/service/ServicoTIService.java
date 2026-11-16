package br.com.techservices.service;

import br.com.techservices.dto.ServicoDtos.ServicoRequest;
import br.com.techservices.dto.ServicoDtos.ServicoResponse;
import br.com.techservices.model.ServicoTI;
import br.com.techservices.repository.ServicoTIRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServicoTIService {

    private final ServicoTIRepository servicoRepository;

    public ServicoTIService(ServicoTIRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    @Transactional
    public ServicoResponse cadastrar(ServicoRequest req) {
        ServicoTI s = new ServicoTI(req.nome().trim(), req.descricao().trim(), req.preco(), req.prazoDias());
        return ServicoResponse.de(servicoRepository.save(s));
    }

    @Transactional(readOnly = true)
    public List<ServicoResponse> listarTodos() {
        return servicoRepository.findAll(Sort.by("nome")).stream()
                .map(ServicoResponse::de)
                .toList();
    }
}
