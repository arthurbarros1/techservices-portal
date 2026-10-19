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
     1. Listas de caracteres especiais (fonte única da verdade)
     ----------------------------------------------------------------------- */
  var CARACTERES_PERMITIDOS = ["@", "#", "$", "%", "&", "!", "?", "/", "+", "=", "."];
  var CARACTERES_PROIBIDOS  = ["}", "^", ";", "<", ">"];

  /* -----------------------------------------------------------------------
     2. Validação de e-mail
     ----------------------------------------------------------------------- */
  function validarEmail(email) {
    if (typeof email !== "string") { return false; }
    var valor = email.trim();
    // Formato geral: texto@texto.dominio (sem espaços, com ao menos um ponto no domínio)
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
     sem dígitos nem caracteres especiais (apenas letras, incluindo
     acentuadas, e espaços).
     ----------------------------------------------------------------------- */
  function validarNomeCompleto(nome) {
    if (typeof nome !== "string") { return false; }
    var valor = nome.trim().replace(/\s+/g, " ");
    if (valor === "") { return false; }

    // Apenas letras (com acentos), apóstrofo e hífen em cada palavra
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
  // Aplica a máscara NNN.NNN.NNN-NN conforme o usuário digita
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

  // Valida o CPF pelos dígitos verificadores reais
  function validarCPF(cpf) {
    var numeros = String(cpf).replace(/\D/g, "");

    if (numeros.length !== 11) { return false; }
    // Rejeita sequências iguais (000..., 111..., etc.)
    if (/^(\d)\1{10}$/.test(numeros)) { return false; }

    var soma = 0;
    var resto;

    // Primeiro dígito verificador
    for (var i = 1; i <= 9; i++) {
      soma += parseInt(numeros.substring(i - 1, i), 10) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) { resto = 0; }
    if (resto !== parseInt(numeros.substring(9, 10), 10)) { return false; }

    // Segundo dígito verificador
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
     Recebe a data no formato ISO (YYYY-MM-DD) vindo do input[type=date].
     ----------------------------------------------------------------------- */
  function validarMaioridade(dataISO) {
    if (typeof dataISO !== "string" || dataISO === "") { return false; }

    var partes = dataISO.split("-");
    if (partes.length !== 3) { return false; }

    var ano = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10);
    var dia = parseInt(partes[2], 10);

    var nascimento = new Date(ano, mes - 1, dia);
    // Rejeita datas inexistentes (ex.: 31/02) ou futuras
    if (nascimento.getFullYear() !== ano ||
        nascimento.getMonth() !== mes - 1 ||
        nascimento.getDate() !== dia) {
      return false;
    }

    var hoje = new Date();
    if (nascimento > hoje) { return false; }

    var idade = hoje.getFullYear() - nascimento.getFullYear();
    var mesDiff = hoje.getMonth() - nascimento.getMonth();

    // Ainda não fez aniversário neste ano?
    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade >= 18;
  }

  /* -----------------------------------------------------------------------
     8. Máscara e validação de telefone nacional
     Aceita fixo (10 dígitos) e celular (11 dígitos, com 9 após o DDD).
     ----------------------------------------------------------------------- */
  // Aplica (NN) NNNNN-NNNN para celular ou (NN) NNNN-NNNN para fixo
  function mascararTelefone(valor) {
    var numeros = String(valor).replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return numeros.replace(/(\d{1,2})/, "($1");
    }
    if (numeros.length <= 6) {
      return numeros.replace(/(\d{2})(\d{1,4})/, "($1) $2");
    }
    if (numeros.length <= 10) {
      // Fixo: (NN) NNNN-NNNN
      return numeros.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
    }
    // Celular: (NN) NNNNN-NNNN
    return numeros.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
  }

  function validarTelefone(tel) {
    var numeros = String(tel).replace(/\D/g, "");

    // 10 dígitos (fixo) ou 11 dígitos (celular)
    if (numeros.length !== 10 && numeros.length !== 11) { return false; }

    // DDD válido (11 a 99)
    var ddd = parseInt(numeros.substring(0, 2), 10);
    if (ddd < 11) { return false; }

    // Se for celular (11 dígitos), o terceiro dígito deve ser 9
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