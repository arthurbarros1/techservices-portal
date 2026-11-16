import { Link } from "react-router-dom";
import { useSessao } from "../../context/SessaoContext.jsx";

export default function Hero() {
  const { logado } = useSessao();

  return (
    <section className="hero">
      <div className="hero__conteudo">
        <span className="hero__selo">Tecnologia da Informação desde 2010</span>
        <h1>Soluções de TI que <span>impulsionam</span> o seu negócio</h1>
        <p>
          Suporte técnico, infraestrutura, desenvolvimento de sistemas e segurança da informação — tudo com a
          confiança de quem cuida da sua tecnologia há mais de 15 anos.
        </p>
        <div className="hero__acoes">
          {logado ? (
            <Link to="/servicos" className="btn btn--primario">Minhas solicitações</Link>
          ) : (
            <>
              <Link to="/cadastro" className="btn btn--primario">Criar conta</Link>
              <Link to="/login" className="btn btn--secundario">Acessar área do cliente</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
