import express from "express";
import cors from "cors";

import { config } from "./config.js";
import { rotaNaoEncontrada, tratadorDeErros } from "./errors.js";
import { authRouter } from "./routes/auth.js";
import { clientesRouter } from "./routes/clientes.js";
import { servicosRouter } from "./routes/servicos.js";
import { solicitacoesRouter } from "./routes/solicitacoes.js";

/** Monta a aplicação Express (separada do listen para facilitar os testes). */
export function criarApp() {
  const app = express();

  // CORS equivalente ao CorsConfig.java
  app.use("/api", cors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 3600,
    optionsSuccessStatus: 200 // mesmo status do preflight no Spring
  }));

  app.use(express.json({ limit: "1mb" }));

  app.use("/api/auth", authRouter);
  app.use("/api/clientes", clientesRouter);
  app.use("/api/servicos", servicosRouter);
  app.use("/api/solicitacoes", solicitacoesRouter);

  app.use(rotaNaoEncontrada);
  app.use(tratadorDeErros);
  return app;
}
