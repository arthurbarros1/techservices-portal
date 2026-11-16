import { createContext, useContext, useEffect, useState } from "react";

const CHAVE = "ts_login";
const SessaoContext = createContext(null);

function lerLoginSalvo() {
  try {
    return sessionStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

/** Mantém o login do cliente autenticado (persistido na sessão do navegador). */
export function SessaoProvider({ children }) {
  const [login, setLogin] = useState(lerLoginSalvo);

  useEffect(() => {
    try {
      if (login) sessionStorage.setItem(CHAVE, login);
      else sessionStorage.removeItem(CHAVE);
    } catch {
      /* armazenamento indisponível: a sessão vale só enquanto a aba estiver aberta */
    }
  }, [login]);

  const valor = {
    login,
    logado: Boolean(login),
    entrar: (novoLogin) => setLogin(novoLogin.trim().toLowerCase()),
    sair: () => setLogin(null)
  };

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  return useContext(SessaoContext);
}
