import { useState } from "react";
import ResumoSolicitacao from "./ResumoSolicitacao.jsx";

export const STATUS_INICIAL = "EM ELABORAÇÃO";

/** Combo de serviços (vindos do backend) + resumo reativo + botão de inclusão. */
export default function NovaSolicitacao({ servicos, onIncluir }) {
  const [servicoId, setServicoId] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const servico = servicos.find((s) => String(s.id) === servicoId);

  function handleIncluir() {
    if (!servico) {
      setMensagem({ tipo: "erro", texto: "Selecione um serviço para incluir a solicitação." });
      return;
    }
    onIncluir(servico);
    setMensagem({ tipo: "ok", texto: "Solicitação incluída no carrinho. Clique em “Salvar solicitações” para gravar." });
    setServicoId("");
  }

  return (
    <section className="painel-secao" aria-label="Nova solicitação">
      <h2>Nova solicitação de serviço</h2>

      <div className="form-solicitacao">
        <div className="campo">
          <label htmlFor="servico">Serviço desejado</label>
          <select id="servico" value={servicoId}
                  onChange={(e) => { setServicoId(e.target.value); setMensagem({ tipo: "", texto: "" }); }}>
            <option value="">— Selecione um serviço —</option>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>

        <ResumoSolicitacao servico={servico} status={STATUS_INICIAL} />

        <p className={`mensagem-form ${mensagem.tipo}`} role="status">{mensagem.texto}</p>

        <div className="form-acoes">
          <button type="button" className="btn btn--primario" onClick={handleIncluir}>
            Incluir solicitação
          </button>
        </div>
      </div>
    </section>
  );
}
