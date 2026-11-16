import BadgeStatus from "./BadgeStatus.jsx";
import { formatarDataBR, formatarMoeda } from "../../utils/formatters.js";

export default function LinhaSolicitacao({ item, onExcluir }) {
  return (
    <tr>
      <td>{formatarDataBR(item.dataPedido)}</td>
      <td>{item.numero}</td>
      <td>{item.servicoNome}</td>
      <td><BadgeStatus status={item.status} /></td>
      <td className="col-preco">{formatarMoeda(item.precoCobrado)}</td>
      <td>{formatarDataBR(item.dataPrevista)}</td>
      <td>
        <button type="button" className="btn-excluir" onClick={() => onExcluir(item.chave)}>
          Excluir
        </button>
      </td>
    </tr>
  );
}
