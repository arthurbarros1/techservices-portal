import { pool } from "../db/pool.js";

const COLUNAS = `id, nome, descricao, preco, prazo_dias AS "prazoDias"`;

/** Cadastra serviço de TI; o id vem da coluna IDENTITY (autoincremento). */
export async function cadastrar({ nome, descricao, preco, prazoDias }) {
  const { rows } = await pool.query(
    `INSERT INTO servico_ti (nome, descricao, preco, prazo_dias)
     VALUES ($1, $2, $3, $4)
     RETURNING ${COLUNAS}`,
    [nome.trim(), descricao.trim(), preco, prazoDias]
  );
  return rows[0];
}

/** Lista todos os serviços ordenados por nome (Sort.by("nome") no Java). */
export async function listarTodos() {
  const { rows } = await pool.query(`SELECT ${COLUNAS} FROM servico_ti ORDER BY nome`);
  return rows;
}
