import { ManageUsers } from '../components/ManageUsers';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="muted">Sesión iniciada</p>
          <strong>{user?.name}</strong>
          <p className="muted">Rol: {user?.role}</p>
        </div>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      {user?.role === 'ADMIN' ? (
        <ManageUsers />
      ) : (
        <div className="card">
          <h2>Panel de operario</h2>
          <p className="muted">
            Bienvenido. Tu rol es operario, solo tienes acceso a las funciones asignadas por un
            administrador.
          </p>
        </div>
      )}
    </div>
  );
};
