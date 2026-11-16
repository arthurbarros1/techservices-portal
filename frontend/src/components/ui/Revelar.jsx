import { useEffect, useRef, useState } from "react";

/**
 * Efeito "scroll reveal" da AV1: aplica a classe `visivel` quando o elemento
 * entra na viewport. O nó é obtido por ref (sem consultas ao DOM).
 */
export default function Revelar({ as: Tag = "section", className = "", children, ...resto }) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo || !("IntersectionObserver" in window)) {
      setVisivel(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(alvo);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${className} revelar${visivel ? " visivel" : ""}`.trim()} {...resto}>
      {children}
    </Tag>
  );
}
