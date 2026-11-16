function Selo({ titulo, legenda, children }) {
  return (
    <figure className="selo-pagamento" title={titulo}>
      <svg width="48" height="32" viewBox="0 0 48 32" role="img" aria-label={titulo} xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="46" height="30" rx="4" fill="#1a212e" stroke="#3a465a" />
        {children}
      </svg>
      <figcaption>{legenda}</figcaption>
    </figure>
  );
}

const BARRAS_BOLETO = [[8, 2], [12, 1], [15, 3], [20, 1], [23, 2], [27, 3], [32, 1], [35, 2], [39, 1]];

export default function FormasPagamento() {
  return (
    <div className="formas-pagamento">
      <Selo titulo="Cartão de crédito" legenda="Crédito">
        <rect x="1" y="7" width="46" height="6" fill="#38bdf8" />
        <rect x="6" y="20" width="16" height="4" rx="1" fill="#6b7789" />
      </Selo>
      <Selo titulo="Cartão de débito" legenda="Débito">
        <circle cx="20" cy="16" r="7" fill="#38bdf8" opacity="0.9" />
        <circle cx="28" cy="16" r="7" fill="#6366f1" opacity="0.9" />
      </Selo>
      <Selo titulo="Pix" legenda="Pix">
        <path d="M24 9 l7 7 -7 7 -7 -7 z" fill="#34d399" />
      </Selo>
      <Selo titulo="Boleto bancário" legenda="Boleto">
        <g fill="#e8edf4">
          {BARRAS_BOLETO.map(([x, w]) => (
            <rect key={x} x={x} y="8" width={w} height="16" />
          ))}
        </g>
      </Selo>
    </div>
  );
}
