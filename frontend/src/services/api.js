// Cliente HTTP da API Spring Boot (fetch nativo).
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

/** Erro de API com status HTTP e eventuais mensagens por campo. */
export class ApiError extends Error {
  constructor(status, mensagem, campos) {
    super(mensagem);
    this.status = status;
    this.campos = campos || {};
  }
}

async function requisicao(caminho, { method = "GET", body } = {}) {
  let resposta;
  try {
    resposta = await fetch(BASE_URL + caminho, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
  }

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    throw new ApiError(
      resposta.status,
      (dados && dados.mensagem) || "Erro inesperado ao comunicar com o servidor.",
      dados && dados.campos
    );
  }
  return dados;
}

const enc = encodeURIComponent;

export const api = {
  // Autenticação
  login: (login, senha) =>
    requisicao("/api/auth/login", { method: "POST", body: { login, senha } }),
  trocarSenha: (login, senhaAtual, novaSenha) =>
    requisicao("/api/auth/password", { method: "PUT", body: { login, senhaAtual, novaSenha } }),

  // Clientes
  cadastrarCliente: (cliente) =>
    requisicao("/api/clientes", { method: "POST", body: cliente }),
  buscarCliente: (login) => requisicao(`/api/clientes/${enc(login)}`),

  // Serviços de TI
  listarServicos: () => requisicao("/api/servicos"),
  cadastrarServico: (servico) =>
    requisicao("/api/servicos", { method: "POST", body: servico }),

  // Solicitações
  listarSolicitacoes: (login) => requisicao(`/api/solicitacoes/${enc(login)}`),
  salvarSolicitacoes: (login, lista) =>
    requisicao(`/api/solicitacoes/${enc(login)}`, { method: "PUT", body: lista })
};
