import "dotenv/config";

/**
 * Converte a DB_URL no formato JDBC do Spring (jdbc:postgresql://host:porta/banco)
 * em URL do driver `pg`, para que os dois backends possam compartilhar a mesma variável.
 */
function urlDoBanco() {
  const url = process.env.DATABASE_URL || process.env.DB_URL;
  if (!url) return null;
  if (!url.startsWith("jdbc:")) return url;

  const semPrefixo = url.slice("jdbc:".length).replace(/^postgresql:/, "postgres:");
  const destino = new URL(semPrefixo);
  destino.username = encodeURIComponent(process.env.DB_USER || "postgres");
  destino.password = encodeURIComponent(process.env.DB_PASSWORD || "postgres");
  return destino.toString();
}

const lista = (valor) => valor.split(",").map((s) => s.trim()).filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 3000),
  db: urlDoBanco()
    ? { connectionString: urlDoBanco() }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || "techservices",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres"
      },
  corsOrigins: lista(process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173"),
  seedEnabled: (process.env.SEED_ENABLED || "true").toLowerCase() === "true"
};
