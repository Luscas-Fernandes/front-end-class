import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { verifyAuth } from '../../utils/auth';
import './Services.css';

const serviceData = {
  professor: {
    price: 'R$ 100,00/hora',
    deadline: '2 dias',
    description: 'Oferecer-se como Professor'
  },
  aluno: {
    price: 'R$ 125,00/hora', 
    deadline: '3 dias',
    description: 'Oferecer-se como Aluno'
  },
  oferecer_consultoria: {
    price: 'R$ 200,00/hora',
    deadline: '1 dia',
    description: 'Oferecer Consultoria'
  },
  receber_consultoria: {
    price: 'R$ 150,00/hora',
    deadline: '1 dia',
    description: 'Receber Consultoria'
  }
};

export default function Services() {
  const [requests, setRequests] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!verifyAuth()) {
      navigate('/signin');
    }
  }, [navigate]);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  const calculateServiceDate = (deadline) => {
    const today = new Date();
    const days = parseInt(deadline);
    if (!isNaN(days)) {
      today.setDate(today.getDate() + days);
      return formatDate(today);
    }
    return deadline;
  };

  const addRequest = () => {
    if (!selectedService) {
      alert('Por favor, selecione um serviço.');
      return;
    }
    
    const newRequest = {
      date: formatDate(new Date()),
      number: `2023-${(requests.length + 1).toString().padStart(3, '0')}`,
      description: serviceData[selectedService].description,
      status: 'EM ELABORAÇÃO',
      price: serviceData[selectedService].price,
      expectedDate: calculateServiceDate(serviceData[selectedService].deadline)
    };
    
    setRequests([newRequest, ...requests]);
    setSelectedService('');
  };

  const deleteRequest = (index) => {
    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
      const newRequests = [...requests];
      newRequests.splice(index, 1);
      setRequests(newRequests);
    }
  };

  const user = verifyAuth();

  return (
    <>
      <Header />
      <main className="services-page">
        <div className="container">
          <h1>Carrinho de Serviços de TI</h1>
          
          <section className="user-section">
            <h2>Informações do Usuário</h2>
            <div className="user-info">
              <div className="info-field">
                <span className="info-label">Nome:</span>
                <span className="info-value">{user?.nome || ''}</span>
              </div>
              <div className="info-field">
                <span className="info-label">E-mail:</span>
                <span className="info-value">{user?.email || ''}</span>
              </div>
            </div>
          </section>
          
          <section className="requests-section">
            <h2>Minhas Solicitações</h2>
            <div className="table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Data do Pedido</th>
                    <th>Nº Solicitação</th>
                    <th>Serviço de TI</th>
                    <th>Status</th>
                    <th>Preço</th>
                    <th>Data Prevista</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.date}</td>
                      <td>{request.number}</td>
                      <td>{request.description}</td>
                      <td>
                        <span className={`status status-${request.status.toLowerCase().replace(' ', '-')}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{request.price}</td>
                      <td>{request.expectedDate}</td>
                      <td>
                        <button 
                          className="btn btn-danger"
                          onClick={() => deleteRequest(index)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan="7" className="no-requests">Nenhuma solicitação encontrada</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          
          <section className="new-request-section">
            <h2>Nova Solicitação de Serviço</h2>
            <div className="service-form">
              <div className="form-group">
                <div className="form-control">
                  <label htmlFor="service-type">Serviço de TI:</label>
                  <select 
                    id="service-type"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Selecione um serviço...</option>
                    <option value="professor">Oferecer-se como Professor</option>
                    <option value="aluno">Oferecer-se como Aluno</option>
                    <option value="oferecer_consultoria">Oferecer Consultoria</option>
                    <option value="receber_consultoria">Receber Consultoria</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-control">
                  <label>Preço:</label>
                  <div className="info-display">
                    {selectedService ? serviceData[selectedService].price : 'Selecione um serviço'}
                  </div>
                </div>
                <div className="form-control">
                  <label>Prazo de Atendimento:</label>
                  <div className="info-display">
                    {selectedService ? serviceData[selectedService].deadline : 'Selecione um serviço'}
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-control">
                  <label>Data Prevista de Atendimento:</label>
                  <div className="info-display">
                    {selectedService ? calculateServiceDate(serviceData[selectedService].deadline) : 'Selecione um serviço'}
                  </div>
                </div>
                <div className="form-control">
                  <label>Status:</label>
                  <div className="info-display status status-draft">
                    EM ELABORAÇÃO
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={addRequest}
                >
                  Incluir Solicitação
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}