import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate  = useNavigate();
  const nomUsu    = localStorage.getItem('nomUsu');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        ⚡ SportPoint
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">🏠 Dashboard</NavLink>
        <NavLink to="/usuarios">👥 Usuarios</NavLink>
        <NavLink to="/eventos">🏆 Eventos</NavLink>
        <NavLink to="/reservas">📅 Reservas</NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>👤 {nomUsu}</span>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}

export default Sidebar;
