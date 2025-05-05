function validarCadastro() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const nascimento = document.getElementById("nascimento").value;
    const telefone = document.getElementById("telefone").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!?\/\\|\-_\+=.])[A-Za-z\d@#$%&*!?\/\\|\-_\+=.]{6,}$/;
    const senhaInvalidChars = /[¨{}[\]´`~^:;<>,“‘]/;
    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

    if (!email || !emailRegex.test(email)) return alert("Enter a valid email address.");
    if (!senha || !senhaRegex.test(senha) || senhaInvalidChars.test(senha)) return alert("Invalid password.");
    if (!confirmarSenha || senha !== confirmarSenha) return alert("Password confirmation does not match.");
    if (!nome || nome.split(" ").length < 2 || nome.split(" ")[0].length < 2 || !nomeRegex.test(nome)) return alert("Nome inválido.");
    if (!cpf || !cpfRegex.test(cpf)) return alert("Fill in the CPF in the correct format.");
    if (!validarCPF(cpf)) return alert("Invalid CPF.");
    if (!nascimento || calcularIdade(nascimento) < 18) return alert("You must be at least 18 years old.");
    if (telefone && !telefoneRegex.test(telefone)) return alert("Invalid phone number.");

    if (!telefone || telefoneRegex.test(telefone)) {
        const usuario = {
            email,
            senha,
            nome,
            cpf,
            nascimento,
            telefone
        };
        localStorage.setItem("usuarioParthenogenesis", JSON.stringify(usuario));
        alert("Registration completed successfully!");
        window.location.href = "signin.html";
        return false;
    }

    alert("Invalid phone number.");
    return false;

  }

  function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  function limparCadastro() {
    document.getElementById("cadastroForm").reset();
    document.getElementById("email").focus();
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }