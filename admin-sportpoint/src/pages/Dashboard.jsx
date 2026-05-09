import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    eventos: 0,
    reservas: 0,
    equipos: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usuarios, eventos, reservas, equipos] = await Promise.all([
          api.get('/usuarios/'),
          api.get('/eventos/'),
          api.get('/reservas/'),
          api.get('/equipos/'),
        ]);
        setStats({
          usuarios: usuarios.data.length,
          eventos:  eventos.data.length,
          reservas: reservas.data.length,
          equipos:  equipos.data.length,
        });
      } catch (err) {
        console.error('Error cargando estadísticas', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="page-title">Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Usuarios registrados</h3>
            <div className="stat-number">{stats.usuarios}</div>
          </div>
          <div className="stat-card">
            <h3>Eventos activos</h3>
            <div className="stat-number">{stats.eventos}</div>
          </div>
          <div className="stat-card">
            <h3>Reservas</h3>
            <div className="stat-number">{stats.reservas}</div>
          </div>
          <div className="stat-card">
            <h3>Equipos</h3>
            <div className="stat-number">{stats.equipos}</div>
          </div>
        </div>

        <div className="table-container" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', color: '#8b949e', marginBottom: '8px' }}>
            Bienvenido al panel de administración de SportPoint
          </h2>
          <p style={{ fontSize: '14px', color: '#8b949e' }}>
            Usa el menú lateral para gestionar usuarios, eventos y reservas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;