# 🟩 TechServices Portal — Backend Node.js

Segundo backend da AV2 (atividade complementar): uma API REST em **Node.js + Express** que espelha **exatamente** o backend Java/Spring Boot da pasta [`/backend`](../backend/). Ela usa as mesmas rotas, os mesmos formatos de JSON, as mesmas regras de validação e **o mesmo banco PostgreSQL**.

O frontend React troca de backend mudando só a URL base, sem nenhuma alteração de código.

| Backend | Tecnologia | Porta padrão |
| :--- | :--- | :--- |
| `/backend` | Java 17 + Spring Boot 3 + JPA | `8080` |
| `/backend-node` | Node.js 20+ + Express 5 + `pg` | `3000` |

---

## ⚙️ Tecnologias

| Pacote | Uso |
| :--- | :--- |
| `express` | Servidor HTTP e rotas |
| `cors` | Libera o frontend React (equivalente ao `CorsConfig.java`) |
| `pg` | Driver PostgreSQL, com pool de conexões e transações (`BEGIN`/`COMMIT`/`ROLLBACK`) |
| `bcryptjs` | Hash de senhas compatível com o `BCryptPasswordEncoder` do Spring |
| `dotenv` | Carrega as variáveis do arquivo `.env` |

> **Por que `bcryptjs` e não `bcrypt`?** As duas bibliotecas geram e leem o mesmo formato de hash (`$2a$`, custo 10). Por isso, um cliente cadastrado pelo Java faz login pelo Node e vice-versa. A diferença é que `bcryptjs` é JavaScript puro e instala em qualquer máquina, sem depender de compilação nativa (node-gyp / Visual Studio Build Tools no Windows).

---

## 🚀 Como rodar

### 1. Pré-requisitos

- **Node.js 20 ou superior**
- **PostgreSQL** com o banco `techservices`, o mesmo usado pelo Spring Boot. Se ainda não tiver, suba o container do projeto:

```bash
cd backend
docker compose up -d
```

### 2. Instalar as dependências

```bash
cd backend-node
npm install
```

### 3. Configurar as variáveis de ambiente

Copie o modelo e ajuste se necessário:

```bash
cp .env.example .env        # Windows (PowerShell): Copy-Item .env.example .env
```

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `PORT` | `3000` | Porta HTTP; fica separada dos `8080` do Spring Boot |
| `DB_HOST` | `localhost` | Host do PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_NAME` | `techservices` | Nome do banco (o mesmo do Java) |
| `DB_USER` | `postgres` | Usuário |
| `DB_PASSWORD` | `postgres` | Senha |
| `DB_URL` | — | *Opcional.* Substitui as variáveis acima. Aceita `postgres://usuario:senha@host:porta/banco` ou a mesma URL JDBC do Spring (`jdbc:postgresql://localhost:5432/techservices`) |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Origens liberadas no CORS |
| `SEED_ENABLED` | `true` | Insere o catálogo inicial de serviços se a tabela estiver vazia |

Os padrões são os mesmos do `application.properties` do Java. Por isso, sem nenhum `.env`, os dois backends já apontam para o mesmo banco.

### 4. Iniciar

```bash
npm start        # produção
npm run dev      # desenvolvimento: reinicia sozinho ao salvar (node --watch)
```

Saída esperada:

```text
TechServices API (Node.js) ouvindo em http://localhost:3000
```

### 5. Apontar o frontend para o backend Node

Em `frontend/.env.local`:

```bash
VITE_API_URL=http://localhost:3000
```

Reinicie o `npm run dev` do frontend. Para voltar ao Spring Boot, use `VITE_API_URL=http://localhost:8080` ou apague a linha.

---

## 🔌 Endpoints

São idênticos aos do backend Java:

| Método | Rota | Sucesso | Erros |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `200` → `true` / `false` | `400` campos em branco |
| `PUT` | `/api/auth/password` | `200` → `{ "mensagem": "Senha alterada com sucesso." }` | `401` login/senha atual inválidos · `400` senha fraca ou igual à atual |
| `POST` | `/api/clientes` | `201` → `{ id, nome, login }` | `409` login já existe · `400` validação |
| `POST` | `/api/servicos` | `201` → `{ id, nome, descricao, preco, prazoDias }` (id autoincremento) | `400` validação |
| `GET` | `/api/servicos` | `200` → lista ordenada por nome | — |
| `GET` | `/api/solicitacoes/{login}` | `200` → lista em ordem cronológica | `404` cliente inexistente |
| `PUT` | `/api/solicitacoes/{login}` | `200` → nova lista gravada | `400` serviço inexistente/item inválido · `404` cliente inexistente |
| `GET` | `/api/clientes/{login}` | `200` → `{ id, nome, login }` *(auxiliar, usado pelo painel)* | `404` |

O `PUT /api/solicitacoes/{login}` roda em **uma única transação**: remove as solicitações antigas do cliente e insere as novas. Se qualquer item falhar (por exemplo, um `servicoId` inexistente), é feito `ROLLBACK` e a lista anterior continua intacta.

Os erros seguem o mesmo contrato do `GlobalExceptionHandler` do Java:

```json
{
  "timestamp": "2026-11-16T17:59:06.128Z",
  "status": 409,
  "erro": "Conflict",
  "mensagem": "Já existe um cliente cadastrado com o login maria@exemplo.com.",
  "campos": null
}
```

---

## 🗄️ Compatibilidade com o banco do Java

- Na inicialização, o backend executa `CREATE TABLE IF NOT EXISTS` com **o mesmo esquema que o Hibernate gera** para as entidades `Cliente`, `ServicoTI` e `SolicitacaoServicoTI`: mesmas tabelas, colunas, tipos e chaves `IDENTITY`. Não importa qual backend sobe primeiro, o outro reaproveita as tabelas.
- Logins são comparados sem diferenciar maiúsculas e gravados em minúsculas, como no Java.
- Datas trafegam como `AAAA-MM-DD`, ids e preços como números.
- **Única diferença visível:** o Java serializa `BigDecimal` com as casas decimais (`1200.00`) e o Node como número JavaScript (`1200`). Em JSON os dois valores são o mesmo número, e o frontend trata ambos da mesma forma.

---

## 🧪 Testes

Os testes de integração (`node:test`) espelham o `ApiIntegrationTest.java` e precisam de um PostgreSQL acessível:

```bash
DB_NAME=techservices_test npm test
# PowerShell: $env:DB_NAME="techservices_test"; npm test
```

> ⚠️ Os testes **esvaziam as tabelas** (`TRUNCATE`) do banco configurado. Use um banco separado (ex.: `techservices_test`), nunca o banco com dados reais.

---

## 📁 Estrutura

```bash
backend-node/
├── src/
│   ├── server.js                 # Ponto de entrada: cria o esquema, faz a carga inicial e sobe o servidor
│   ├── app.js                    # Express: CORS, JSON, rotas e tratamento de erros
│   ├── config.js                 # Variáveis de ambiente (.env)
│   ├── errors.js                 # ApiError + formato de erro do Spring
│   ├── validation.js             # Equivalentes das anotações Bean Validation
│   ├── db/
│   │   ├── pool.js               # Pool do pg e helper de transação
│   │   └── schema.js             # DDL compatível com o Hibernate + catálogo inicial
│   ├── routes/                   # auth, clientes, servicos, solicitacoes (≈ controllers)
│   └── services/                 # Regras de negócio (≈ services do Spring) + política de senha e BCrypt
├── test/api.test.js              # Testes de integração
├── .env.example
└── package.json
```
