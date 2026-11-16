import Revelar from "../ui/Revelar.jsx";

export function Historia() {
  return (
    <Revelar className="destaque-inicial">
      <p className="slogan-topo" style={{ fontStyle: "italic" }}>Tecnologia que impulsiona o seu negócio</p>
      <h2 className="titulo-secao">Nossa história</h2>
      <p>
        A TechServices nasceu em 2010 com uma missão clara: aproximar a tecnologia das pessoas e tornar a
        infraestrutura de TI um aliado do crescimento. Começamos como uma pequena equipe de suporte técnico e,
        ao longo dos anos, expandimos nossa atuação para desenvolvimento de sistemas, segurança da informação e
        consultoria estratégica, atendendo hoje centenas de clientes em todo o país.
      </p>
    </Revelar>
  );
}

export function VideoInstitucional() {
  return (
    <Revelar className="secao">
      <h2 className="titulo-secao">Vídeo institucional</h2>
      <div className="moldura-video">
        <iframe
          src="https://www.youtube.com/embed/ibrwJrL5aME"
          title="Vídeo institucional da TechServices"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Revelar>
  );
}

const FOTOS = [
  ["/img/recepcao.webp", "Corredor e recepção da sede da TechServices", "Recepção da nossa sede"],
  ["/img/servidores.webp", "Rack de servidores monitorados 24 horas", "Central de monitoramento 24/7"],
  ["/img/devs.webp", "Analistas de infraestrutura trabalhando em conjunto", "Nossos analistas de infraestrutura"],
  ["/img/equipe.webp", "Equipe de desenvolvimento da TechServices", "Equipe de desenvolvimento"]
];

export function Galeria() {
  return (
    <Revelar className="secao">
      <h2 className="titulo-secao">Nossas instalações e equipe</h2>
      <div className="galeria">
        {FOTOS.map(([src, alt, legenda]) => (
          <figure key={src}>
            <img src={src} alt={alt} />
            <figcaption>{legenda}</figcaption>
          </figure>
        ))}
      </div>
    </Revelar>
  );
}
