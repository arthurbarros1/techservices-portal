import LinhaSolicitacao from "./LinhaSolicitacao.jsx";

const COLUNAS = ["Data do pedido", "Nº da solicitação", "Serviço", "Status", "Preço cobrado", "Data prevista", "Ação"];

export default function TabelaSolicitacoes({ itens, carregando, onExcluir }) {
  return (
    <div className="tabela-rolagem">
      <table className="tabela-pedidos">
        <caption>Solicitações de serviços registradas na sua conta.</caption>
        <thead>
          <tr>
            {COLUNAS.map((c) => <th key={c} scope="col">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr className="tabela-vazia"><td colSpan={COLUNAS.length}>Carregando solicitações…</td></tr>
          )}
          {!carregando && itens.length === 0 && (
            <tr className="tabela-vazia"><td colSpan={COLUNAS.length}>Nenhuma solicitação cadastrada.</td></tr>
          )}
          {!carregando && itens.map((item) => (
            <LinhaSolicitacao key={item.chave} item={item} onExcluir={onExcluir} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
