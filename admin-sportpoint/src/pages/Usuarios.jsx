import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/usuarios/');
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const cambiarRol = async (id_usuario, id_rol) => {
    try {
      await api.put(`/roles/usuario/${id_usuario}?id_rol=${id_rol}`);
      fetchUsuarios();
    } catch (err) {
      alert('Error al cambiar rol');
    }
  };

  const eliminarUsuario = async (id_usuario) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
      await api.delete(`/usuarios/${id_usuario}`);
      fetchUsuarios();
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="page-title">Usuarios</h1>

        {loading && <p style={{ color: '#8b949e' }}>Cargando...</p>}
        {error   && <div className="error-box">{error}</div>}

        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Municipio</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id_usuario}>
                    <td>{u.nomUsu}</td>
                    <td>{u.correo}</td>
                    <td>{u.municipio}</td>
                    <td>
                      <span className={`badge ${u.id_rol === 1 ? 'badge-admin' : 'badge-usuario'}`}>
                        {u.id_rol === 1 ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      {u.id_rol !== 1 ? (
                        <button
                          className="btn-secondary"
                          onClick={() => cambiarRol(u.id_usuario, 1)}
                        >
                          Hacer admin
                        </button>
                      ) : (
                        <button
                          className="btn-secondary"
                          onClick={() => cambiarRol(u.id_usuario, 2)}
                        >
                          Quitar admin
                        </button>
                      )}
                      <button
                        className="btn-danger"
                        onClick={() => eliminarUsuario(u.id_usuario)}
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

export default Usuarios;