/** Painel visual à esquerda da tela de login (layout "split" da AV1). */
export default function AuthVisual() {
  return (
    <aside className="auth-visual">
      <span className="marca auth-visual__marca">Tech<span>Services</span></span>
      <h2>Bem-vindo de <span>volta</span></h2>
      <p>Acesse a área do cliente para acompanhar e solicitar seus serviços de Tecnologia da Informação.</p>
      <ul className="auth-visual__lista">
        <li>Acompanhe suas ordens de serviço</li>
        <li>Solicite novos atendimentos</li>
        <li>Suporte técnico especializado</li>
      </ul>
    </aside>
  );
}
