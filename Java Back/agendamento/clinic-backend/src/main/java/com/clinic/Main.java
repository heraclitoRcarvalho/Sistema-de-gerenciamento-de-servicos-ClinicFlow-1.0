package com.clinic;

import static spark.Spark.*;
import com.google.gson.Gson;
import java.util.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Main {

    private static List<Map<String, String>> agendamentos = new ArrayList<>();

    public static void main(String[] args) {
        port(4567);

        System.out.println("Servidor iniciado na porta 4567");

        before((request, response) -> {
            // Permite qualquer origem para testes locais
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type");
        });

        options("/*", (request, response) -> "OK");

        get("/ping", (req, res) -> "pong");

        post("/agendar", (request, response) -> {
            Gson gson = new Gson();
            Map<String, String> dados = gson.fromJson(request.body(), Map.class);

            if (dados.containsKey("nomeCompleto") && dados.containsKey("telefone") &&
                    dados.containsKey("dataConsulta") && dados.containsKey("horaConsulta") && dados.containsKey("observacoes")) {

                String nome = dados.get("nomeCompleto");
                String telefone = dados.get("telefone");
                String dataISO = dados.get("dataConsulta"); // yyyy-MM-dd
                String hora = dados.get("horaConsulta");
                String observacoes = dados.get("observacoes");

                // Convertendo data para dd/MM/yyyy
                String[] partes = dataISO.split("-");
                String dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];

                // Substituindo e adicionando campos
                dados.put("dataConsulta", dataFormatada);
                dados.put("status", "Pendente"); // status inicial

                agendamentos.add(dados);

                System.out.println("Agendamento recebido de: " + nome + ", telefone: " + telefone + ", data: " + dataFormatada + ", hora: " + hora + ", observacoes: " + observacoes);

                WhatsAppService.sendWhatsAppMessage(
                        telefone,
                        "Olá " + nome + "! Seu agendamento foi confirmado para " + dataFormatada + " às " + hora + ". Observações: " + observacoes
                );

                response.type("application/json");
                return "{\"status\":\"ok\"}";
            } else {
                response.status(400);
                return "{\"status\":\"erro\", \"mensagem\":\"Dados incompletos.\"}";
            }
        });

        get("/agendamentos", (request, response) -> {
            response.type("application/json");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            // Cria uma cópia para não alterar a lista original
            List<Map<String, String>> agendamentosOrdenados = new ArrayList<>(agendamentos);

            // Ordena por dataConsulta (dd/MM/yyyy) e horaConsulta (HH:mm), em ordem crescente
            agendamentosOrdenados.sort((a, b) -> {
                LocalDate dataA = LocalDate.parse(a.get("dataConsulta"), formatter);
                LocalDate dataB = LocalDate.parse(b.get("dataConsulta"), formatter);

                int cmpData = dataA.compareTo(dataB);
                if (cmpData != 0) {
                    return cmpData; // ordem crescente pela data
                } else {
                    // Se a data for igual, ordena pela hora (formato HH:mm)
                    return a.get("horaConsulta").compareTo(b.get("horaConsulta"));
                }
            });

            // Inverte para ordem decrescente (mais recente primeiro)
            Collections.reverse(agendamentosOrdenados);

            return new Gson().toJson(agendamentosOrdenados);
        });
    }
}
