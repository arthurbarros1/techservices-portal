// Mesmo contrato de erro do GlobalExceptionHandler do Java:
// { timestamp, status, erro, mensagem, campos }

const FRASES = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error"
};

export const MSG_DADOS_INVALIDOS = "Dados inválidos. Verifique os campos informados.";
export const MSG_CORPO_INVALIDO = "Corpo da requisição ausente ou em formato inválido.";

export class ApiError extends Error {
  constructor(status, mensagem, campos = null) {
    super(mensagem);
    this.status = status;
    this.campos = campos;
  }

  static requisicaoInvalida(mensagem, campos) { return new ApiError(400, mensagem, campos); }
  static naoAutorizado(mensagem) { return new ApiError(401, mensagem); }
  static naoEncontrado(mensagem) { return new ApiError(404, mensagem); }
  static conflito(mensagem) { return new ApiError(409, mensagem); }
}

function corpoErro(status, mensagem, campos = null) {
  return {
    timestamp: new Date().toISOString(),
    status,
    erro: FRASES[status] || "Error",
    mensagem,
    campos
  };
}

export function rotaNaoEncontrada(req, res) {
  res.status(404).json(corpoErro(404, `Rota não encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function tratadorDeErros(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json(corpoErro(err.status, err.message, err.campos));
  }
  // JSON malformado (express.json)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json(corpoErro(400, MSG_CORPO_INVALIDO));
  }
  console.error(err);
  return res.status(500).json(corpoErro(500, "Erro interno no servidor."));
}
