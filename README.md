# 💻 TechServices Portal

> Solução web institucional e transacional desenvolvida em HTML5 semântico, CSS3 e JavaScript Vanilla para a gestão e contratação de serviços corporativos de Tecnologia da Informação.

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://arthurbarros1.github.io/techservices-portal/)
[![HTML5](https://img.shields.io/badge/HTML5-Semântico-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Moderno-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
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

## 📂 Estrutura de Diretórios

## 📁 Estrutura do Projeto

```bash
techservices-portal/
├── assets/
│   ├── css/
│   │   ├── auth.css              # Estilos dos formulários (login, cadastro, troca de senha)
│   │   ├── global.css            # Variáveis CSS, reset, header e footer padronizados
│   │   ├── home.css              # Estilização exclusiva da página principal (vitrine, grid, overflow)
│   │   └── services.css          # Layout do dashboard e tabela de ordens de serviço
│   ├── img/                      # Imagens locais, logotipos e fotos da galeria institucional
│   └── js/
│       ├── auth-validators.js    # Lógica de validações (CPF, maioridade, regex de senha, nome)
│       └── services.js           # Reatividade do catálogo, cálculo de prazos e manipulação da tabela
├── .gitignore                    # Arquivos e pastas desconsiderados pelo controle de versão
├── cadastro.html                 # Página de formulário de cadastro de novos clientes
├── index.html                    # Página institucional de apresentação (Home)
├── LICENSE                       # Licença de uso do projeto (MIT)
├── login.html                    # Página de autenticação / login de clientes
├── README.md                     # Documentação técnica e instruções do projeto
├── servicos.html                 # Painel do cliente / solicitação de serviços de TI
└── troca-senha.html              # Página de recuperação e troca de credenciais de acesso

---

## 💻 Como Rodar o Projeto Localmente

1. Clone o repositório em sua máquina:
   
   git clone https://github.com/Arthurbarros1/techservices-portal.git
   ```
   
2. Acesse a pasta do projeto:
   '''
   cd techservices-portal
   ```

3. Abra o arquivo `index.html` diretamente em seu navegador web preferido:
   * **Dica:** Se estiver utilizando o **Visual Studio Code**, clique com o botão direito sobre o `index.html` e selecione **"Open with Live Server"**.

---

## 👨‍💻 Autor

Desenvolvido por **Arthur Barros**:

* **GitHub:** [@Arthurbarros1](https://github.com/Arthurbarros1)
* **LinkedIn:** [Perfil do LinkedIn](www.linkedin.com/in/arthur-meirinho)

---

## 📄 Licença

Este projeto é distribuído sob os termos da licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.