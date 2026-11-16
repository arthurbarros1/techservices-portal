/**
 * Wrapper de campo de formulário (label + controle + mensagem).
 * O estado visual vem por props: `erro` (texto) ou `ok` (boolean).
 */
export default function Campo({ id, label, obrigatorio = false, ajuda, erro, ok = false, children }) {
  const classes = ["campo"];
  if (erro) classes.push("campo--erro");
  else if (ok) classes.push("campo--ok");

  return (
    <div className={classes.join(" ")}>
      <label htmlFor={id}>
        {label}
        {obrigatorio && <span className="obrigatorio" aria-hidden="true"> *</span>}
      </label>
      {children}
      {ajuda && <span className="ajuda">{ajuda}</span>}
      <span className="mensagem-campo" id={`msg-${id}`}>{erro || ""}</span>
    </div>
  );
}
