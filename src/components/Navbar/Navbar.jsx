import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'navbar__item--active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">📚</span>
          <span className="navbar__logo-text">Biblioteca Online</span>
        </Link>

        <ul className="navbar__menu">
          <li className="navbar__item">
            <Link to="/" className={`navbar__link ${isActive('/')}`}>
              Inicio
            </Link>
          </li>
          <li className="navbar__item">
            <Link to="/catalogo" className={`navbar__link ${isActive('/catalogo')}`}>
              Catálogo
            </Link>
          </li>
          {isAuthenticated && (
            <li className="navbar__item">
              <Link to="/mis-prestamos" className={`navbar__link ${isActive('/mis-prestamos')}`}>
                Mis Préstamos
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__user">
              <span className="navbar__user-name">{user?.nombre}</span>
              <button onClick={logout} className="navbar__logout">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar__login">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
