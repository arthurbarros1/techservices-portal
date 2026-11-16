import { formatarDataBR, formatarMoeda, formatarPrazo, hojeISO, somarDiasISO } from "../../utils/formatters.js";

/** Painel de valores reativos ao serviço selecionado. */
export default function ResumoSolicitacao({ servico, status }) {
  const itens = [
    ["Preço", servico ? formatarMoeda(servico.preco) : "—"],
    ["Prazo de atendimento", servico ? formatarPrazo(servico.prazoDias) : "—"],
    ["Data prevista", servico ? formatarDataBR(somarDiasISO(hojeISO(), servico.prazoDias)) : "—"],
    ["Status", status]
  ];

  return (
    <div className="resumo-solicitacao">
      {itens.map(([rotulo, valor]) => (
        <div key={rotulo} className="resumo-item">
          <span className="rotulo">{rotulo}</span>
          <span className="valor">{valor}</span>
        </div>
      ))}
    </div>
  );
}
