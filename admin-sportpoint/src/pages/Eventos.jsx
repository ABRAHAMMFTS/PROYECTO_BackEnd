import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchEventos = async () => {
    try {
      const res = await api.get('/eventos/');
      setEventos(res.data);
    } catch (err) {
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const eliminarEvento = async (id_evento) => {
    if (!confirm('¿Seguro que quieres eliminar este evento?')) return;
    try {
      await api.delete(`/eventos/${id_evento}`);
      fetchEventos();
    } catch (err) {
      alert('Error al eliminar evento');
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="page-title">Eventos</h1>

        {loading && <p style={{ color: '#8b949e' }}>Cargando...</p>}
        {error   && <div className="error-box">{error}</div>}

        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Deporte</th>
                  <th>Instalación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#8b949e' }}>
                      No hay eventos registrados
                    </td>
                  </tr>
                )}
                {eventos.map((e) => (
                  <tr key={e.id_evento}>
                    <td>{e.nomEve}</td>
                    <td>{e.fecha_ini}</td>
                    <td>{e.fecha_fin}</td>
                    <td>{e.id_deporte}</td>
                    <td>{e.id_instalacion}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => eliminarEvento(e.id_evento)}
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

export default Eventos;