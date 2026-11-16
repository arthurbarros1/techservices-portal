import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import RegrasSenha from "../components/auth/RegrasSenha.jsx";
import Alerta from "../components/ui/Alerta.jsx";
import Campo from "../components/ui/Campo.jsx";
import useFocoCampos from "../hooks/useFocoCampos.js";
import useRedirecionarApos from "../hooks/useRedirecionarApos.js";
import { useSessao } from "../context/SessaoContext.jsx";
import { api } from "../services/api.js";
import { senhasConferem, validarEmail, validarSenhaForte } from "../utils/validators.js";

const ORDEM = ["email", "senhaAtual", "senha", "confirma"];

function validar({ email, senhaAtual, senha, confirma }) {
  const erros = {};
  if (email.trim() === "") erros.email = "Informe o e-mail.";
  else if (!validarEmail(email)) erros.email = "E-mail em formato inválido.";

  if (senhaAtual === "") erros.senhaAtual = "Informe a senha atual.";

  if (senha === "") erros.senha = "Informe a nova senha.";
  else if (!validarSenhaForte(senha).valido) erros.senha = "A senha não atende a todas as regras.";
  else if (senha === senhaAtual) erros.senha = "A nova senha deve ser diferente da atual.";

  if (confirma === "") erros.confirma = "Confirme a nova senha.";
  else if (!senhasConferem(senha, confirma)) erros.confirma = "As senhas não conferem.";
  return erros;
}

export default function TrocaSenha() {
  const { login, sair } = useSessao();
  const vazio = { email: login || "", senhaAtual: "", senha: "", confirma: "" };

  const [valores, setValores] = useState(vazio);
  const [erros, setErros] = useState({});
  const [validado, setValidado] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const { registrar, focar, focarPrimeiroErro } = useFocoCampos();

  useRedirecionarApos(sucesso, "/login");

  const alterar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });
  const ok = (campo) => validado && !erros[campo];

  async function handleSubmit(e) {
    e.preventDefault();
    setErroGeral("");
    const novosErros = validar(valores);
    setErros(novosErros);
    setValidado(true);

    if (Object.keys(novosErros).length > 0) {
      setErroGeral("Não foi possível trocar a senha. Corrija os campos destacados.");
      focarPrimeiroErro(novosErros, ORDEM);
      return;
    }

    setEnviando(true);
    try {
      await api.trocarSenha(valores.email.trim(), valores.senhaAtual, valores.senha);
      sair(); // força novo login com a senha nova
      setSucesso(true);
    } catch (err) {
      if (err.status === 401) {
        setErros({ senhaAtual: "Senha atual incorreta para este e-mail." });
        focar("senhaAtual");
      }
      setErroGeral(err.message);
    } finally {
      setEnviando(false);
    }
  }

  function handleLimpar() {
    setValores(vazio);
    setErros({});
    setValidado(false);
    setErroGeral("");
    focar("email");
  }

  return (
    <>
      <Header />
      <main className="conteudo-central">
        <section className="auth-card" aria-labelledby="titulo-troca">
          <header className="auth-cabecalho">
            <h1 id="titulo-troca">Troca de senha de clientes</h1>
            <p>Confirme sua senha atual e defina uma nova seguindo as regras abaixo.</p>
          </header>

          {sucesso && <Alerta tipo="sucesso">Senha alterada com sucesso. Retornando ao login…</Alerta>}
          <Alerta>{erroGeral}</Alerta>

          <form className="auth-form" noValidate onSubmit={handleSubmit}>
            <Campo id="email" label="E-mail" obrigatorio erro={erros.email} ok={ok("email")}>
              <input type="email" id="email" name="email" autoComplete="email"
                     placeholder="voce@exemplo.com.br" ref={registrar("email")}
                     value={valores.email} onChange={alterar} />
            </Campo>

            <Campo id="senhaAtual" label="Senha atual" obrigatorio erro={erros.senhaAtual} ok={ok("senhaAtual")}>
              <input type="password" id="senhaAtual" name="senhaAtual" autoComplete="current-password"
                     placeholder="Digite sua senha atual" ref={registrar("senhaAtual")}
                     value={valores.senhaAtual} onChange={alterar} />
            </Campo>

            <Campo id="senha" label="Nova senha" obrigatorio erro={erros.senha} ok={ok("senha")}>
              <input type="password" id="senha" name="senha" autoComplete="new-password"
                     placeholder="Crie uma nova senha" ref={registrar("senha")}
                     value={valores.senha} onChange={alterar} />
            </Campo>

            <Campo id="confirma" label="Confirmar nova senha" obrigatorio erro={erros.confirma} ok={ok("confirma")}>
              <input type="password" id="confirma" name="confirma" autoComplete="new-password"
                     placeholder="Repita a nova senha" ref={registrar("confirma")}
                     value={valores.confirma} onChange={alterar} />
            </Campo>

            <RegrasSenha titulo="Regras da nova senha" senha={valores.senha} />

            <div className="auth-acoes">
              <button type="submit" className="btn btn--primario" disabled={enviando || sucesso}>
                {enviando ? "Enviando…" : "Troca Senha"}
              </button>
              <button type="button" className="btn btn--secundario" onClick={handleLimpar}>Limpar</button>
            </div>
          </form>

          <nav className="auth-rodape">
            <p>Lembrou a senha? <Link to="/login">Voltar ao login</Link></p>
          </nav>
        </section>
      </main>
      <Footer />
    </>
  );
}
