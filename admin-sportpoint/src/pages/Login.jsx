import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/main.css';

function Login() {
  const [correo, setCorreo]         = useState('');
  const [contrasenha, setContrasenha] = useState('');
  const [error, setError]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { correo, contrasenha });
      const { access_token, id_rol, nomUsu } = res.data;

      if (id_rol !== 1) {
        setError('No tienes permisos de administrador');
        return;
      }

      localStorage.setItem('token', access_token);
      localStorage.setItem('rol', id_rol);
      localStorage.setItem('nomUsu', nomUsu);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">⚡</div>
        <h1>SportPoint Admin</h1>
        <p className="login-subtitle">Panel de administración</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@sportpoint.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={contrasenha}
              onChange={(e) => setContrasenha(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="error-box">
              ⚠ {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;