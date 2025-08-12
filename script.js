document.addEventListener('DOMContentLoaded', () => {
  // Menu Mobile toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('show');
    });
  }

  // Carrossel
  const slides = document.querySelectorAll('.carrossel .slide');
  const prevBtn = document.querySelector('.carrossel .prev');
  const nextBtn = document.querySelector('.carrossel .next');
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlideFunc() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  if (nextBtn && prevBtn && slides.length > 0) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlideFunc);
  }

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Formulário de Agendamento
  const form = document.getElementById('form-agendamento');
  const mensagemEnvio = document.getElementById('mensagemEnvio');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const botao = form.querySelector('button[type="submit"]');
      if (botao) botao.disabled = true; // Desativa o botão para evitar múltiplos cliques

      const nome = document.getElementById('nome').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const data = document.getElementById('data').value;
      const hora = document.getElementById('hora').value;
      const observacoes = document.getElementById('mensagem').value.trim();
      const hoje = new Date().toISOString().split('T')[0];

      // Validação de data
      if (data < hoje) {
        exibirMensagem("Por favor, selecione uma data igual ou posterior a hoje.", "erro");
        if (botao) botao.disabled = false; // Reativa botão em caso de erro
        return;
      }

      // Validação de horário comercial
      if (hora < "08:00" || hora > "18:00") {
        exibirMensagem("Por favor, selecione um horário dentro do horário comercial (08:00 às 18:00).", "erro");
        if (botao) botao.disabled = false; // Reativa botão em caso de erro
        return;
      }

      const dados = {
        nomeCompleto: nome,
        telefone: telefone,
        dataConsulta: data,
        horaConsulta: hora,
        observacoes: observacoes
      };

      fetch('http://localhost:4567/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
      .then(response => {
        if (!response.ok) throw new Error("Erro no envio dos dados");
        return response.json();
      })
      .then(data => {
        exibirMensagem("Agendamento enviado com sucesso! Confirmação será enviada por WhatsApp.", "sucesso");
        form.reset();
        if (botao) botao.disabled = false; // Reativa botão após sucesso
      })
      .catch(error => {
        exibirMensagem("Erro ao enviar agendamento. Tente novamente mais tarde.", "erro");
        console.error(error);
        if (botao) botao.disabled = false; // Reativa botão após erro
      });
    });
  }

  function exibirMensagem(msg, tipo) {
    if (!mensagemEnvio) return;

    mensagemEnvio.textContent = msg;
    mensagemEnvio.className = `mensagem-envio ${tipo} mostrar`;
    mensagemEnvio.style.display = 'block';
    mensagemEnvio.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      mensagemEnvio.className = 'mensagem-envio';
      mensagemEnvio.style.display = 'none';
    }, 5000);
  }
});
