import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Navega para `destino` após `atraso` ms quando `ativo` for verdadeiro (com limpeza do timer). */
export default function useRedirecionarApos(ativo, destino, atraso = 1200) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!ativo) return undefined;
    const timer = setTimeout(() => navigate(destino), atraso);
    return () => clearTimeout(timer);
  }, [ativo, destino, atraso, navigate]);
}
