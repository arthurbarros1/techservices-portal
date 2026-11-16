import Revelar from "../ui/Revelar.jsx";

const FUNDADORES = [
  ["CEO & Fundador", "Ana Carolina Ferreira", "Bacharel em Sistemas de Informação, com mais de 20 anos de experiência em gestão de projetos de TI e liderança de equipes técnicas."],
  ["CTO (Diretor de Tecnologia)", "Rafael Souza Lima", "Engenheiro de Software e especialista em arquitetura de nuvem, responsável pela estratégia técnica e pelo time de desenvolvimento."],
  ["COO (Diretor de Operações)", "Mariana Alves Costa", "Administradora com pós-graduação em Governança de TI, atua na gestão de processos, atendimento e relacionamento com clientes."]
];

export default function Fundadores() {
  return (
    <Revelar className="secao">
      <h2 className="titulo-secao">Nossos fundadores</h2>
      <table className="layout-fundadores">
        <tbody>
          <tr>
            <td className="coluna-tabela">
              <table className="tabela-fundadores">
                <caption>Equipe fundadora da TechServices (desde 2010).</caption>
                <thead>
                  <tr>
                    <th scope="col">Cargo</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Breve currículo</th>
                  </tr>
                </thead>
                <tbody>
                  {FUNDADORES.map(([cargo, nome, curriculo]) => (
                    <tr key={nome}>
                      <td className="cargo" data-rotulo="Cargo">{cargo}</td>
                      <td data-rotulo="Nome">{nome}</td>
                      <td data-rotulo="Currículo">{curriculo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td className="coluna-destaque">
              <div className="box-institucional">
                <h3>Compromisso TechServices</h3>
                <p>
                  Equipe fundadora atuante, com décadas de experiência somadas em tecnologia, gestão e atendimento —
                  à frente de cada projeto entregue aos nossos clientes.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Revelar>
  );
}
