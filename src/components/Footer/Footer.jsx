import React from 'react';
import './../../assets/styles/global.css';

const Footer = () => {
  return (
    <footer>
      <div className="contacts">
        <h2>Company's Contact</h2>
        <ul className="direct-contact">
          <li><a href="tel:+558193529488" className="telto">Call +55 81 9352-9488</a></li>
          <li><a href="https://wa.me//5581997508702?text=Olá, Marília, CTO do Parthenogenesis!%20Te%20encontrei%20pelo%20site">Whats App: +55 81 9352-9488</a></li>
          <li><a href="mailto:parthenogenesis@gmail.com">Send Email</a></li>
        </ul>
      </div>

      <div className="payment-info">
        <h2>Payment Methods</h2>
        <div className="payment-methods">
          <img src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/mastercard_2bc6a4921f.png" alt="mastercard" />
          <img src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/PXI_IMAGE_c8e3cdecc4.jpg" alt="pix" />
          <img src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/Visa_e6ac2f5dd8.jpg" alt="visa" />
        </div>
      </div>

      <div className="address">
        <span>2025 © Parthenogenesis · CNPJ 24.988.907/0001-79<br /></span>
        <span>Rua Cícero Dias, 91 · Recife, PE · 52050-150</span>
      </div>
    </footer>
  );
};

export default Footer;