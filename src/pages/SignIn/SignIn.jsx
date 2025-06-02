import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './SignIn.css';

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const user = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    
    if (!user) {
      alert('Nenhum usuário cadastrado encontrado. Por favor, cadastre-se primeiro.');
      return;
    }
    
    if (email === user.email && password === user.senha) {
      localStorage.setItem('usuarioParthenogenesis', JSON.stringify(user));
      navigate('/gallery');
    } else {
      alert('E-mail ou senha incorretos.');
    }
  };

  return (
    <>
      <Header />
      <main className="signin-page">
        <div className="signin-container">
          <h2>Sign In</h2>
          
          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="signin-btn">Sign In</button>
          </form>
          
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}