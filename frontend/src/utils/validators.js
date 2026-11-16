// Regras de validação herdadas da AV1 (auth-validators.js), agora como módulo ES.

const PERMITIDOS_STR = "@#$%&*!?/\\|-_+.=";
const PROIBIDOS_STR = "¨{}[]´`~^:;<>,\"'";

export const CARACTERES_PERMITIDOS = [...new Set(PERMITIDOS_STR)];
export const CARACTERES_PROIBIDOS = [...new Set(PROIBIDOS_STR)];

export function validarEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Retorna { valido, criterios } com cada regra de composição da senha. */
export function validarSenhaForte(senha) {
  const valor = typeof senha === "string" ? senha : "";
  const temProibido = CARACTERES_PROIBIDOS.some((c) => valor.includes(c));

  const criterios = {
    tamanho: valor.length >= 6,
    numero: /[0-9]/.test(valor),
    maiuscula: /[A-Z]/.test(valor),
    permitido: CARACTERES_PERMITIDOS.some((c) => valor.includes(c)),
    semProibido: !temProibido && valor.length > 0
  };

  return { valido: Object.values(criterios).every(Boolean), criterios };
}

export function senhasConferem(a, b) {
  return typeof a === "string" && a.length > 0 && a === b;
}

/** Ao menos duas palavras; 1ª com 2+ letras; sem caracteres especiais. */
export function validarNomeCompleto(nome) {
  if (typeof nome !== "string") return false;
  const palavras = nome.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  if (palavras.length < 2 || palavras[0].length < 2) return false;
  return palavras.every((p) => /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/.test(p));
}

export function mascararCPF(valor) {
  const n = String(valor).replace(/\D/g, "").slice(0, 11);
  if (n.length > 9) return n.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  if (n.length > 6) return n.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (n.length > 3) return n.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  return n;
}

/** Validação dos dois dígitos verificadores (módulo 11). */
export function validarCPF(cpf) {
  const n = String(cpf).replace(/\D/g, "");
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  const digito = (tamanho) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(n[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(n[9]) && digito(10) === Number(n[10]);
}

/** Idade mínima de 18 anos a partir de uma data ISO (AAAA-MM-DD). */
export function validarMaioridade(dataISO) {
  if (typeof dataISO !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) return false;
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  if (nascimento.getFullYear() !== ano || nascimento.getMonth() !== mes - 1 || nascimento.getDate() !== dia) {
    return false;
  }

  const hoje = new Date();
  if (nascimento > hoje) return false;

  let idade = hoje.getFullYear() - ano;
  const mesDiff = hoje.getMonth() - (mes - 1);
  if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < dia)) idade--;
  return idade >= 18;
}

export function mascararTelefone(valor) {
  const n = String(valor).replace(/\D/g, "").slice(0, 11);
  if (n.length === 0) return "";
  if (n.length <= 2) return n.replace(/(\d{1,2})/, "($1");
  if (n.length <= 6) return n.replace(/(\d{2})(\d{1,4})/, "($1) $2");
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
  return n.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
}

export function validarTelefone(tel) {
  const n = String(tel).replace(/\D/g, "");
  if (n.length !== 10 && n.length !== 11) return false;
  if (Number(n.slice(0, 2)) < 11) return false;
  return !(n.length === 11 && n[2] !== "9");
}
