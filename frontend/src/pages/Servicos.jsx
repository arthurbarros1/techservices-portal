import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import Alerta from "../components/ui/Alerta.jsx";
import DadosUsuario from "../components/servicos/DadosUsuario.jsx";
import TabelaSolicitacoes from "../components/servicos/TabelaSolicitacoes.jsx";
import NovaSolicitacao, { STATUS_INICIAL } from "../components/servicos/NovaSolicitacao.jsx";
import BarraCarrinho from "../components/servicos/BarraCarrinho.jsx";
import { useSessao } from "../context/SessaoContext.jsx";
import { api } from "../services/api.js";
import { hojeISO, somarDiasISO } from "../utils/formatters.js";

// Cada item recebe uma `chave` local estável para a lista do React.
let sequenciaChave = 0;
const novaChave = () => `item-${++sequenciaChave}`;
const comChave = (lista) => lista.map((s) => ({ ...s, chave: novaChave() }));

/** Próximo número no formato AAAA-NNNN, continuando a sequência do ano corrente. */
function proximoNumero(itens) {
  const ano = new Date().getFullYear();
  const maior = itens
    .map((i) => i.numero || "")
    .filter((n) => n.startsWith(`${ano}-`))
    .map((n) => Number(n.split("-")[1]) || 0)
    .reduce((a, b) => Math.max(a, b), 0);
  return `${ano}-${String(maior + 1).padStart(4, "0")}`;
}

export default function Servicos() {
  const { login } = useSessao();

  const [cliente, setCliente] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [recarga, setRecarga] = useState(0);
  const [pendente, setPendente] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });

  // Carrega catálogo (GET /api/servicos) e solicitações do usuário (GET /api/solicitacoes/{login})
  useEffect(() => {
    let ativo = true;
    setCarregando(true);

    Promise.all([
      api.listarServicos(),
      api.listarSolicitacoes(login),
      api.buscarCliente(login).catch(() => null)
    ])
      .then(([listaServicos, listaSolicitacoes, dadosCliente]) => {
        if (!ativo) return;
        setServicos(listaServicos);
        setItens(comChave(listaSolicitacoes));
        setCliente(dadosCliente);
        setPendente(false);
      })
      .catch((err) => ativo && setAlerta({ tipo: "erro", texto: err.message }))
      .finally(() => ativo && setCarregando(false));

    return () => { ativo = false; };
  }, [login, recarga]);

  function incluir(servico) {
    const dataPedido = hojeISO();
    setItens((atual) => [
      ...atual,
      {
        chave: novaChave(),
        numero: proximoNumero(atual),
        servicoId: servico.id,
        servicoNome: servico.nome,
        dataPedido,
        status: STATUS_INICIAL,
        precoCobrado: servico.preco,
        dataPrevista: somarDiasISO(dataPedido, servico.prazoDias)
      }
    ]);
    setPendente(true);
    setAlerta({ tipo: "", texto: "" });
  }

  function excluir(chave) {
    setItens((atual) => atual.filter((i) => i.chave !== chave));
    setPendente(true);
    setAlerta({ tipo: "", texto: "" });
  }

  async function salvar() {
    setSalvando(true);
    setAlerta({ tipo: "", texto: "" });
    try {
      const payload = itens.map(({ numero, servicoId, dataPedido, status, precoCobrado, dataPrevista }) => ({
        numero, servicoId, dataPedido, status, precoCobrado, dataPrevista
      }));
      const salvas = await api.salvarSolicitacoes(login, payload);
      setItens(comChave(salvas));
      setPendente(false);
      setAlerta({ tipo: "sucesso", texto: "Solicitações salvas com sucesso." });
    } catch (err) {
      setAlerta({ tipo: "erro", texto: err.message });
    } finally {
      setSalvando(false);
    }
  }

  function descartar() {
    setAlerta({ tipo: "", texto: "" });
    setRecarga((n) => n + 1);
  }

  const total = itens.reduce((soma, i) => soma + Number(i.precoCobrado), 0);

  return (
    <>
      <Header />
      <main className="conteudo-central">
        <DadosUsuario nome={cliente?.nome} login={login} />

        <section className="painel-secao" aria-label="Minhas solicitações">
          <h2>Minhas solicitações</h2>
          <Alerta tipo={alerta.tipo}>{alerta.texto}</Alerta>
          <TabelaSolicitacoes itens={itens} carregando={carregando} onExcluir={excluir} />
          <BarraCarrinho total={total} pendente={pendente} salvando={salvando}
                         onSalvar={salvar} onDescartar={descartar} />
        </section>

        {!carregando && servicos.length === 0 ? (
          <section className="painel-secao">
            <h2>Nova solicitação de serviço</h2>
            <p className="carregando">
              Nenhum serviço de TI cadastrado. <Link to="/servicos/novo">Cadastre o primeiro serviço</Link>.
            </p>
          </section>
        ) : (
          <NovaSolicitacao servicos={servicos} onIncluir={incluir} />
        )}
      </main>
      <Footer />
    </>
  );
}
