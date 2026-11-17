import pg from "pg";
import { config } from "../config.js";

// DATE (OID 1082) volta como texto "AAAA-MM-DD", igual ao LocalDate serializado pelo Java,
// evitando conversões de fuso horário.
pg.types.setTypeParser(1082, (valor) => valor);
// BIGINT (ids) e NUMERIC (preços) voltam como número no JSON, como Long/BigDecimal no Java.
pg.types.setTypeParser(20, (valor) => Number(valor));
pg.types.setTypeParser(1700, (valor) => Number(valor));

export const pool = new pg.Pool(config.db);

/**
 * Executa `fn(client)` dentro de uma transação (BEGIN/COMMIT), com ROLLBACK em caso de erro —
 * equivalente ao @Transactional do Spring.
 */
export async function emTransacao(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const resultado = await fn(client);
    await client.query("COMMIT");
    return resultado;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}
