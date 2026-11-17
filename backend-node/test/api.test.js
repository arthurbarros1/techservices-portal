// Testes de integração — espelham ApiIntegrationTest.java.
// Exigem um PostgreSQL acessível pelas variáveis do .env (de preferência um banco só para testes,
// pois as tabelas são esvaziadas). Rode com: npm test
import { after, before, test } from "node:test";
import assert from "node:assert/strict";

import { criarApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";
import { garantirEsquema } from "../src/db/schema.js";

let servidor;
let base;

async function chamar(metodo, caminho, corpo, headers = {}) {
  const resposta = await fetch(base + caminho, {
    method: metodo,
    headers: corpo !== undefined ? { "Content-Type": "application/json", ...headers } : headers,
    body: corpo !== undefined ? (typeof corpo === "string" ? corpo : JSON.stringify(corpo)) : undefined
  });
  const texto = await resposta.text();
  return { status: resposta.status, headers: resposta.headers, corpo: texto ? JSON.parse(texto) : null };
}

before(async () => {
  await garantirEsquema();
  await pool.query("TRUNCATE solicitacao_servico_ti, servico_ti, cliente RESTART IDENTITY CASCADE");
  servidor = criarApp().listen(0);
  base = `http://localhost:${servidor.address().port}`;
});

after(async () => {
  servidor.close();
  await pool.end();
});

test("fluxo completo dos endpoints", async () => {
  // Cadastro de cliente + login duplicado (case-insensitive)
  const cliente = { nome: "Maria da Silva", login: "maria@exemplo.com", senha: "Senha@1" };
  const criado = await chamar("POST", "/api/clientes", cliente);
  assert.equal(criado.status, 201);
  assert.deepEqual(Object.keys(criado.corpo).sort(), ["id", "login", "nome"]);
  assert.equal((await chamar("POST", "/api/clientes", { ...cliente, login: "MARIA@exemplo.com" })).status, 409);
  assert.equal((await chamar("POST", "/api/clientes", { ...cliente, login: "fraca@x.com", senha: "123" })).status, 400);

  // Login
  assert.equal((await chamar("POST", "/api/auth/login", { login: "maria@exemplo.com", senha: "Senha@1" })).corpo, true);
  assert.equal((await chamar("POST", "/api/auth/login", { login: "maria@exemplo.com", senha: "errada" })).corpo, false);
  assert.equal((await chamar("POST", "/api/auth/login", { login: "ninguem@x.com", senha: "x" })).corpo, false);

  // Troca de senha
  const troca = (senhaAtual, novaSenha) =>
    chamar("PUT", "/api/auth/password", { login: "maria@exemplo.com", senhaAtual, novaSenha });
  assert.equal((await troca("errada", "Nova#22")).status, 401);
  assert.equal((await troca("Senha@1", "Nova#22")).status, 200);
  assert.equal((await chamar("POST", "/api/auth/login", { login: "maria@exemplo.com", senha: "Nova#22" })).corpo, true);

  // Serviços
  const s1 = await chamar("POST", "/api/servicos", { nome: "Suporte", descricao: "Suporte técnico remoto", preco: 150.0, prazoDias: 2 });
  assert.equal(s1.status, 201);
  assert.equal(typeof s1.corpo.id, "number");
  const s2 = await chamar("POST", "/api/servicos", { nome: "Redes", descricao: "Instalação de redes", preco: 800.5, prazoDias: 5 });
  assert.equal(s2.corpo.id, s1.corpo.id + 1); // autoincremento
  const invalido = await chamar("POST", "/api/servicos", { nome: "", descricao: "x", preco: 0, prazoDias: 0 });
  assert.equal(invalido.status, 400);
  assert.deepEqual(Object.keys(invalido.corpo.campos).sort(), ["descricao", "nome", "prazoDias", "preco"]);

  const lista = await chamar("GET", "/api/servicos");
  assert.equal(lista.corpo.length, 2);
  assert.deepEqual(lista.corpo.map((s) => s.nome), ["Redes", "Suporte"]); // ordenado por nome
  const id1 = s1.corpo.id;

  // Solicitações: grava, consulta, substitui, rollback e esvazia
  const login = "/api/solicitacoes/maria%40exemplo.com";
  const gravadas = await chamar("PUT", login, [
    { servicoId: id1, dataPedido: "2026-11-01" },
    { servicoId: id1, status: "EM ANDAMENTO" }
  ]);
  assert.equal(gravadas.status, 200);
  assert.equal(gravadas.corpo.length, 2);
  assert.equal(gravadas.corpo[0].status, "EM ELABORAÇÃO");
  assert.equal(gravadas.corpo[0].numero, "2026-0001");
  assert.equal(gravadas.corpo[0].dataPrevista, "2026-11-03");
  assert.equal(gravadas.corpo[0].precoCobrado, 150);
  assert.equal(gravadas.corpo[0].servicoNome, "Suporte");

  assert.equal((await chamar("GET", login)).corpo.length, 2);
  assert.equal((await chamar("PUT", login, [{ servicoId: id1 }])).corpo.length, 1);

  assert.equal((await chamar("PUT", login, [{ servicoId: 999999 }])).status, 400);
  assert.equal((await chamar("GET", login)).corpo.length, 1); // lista anterior preservada (rollback)

  assert.equal((await chamar("PUT", login, [])).corpo.length, 0);
  assert.equal((await chamar("GET", "/api/solicitacoes/ninguem@exemplo.com")).status, 404);
});

test("erros de corpo seguem o formato do Spring", async () => {
  const r = await chamar("POST", "/api/auth/login", "{json quebrado");
  assert.equal(r.status, 400);
  assert.deepEqual(Object.keys(r.corpo).sort(), ["campos", "erro", "mensagem", "status", "timestamp"]);
  assert.equal((await chamar("PUT", "/api/solicitacoes/x@x.com", { nao: "lista" })).status, 400);
});

test("CORS permite o frontend React", async () => {
  const r = await fetch(`${base}/api/servicos`, {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:5173", "Access-Control-Request-Method": "PUT" }
  });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("access-control-allow-origin"), "http://localhost:5173");
});
