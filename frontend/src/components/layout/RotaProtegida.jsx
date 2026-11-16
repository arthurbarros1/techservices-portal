import { Navigate, useLocation } from "react-router-dom";
import { useSessao } from "../../context/SessaoContext.jsx";

/** Redireciona para o login quando não há cliente autenticado. */
export default function RotaProtegida({ children }) {
  const { logado } = useSessao();
  const location = useLocation();

  if (!logado) {
    return <Navigate to="/login" replace state={{ destino: location.pathname }} />;
  }
  return children;
}
