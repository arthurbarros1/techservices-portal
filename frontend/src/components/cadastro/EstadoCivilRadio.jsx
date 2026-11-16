const OPCOES = [
  ["solteiro", "Solteiro(a)"],
  ["casado", "Casado(a)"],
  ["divorciado", "Divorciado(a)"],
  ["viuvo", "Viúvo(a)"]
];

export default function EstadoCivilRadio({ valor, onChange }) {
  return (
    <fieldset className="grupo-radio">
      <legend>Estado civil</legend>
      <div className="opcoes-radio">
        {OPCOES.map(([codigo, rotulo]) => (
          <label key={codigo} className="opcao-radio">
            <input type="radio" name="estadoCivil" value={codigo}
                   checked={valor === codigo} onChange={() => onChange(codigo)} /> {rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
