package com.clinicflow.agendamento.service;

import com.clinicflow.agendamento.model.Agendamento;
import com.clinicflow.agendamento.repository.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository repository;

    public Agendamento salvar(Agendamento agendamento) {
        return repository.save(agendamento);
    }
}
