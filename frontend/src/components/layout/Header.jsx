import { Link, useNavigate } from "react-router-dom";
import { useSessao } from "../../context/SessaoContext.jsx";

/** Cabeçalho da AV1 com o menu condicionado ao login. */
export default function Header() {
  const { logado, sair } = useSessao();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate("/login");
  }

  return (
    <header className="cabecalho-topo main-header">
      <div className="cabecalho-conteudo">
        <Link to="/" className="marca" aria-label="TechServices — página inicial">
          Tech<span>Services</span>
        </Link>
        <nav className="menu-principal" aria-label="Navegação principal">
          <ul>
            <li><Link to="/">Início</Link></li>
            {logado ? (
              <>
                <li><Link to="/servicos">Serviços</Link></li>
                <li><Link to="/servicos/novo">Novo serviço</Link></li>
                <li><a href="#sair" className="link-botao" onClick={(e) => { e.preventDefault(); handleSair(); }}>Sair</a></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Entrar</Link></li>
                <li><Link to="/cadastro">Cadastrar</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
