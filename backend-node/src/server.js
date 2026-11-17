import { criarApp } from "./app.js";
import { config } from "./config.js";
import { pool } from "./db/pool.js";
import { cargaInicialServicos, garantirEsquema } from "./db/schema.js";

async function iniciar() {
  await garantirEsquema();

  if (config.seedEnabled) {
    const inseridos = await cargaInicialServicos();
    if (inseridos > 0) console.log(`Catálogo inicial com ${inseridos} serviços de TI cadastrado.`);
  }

  const servidor = criarApp().listen(config.port, () => {
    console.log(`TechServices API (Node.js) ouvindo em http://localhost:${config.port}`);
  });

  const encerrar = () => servidor.close(() => pool.end().then(() => process.exit(0)));
  process.on("SIGINT", encerrar);
  process.on("SIGTERM", encerrar);
}

iniciar().catch((erro) => {
  console.error("Falha ao iniciar o backend Node.js:", erro.message);
  process.exit(1);
});
