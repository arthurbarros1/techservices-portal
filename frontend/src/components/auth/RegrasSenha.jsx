import { CARACTERES_PERMITIDOS, CARACTERES_PROIBIDOS, validarSenhaForte } from "../../utils/validators.js";

const REGRAS = [
  ["tamanho", "Mínimo de 6 caracteres"],
  ["numero", "Pelo menos um número (0–9)"],
  ["maiuscula", "Pelo menos uma letra maiúscula (A–Z)"],
  ["permitido", "Pelo menos um caractere especial permitido"],
  ["semProibido", "Sem caracteres proibidos"]
];

function Chips({ caracteres, classe }) {
  return (
    <div className="chips-caracteres">
      {caracteres.map((c) => (
        <span key={c} className={`chip ${classe}`}>{c}</span>
      ))}
    </div>
  );
}

/** Lista de regras que se marcam em tempo real conforme a senha digitada. */
export default function RegrasSenha({ titulo = "Regras da senha", senha }) {
  const { criterios } = validarSenhaForte(senha);

  return (
    <section className="regras-senha" aria-label="Regras de composição de senha">
      <h2>{titulo}</h2>
      <ul className="lista-regras">
        {REGRAS.map(([chave, texto]) => (
          <li key={chave} className={criterios[chave] ? "atendido" : undefined}>{texto}</li>
        ))}
      </ul>
      <div className="caracteres-senha">
        <div className="bloco-caracteres bloco-permitidos">
          <h3>Permitidos</h3>
          <Chips caracteres={CARACTERES_PERMITIDOS} classe="chip--ok" />
        </div>
        <div className="bloco-caracteres bloco-proibidos">
          <h3>Proibidos</h3>
          <Chips caracteres={CARACTERES_PROIBIDOS} classe="chip--proibido" />
        </div>
      </div>
    </section>
  );
}
