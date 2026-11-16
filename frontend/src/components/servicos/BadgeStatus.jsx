const CLASSES = {
  "EM ANDAMENTO": "badge--andamento",
  "CONCLUÍDO": "badge--concluido"
};

export default function BadgeStatus({ status }) {
  return <span className={`badge ${CLASSES[status] || "badge--elaboracao"}`}>{status}</span>;
}
