import { NavLink } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineTag, HiOutlineChartBar } from 'react-icons/hi';
import { FaStethoscope, FaHeartbeat } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><FaHeartbeat /></div>
        <div>
          <h1>Clínica do <span>Sertão</span></h1>
          <p>Sistema de Gestão Médica</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineViewGrid /> Dashboard
        </NavLink>
        <NavLink to="/medicos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaStethoscope /> Médicos
        </NavLink>
        <NavLink to="/especialidades" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineTag /> Especialidades
        </NavLink>
        <NavLink to="/pacientes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineUsers /> Pacientes
        </NavLink>
        <NavLink to="/agendar" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineClipboardList /> Agendar Consulta
        </NavLink>
        <NavLink to="/agendamentos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineCalendar /> Agendamentos
        </NavLink>
        <NavLink to="/relatorios" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineChartBar /> Relatórios
        </NavLink>
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-label">Atendente</div>
        <div className="sidebar-user-name">Maria da Silva</div>
        <div className="sidebar-user-status">● Online</div>
      </div>
    </aside>
  );
}
