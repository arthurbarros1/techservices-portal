# 💻 TechServices Portal

> Solução web institucional e transacional desenvolvida em HTML5 semântico, CSS3 e JavaScript Vanilla para a gestão e contratação de serviços corporativos de Tecnologia da Informação.

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://arthurbarros1.github.io/techservices-portal/)
[![HTML5](https://img.shields.io/badge/HTML5-Semântico-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Moderno-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-JPA-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Licença](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)](#)

---

## 📌 Visão Geral do Projeto

O **TechServices Portal** é uma plataforma web completa construída com tecnologias web nativas (sem dependências de frameworks externos). O sistema simula o ecossistema digital de uma empresa de serviços de TI, abrangendo desde a presença institucional e comunicação com clientes até fluxos completos de autenticação, validações avançadas de dados cadastrais no front-end e um painel reativo para gerenciamento e contratação de ordens de serviço.

Este projeto foi concebido para atender rigorosamente aos requisitos técnicos da avaliação acadêmica (AV1) e, concomitantemente, compor meu portfólio profissional demonstrando domínio dos fundamentos da web: **estruturação semântica, cascata e especificidade de estilos, manipulação de DOM e validações algorítmicas**.

---

## 🚀 Demonstração Online

Acesse o sistema em execução diretamente pelo navegador:

👉 **[https://arthurbarros1.github.io/techservices-portal/](https://arthurbarros1.github.io/techservices-portal/)**

---

## 🖥️ Arquitetura das Páginas e Funcionalidades

O portal é composto por **5 páginas interligadas**, mantendo coerência visual, tipográfica e de paleta de cores em toda a experiência:

### 1. Página Institucional (`index.html`)
* **Header:** Identidade visual, logotipo da empresa, slogan e menu de navegação direcionando para Login, Cadastro e Painel de Serviços (com link condicional).
* **Apresentação e Mídia:** Seção de história da empresa e vídeo institucional incorporado via *streaming* do YouTube.
* **Galeria de Fotos:** Grade responsiva com instalações físicas e equipe técnica da empresa.
* **Vitrine de Serviços:** Apresentação estática e visual das soluções de TI oferecidas.
* **Corpo Diretivo:** Tabela estruturada contendo cargos, nomes e mini currículos dos fundadores.
* **Container de Rolagem Automática:** Área técnica demonstrando o uso de `overflow: auto` para conteúdos longos sem quebrar o grid principal.
* **Footer:** Canais de atendimento (telefone fixo, WhatsApp corporativo e link direto `mailto`), endereço físico e mostruário das formas de pagamento aceitas (Pix, cartões de crédito e boleto).

### 2. Autenticação de Clientes (`login.html`)
* Identificação clara da página e logotipo corporativo.
* Formulário com validação de formato de e-mail e campo de senha obrigatório.
* Botão de submissão com validações via JavaScript puro e feedback ao usuário.
* Botão **Limpar** com reset automático e aplicação imediata de foco (`focus()`) no campo de login.
* Rotas de navegação direta para cadastro e recuperação/troca de senha.

### 3. Redefinição de Credenciais (`troca-senha.html`)
* Painel de instruções visuais explícitas detalhando a regra de composição e requisitos de segurança.
* **Regras de Complexidade:**
  * Mínimo de 6 caracteres.
  * Pelo menos 1 caractere numérico (0-9).
  * Pelo menos 1 letra maiúscula (A-Z).
  * Pelo menos 1 caractere especial permitido: `@`, `#`, `$`, `%`, `&`, `!`, `?`, `/`, `+`, `=`, `.`.
  * **Bloqueio explícito** de caracteres não permitidos: `}`, `^`, `;`, `<`, `>`.
* Validação de confirmação de senha, feedback por notificação em tela e redirecionamento de histórico (`window.history.back()`).

### 4. Cadastro de Novos Clientes (`cadastro.html`)
* Coleta completa de dados cadastrais: nome completo, e-mail/login, senhas com confirmação, CPF, data de nascimento, telefone/WhatsApp, estado civil e grau de escolaridade.
* **Validações Rigorosas:**
  * **Nome Próprio:** Mínimo de duas palavras, primeira palavra com pelo menos 2 caracteres e proibição de caracteres especiais.
  * **CPF:** Aplicação de máscara em tempo real (`NNN.NNN.NNN-NN`), restrição exclusiva a dígitos numéricos e validação matemática real dos dois dígitos verificadores (módulo 11).
  * **Maioridade:** Cálculo dinâmico comparando a data de nascimento informada com a data atual (mínimo de 18 anos completos).
  * **Telefone/WhatsApp:** Validação de formato nacional (campo opcional, mas com validação estrita se preenchido).
  * **Valores Padrão:** Radio button pré-selecionado em `Solteiro(a)` e select box em `2º grau completo`.

### 5. Painel de Serviços e Ordens de Serviço (`servicos.html`)
* Painel centralizado em página única com layout modular em seções:
* **Identificação:** Resumo do perfil do cliente conectado (labels fixos de identificação).
* **Novo Pedido (Reatividade em JS puro):**
  * Seleção dinâmica de serviços em combo box.
  * Atualização imediata do preço e prazo de execução correspondente.
  * Cálculo dinâmico da data prevista de atendimento somando o prazo em dias à data corrente.
  * Status inicial padronizado como `EM ELABORAÇÃO`.
* **Tabela de Ordens de Serviço:**
  * Histórico de solicitações com ordenação cronológica crescente.
  * Funcionalidade completa de inclusão em tempo real de novas ordens na tabela.
  * Remoção dinâmica de registros individuais via botão **Excluir** vinculado à respectiva linha da tabela.

---

## 🛠️ Tecnologias e Conceitos Aplicados

| Tecnologia | Finalidade e Conceitos Demonstrados |
| :--- | :--- |
| **HTML5 Semântico** | Uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`, formulários acessíveis e tabelas estruturadas; ausência de tags obsoletas. |
| **CSS3 Avançado** | Arquitetura modular, variáveis CSS (`:root`), Flexbox e CSS Grid para alinhamento e diagramação, controle de rolagem (`overflow: auto`) e tipografia hierárquica. |
| **Cascata e Especificidade** | Demonstração prática dos níveis de estilo: CSS externo (`assets/css/`), estilos na tag `<style>` e sobrescrita controlada via atributo `style="..."` *inline*. |
| **JavaScript Vanilla** | Manipulação direta do DOM, eventos de formulário, regex de validação, cálculos temporais com `Date()`, algoritmo do dígito verificador de CPF e operações dinâmicas em tabelas. |

---

## 🚀 AV2 — Evolução Full Stack (Spring Boot + React)

Na AV2 o portal passou a ter persistência real: o frontend foi reescrito em **React (Vite)** com Hooks e consome uma **API REST em Spring Boot** com banco **PostgreSQL**. O site estático da AV1 foi preservado em [`av1/`](av1/).

### Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Recebe `{login, senha}` e retorna `true`/`false`. |
| `PUT` | `/api/auth/password` | Recebe `{login, senhaAtual, novaSenha}`; valida a atual (401 se não conferir) e grava a nova. |
| `POST` | `/api/clientes` | Cadastra cliente (201); **409** se o login já existir. |
| `POST` | `/api/servicos` | Cadastra serviço de TI (id por autoincremento). |
| `GET` | `/api/servicos` | Lista todos os serviços de TI. |
| `GET` | `/api/solicitacoes/{login}` | Lista as solicitações do cliente. |
| `PUT` | `/api/solicitacoes/{login}` | Recebe a lista completa; remove as antigas do cliente e grava a nova (transação única). |
| `GET` | `/api/clientes/{login}` | *Auxiliar:* nome do cliente para o painel (sem senha). |

Erros seguem o formato `{ status, erro, mensagem, campos }`. Senhas são gravadas com **BCrypt** e as regras de composição da AV1 também são validadas no servidor.

### Páginas React

| Rota | Página | API consumida |
| :--- | :--- | :--- |
| `/` | Institucional (Home) | — |
| `/login` | Login | `POST /api/auth/login` |
| `/troca-senha` | Troca de senha | `PUT /api/auth/password` |
| `/cadastro` | Cadastro de cliente | `POST /api/clientes` |
| `/servicos` | Carrinho / solicitações (protegida) | `GET /api/servicos`, `GET` e `PUT /api/solicitacoes/{login}` |
| `/servicos/novo` | Cadastro de serviço de TI (protegida) | `POST` e `GET /api/servicos` |

Todo o estado é controlado por Hooks (`useState`, `useEffect`, `useContext`, `useRef` para foco); não há manipulação direta do DOM.

---

## 📁 Estrutura do Projeto

```bash
techservices-portal/
├── backend/                      # API REST — Java 17+, Spring Boot 3, Spring Data JPA, PostgreSQL
│   ├── src/main/java/br/com/techservices/
│   │   ├── config/               # CORS, BCrypt e carga inicial do catálogo
│   │   ├── controller/           # AuthController, ClienteController, ServicoTIController, SolicitacaoController
│   │   ├── dto/                  # Records de requisição/resposta com Bean Validation
│   │   ├── exception/            # ApiException + handler global de erros
│   │   ├── model/                # Entidades Cliente, ServicoTI, SolicitacaoServicoTI
│   │   ├── repository/           # Repositórios Spring Data
│   │   └── service/              # Regras de negócio
│   ├── src/test/                 # Testes de integração (MockMvc + H2)
│   ├── docker-compose.yml        # PostgreSQL local opcional
│   ├── mvnw / mvnw.cmd           # Maven Wrapper (não exige Maven instalado)
│   └── pom.xml
├── frontend/                     # SPA — React 18 + Vite + React Router
│   ├── public/img/               # Imagens da AV1
│   └── src/
│       ├── components/           # layout/, ui/, auth/, cadastro/, home/, servicos/
│       ├── context/              # Sessão do cliente logado
│       ├── hooks/                # Hooks reutilizáveis (foco de campos, redirecionamento)
│       ├── pages/                # Um componente principal por página
│       ├── services/api.js       # Cliente HTTP (fetch)
│       ├── styles/               # CSS da AV1 + complementos (app.css)
│       └── utils/                # Validadores e formatadores
├── av1/                          # Versão estática original (HTML/CSS/JS puro)
├── LICENSE
└── README.md
```

---

## 💻 Como Rodar o Projeto Localmente

**Pré-requisitos:** Java 17+, Node.js 18+ e PostgreSQL (local ou via Docker).

### 1. Banco de dados

Crie o banco `techservices` no seu PostgreSQL, ou suba um container:

```bash
cd backend
docker compose up -d
```

As credenciais padrão são `postgres` / `postgres` em `localhost:5432`. Para usar outras, defina as variáveis `DB_URL`, `DB_USER` e `DB_PASSWORD`. As tabelas são criadas automaticamente pelo JPA e o catálogo da AV1 é inserido na primeira execução.

### 2. Backend (porta 8080)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
./mvnw test                   # testes de integração (usam H2, não precisam do PostgreSQL)
```

### 3. Frontend (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Acesse <http://localhost:5173>. A URL da API pode ser alterada em `frontend/.env.local` (`VITE_API_URL`, ver `.env.example`). As origens liberadas no CORS ficam em `app.cors.allowed-origins` (variável `CORS_ORIGINS`).

### Versão AV1 (estática)

Abra `av1/index.html` no navegador (ou use o *Live Server* do VS Code).

---

## 👨‍💻 Autor

Desenvolvido por **Arthur Barros**:

* **GitHub:** [@Arthurbarros1](https://github.com/Arthurbarros1)
* **LinkedIn:** [arthur-meirinho](www.linkedin.com/in/arthur-meirinho)

---

## 📄 Licença

Este projeto é distribuído sob os termos da licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.