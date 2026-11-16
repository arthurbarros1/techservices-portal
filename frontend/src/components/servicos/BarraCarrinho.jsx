import { formatarMoeda } from "../../utils/formatters.js";

/** Total da lista e ações de persistência (PUT /api/solicitacoes/{login}). */
export default function BarraCarrinho({ total, pendente, salvando, onSalvar, onDescartar }) {
  return (
    <div className="barra-carrinho">
      <div>
        <p className="total">Total: <span>{formatarMoeda(total)}</span></p>
        {pendente && <p className="aviso-pendente">Há alterações não salvas.</p>}
      </div>
      <div className="form-acoes">
        <button type="button" className="btn btn--secundario" onClick={onDescartar}
                disabled={!pendente || salvando}>
          Descartar alterações
        </button>
        <button type="button" className="btn btn--primario" onClick={onSalvar}
                disabled={!pendente || salvando}>
          {salvando ? "Salvando…" : "Salvar solicitações"}
        </button>
      </div>
    </div>
  );
}
