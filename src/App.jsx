import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Medicos from './pages/Medicos';
import Especialidades from './pages/Especialidades';
import Pacientes from './pages/Pacientes';
import AgendarConsulta from './pages/AgendarConsulta';
import Agendamentos from './pages/Agendamentos';
import Relatorios from './pages/Relatorios';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ className: 'toast-custom', duration: 3000 }} />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/especialidades" element={<Especialidades />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/agendar" element={<AgendarConsulta />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
