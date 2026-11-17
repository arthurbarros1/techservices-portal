import { pool, emTransacao } from "../db/pool.js";
import { ApiError } from "../errors.js";

export const STATUS_INICIAL = "EM ELABORAÇÃO";

const SELECT_POR_CLIENTE = `
  SELECT s.id, s.numero, s.servico_ti_id AS "servicoId", sv.nome AS "servicoNome",
         s.data_pedido AS "dataPedido", s.status, s.preco_cobrado AS "precoCobrado",
         s.data_prevista AS "dataPrevista"
    FROM solicitacao_servico_ti s
    JOIN servico_ti sv ON sv.id = s.servico_ti_id
   WHERE s.cliente_id = $1
   ORDER BY s.data_pedido ASC, s.id ASC`;

async function buscarIdCliente(db, login) {
  const { rows } = await db.query("SELECT id FROM cliente WHERE LOWER(login) = LOWER($1)", [login.trim()]);
  if (rows.length === 0) throw ApiError.naoEncontrado(`Cliente não encontrado: ${login}`);
  return rows[0].id;
}

// --- datas ISO sem fuso horário ---
const hojeISO = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const somarDias = (iso, dias) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
};
const textoOuPadrao = (v, padrao) => (v === null || v.trim() === "" ? padrao : v.trim());

export async function listarPorLogin(login) {
  const clienteId = await buscarIdCliente(pool, login);
  const { rows } = await pool.query(SELECT_POR_CLIENTE, [clienteId]);
  return rows;
}

/**
 * Substitui todas as solicitações do cliente pela lista recebida, em uma única
 * transação: DELETE das antigas + INSERT das novas (SolicitacaoService.substituirLista).
 */
export async function substituirLista(login, itens) {
  return emTransacao(async (client) => {
    const clienteId = await buscarIdCliente(client, login);

    // Carrega os serviços referenciados e rejeita ids inexistentes
    const ids = [...new Set(itens.map((i) => i.servicoId))];
    const { rows: servicos } = await client.query(
      "SELECT id, preco, prazo_dias FROM servico_ti WHERE id = ANY($1::bigint[])",
      [ids]
    );
    const porId = new Map(servicos.map((s) => [s.id, s]));
    const inexistente = ids.find((id) => !porId.has(id));
    if (inexistente !== undefined) {
      throw ApiError.requisicaoInvalida(`Serviço de TI inexistente: id ${inexistente}.`);
    }

    await client.query("DELETE FROM solicitacao_servico_ti WHERE cliente_id = $1", [clienteId]);

    let sequencia = 1;
    for (const item of itens) {
      const servico = porId.get(item.servicoId);
      const dataPedido = item.dataPedido ?? hojeISO();
      const ano = dataPedido.slice(0, 4);

      await client.query(
        `INSERT INTO solicitacao_servico_ti
           (cliente_id, servico_ti_id, numero, data_pedido, status, preco_cobrado, data_prevista)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          clienteId,
          servico.id,
          textoOuPadrao(item.numero, `${Number(ano)}-${String(sequencia).padStart(4, "0")}`),
          dataPedido,
          textoOuPadrao(item.status, STATUS_INICIAL),
          item.precoCobrado ?? servico.preco,
          item.dataPrevista ?? somarDias(dataPedido, servico.prazo_dias)
        ]
      );
      sequencia++;
    }

    const { rows } = await client.query(SELECT_POR_CLIENTE, [clienteId]);
    return rows;
  });
}
