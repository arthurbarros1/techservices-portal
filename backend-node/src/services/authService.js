import { pool, emTransacao } from "../db/pool.js";
import { ApiError } from "../errors.js";
import { validarSenha } from "./politicaSenha.js";
import { conferir, gerarHash } from "./senhaHash.js";

/** Retorna true se o login existir e a senha conferir (AuthService.autenticar). */
export async function autenticar({ login, senha }) {
  const { rows } = await pool.query(
    "SELECT senha FROM cliente WHERE LOWER(login) = LOWER($1)",
    [login.trim()]
  );
  if (rows.length === 0) return false;
  return conferir(senha, rows[0].senha);
}

/** Troca a senha validando a atual (AuthService.trocarSenha). */
export async function trocarSenha({ login, senhaAtual, novaSenha }) {
  await emTransacao(async (client) => {
    const { rows } = await client.query(
      "SELECT id, senha FROM cliente WHERE LOWER(login) = LOWER($1) FOR UPDATE",
      [login.trim()]
    );
    const cliente = rows[0];

    if (!cliente || !(await conferir(senhaAtual, cliente.senha))) {
      throw ApiError.naoAutorizado("Login ou senha atual inválidos.");
    }
    if (senhaAtual === novaSenha) {
      throw ApiError.requisicaoInvalida("A nova senha deve ser diferente da senha atual.");
    }
    validarSenha(novaSenha);

    await client.query("UPDATE cliente SET senha = $1 WHERE id = $2", [await gerarHash(novaSenha), cliente.id]);
  });
}
