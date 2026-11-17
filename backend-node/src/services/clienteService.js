import { pool } from "../db/pool.js";
import { ApiError } from "../errors.js";
import { validarSenha } from "./politicaSenha.js";
import { gerarHash } from "./senhaHash.js";

const VIOLACAO_UNICIDADE = "23505";

const paraResposta = (c) => ({ id: c.id, nome: c.nome, login: c.login });
const msgDuplicado = (login) => `Já existe um cliente cadastrado com o login ${login}.`;

/** Cadastra cliente (ClienteService.cadastrar): 409 se o login já existir. */
export async function cadastrar(req) {
  const login = req.login.trim().toLowerCase();

  const existe = await pool.query("SELECT 1 FROM cliente WHERE LOWER(login) = LOWER($1)", [login]);
  if (existe.rowCount > 0) throw ApiError.conflito(msgDuplicado(login));

  validarSenha(req.senha);

  try {
    const { rows } = await pool.query(
      `INSERT INTO cliente (nome, login, senha, cpf, data_nascimento, telefone, estado_civil, escolaridade)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nome, login`,
      [
        req.nome.trim().replace(/\s+/g, " "),
        login,
        await gerarHash(req.senha),
        req.cpf, req.dataNascimento, req.telefone, req.estadoCivil, req.escolaridade
      ]
    );
    return paraResposta(rows[0]);
  } catch (erro) {
    // Corrida entre duas requisições simultâneas com o mesmo login
    if (erro.code === VIOLACAO_UNICIDADE) throw ApiError.conflito(msgDuplicado(login));
    throw erro;
  }
}

/** Endpoint auxiliar GET /api/clientes/{login} (sem a senha). */
export async function buscarPorLogin(login) {
  const { rows } = await pool.query(
    "SELECT id, nome, login FROM cliente WHERE LOWER(login) = LOWER($1)",
    [login.trim()]
  );
  if (rows.length === 0) throw ApiError.naoEncontrado(`Cliente não encontrado: ${login}`);
  return paraResposta(rows[0]);
}
