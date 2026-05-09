import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchReservas = async () => {
    try {
      const res = await api.get('/reservas/');
      setReservas(res.data);
    } catch (err) {
      setError('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const eliminarReserva = async (id_reserva) => {
    if (!confirm('¿Seguro que quieres eliminar esta reserva?')) return;
    try {
      await api.delete(`/reservas/${id_reserva}`);
      fetchReservas();
    } catch (err) {
      alert('Error al eliminar reserva');
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="page-title">Reservas</h1>

        {loading && <p style={{ color: '#8b949e' }}>Cargando...</p>}
        {error   && <div className="error-box">{error}</div>}

        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID Reserva</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Usuario</th>
                  <th>Instalación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#8b949e' }}>
                      No hay reservas registradas
                    </td>
                  </tr>
                )}
                {reservas.map((r) => (
                  <tr key={r.id_reserva}>
                    <td>{r.id_reserva}</td>
                    <td>{r.fecha_resIni}</td>
                    <td>{r.fecha_resFin}</td>
                    <td>{r.id_usuario ?? '—'}</td>
                    <td>{r.id_instalacion}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => eliminarReserva(r.id_reserva)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservas;