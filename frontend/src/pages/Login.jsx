import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Header from "../components/layout/Header.jsx";
import AuthVisual from "../components/auth/AuthVisual.jsx";
import Alerta from "../components/ui/Alerta.jsx";
import Campo from "../components/ui/Campo.jsx";
import useFocoCampos from "../hooks/useFocoCampos.js";
import useRedirecionarApos from "../hooks/useRedirecionarApos.js";
import { useSessao } from "../context/SessaoContext.jsx";
import { api } from "../services/api.js";
import { validarEmail } from "../utils/validators.js";

const VAZIO = { email: "", senha: "" };

function validar({ email, senha }) {
  const erros = {};
  if (email.trim() === "") erros.email = "Informe o e-mail.";
  else if (!validarEmail(email)) erros.email = "E-mail em formato inválido.";
  if (senha === "") erros.senha = "Informe a senha.";
  return erros;
}

export default function Login() {
  const { entrar } = useSessao();
  const location = useLocation();
  const destino = location.state?.destino || "/servicos";

  const [valores, setValores] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [validado, setValidado] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const { registrar, focar, focarPrimeiroErro } = useFocoCampos();

  useRedirecionarApos(sucesso, destino);

  const alterar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setErroGeral("");
    const novosErros = validar(valores);
    setErros(novosErros);
    setValidado(true);

    if (Object.keys(novosErros).length > 0) {
      setErroGeral("Não foi possível entrar. Corrija os campos destacados.");
      focarPrimeiroErro(novosErros, ["email", "senha"]);
      return;
    }

    setEnviando(true);
    try {
      const autenticado = await api.login(valores.email.trim(), valores.senha);
      if (autenticado) {
        entrar(valores.email);
        setSucesso(true);
      } else {
        setErroGeral("E-mail ou senha inválidos.");
        focar("senha");
      }
    } catch (err) {
      setErroGeral(err.message);
    } finally {
      setEnviando(false);
    }
  }

  function handleLimpar() {
    setValores(VAZIO);
    setErros({});
    setValidado(false);
    setErroGeral("");
    focar("email");
  }

  return (
    <>
      <Header />
      <div className="auth-split">
        <AuthVisual />

        <main className="auth-form-area">
          <div className="auth-form-inner">
            <header className="auth-cabecalho">
              <h1>Login de clientes</h1>
              <p>Entre com seu e-mail e senha cadastrados.</p>
            </header>

            {sucesso && <Alerta tipo="sucesso">Login realizado com sucesso. Redirecionando…</Alerta>}
            <Alerta>{erroGeral}</Alerta>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
              <Campo id="email" label="E-mail" obrigatorio erro={erros.email} ok={validado && !erros.email}>
                <input type="email" id="email" name="email" autoComplete="email"
                       placeholder="voce@exemplo.com.br" ref={registrar("email")}
                       value={valores.email} onChange={alterar} />
              </Campo>

              <Campo id="senha" label="Senha" obrigatorio erro={erros.senha} ok={validado && !erros.senha}>
                <input type="password" id="senha" name="senha" autoComplete="current-password"
                       placeholder="Digite sua senha" ref={registrar("senha")}
                       value={valores.senha} onChange={alterar} />
              </Campo>

              <div className="auth-acoes">
                <button type="submit" className="btn btn--primario" disabled={enviando || sucesso}>
                  {enviando ? "Entrando…" : "Realizar Login"}
                </button>
                <button type="button" className="btn btn--secundario" onClick={handleLimpar}>Limpar</button>
              </div>
            </form>

            <nav className="auth-rodape">
              <p><Link to="/troca-senha">Esqueci / trocar minha senha</Link></p>
              <p>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
            </nav>
          </div>
        </main>
      </div>
    </>
  );
}
