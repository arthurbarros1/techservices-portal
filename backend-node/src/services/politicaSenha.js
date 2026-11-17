// Regras de composição idênticas às de PoliticaSenha.java e do frontend.
import { ApiError } from "../errors.js";

const PERMITIDOS = "@#$%&*!?/\\|-_+.=";
const PROIBIDOS = "¨{}[]´`~^:;<>,\"'";

export function validarSenha(senha) {
  const s = typeof senha === "string" ? senha : "";
  const chars = [...s];

  if (s.length < 6) throw ApiError.requisicaoInvalida("A senha deve ter no mínimo 6 caracteres.");
  if (!/[0-9]/.test(s)) throw ApiError.requisicaoInvalida("A senha deve conter pelo menos um número.");
  if (!/[A-Z]/.test(s)) throw ApiError.requisicaoInvalida("A senha deve conter pelo menos uma letra maiúscula.");
  if (!chars.some((c) => PERMITIDOS.includes(c))) {
    throw ApiError.requisicaoInvalida("A senha deve conter pelo menos um caractere especial permitido.");
  }
  if (chars.some((c) => PROIBIDOS.includes(c))) {
    throw ApiError.requisicaoInvalida("A senha contém caracteres não permitidos.");
  }
}
