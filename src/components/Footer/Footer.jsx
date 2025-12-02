import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__bottom">
        <p className="footer__copyright">
          © {currentYear} Biblioteca Online. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
