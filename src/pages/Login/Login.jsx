import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/mis-prestamos');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login">
      <div className="login__container">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
