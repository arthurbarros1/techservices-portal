import { Router } from "express";
import * as solicitacaoService from "../services/solicitacaoService.js";
import { ApiError, MSG_CORPO_INVALIDO, MSG_DADOS_INVALIDOS } from "../errors.js";
import { data, exigirObjeto, inteiro, numero, tamanhoMaior, texto } from "../validation.js";

export const solicitacoesRouter = Router();

/** GET /api/solicitacoes/{login} → solicitações do cliente em ordem cronológica. */
solicitacoesRouter.get("/:login", async (req, res) => {
  res.json(await solicitacaoService.listarPorLogin(req.params.login));
});

/** Converte e valida um item da lista (SolicitacaoRequest no Java). */
function lerItem(bruto) {
  const corpo = exigirObjeto(bruto);
  const item = {
    numero: texto(corpo, "numero"),
    servicoId: inteiro(corpo, "servicoId"),
    dataPedido: data(corpo, "dataPedido"),
    status: texto(corpo, "status"),
    precoCobrado: numero(corpo, "precoCobrado"),
    dataPrevista: data(corpo, "dataPrevista")
  };

  const invalido = item.servicoId === null
    || tamanhoMaior(item.numero, 20)
    || tamanhoMaior(item.status, 30)
    || (item.precoCobrado !== null && item.precoCobrado < 0);
  // Como no Spring (validação de elementos de lista), a resposta não detalha os campos.
  if (invalido) throw ApiError.requisicaoInvalida(MSG_DADOS_INVALIDOS);
  return item;
}

/**
 * PUT /api/solicitacoes/{login} → substitui a lista completa do cliente.
 * Uma lista vazia remove todas as solicitações.
 */
solicitacoesRouter.put("/:login", async (req, res) => {
  if (!Array.isArray(req.body)) throw ApiError.requisicaoInvalida(MSG_CORPO_INVALIDO);
  const itens = req.body.map(lerItem);
  res.json(await solicitacaoService.substituirLista(req.params.login, itens));
});
