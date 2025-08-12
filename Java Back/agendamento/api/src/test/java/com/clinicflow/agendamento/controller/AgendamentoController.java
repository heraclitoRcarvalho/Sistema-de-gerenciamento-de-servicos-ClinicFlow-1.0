package com.clinicflow.agendamento.controller;

import com.clinicflow.agendamento.model.Agendamento;
import com.clinicflow.agendamento.repository.AgendamentoRepository;

import com.clinicflow.agendamento.dto.AgendamentoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agendamentos")

public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @PostMapping
    public ResponseEntity<String> agendarConsulta(@RequestBody AgendamentoDTO dto) {
        try {
            // Cria um objeto da entidade a partir do DTO
            Agendamento agendamento = new Agendamento();
            agendamento.setNome(dto.getNome());
            agendamento.setTelefone(dto.getTelefone());
            agendamento.setDataHora(dto.getDataHora());

            // Salva no banco de dados
            agendamentoRepository.save(agendamento);

            return ResponseEntity.ok("Agendamento recebido com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao processar o agendamento: " + e.getMessage());
        }
    }
}
