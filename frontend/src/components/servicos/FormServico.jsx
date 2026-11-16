import { useState } from "react";

import Campo from "../ui/Campo.jsx";
import useFocoCampos from "../../hooks/useFocoCampos.js";

const VAZIO = { nome: "", descricao: "", preco: "", prazoDias: "" };
const ORDEM = ["nome", "descricao", "preco", "prazoDias"];
const MAX_DESCRICAO = 500;

/** Converte "1.234,56", "1234,56" ou "1234.56" em número; NaN se inválido. */
function lerPreco(texto) {
  const limpo = texto.trim().replace(/\s/g, "");
  // Formato brasileiro com separador de milhar: 1.234 / 1.234,56
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(limpo)) {
    return Number(limpo.replace(/\./g, "").replace(",", "."));
  }
  // Sem milhar: 1234 / 1234,5 / 1234.56
  if (/^\d+([.,]\d{1,2})?$/.test(limpo)) return Number(limpo.replace(",", "."));
  return NaN;
}

export function validarServico(v) {
  const erros = {};
  const nome = v.nome.trim();
  if (nome === "") erros.nome = "Informe o nome do serviço.";
  else if (nome.length < 3 || nome.length > 100) erros.nome = "O nome deve ter entre 3 e 100 caracteres.";

  const descricao = v.descricao.trim();
  if (descricao === "") erros.descricao = "Informe a descrição do serviço.";
  else if (descricao.length < 10) erros.descricao = "A descrição deve ter pelo menos 10 caracteres.";
  else if (descricao.length > MAX_DESCRICAO) erros.descricao = `Máximo de ${MAX_DESCRICAO} caracteres.`;

  const preco = lerPreco(v.preco);
  if (v.preco.trim() === "") erros.preco = "Informe o preço.";
  else if (Number.isNaN(preco)) erros.preco = "Preço inválido. Use o formato 1500,00.";
  else if (preco <= 0) erros.preco = "O preço deve ser maior que zero.";

  const prazo = Number(v.prazoDias);
  if (v.prazoDias === "") erros.prazoDias = "Informe o prazo.";
  else if (!Number.isInteger(prazo) || prazo < 1 || prazo > 365) erros.prazoDias = "Informe um número inteiro de 1 a 365 dias.";

  return { erros, dados: { nome, descricao, preco, prazoDias: prazo } };
}

/**
 * Formulário do serviço com validação obrigatória no React.
 * `onSalvar(dados)` deve devolver uma Promise; em caso de sucesso o form é limpo.
 */
export default function FormServico({ onSalvar, enviando }) {
  const [valores, setValores] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [validado, setValidado] = useState(false);
  const { registrar, focar, focarPrimeiroErro } = useFocoCampos();

  const alterar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });
  const ok = (campo) => validado && !erros[campo];

  async function handleSubmit(e) {
    e.preventDefault();
    const { erros: novosErros, dados } = validarServico(valores);
    setErros(novosErros);
    setValidado(true);

    if (Object.keys(novosErros).length > 0) {
      focarPrimeiroErro(novosErros, ORDEM);
      return;
    }

    const salvou = await onSalvar(dados);
    if (salvou === true) limpar();
    else if (salvou && typeof salvou === "object") {
      setErros(salvou); // erros de campo vindos do backend
      focarPrimeiroErro(salvou, ORDEM);
    }
  }

  function limpar() {
    setValores(VAZIO);
    setErros({});
    setValidado(false);
    focar("nome");
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      <Campo id="nome" label="Nome do serviço" obrigatorio erro={erros.nome} ok={ok("nome")}>
        <input type="text" id="nome" name="nome" maxLength={100} placeholder="Ex.: Suporte técnico remoto"
               ref={registrar("nome")} value={valores.nome} onChange={alterar} />
      </Campo>

      <Campo id="descricao" label="Descrição" obrigatorio erro={erros.descricao} ok={ok("descricao")}
             ajuda="Mínimo de 10 caracteres.">
        <textarea id="descricao" name="descricao" maxLength={MAX_DESCRICAO}
                  placeholder="Descreva o escopo do atendimento"
                  ref={registrar("descricao")} value={valores.descricao} onChange={alterar} />
        <span className="contador-caracteres">{valores.descricao.length}/{MAX_DESCRICAO}</span>
      </Campo>

      <div className="campo-linha">
        <Campo id="preco" label="Preço (R$)" obrigatorio erro={erros.preco} ok={ok("preco")}>
          <input type="text" id="preco" name="preco" inputMode="decimal" placeholder="1500,00"
                 ref={registrar("preco")} value={valores.preco} onChange={alterar} />
        </Campo>

        <Campo id="prazoDias" label="Prazo de atendimento (dias)" obrigatorio erro={erros.prazoDias} ok={ok("prazoDias")}>
          <input type="number" id="prazoDias" name="prazoDias" min={1} max={365} step={1} placeholder="5"
                 ref={registrar("prazoDias")} value={valores.prazoDias} onChange={alterar} />
        </Campo>
      </div>

      <div className="auth-acoes">
        <button type="submit" className="btn btn--primario" disabled={enviando}>
          {enviando ? "Enviando…" : "Cadastrar serviço"}
        </button>
        <button type="button" className="btn btn--secundario" onClick={limpar}>Limpar</button>
      </div>
    </form>
  );
}
