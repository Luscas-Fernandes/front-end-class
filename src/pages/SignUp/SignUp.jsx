import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './SignUp.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    cpf: '',
    nascimento: '',
    telefone: '',
    estadoCivil: 'solteiro',
    escolaridade: '2º grau completo'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  };

  const calcularIdade = (dataNasc) => {
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  };

  const validarCadastro = (e) => {
    e.preventDefault();
    
    const { email, senha, confirmarSenha, nome, cpf, nascimento, telefone } = formData;
    
    // Validações
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!?\/\\|\-_\+=.])[A-Za-z\d@#$%&*!?\/\\|\-_\+=.]{6,}$/;
    const senhaInvalidChars = /[¨{}[\]´`~^:;<>,“‘]/;
    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

    if (!email || !emailRegex.test(email)) {
      alert("Informe um endereço de e-mail válido.");
      return;
    }

    if (!senha || !senhaRegex.test(senha) || senhaInvalidChars.test(senha)) {
      alert("Senha inválida. Deve conter pelo menos 6 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.");
      return;
    }

    if (!confirmarSenha || senha !== confirmarSenha) {
      alert("Confirmação de senha não coincide.");
      return;
    }

    if (!nome || nome.split(" ").length < 2 || nome.split(" ")[0].length < 2 || !nomeRegex.test(nome)) {
      alert("Nome inválido. Deve conter nome e sobrenome.");
      return;
    }

    if (!cpf || !cpfRegex.test(cpf)) {
      alert("Preencha o CPF no formato correto: 000.000.000-00");
      return;
    }

    if (!validarCPF(cpf)) {
      alert("CPF inválido.");
      return;
    }

    if (!nascimento || calcularIdade(nascimento) < 18) {
      alert("Você deve ter pelo menos 18 anos.");
      return;
    }

    if (telefone && !telefoneRegex.test(telefone)) {
      alert("Número de telefone inválido. Use o formato (00) 00000-0000");
      return;
    }

    const usuario = {
      email,
      senha,
      nome,
      cpf,
      nascimento,
      telefone: telefone || '',
      estadoCivil: formData.estadoCivil,
      escolaridade: formData.escolaridade
    };
    
    localStorage.setItem("usuarioParthenogenesis", JSON.stringify(usuario));
    alert("Cadastro realizado com sucesso!");
    navigate("/signin");
  };

  const limparCadastro = () => {
    setFormData({
      email: '',
      senha: '',
      confirmarSenha: '',
      nome: '',
      cpf: '',
      nascimento: '',
      telefone: '',
      estadoCivil: 'solteiro',
      escolaridade: '2º grau completo'
    });
  };

  return (
    <>
      <Header />
      <main className="signup-page">
        <div className="signup-container">
          <h2 className="cadastro-title">Cadastro de clientes</h2>
          
          <form className="cadastro-form" onSubmit={validarCadastro}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">E-mail (Login):</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha:</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="password-requirements">
              <p>Requisitos da senha:</p>
              <ul>
                <li>Mínimo 6 caracteres</li>
                <li>Pelo menos 1 letra maiúscula</li>
                <li>Pelo menos 1 número</li>
                <li>Pelo menos 1 caractere especial: @#$%&*!?/\|-_.=+</li>
              </ul>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cpf">CPF:</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nascimento">Data de Nascimento:</label>
                <input
                  type="date"
                  id="nascimento"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone (opcional):</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Estado Civil:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="solteiro"
                    checked={formData.estadoCivil === 'solteiro'}
                    onChange={handleChange}
                  />
                  Solteiro(a)
                </label>
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="casado"
                    checked={formData.estadoCivil === 'casado'}
                    onChange={handleChange}
                  />
                  Casado(a)
                </label>
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="divorciado"
                    checked={formData.estadoCivil === 'divorciado'}
                    onChange={handleChange}
                  />
                  Divorciado(a)
                </label>
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="viuvo"
                    checked={formData.estadoCivil === 'viuvo'}
                    onChange={handleChange}
                  />
                  Viúvo(a)
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="escolaridade">Escolaridade:</label>
              <select
                id="escolaridade"
                name="escolaridade"
                value={formData.escolaridade}
                onChange={handleChange}
              >
                <option value="1º grau incompleto">1º grau incompleto</option>
                <option value="1º grau completo">1º grau completo</option>
                <option value="2º grau completo">2º grau completo</option>
                <option value="Nível superior">Nível superior</option>
                <option value="Pós-graduado">Pós-graduado</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">Incluir</button>
              <button type="button" className="btn-clear" onClick={limparCadastro}>Limpar</button>
              <button type="button" className="btn-back" onClick={() => navigate(-1)}>Voltar</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}