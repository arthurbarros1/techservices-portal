// Equivalentes das anotações Bean Validation usadas nos DTOs do Java.
import { ApiError, MSG_CORPO_INVALIDO, MSG_DADOS_INVALIDOS } from "./errors.js";

export const vazio = (v) => v === undefined || v === null;
export const emBranco = (v) => vazio(v) || (typeof v === "string" && v.trim() === "");

/** Equivale a falha de desserialização do Jackson (HttpMessageNotReadableException). */
export function exigirObjeto(corpo) {
  if (corpo === null || typeof corpo !== "object" || Array.isArray(corpo)) {
    throw ApiError.requisicaoInvalida(MSG_CORPO_INVALIDO);
  }
  return corpo;
}

/** Campo textual: precisa ser string (ou ausente). */
export function texto(corpo, campo) {
  const v = corpo[campo];
  if (vazio(v)) return null;
  if (typeof v !== "string") throw ApiError.requisicaoInvalida(MSG_CORPO_INVALIDO);
  return v;
}

/** Data ISO (AAAA-MM-DD) válida, como o LocalDate do Jackson. */
export function data(corpo, campo) {
  const v = corpo[campo];
  if (vazio(v)) return null;
  const ok = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)
    && new Date(`${v}T00:00:00Z`).toISOString().startsWith(v);
  if (!ok) throw ApiError.requisicaoInvalida(MSG_CORPO_INVALIDO);
  return v;
}

/** Número (aceita também string numérica, como o Jackson). */
export function numero(corpo, campo) {
  const v = corpo[campo];
  if (vazio(v)) return null;
  const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
  if (typeof n !== "number" || !Number.isFinite(n)) throw ApiError.requisicaoInvalida(MSG_CORPO_INVALIDO);
  return n;
}

export function inteiro(corpo, campo) {
  const n = numero(corpo, campo);
  if (n !== null && !Number.isInteger(n)) throw ApiError.requisicaoInvalida(MSG_CORPO_INVALIDO);
  return n;
}

/** Acumula erros por campo e lança 400 no formato do Spring (MethodArgumentNotValidException). */
export class Validador {
  constructor() { this.campos = {}; }

  erro(campo, mensagem) {
    if (!(campo in this.campos)) this.campos[campo] = mensagem;
    return this;
  }

  verificar(condicaoInvalida, campo, mensagem) {
    if (condicaoInvalida) this.erro(campo, mensagem);
    return this;
  }

  lancarSeHouverErros() {
    if (Object.keys(this.campos).length > 0) {
      throw ApiError.requisicaoInvalida(MSG_DADOS_INVALIDOS, this.campos);
    }
  }
}

export const tamanhoMaior = (v, max) => typeof v === "string" && v.length > max;
export const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Quantidade de casas decimais de um número (para o @Digits(fraction = 2)). */
export function casasDecimais(n) {
  const [, dec = ""] = String(n).split(".");
  return dec.replace(/e.*$/i, "").length;
}
