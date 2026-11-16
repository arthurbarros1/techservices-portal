// Datas trafegam com o backend no formato ISO local (AAAA-MM-DD).

const pad = (n) => String(n).padStart(2, "0");

function paraISO(data) {
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

export function hojeISO() {
  return paraISO(new Date());
}

export function somarDiasISO(iso, dias) {
  const [a, m, d] = iso.split("-").map(Number);
  return paraISO(new Date(a, m - 1, d + dias));
}

export function formatarDataBR(iso) {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarPrazo(dias) {
  return `${dias} ${dias === 1 ? "dia" : "dias"}`;
}
