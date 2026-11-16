package br.com.techservices;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

    @Autowired
    private MockMvc mvc;

    private void postJson(String url, String json, int statusEsperado) throws Exception {
        mvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().is(statusEsperado));
    }

    @Test
    void fluxoCompleto() throws Exception {
        // Cadastro de cliente + login duplicado
        String cliente = """
                {"nome":"Maria da Silva","login":"maria@exemplo.com","senha":"Senha@1"}""";
        postJson("/api/clientes", cliente, 201);
        postJson("/api/clientes", cliente.replace("maria@", "MARIA@"), 409);

        // Login
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"maria@exemplo.com\",\"senha\":\"Senha@1\"}"))
                .andExpect(status().isOk()).andExpect(content().string("true"));
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"maria@exemplo.com\",\"senha\":\"errada\"}"))
                .andExpect(status().isOk()).andExpect(content().string("false"));

        // Troca de senha
        mvc.perform(put("/api/auth/password").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"maria@exemplo.com\",\"senhaAtual\":\"errada\",\"novaSenha\":\"Nova#22\"}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(put("/api/auth/password").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"maria@exemplo.com\",\"senhaAtual\":\"Senha@1\",\"novaSenha\":\"Nova#22\"}"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"maria@exemplo.com\",\"senha\":\"Nova#22\"}"))
                .andExpect(content().string("true"));

        // Serviços: cadastro (id autoincremento), validação e listagem
        postJson("/api/servicos",
                "{\"nome\":\"Suporte\",\"descricao\":\"Suporte técnico remoto\",\"preco\":150.00,\"prazoDias\":2}", 201);
        postJson("/api/servicos",
                "{\"nome\":\"Redes\",\"descricao\":\"Instalação de redes\",\"preco\":800.50,\"prazoDias\":5}", 201);
        postJson("/api/servicos", "{\"nome\":\"\",\"descricao\":\"x\",\"preco\":0,\"prazoDias\":0}", 400);

        String lista = mvc.perform(get("/api/servicos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andReturn().getResponse().getContentAsString();
        long id1 = Long.parseLong(lista.replaceAll("(?s).*?\"id\":(\\d+).*", "$1"));

        // Solicitações: grava lista, consulta, substitui e esvazia
        mvc.perform(put("/api/solicitacoes/maria@exemplo.com").contentType(MediaType.APPLICATION_JSON)
                        .content("[{\"servicoId\":" + id1 + ",\"dataPedido\":\"2026-11-01\"},"
                               + "{\"servicoId\":" + id1 + ",\"status\":\"EM ANDAMENTO\"}]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].status").value("EM ELABORAÇÃO"))
                .andExpect(jsonPath("$[0].numero").value("2026-0001"));

        mvc.perform(get("/api/solicitacoes/maria@exemplo.com"))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(2)));

        mvc.perform(put("/api/solicitacoes/maria@exemplo.com").contentType(MediaType.APPLICATION_JSON)
                        .content("[{\"servicoId\":" + id1 + "}]"))
                .andExpect(jsonPath("$", hasSize(1)));

        mvc.perform(put("/api/solicitacoes/maria@exemplo.com").contentType(MediaType.APPLICATION_JSON)
                        .content("[{\"servicoId\":999999}]"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/solicitacoes/maria@exemplo.com"))
                .andExpect(jsonPath("$", hasSize(1))); // lista anterior preservada (rollback)

        mvc.perform(put("/api/solicitacoes/maria@exemplo.com").contentType(MediaType.APPLICATION_JSON)
                        .content("[]"))
                .andExpect(jsonPath("$", hasSize(0)));

        mvc.perform(get("/api/solicitacoes/ninguem@exemplo.com")).andExpect(status().isNotFound());
    }

    @Test
    void corsPermiteFrontendReact() throws Exception {
        mvc.perform(options("/api/servicos")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "PUT"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}
