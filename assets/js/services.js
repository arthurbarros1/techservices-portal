/* ==========================================================================
   services.js — Lógica da página de solicitação de serviços / carrinho
   Projeto: techservices-portal
   Página: servicos.html
   Responsável por: catálogo de serviços, labels reativos (preço, prazo,
   data prevista), inclusão/exclusão de pedidos e pré-carga de exemplos.
   ========================================================================== */

(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     1. Catálogo de serviços (preço fixo e prazo em dias)
     ----------------------------------------------------------------------- */
  var SERVICOS = {
    "manutencao-servidores": { nome: "Manutenção de Servidores", preco: 1200.00, prazo: 3 },
    "instalacao-redes":      { nome: "Instalação de Redes",       preco: 2500.00, prazo: 7 },
    "consultoria-cloud":     { nome: "Consultoria Cloud",          preco: 3800.00, prazo: 10 },
    "backup-corporativo":    { nome: "Backup Corporativo",         preco: 900.00,  prazo: 2 },
    "seguranca-informacao":  { nome: "Segurança da Informação",    preco: 4200.00, prazo: 14 }
  };

  var STATUS_INICIAL = "EM ELABORAÇÃO";

  /* -----------------------------------------------------------------------
     2. Utilitários de formatação
     ----------------------------------------------------------------------- */
  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function formatarData(data) {
    var dia = String(data.getDate()).padStart(2, "0");
    var mes = String(data.getMonth() + 1).padStart(2, "0");
    var ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
  }

  // Soma dias corridos a uma data e retorna nova data
  function somarDias(data, dias) {
    var nova = new Date(data.getTime());
    nova.setDate(nova.getDate() + dias);
    return nova;
  }

  /* -----------------------------------------------------------------------
     3. Referências de DOM
     ----------------------------------------------------------------------- */
  var selServico   = document.getElementById("servico");
  var lblPreco     = document.getElementById("resumo-preco");
  var lblPrazo     = document.getElementById("resumo-prazo");
  var lblDataPrev  = document.getElementById("resumo-data");
  var lblStatus    = document.getElementById("resumo-status");
  var btnIncluir   = document.getElementById("btn-incluir");
  var msgForm      = document.getElementById("mensagem-form");
  var corpoTabela  = document.getElementById("corpo-tabela");

  var contadorSolicitacao = 0; // gera números sequenciais de solicitação

  /* -----------------------------------------------------------------------
     4. Preenchimento do combo e labels reativos
     ----------------------------------------------------------------------- */
  function popularCombo() {
    var opcaoVazia = document.createElement("option");
    opcaoVazia.value = "";
    opcaoVazia.textContent = "— Selecione um serviço —";
    selServico.appendChild(opcaoVazia);

    Object.keys(SERVICOS).forEach(function (chave) {
      var opcao = document.createElement("option");
      opcao.value = chave;
      opcao.textContent = SERVICOS[chave].nome;
      selServico.appendChild(opcao);
    });
  }

  function atualizarResumo() {
    var chave = selServico.value;
    lblStatus.textContent = STATUS_INICIAL;

    if (chave === "" || !SERVICOS[chave]) {
      lblPreco.textContent    = "—";
      lblPrazo.textContent    = "—";
      lblDataPrev.textContent = "—";
      return;
    }

    var servico = SERVICOS[chave];
    var dataPrevista = somarDias(new Date(), servico.prazo);

    lblPreco.textContent    = formatarMoeda(servico.preco);
    lblPrazo.textContent    = servico.prazo + (servico.prazo === 1 ? " dia" : " dias");
    lblDataPrev.textContent = formatarData(dataPrevista);
  }

  /* -----------------------------------------------------------------------
     5. Construção de linha da tabela
     ----------------------------------------------------------------------- */
  // Retorna o HTML do badge conforme o status
  function badgeStatus(status) {
    var classe = "badge--elaboracao";
    if (status === "EM ANDAMENTO") { classe = "badge--andamento"; }
    else if (status === "CONCLUÍDO") { classe = "badge--concluido"; }
    return '<span class="badge ' + classe + '">' + status + '</span>';
  }

  function removerLinhaVazia() {
    var vazia = corpoTabela.querySelector(".tabela-vazia");
    if (vazia) { vazia.remove(); }
  }

  function verificarTabelaVazia() {
    if (corpoTabela.querySelectorAll("tr").length === 0) {
      var tr = document.createElement("tr");
      tr.className = "tabela-vazia";
      tr.innerHTML = '<td colspan="7">Nenhuma solicitação cadastrada.</td>';
      corpoTabela.appendChild(tr);
    }
  }

  // Cria e anexa uma linha de pedido. `pedido` traz os dados já formatados.
  function adicionarLinha(pedido) {
    removerLinhaVazia();

    var tr = document.createElement("tr");

    var tdData = document.createElement("td");
    tdData.textContent = pedido.dataPedido;

    var tdNumero = document.createElement("td");
    tdNumero.textContent = pedido.numero;

    var tdServico = document.createElement("td");
    tdServico.textContent = pedido.servico;

    var tdStatus = document.createElement("td");
    tdStatus.innerHTML = badgeStatus(pedido.status);

    var tdPreco = document.createElement("td");
    tdPreco.className = "col-preco";
    tdPreco.textContent = pedido.preco;

    var tdDataPrev = document.createElement("td");
    tdDataPrev.textContent = pedido.dataPrevista;

    var tdAcao = document.createElement("td");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-excluir";
    btn.textContent = "Excluir";
    btn.addEventListener("click", function () {
      tr.remove();
      verificarTabelaVazia();
    });
    tdAcao.appendChild(btn);

    tr.appendChild(tdData);
    tr.appendChild(tdNumero);
    tr.appendChild(tdServico);
    tr.appendChild(tdStatus);
    tr.appendChild(tdPreco);
    tr.appendChild(tdDataPrev);
    tr.appendChild(tdAcao);

    corpoTabela.appendChild(tr);
  }

  // Gera número de solicitação no formato 2026-0001
  function proximoNumero() {
    contadorSolicitacao += 1;
    return new Date().getFullYear() + "-" + String(contadorSolicitacao).padStart(4, "0");
  }

  /* -----------------------------------------------------------------------
     6. Inclusão de nova solicitação
     ----------------------------------------------------------------------- */
  function incluirSolicitacao() {
    msgForm.textContent = "";
    msgForm.className = "mensagem-form";

    var chave = selServico.value;
    if (chave === "" || !SERVICOS[chave]) {
      msgForm.textContent = "Selecione um serviço para incluir a solicitação.";
      msgForm.classList.add("erro");
      selServico.focus();
      return;
    }

    var servico = SERVICOS[chave];
    var hoje = new Date();
    var dataPrevista = somarDias(hoje, servico.prazo);

    adicionarLinha({
      dataPedido:   formatarData(hoje),
      numero:       proximoNumero(),
      servico:      servico.nome,
      status:       STATUS_INICIAL,
      preco:        formatarMoeda(servico.preco),
      dataPrevista: formatarData(dataPrevista)
    });

    msgForm.textContent = "Validação realizada com sucesso. Solicitação incluída.";
    msgForm.classList.add("ok");

    selServico.value = "";
    atualizarResumo();
  }

  /* -----------------------------------------------------------------------
     7. Pré-carga de pedidos fictícios (ordem crescente de data)
     ----------------------------------------------------------------------- */
  function preCarregarExemplos() {
    var hoje = new Date();

    // Datas de pedido anteriores à atual, em ordem crescente
    var exemplos = [
      { diasAtras: 20, chave: "backup-corporativo",    status: "CONCLUÍDO" },
      { diasAtras: 12, chave: "manutencao-servidores", status: "EM ANDAMENTO" },
      { diasAtras: 5,  chave: "instalacao-redes",      status: "EM ANDAMENTO" }
    ];

    exemplos.forEach(function (ex) {
      var servico = SERVICOS[ex.chave];
      var dataPedido = somarDias(hoje, -ex.diasAtras);
      var dataPrevista = somarDias(dataPedido, servico.prazo);

      adicionarLinha({
        dataPedido:   formatarData(dataPedido),
        numero:       proximoNumero(),
        servico:      servico.nome,
        status:       ex.status,
        preco:        formatarMoeda(servico.preco),
        dataPrevista: formatarData(dataPrevista)
      });
    });
  }

  /* -----------------------------------------------------------------------
     8. Inicialização
     ----------------------------------------------------------------------- */
  function init() {
    popularCombo();
    atualizarResumo();
    preCarregarExemplos();

    selServico.addEventListener("change", atualizarResumo);
    btnIncluir.addEventListener("click", incluirSolicitacao);
  }

  document.addEventListener("DOMContentLoaded", init);
})();