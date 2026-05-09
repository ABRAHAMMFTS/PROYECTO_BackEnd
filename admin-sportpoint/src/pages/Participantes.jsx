import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

function Participantes() {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParticipantes = async () => {
    try {
      const res = await api.get('/participantes/');
      setParticipantes(res.data);
    } catch (err) {
      setError('Error al cargar participantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipantes();
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="page-title">Participantes</h1>

        {loading && <p style={{ color: '#8b949e' }}>Cargando...</p>}
        {error && <div className="error-box">{error}</div>}

        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Evento</th>
                  <th>Usuario</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {participantes.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#8b949e' }}>
                      No hay participantes registrados
                    </td>
                  </tr>
                )}
                {participantes.map((p) => (
                  <tr key={p.id_participante_evento}>
                    <td>{p.id_participante_evento}</td>
                    <td>{p.id_evento}</td>
                    <td>{p.id_usuario}</td>
                    <td>{p.id_equipo ?? '—'}</td>
                    <td>{p.estado}</td>
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

export default Participantes;
