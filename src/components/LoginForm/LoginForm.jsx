import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-form__title">Iniciar Sesión</h2>
      <p className="login-form__subtitle">Accede a tu cuenta de biblioteca</p>

      {error && <div className="login-form__error">{error}</div>}

      <div className="login-form__group">
        <label htmlFor="email" className="login-form__label">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          className="login-form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
        />
      </div>

      <div className="login-form__group">
        <label htmlFor="password" className="login-form__label">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          className="login-form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="login-form__button"
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <div className="login-form__demo">
        <p className="login-form__demo-title">Credenciales de prueba:</p>
        <p className="login-form__demo-text">Email: admin@biblioteca.com</p>
        <p className="login-form__demo-text">Contraseña: admin123</p>
      </div>
    </form>
  );
};

export default LoginForm;
