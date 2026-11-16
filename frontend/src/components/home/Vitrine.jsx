import { Fragment } from "react";
import Revelar from "../ui/Revelar.jsx";

const CARDS = [
  ["Suporte técnico", "Atendimento remoto e presencial para estações de trabalho, servidores e periféricos, com SLA definido em contrato."],
  ["Infraestrutura e redes", "Projeto, implantação e gestão de redes cabeadas e sem fio, firewalls e conectividade de alta disponibilidade."],
  ["Desenvolvimento de sistemas", "Criação de aplicações web e corporativas sob medida, do levantamento de requisitos à manutenção evolutiva."],
  ["Segurança da informação", "Políticas de proteção de dados, backup, antivírus corporativo e adequação às boas práticas de conformidade."],
  ["Soluções em nuvem", "Migração, hospedagem e gerenciamento de ambientes em nuvem, reduzindo custos de infraestrutura física."],
  ["Consultoria em TI", "Diagnóstico, planejamento estratégico e governança de tecnologia alinhados aos objetivos do seu negócio."]
];

const DETALHES = [
  ["Suporte técnico especializado", "Nossa central de atendimento opera com equipe própria de analistas certificados, responsável pelo diagnóstico e resolução de incidentes em estações de trabalho, notebooks, impressoras e servidores. O atendimento remoto utiliza ferramentas de acesso seguro e é registrado em sistema de chamados, garantindo rastreabilidade."],
  ["Infraestrutura e redes corporativas", "Realizamos o projeto completo de cabeamento estruturado, configuração de switches gerenciáveis, roteadores e pontos de acesso sem fio, além da implantação de firewalls e redes virtuais privadas (VPN) para interligação segura entre filiais e colaboradores remotos."],
  ["Desenvolvimento de sistemas sob medida", "Desenvolvemos aplicações web responsivas e sistemas corporativos integrados, seguindo metodologias ágeis, com levantamento de requisitos, prototipação, codificação, testes, homologação e manutenção evolutiva contínua."],
  ["Segurança da informação e proteção de dados", "Implantamos políticas de backup periódico, rotinas de recuperação de desastres, soluções de antivírus corporativo e controles de acesso, apoiando a adequação dos processos às boas práticas de proteção de dados pessoais."],
  ["Soluções em nuvem e continuidade do negócio", "Planejamos e executamos a migração de ambientes locais para a nuvem, dimensionando recursos conforme a demanda, reduzindo custos com equipamentos físicos e aumentando a disponibilidade dos sistemas."]
];

export function VitrineServicos() {
  return (
    <Revelar className="secao">
      <h2 className="titulo-secao">Serviços de TI oferecidos</h2>
      <div className="vitrine-servicos">
        {CARDS.map(([titulo, texto]) => (
          <Revelar key={titulo} as="article" className="card-servico">
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </Revelar>
        ))}
      </div>
    </Revelar>
  );
}

export function DetalhamentoTecnico() {
  return (
    <Revelar className="secao">
      <h2 className="titulo-secao">Detalhamento técnico dos serviços</h2>
      <div className="painel-rolagem" tabIndex={0} aria-label="Detalhamento técnico com rolagem">
        {DETALHES.map(([titulo, texto]) => (
          <Fragment key={titulo}>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </Fragment>
        ))}
      </div>
    </Revelar>
  );
}
