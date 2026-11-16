import { formatarMoeda, formatarPrazo } from "../../utils/formatters.js";

/** Catálogo atual (GET /api/servicos), atualizado após cada cadastro. */
export default function TabelaServicos({ servicos, carregando }) {
  return (
    <div className="tabela-rolagem">
      <table className="tabela-pedidos">
        <caption>Serviços de TI disponíveis para solicitação.</caption>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Serviço</th>
            <th scope="col">Descrição</th>
            <th scope="col">Preço</th>
            <th scope="col">Prazo</th>
          </tr>
        </thead>
        <tbody>
          {carregando && <tr className="tabela-vazia"><td colSpan={5}>Carregando catálogo…</td></tr>}
          {!carregando && servicos.length === 0 && (
            <tr className="tabela-vazia"><td colSpan={5}>Nenhum serviço cadastrado.</td></tr>
          )}
          {!carregando && servicos.map((s) => (
            <tr key={s.id}>
              <td>#{s.id}</td>
              <td>{s.nome}</td>
              <td>{s.descricao}</td>
              <td className="col-preco">{formatarMoeda(s.preco)}</td>
              <td>{formatarPrazo(s.prazoDias)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
