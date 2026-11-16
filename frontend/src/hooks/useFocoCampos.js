import { useRef } from "react";

/**
 * Guarda as refs dos campos de um formulário para mover o foco sem consultar o DOM.
 *   const { registrar, focar, focarPrimeiroErro } = useFocoCampos();
 *   <input ref={registrar("email")} />
 */
export default function useFocoCampos() {
  const refs = useRef({});

  const registrar = (nome) => (elemento) => {
    if (elemento) refs.current[nome] = elemento;
    else delete refs.current[nome];
  };

  const focar = (nome) => refs.current[nome]?.focus();

  /** Foca o primeiro campo (na ordem informada) que possui mensagem de erro. */
  const focarPrimeiroErro = (erros, ordem) => {
    const primeiro = ordem.find((nome) => erros[nome]);
    if (primeiro) focar(primeiro);
  };

  return { registrar, focar, focarPrimeiroErro };
}
