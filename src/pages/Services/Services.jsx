import React, { useState, useEffect } from 'react';
import './Services.css';

const Services = () => {
  const [serviceType, setServiceType] = useState('');
  const [requests, setRequests] = useState([]);
  const [requestCounter, setRequestCounter] = useState(0);

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    if (!user) {
      // Handle redirect if needed
    }
  }, []);

  const handleAddRequest = () => {
    if (!serviceType) return;
    
    const today = new Date();
    const newRequest = {
      date: formatDate(today),
      number: `2023-${String(requestCounter + 1).padStart(3, '0')}`,
      service: serviceData[serviceType].description,
      status: 'EM ELABORAÇÃO',
      price: serviceData[serviceType].price,
      deadline: calculateDeadline(serviceData[serviceType].deadline)
    };
    
    setRequests([newRequest, ...requests]);
    setRequestCounter(prev => prev + 1);
    setServiceType('');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const calculateDeadline = (deadline) => {
    const today = new Date();
    const days = parseInt(deadline);
    if (!isNaN(days)) {
      today.setDate(today.getDate() + days);
      return formatDate(today);
    }
    return deadline;
  };

  return (
    <main className="services-main">
      <div className="container">
        <h1>Service Cart</h1>
        
        <section className="user-section">
          <h2>User Information</h2>
          <div className="user-info">
            <div className="info-label">
              <span>Name:</span>
              <span id="user-name">User Name</span>
            </div>
            <div className="info-label">
              <span>Email:</span>
              <span id="user-email">user@example.com</span>
            </div>
          </div>
        </section>
        
        <section className="new-request-section">
          <h2>New Service Request</h2>
          <div className="service-form">
            <div className="form-group">
              <div className="form-control">
                <label htmlFor="service-type">Service:</label>
                <select 
                  id="service-type"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                >
                  <option value="">Select a service...</option>
                  {Object.keys(serviceData).map(key => (
                    <option key={key} value={key}>{serviceData[key].description}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <div className="form-control">
                <label>Price:</label>
                <div className="info-value">
                  {serviceType ? serviceData[serviceType].price : 'Select a service'}
                </div>
              </div>
              <div className="form-control">
                <label>Deadline:</label>
                <div className="info-value">
                  {serviceType ? serviceData[serviceType].deadline : 'Select a service'}
                </div>
              </div>
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={handleAddRequest}
              disabled={!serviceType}
            >
              Add Request
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Services;