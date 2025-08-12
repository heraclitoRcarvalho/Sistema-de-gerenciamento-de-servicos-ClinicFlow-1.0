document.addEventListener('DOMContentLoaded', () => {
  const containerAndamento = document.querySelector('#agendamentos-andamento .lista-agendamentos');
  const containerCancelados = document.querySelector('#agendamentos-cancelados .lista-agendamentos');
  const containerConcluidos = document.querySelector('#agendamentos-concluidos .lista-agendamentos');
  const containerInicial = document.querySelector('#agendamentos-container');

  const inputNome = document.getElementById('filtro-nome');
  const inputData = document.getElementById('filtro-data');
  const horaInicio = document.getElementById('horaInicio');
  const horaFim = document.getElementById('horaFim');
  const selectOrdenar = document.getElementById('ordenarPor');

  const btnFiltro = document.getElementById('aplicarFiltro');
  const btnLimparFiltro = document.getElementById('limparFiltro');

  let agendamentosOriginais = [];

  // Função corrigida para converter "dd/MM/yyyy" para "yyyy-MM-dd"
  function converterDataBRparaISO(dataBR) {
    if (!dataBR) return null; // evita erro se dataBR for indefinida ou vazia

    const partes = dataBR.split('/');
    if (partes.length !== 3) return null; // formato inválido

    let [dia, mes, ano] = partes;

    // validação simples para garantir que são números
    if (
      isNaN(dia) || isNaN(mes) || isNaN(ano) ||
      dia.length === 0 || mes.length === 0 || ano.length === 0
    ) {
      return null;
    }

    // padStart para garantir 2 dígitos em dia e mês, 4 em ano
    dia = dia.padStart(2, '0');
    mes = mes.padStart(2, '0');
    ano = ano.padStart(4, '0');

    return `${ano}-${mes}-${dia}`;
  }

  function horaParaMinutos(hora) {
    if (!hora) return null;
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  function aplicarFiltro() {
    const nomeFiltro = inputNome.value.trim().toLowerCase();
    const dataFiltro = inputData.value; // aqui já está no formato yyyy-MM-dd, direto do input type=date
    const inicio = horaInicio.value;
    const fim = horaFim.value;
    const minInicio = horaParaMinutos(inicio);
    const minFim = horaParaMinutos(fim);

    let filtrados = agendamentosOriginais.filter(a => {
      if (nomeFiltro && !a.nomeCompleto.toLowerCase().includes(nomeFiltro)) return false;

      // converte dataConsulta do formato dd/MM/yyyy para ISO para comparar com dataFiltro do input
      const dataConsultaISO = converterDataBRparaISO(a.dataConsulta);
      if (dataFiltro && dataConsultaISO !== dataFiltro) return false;

      if (minInicio !== null && minFim !== null) {
        const minAgendamento = horaParaMinutos(a.horaConsulta);
        if (minAgendamento === null) return false;
        if (minAgendamento < minInicio || minAgendamento > minFim) return false;
      }
      return true;
    });

    // Ordenação segura
    const ordenacao = selectOrdenar.value;
    filtrados.sort((a, b) => {
      const dataAISO = converterDataBRparaISO(a.dataConsulta);
      const dataBISO = converterDataBRparaISO(b.dataConsulta);

      // Se alguma data for inválida, considera igual para não quebrar
      if (!dataAISO || !dataBISO) return 0;

      const dataHoraA = new Date(`${dataAISO}T${a.horaConsulta}`);
      const dataHoraB = new Date(`${dataBISO}T${b.horaConsulta}`);

      switch (ordenacao) {
        case 'data-recente':
          return dataHoraB - dataHoraA;
        case 'data-antiga':
          return dataHoraA - dataHoraB;
        case 'hora-crescente':
          return a.horaConsulta.localeCompare(b.horaConsulta);
        case 'hora-decrescente':
          return b.horaConsulta.localeCompare(a.horaConsulta);
        default:
          return 0;
      }
    });

    exibirAgendamentos(filtrados);
  }

  function limparFiltros() {
    inputNome.value = '';
    inputData.value = '';
    horaInicio.value = '';
    horaFim.value = '';
    selectOrdenar.value = '';
    exibirAgendamentos(agendamentosOriginais);
  }

  function criarSelectStatus(agendamento) {
    const select = document.createElement('select');
    select.classList.add('status-select');

    const opcoes = ['Pendente', 'Em andamento', 'Concluída', 'Cancelada'];
    opcoes.forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      if (agendamento.status === status) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      agendamento.status = select.value;
      exibirAgendamentos(agendamentosOriginais);
    });

    return select;
  }

  function exibirAgendamentos(lista) {
    containerInicial.innerHTML = '';
    containerAndamento.innerHTML = '';
    containerCancelados.innerHTML = '';
    containerConcluidos.innerHTML = '';

    if (lista.length === 0) {
      containerInicial.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
      return;
    }

    lista.forEach(agendamento => {
      const card = document.createElement('div');
      card.className = 'agendamento-card';
      card.innerHTML = `
        <strong>Nome:</strong> ${agendamento.nomeCompleto}<br>
        <strong>Telefone:</strong> ${agendamento.telefone}<br>
        <strong>Data:</strong> ${agendamento.dataConsulta}<br>
        <strong>Hora:</strong> ${agendamento.horaConsulta}<br>
        <strong>Observações:</strong> ${agendamento.observacoes || 'Nenhuma'}<br>
      `;
      card.appendChild(criarSelectStatus(agendamento));

      switch (agendamento.status) {
        case 'Em andamento':
          containerAndamento.appendChild(card);
          break;
        case 'Cancelada':
          containerCancelados.appendChild(card);
          break;
        case 'Concluída':
          containerConcluidos.appendChild(card);
          break;
        default:
          containerInicial.appendChild(card);
      }
    });
  }

  btnFiltro.addEventListener('click', aplicarFiltro);
  btnLimparFiltro.addEventListener('click', limparFiltros);
  selectOrdenar.addEventListener('change', aplicarFiltro);

  fetch('http://localhost:4567/agendamentos')
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar agendamentos");
      return response.json();
    })
    .then(data => {
      agendamentosOriginais = data.map(a => ({ ...a, status: 'Pendente' }));
      exibirAgendamentos(agendamentosOriginais);
    })
    .catch(error => {
      containerInicial.innerHTML = `<p style="color:red;">Erro: ${error.message}</p>`;
      console.error(error);
    });
});
