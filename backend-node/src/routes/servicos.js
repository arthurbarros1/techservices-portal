import { Router } from "express";
import * as servicoService from "../services/servicoService.js";
import {
  Validador, casasDecimais, emBranco, exigirObjeto, inteiro, numero, texto
} from "../validation.js";

export const servicosRouter = Router();

/** POST /api/servicos → 201 com o serviço criado (id gerado por autoincremento). */
servicosRouter.post("/", async (req, res) => {
  const corpo = exigirObjeto(req.body);
  const dados = {
    nome: texto(corpo, "nome"),
    descricao: texto(corpo, "descricao"),
    preco: numero(corpo, "preco"),
    prazoDias: inteiro(corpo, "prazoDias")
  };

  const nome = dados.nome ?? "";
  const descricao = dados.descricao ?? "";

  new Validador()
    .verificar(emBranco(dados.nome), "nome", "Informe o nome do serviço.")
    .verificar(nome.length > 0 && (nome.length < 3 || nome.length > 100), "nome",
      "O nome deve ter entre 3 e 100 caracteres.")
    .verificar(emBranco(dados.descricao), "descricao", "Informe a descrição do serviço.")
    .verificar(descricao.length > 0 && (descricao.length < 10 || descricao.length > 500), "descricao",
      "A descrição deve ter entre 10 e 500 caracteres.")
    .verificar(dados.preco === null, "preco", "Informe o preço.")
    .verificar(dados.preco !== null && dados.preco < 0.01, "preco", "O preço deve ser maior que zero.")
    .verificar(dados.preco !== null && (casasDecimais(dados.preco) > 2 || Math.abs(dados.preco) >= 1e10),
      "preco", "Preço com no máximo 2 casas decimais.")
    .verificar(dados.prazoDias === null, "prazoDias", "Informe o prazo.")
    .verificar(dados.prazoDias !== null && dados.prazoDias < 1, "prazoDias", "O prazo deve ser de pelo menos 1 dia.")
    .verificar(dados.prazoDias !== null && dados.prazoDias > 365, "prazoDias", "O prazo deve ser de no máximo 365 dias.")
    .lancarSeHouverErros();

  res.status(201).json(await servicoService.cadastrar(dados));
});

/** GET /api/servicos → todos os serviços de TI cadastrados. */
servicosRouter.get("/", async (req, res) => {
  res.json(await servicoService.listarTodos());
});
