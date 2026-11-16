import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import RegrasSenha from "../components/auth/RegrasSenha.jsx";
import EstadoCivilRadio from "../components/cadastro/EstadoCivilRadio.jsx";
import EscolaridadeSelect from "../components/cadastro/EscolaridadeSelect.jsx";
import Alerta from "../components/ui/Alerta.jsx";
import Campo from "../components/ui/Campo.jsx";
import useFocoCampos from "../hooks/useFocoCampos.js";
import useRedirecionarApos from "../hooks/useRedirecionarApos.js";
import { api } from "../services/api.js";
import {
  mascararCPF, mascararTelefone, senhasConferem, validarCPF, validarEmail,
  validarMaioridade, validarNomeCompleto, validarSenhaForte, validarTelefone
} from "../utils/validators.js";

const VAZIO = {
  email: "", nome: "", cpf: "", nascimento: "", telefone: "",
  senha: "", confirma: "", estadoCivil: "solteiro", escolaridade: "2g-completo"
};
const ORDEM = ["email", "nome", "cpf", "nascimento", "telefone", "senha", "confirma"];

function validar(v) {
  const erros = {};
  if (v.email.trim() === "") erros.email = "Informe o e-mail.";
  else if (!validarEmail(v.email)) erros.email = "E-mail em formato inválido.";

  if (v.nome.trim() === "") erros.nome = "Informe o nome completo.";
  else if (!validarNomeCompleto(v.nome)) erros.nome = "Nome inválido. Verifique as regras abaixo do campo.";

  if (v.cpf === "") erros.cpf = "Informe o CPF.";
  else if (!validarCPF(v.cpf)) erros.cpf = "CPF inválido.";

  if (v.nascimento === "") erros.nascimento = "Informe a data de nascimento.";
  else if (!validarMaioridade(v.nascimento)) erros.nascimento = "É necessário ter 18 anos ou mais.";

  if (v.telefone !== "" && !validarTelefone(v.telefone)) erros.telefone = "Telefone em formato inválido.";

  if (v.senha === "") erros.senha = "Informe a senha.";
  else if (!validarSenhaForte(v.senha).valido) erros.senha = "A senha não atende a todas as regras.";

  if (v.confirma === "") erros.confirma = "Confirme a senha.";
  else if (!senhasConferem(v.senha, v.confirma)) erros.confirma = "As senhas não conferem.";
  return erros;
}

export default function CadastroCliente() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [validado, setValidado] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const { registrar, focar, focarPrimeiroErro } = useFocoCampos();

  useRedirecionarApos(sucesso, "/login", 1800);

  const definir = (campo, valor) => setValores((atual) => ({ ...atual, [campo]: valor }));
  const alterar = (e) => definir(e.target.name, e.target.value);
  const ok = (campo) => validado && !erros[campo];

  async function handleSubmit(e) {
    e.preventDefault();
    setErroGeral("");
    const novosErros = validar(valores);
    setErros(novosErros);
    setValidado(true);

    if (Object.keys(novosErros).length > 0) {
      setErroGeral("Não foi possível concluir o cadastro. Corrija os campos destacados.");
      focarPrimeiroErro(novosErros, ORDEM);
      return;
    }

    setEnviando(true);
    try {
      await api.cadastrarCliente({
        nome: valores.nome.trim(),
        login: valores.email.trim(),
        senha: valores.senha,
        cpf: valores.cpf,
        dataNascimento: valores.nascimento,
        telefone: valores.telefone || null,
        estadoCivil: valores.estadoCivil,
        escolaridade: valores.escolaridade
      });
      setSucesso(true);
    } catch (err) {
      if (err.status === 409) {
        setErros({ email: "Este e-mail já está cadastrado." });
        focar("email");
      }
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
      <main className="conteudo-central">
        <section className="auth-card auth-card--amplo" aria-labelledby="titulo-cadastro">
          <header className="auth-cabecalho">
            <h1 id="titulo-cadastro">Cadastro de clientes</h1>
            <p>Preencha seus dados para criar uma conta.</p>
          </header>

          {sucesso && <Alerta tipo="sucesso">Cadastro realizado com sucesso. Redirecionando ao login…</Alerta>}
          <Alerta>{erroGeral}</Alerta>

          <form className="auth-form" noValidate onSubmit={handleSubmit}>
            <Campo id="email" label="E-mail (login)" obrigatorio erro={erros.email} ok={ok("email")}>
              <input type="email" id="email" name="email" autoComplete="email"
                     placeholder="voce@exemplo.com.br" ref={registrar("email")}
                     value={valores.email} onChange={alterar} />
            </Campo>

            <Campo id="nome" label="Nome completo" obrigatorio erro={erros.nome} ok={ok("nome")}
                   ajuda="Ao menos duas palavras; a primeira com 2+ letras; sem caracteres especiais.">
              <input type="text" id="nome" name="nome" autoComplete="name"
                     placeholder="Ex.: Maria da Silva" ref={registrar("nome")}
                     value={valores.nome} onChange={alterar} />
            </Campo>

            <div className="campo-linha">
              <Campo id="cpf" label="CPF" obrigatorio erro={erros.cpf} ok={ok("cpf")}>
                <input type="text" id="cpf" name="cpf" inputMode="numeric" maxLength={14}
                       placeholder="000.000.000-00" ref={registrar("cpf")}
                       value={valores.cpf} onChange={(e) => definir("cpf", mascararCPF(e.target.value))} />
              </Campo>

              <Campo id="nascimento" label="Data de nascimento" obrigatorio erro={erros.nascimento} ok={ok("nascimento")}>
                <input type="date" id="nascimento" name="nascimento" ref={registrar("nascimento")}
                       value={valores.nascimento} onChange={alterar} />
              </Campo>
            </div>

            <Campo id="telefone" label={<>Celular / WhatsApp <span className="ajuda">(opcional)</span></>}
                   erro={erros.telefone} ok={ok("telefone") && valores.telefone !== ""}>
              <input type="tel" id="telefone" name="telefone" inputMode="numeric" maxLength={15}
                     placeholder="(00) 00000-0000" ref={registrar("telefone")}
                     value={valores.telefone} onChange={(e) => definir("telefone", mascararTelefone(e.target.value))} />
            </Campo>

            <Campo id="senha" label="Senha" obrigatorio erro={erros.senha} ok={ok("senha")}>
              <input type="password" id="senha" name="senha" autoComplete="new-password"
                     placeholder="Crie uma senha" ref={registrar("senha")}
                     value={valores.senha} onChange={alterar} />
            </Campo>

            <Campo id="confirma" label="Confirmar senha" obrigatorio erro={erros.confirma} ok={ok("confirma")}>
              <input type="password" id="confirma" name="confirma" autoComplete="new-password"
                     placeholder="Repita a senha" ref={registrar("confirma")}
                     value={valores.confirma} onChange={alterar} />
            </Campo>

            <RegrasSenha senha={valores.senha} />

            <EstadoCivilRadio valor={valores.estadoCivil} onChange={(v) => definir("estadoCivil", v)} />
            <EscolaridadeSelect valor={valores.escolaridade} onChange={(v) => definir("escolaridade", v)} />

            <div className="auth-acoes">
              <button type="submit" className="btn btn--primario" disabled={enviando || sucesso}>
                {enviando ? "Enviando…" : "Incluir"}
              </button>
              <button type="button" className="btn btn--secundario" onClick={handleLimpar}>Limpar</button>
              <button type="button" className="btn btn--secundario" onClick={() => navigate(-1)}>Voltar</button>
            </div>
          </form>

          <nav className="auth-rodape">
            <p>Já tem conta? <Link to="/login">Faça login</Link></p>
          </nav>
        </section>
      </main>
      <Footer />
    </>
  );
}
