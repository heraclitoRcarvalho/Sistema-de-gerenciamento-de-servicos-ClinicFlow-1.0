package com.clinica;

import static spark.Spark.*;

import com.google.gson.Gson;

import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        port(4567); // Porta do servidor

        // Permitir CORS para o frontend local
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type");
        });

        // Endpoint para receber agendamento
        post("/agendar", (request, response) -> {
            response.type("application/json");
            Gson gson = new Gson();

            Agendamento agendamento = gson.fromJson(request.body(), Agendamento.class);

            // Salvar agendamento em CSV simples (append)
            try (FileWriter fw = new FileWriter("agendamentos.csv", true)) {
                fw.append(agendamento.getNome()).append(",")
                  .append(agendamento.getTelefone()).append(",")
                  .append(agendamento.getData()).append(",")
                  .append(agendamento.getHora()).append(",")
                  .append(agendamento.getObservacoes().replace(",", ";"))
                  .append("\n");
            } catch (IOException e) {
                response.status(500);
                return gson.toJson(new StandardResponse("Erro ao salvar agendamento"));
            }

            // Aqui você poderia adicionar código para envio de WhatsApp, usando API externa

            return gson.toJson(new StandardResponse("Agendamento recebido com sucesso!"));
        });
    }

    static class Agendamento {
        private String nome;
        private String telefone;
        private String data;
        private String hora;
        private String observacoes;

        public String getNome() { return nome; }
        public String getTelefone() { return telefone; }
        public String getData() { return data; }
        public String getHora() { return hora; }
        public String getObservacoes() { return observacoes; }
    }

    static class StandardResponse {
        private String message;

        public StandardResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
