/** Alerta de sucesso/erro no padrão visual da AV1. Não renderiza nada sem mensagem. */
export default function Alerta({ tipo = "erro", children }) {
  if (!children) return null;
  const sucesso = tipo === "sucesso";
  return (
    <div className={`alerta alerta--${sucesso ? "sucesso" : "erro"}`} role={sucesso ? "status" : "alert"}>
      {children}
    </div>
  );
}
