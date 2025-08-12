document.addEventListener('DOMContentLoaded', () => {
  const formTitle = document.getElementById('form-title');
  const toggleText = document.getElementById('toggle-text');
  const loginForm = document.getElementById('login-form');
  let modoCadastro = false;

  function toggleModo() {
    modoCadastro = !modoCadastro;

    if (modoCadastro) {
      formTitle.textContent = 'Cadastro de Funcionário';
      toggleText.innerHTML = 'Já tem uma conta? <a href="#" id="toggle-link">Entrar</a>';
    } else {
      formTitle.textContent = 'Login de Funcionário';
      toggleText.innerHTML = 'Não tem uma conta? <a href="#" id="toggle-link">Cadastre-se</a>';
    }

    document.getElementById('toggle-link').addEventListener('click', function (e) {
      e.preventDefault();
      toggleModo();
    });
  }

  // Inicializa o evento de clique no link
  document.getElementById('toggle-link').addEventListener('click', function (e) {
    e.preventDefault();
    toggleModo();
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const usuario = document.getElementById('username').value;
    const senha = document.getElementById('password').value;
    const mensagem = document.getElementById('login-message');

    if (modoCadastro) {
      mensagem.textContent = "Cadastro realizado com sucesso!";
      mensagem.className = "mensagem-envio sucesso";
    } else {
      if (usuario === "admin" && senha === "1234") {
        localStorage.setItem('logado', 'true'); // Seta flag de login
        mensagem.textContent = "Login bem-sucedido!";
        mensagem.className = "mensagem-envio sucesso";
        
        setTimeout(() => {
          window.location.href = "painel-funcionario.html"; // Redireciona após sucesso
        }, 1000);
      } else {
        mensagem.textContent = "Usuário ou senha inválidos.";
        mensagem.className = "mensagem-envio erro";
      }
    }

    mensagem.style.display = 'block';
    setTimeout(() => {
      mensagem.style.display = 'none';
    }, 4000);
  });
});
