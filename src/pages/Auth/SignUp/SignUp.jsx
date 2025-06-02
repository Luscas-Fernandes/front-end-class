import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    cpf: '',
    nascimento: '',
    telefone: '',
    estadoCivil: 'solteiro',
    escolaridade: '2º grau completo'
  });

  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarCadastro = () => {
    const { email, password, confirmPassword, name, cpf, nascimento } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!?\/\\|\-_\+=.])[A-Za-z\d@#$%&*!?\/\\|\-_\+=.]{6,}$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (!email || !emailRegex.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    
    if (!password || !senhaRegex.test(password)) {
      setError("Password must contain at least 6 characters, including one uppercase letter, one number, and one special character.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return false;
    }
    
    if (!name || name.split(" ").length < 2 || name.split(" ")[0].length < 2) {
      setError("Please enter your full name.");
      return false;
    }
    
    if (!cpf || !cpfRegex.test(cpf)) {
      setError("Invalid CPF format. Use XXX.XXX.XXX-XX");
      return false;
    }
    
    if (!nascimento || calcularIdade(nascimento) < 18) {
      setError("You must be at least 18 years old.");
      return false;
    }

    return true;
  };

  const calcularIdade = (dataNasc) => {
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validarCadastro()) return;

    try {
      await signup(formData);
      navigate('/gallery');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email (Login):</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <small>
            Password must contain at least 6 characters, including:
            <ul>
              <li>One uppercase letter</li>
              <li>One number</li>
              <li>One special character (@#$%&*!?/\|-_.+=)</li>
            </ul>
          </small>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignUp;