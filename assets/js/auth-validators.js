/* ==========================================================================
   auth-validators.js — Lógica reaproveitável de validação
   Projeto: techservices-portal
   Consumido por: login.html, troca-senha.html, cadastro.html
   Expõe o objeto global AuthValidators com validadores e máscaras.
   JavaScript Vanilla, sem dependências externas.
   ========================================================================== */

(function (global) {
  "use strict";

  /* -----------------------------------------------------------------------
     1. Listas de caracteres especiais (conforme especificação do edital)
        Permitidos: @ # $ % & * ! ? / \ | - _ + . =
        Proibidos:  ¨ { } [ ] ´ ` ~ ^ : ; < > , " '
        Montadas a partir de strings para evitar erros de escape no array.
     ----------------------------------------------------------------------- */
  var PERMITIDOS_STR = "@#$%&*!?/\\|-_+.=";
  var PROIBIDOS_STR  = "¨{}[]´`~^:;<>,\"'";

  // Converte a string em array de caracteres únicos, preservando a ordem
  function paraLista(str) {
    var lista = [];
    for (var i = 0; i < str.length; i++) {
      if (lista.indexOf(str.charAt(i)) === -1) {
        lista.push(str.charAt(i));
      }
    }
    return lista;
  }

  var CARACTERES_PERMITIDOS = paraLista(PERMITIDOS_STR);
  var CARACTERES_PROIBIDOS  = paraLista(PROIBIDOS_STR);

  /* -----------------------------------------------------------------------
     2. Validação de e-mail
     ----------------------------------------------------------------------- */
  function validarEmail(email) {
    if (typeof email !== "string") { return false; }
    var valor = email.trim();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  }

  /* -----------------------------------------------------------------------
     3. Validação de senha forte
        Critérios: mínimo 6 caracteres, ao menos um número, ao menos uma
        maiúscula, ao menos um caractere permitido e nenhum proibido.
        Retorna { valido, criterios }.
     ----------------------------------------------------------------------- */
  function validarSenhaForte(senha) {
    var valor = (typeof senha === "string") ? senha : "";

    var temPermitido = CARACTERES_PERMITIDOS.some(function (c) {
      return valor.indexOf(c) !== -1;
    });

    var temProibido = CARACTERES_PROIBIDOS.some(function (c) {
      return valor.indexOf(c) !== -1;
    });

    var criterios = {
      tamanho:     valor.length >= 6,
      numero:      /[0-9]/.test(valor),
      maiuscula:   /[A-Z]/.test(valor),
      permitido:   temPermitido,
      semProibido: !temProibido && valor.length > 0
    };

    var valido = criterios.tamanho &&
                 criterios.numero &&
                 criterios.maiuscula &&
                 criterios.permitido &&
                 criterios.semProibido;

    return { valido: valido, criterios: criterios };
  }

  /* -----------------------------------------------------------------------
     4. Confirmação de senha
     ----------------------------------------------------------------------- */
  function senhasConferem(a, b) {
    return typeof a === "string" && a.length > 0 && a === b;
  }

  /* -----------------------------------------------------------------------
     5. Validação de nome completo
        Regras: ao menos duas palavras; 1ª palavra com 2+ letras;
        sem caracteres especiais (apenas letras, incluindo acentuadas,
        apóstrofo, hífen e espaços).
     ----------------------------------------------------------------------- */
  function validarNomeCompleto(nome) {
    if (typeof nome !== "string") { return false; }
    var valor = nome.trim().replace(/\s+/g, " ");
    if (valor === "") { return false; }

    var regexPalavra = /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/;
    var palavras = valor.split(" ");

    if (palavras.length < 2) { return false; }
    if (palavras[0].length < 2) { return false; }

    return palavras.every(function (p) {
      return regexPalavra.test(p);
    });
  }

  /* -----------------------------------------------------------------------
     6. Máscara e validação de CPF
     ----------------------------------------------------------------------- */
  function mascararCPF(valor) {
    var numeros = String(valor).replace(/\D/g, "").slice(0, 11);
    var saida = numeros;

    if (numeros.length > 9) {
      saida = numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (numeros.length > 6) {
      saida = numeros.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (numeros.length > 3) {
      saida = numeros.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    return saida;
  }

  function validarCPF(cpf) {
    var numeros = String(cpf).replace(/\D/g, "");

    if (numeros.length !== 11) { return false; }
    if (/^(\d)\1{10}$/.test(numeros)) { return false; }

    var soma = 0;
    var resto;

    for (var i = 1; i <= 9; i++) {
      soma += parseInt(numeros.substring(i - 1, i), 10) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) { resto = 0; }
    if (resto !== parseInt(numeros.substring(9, 10), 10)) { return false; }

    soma = 0;
    for (var j = 1; j <= 10; j++) {
      soma += parseInt(numeros.substring(j - 1, j), 10) * (12 - j);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) { resto = 0; }
    if (resto !== parseInt(numeros.substring(10, 11), 10)) { return false; }

    return true;
  }

  /* -----------------------------------------------------------------------
     7. Validação de maioridade (idade >= 18 anos)
     ----------------------------------------------------------------------- */
  function validarMaioridade(dataISO) {
    if (typeof dataISO !== "string" || dataISO === "") { return false; }

    var partes = dataISO.split("-");
    if (partes.length !== 3) { return false; }

    var ano = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10);
    var dia = parseInt(partes[2], 10);

    var nascimento = new Date(ano, mes - 1, dia);
    if (nascimento.getFullYear() !== ano ||
        nascimento.getMonth() !== mes - 1 ||
        nascimento.getDate() !== dia) {
      return false;
    }

    var hoje = new Date();
    if (nascimento > hoje) { return false; }

    var idade = hoje.getFullYear() - nascimento.getFullYear();
    var mesDiff = hoje.getMonth() - nascimento.getMonth();

    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade >= 18;
  }

  /* -----------------------------------------------------------------------
     8. Máscara e validação de telefone nacional
     ----------------------------------------------------------------------- */
  function mascararTelefone(valor) {
    var numeros = String(valor).replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return numeros.replace(/(\d{1,2})/, "($1");
    }
    if (numeros.length <= 6) {
      return numeros.replace(/(\d{2})(\d{1,4})/, "($1) $2");
    }
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
  }

  function validarTelefone(tel) {
    var numeros = String(tel).replace(/\D/g, "");

    if (numeros.length !== 10 && numeros.length !== 11) { return false; }

    var ddd = parseInt(numeros.substring(0, 2), 10);
    if (ddd < 11) { return false; }

    if (numeros.length === 11 && numeros.charAt(2) !== "9") { return false; }

    return true;
  }

  /* -----------------------------------------------------------------------
     9. Exposição pública (objeto global AuthValidators)
     ----------------------------------------------------------------------- */
  global.AuthValidators = {
    CARACTERES_PERMITIDOS: CARACTERES_PERMITIDOS,
    CARACTERES_PROIBIDOS:  CARACTERES_PROIBIDOS,
    validarEmail:          validarEmail,
    validarSenhaForte:     validarSenhaForte,
    senhasConferem:        senhasConferem,
    validarNomeCompleto:   validarNomeCompleto,
    mascararCPF:           mascararCPF,
    validarCPF:            validarCPF,
    validarMaioridade:     validarMaioridade,
    mascararTelefone:      mascararTelefone,
    validarTelefone:       validarTelefone
  };

})(window);