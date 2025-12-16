import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isAuthenticated, hydrated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, evitar mostrar el login.
  if (hydrated && isAuthenticated) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('Correo o contraseña incorrectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page centered">
      <div className="card" style={{ maxWidth: 420 }}>
        <h1>Acceso</h1>
        <p className="muted">Ingresa con tu usuario y contraseña</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            <span>Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@empresa.com"
            />
          </label>
          <label>
            <span>Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};
