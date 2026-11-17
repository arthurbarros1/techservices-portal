import { Router } from "express";
import * as authService from "../services/authService.js";
import { Validador, emBranco, exigirObjeto, texto } from "../validation.js";

export const authRouter = Router();

/** POST /api/auth/login → corpo da resposta: true ou false. */
authRouter.post("/login", async (req, res) => {
  const corpo = exigirObjeto(req.body);
  const dados = { login: texto(corpo, "login"), senha: texto(corpo, "senha") };

  new Validador()
    .verificar(emBranco(dados.login), "login", "Informe o login.")
    .verificar(emBranco(dados.senha), "senha", "Informe a senha.")
    .lancarSeHouverErros();

  res.json(await authService.autenticar(dados));
});

/** PUT /api/auth/password → 200 em caso de sucesso; 401 se a senha atual não conferir. */
authRouter.put("/password", async (req, res) => {
  const corpo = exigirObjeto(req.body);
  const dados = {
    login: texto(corpo, "login"),
    senhaAtual: texto(corpo, "senhaAtual"),
    novaSenha: texto(corpo, "novaSenha")
  };

  new Validador()
    .verificar(emBranco(dados.login), "login", "Informe o login.")
    .verificar(emBranco(dados.senhaAtual), "senhaAtual", "Informe a senha atual.")
    .verificar(emBranco(dados.novaSenha), "novaSenha", "Informe a nova senha.")
    .lancarSeHouverErros();

  await authService.trocarSenha(dados);
  res.json({ mensagem: "Senha alterada com sucesso." });
});
