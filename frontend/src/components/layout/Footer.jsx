import FormasPagamento from "./FormasPagamento.jsx";

/** Rodapé institucional. `completo` inclui as formas de pagamento (página inicial). */
export default function Footer({ completo = false }) {
  return (
    <footer className="rodape-institucional main-footer">
      <div className="rodape-conteudo">
        <div className="rodape-grade">
          <section>
            <h3>Contato</h3>
            <ul className="lista-contatos">
              <li>Telefone fixo: <a href="tel:+558133334444">(81) 3333-4444</a></li>
              <li>WhatsApp: <a href="https://wa.me/5581999998888" target="_blank" rel="noopener noreferrer">(81) 99999-8888</a></li>
              <li>E-mail: <a href="mailto:contato@techservices.com.br">contato@techservices.com.br</a></li>
            </ul>
          </section>
          <section>
            <h3>Endereço</h3>
            <address>
              Av. Agamenon Magalhães, 1000 — Sala 1200<br />
              Boa Vista, Recife/PE<br />
              CEP 50070-160
            </address>
          </section>
          {completo && (
            <section>
              <h3>Formas de pagamento</h3>
              <FormasPagamento />
            </section>
          )}
        </div>
      </div>
      <p className="rodape-base">
        &copy; 2026 TechServices — Soluções em Tecnologia da Informação.
        {completo && " Todos os direitos reservados."}
      </p>
    </footer>
  );
}
