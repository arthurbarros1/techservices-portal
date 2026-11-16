export default function DadosUsuario({ nome, login }) {
  return (
    <section className="painel-secao" aria-label="Dados do usuário">
      <h2>Área do cliente</h2>
      <div className="dados-usuario">
        <div className="dado-item">
          <span className="rotulo">Nome</span>
          <span className="valor">{nome || "—"}</span>
        </div>
        <div className="dado-item">
          <span className="rotulo">E-mail</span>
          <span className="valor">{login}</span>
        </div>
      </div>
    </section>
  );
}
