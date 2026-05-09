import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Eventos from './pages/Eventos';
import Reservas from './pages/Reservas';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protegidas — solo admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/reservas" element={<Reservas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;