import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import Alerta from "../components/ui/Alerta.jsx";
import FormServico from "../components/servicos/FormServico.jsx";
import TabelaServicos from "../components/servicos/TabelaServicos.jsx";
import { api } from "../services/api.js";

export default function CadastroServico() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    let ativo = true;
    api.listarServicos()
      .then((lista) => ativo && setServicos(lista))
      .catch((err) => ativo && setAlerta({ tipo: "erro", texto: err.message }))
      .finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, []);

  /** Envia via POST /api/servicos. Retorna true no sucesso ou os erros de campo do backend. */
  async function salvar(dados) {
    setEnviando(true);
    setAlerta({ tipo: "", texto: "" });
    try {
      const criado = await api.cadastrarServico(dados);
      setServicos((atual) => [...atual, criado].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
      setAlerta({ tipo: "sucesso", texto: `Serviço “${criado.nome}” cadastrado com o código #${criado.id}.` });
      return true;
    } catch (err) {
      setAlerta({ tipo: "erro", texto: err.message });
      return Object.keys(err.campos || {}).length > 0 ? err.campos : false;
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Header />
      <main className="conteudo-central">
        <section className="auth-card auth-card--amplo" aria-labelledby="titulo-servico">
          <header className="auth-cabecalho">
            <h1 id="titulo-servico">Cadastro de serviços de TI</h1>
            <p>Inclua um novo serviço no catálogo disponível aos clientes.</p>
          </header>

          <Alerta tipo={alerta.tipo}>{alerta.texto}</Alerta>
          <FormServico onSalvar={salvar} enviando={enviando} />

          <nav className="auth-rodape">
            <p><Link to="/servicos">Ir para minhas solicitações</Link></p>
          </nav>
        </section>

        <section className="painel-secao" aria-label="Catálogo de serviços" style={{ marginTop: "2rem" }}>
          <h2>Catálogo de serviços</h2>
          <TabelaServicos servicos={servicos} carregando={carregando} />
        </section>
      </main>
      <Footer />
    </>
  );
}
