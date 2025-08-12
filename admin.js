const tabela = document.getElementById('agendamentos-table');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-msg');

async function carregarAgendamentos() {
  try {
    const response = await fetch('http://localhost:4567/agendamentos');

    if (!response.ok) {
      throw new Error('Erro ao buscar agendamentos: ' + response.statusText);
    }

    const agendamentos = await response.json();

    if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
      loadingEl.textContent = 'Nenhum agendamento encontrado.';
      tabela.style.display = 'none';
      return;
    }

    popularTabela(agendamentos);
    loadingEl.style.display = 'none';
    tabela.style.display = 'table';

  } catch (error) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.textContent = error.message;
  }
}

function popularTabela(agendamentos) {
  const tbody = document.querySelector('#agendamentos-table tbody');
  tbody.innerHTML = '';

  agendamentos.forEach(({ nomeCompleto, telefone, dataConsulta, horaConsulta, observacoes }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nomeCompleto}</td>
      <td>${telefone}</td>
      <td>${dataConsulta}</td>
      <td>${horaConsulta}</td>
      <td>${observacoes || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('logout-btn').addEventListener('click', () => {
  window.location.href = 'login.html';
});

carregarAgendamentos();
