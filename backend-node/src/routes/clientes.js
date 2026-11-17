import { Router } from "express";
import * as clienteService from "../services/clienteService.js";
import { Validador, data, emBranco, emailValido, exigirObjeto, tamanhoMaior, texto } from "../validation.js";

export const clientesRouter = Router();

/** POST /api/clientes → 201; 409 se o login já estiver cadastrado. */
clientesRouter.post("/", async (req, res) => {
  const corpo = exigirObjeto(req.body);
  const dados = {
    nome: texto(corpo, "nome"),
    login: texto(corpo, "login"),
    senha: texto(corpo, "senha"),
    cpf: texto(corpo, "cpf"),
    dataNascimento: data(corpo, "dataNascimento"),
    telefone: texto(corpo, "telefone"),
    estadoCivil: texto(corpo, "estadoCivil"),
    escolaridade: texto(corpo, "escolaridade")
  };

  new Validador()
    .verificar(emBranco(dados.nome), "nome", "Informe o nome.")
    .verificar(tamanhoMaior(dados.nome, 120), "nome", "O nome deve ter no máximo 120 caracteres.")
    .verificar(emBranco(dados.login), "login", "Informe o login.")
    .verificar(!emBranco(dados.login) && !emailValido(dados.login), "login", "Login deve ser um e-mail válido.")
    .verificar(tamanhoMaior(dados.login, 120), "login", "O login deve ter no máximo 120 caracteres.")
    .verificar(emBranco(dados.senha), "senha", "Informe a senha.")
    .verificar(tamanhoMaior(dados.cpf, 14), "cpf", "O CPF deve ter no máximo 14 caracteres.")
    .verificar(tamanhoMaior(dados.telefone, 20), "telefone", "O telefone deve ter no máximo 20 caracteres.")
    .verificar(tamanhoMaior(dados.estadoCivil, 20), "estadoCivil", "O estado civil deve ter no máximo 20 caracteres.")
    .verificar(tamanhoMaior(dados.escolaridade, 30), "escolaridade", "A escolaridade deve ter no máximo 30 caracteres.")
    .lancarSeHouverErros();

  res.status(201).json(await clienteService.cadastrar(dados));
});

/**
 * GET /api/clientes/{login} — endpoint auxiliar (também existe no backend Java),
 * usado pelo painel do frontend para exibir o nome do cliente. Não expõe a senha.
 */
clientesRouter.get("/:login", async (req, res) => {
  res.json(await clienteService.buscarPorLogin(req.params.login));
});
