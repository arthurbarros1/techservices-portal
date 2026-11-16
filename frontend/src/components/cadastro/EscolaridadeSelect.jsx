const OPCOES = [
  ["1g-incompleto", "1º grau incompleto"],
  ["1g-completo", "1º grau completo"],
  ["2g-completo", "2º grau completo"],
  ["superior", "Nível superior"],
  ["pos", "Pós-graduado"]
];

export default function EscolaridadeSelect({ valor, onChange }) {
  return (
    <div className="campo">
      <label htmlFor="escolaridade">Escolaridade</label>
      <select id="escolaridade" name="escolaridade" value={valor} onChange={(e) => onChange(e.target.value)}>
        {OPCOES.map(([codigo, rotulo]) => (
          <option key={codigo} value={codigo}>{rotulo}</option>
        ))}
      </select>
    </div>
  );
}
