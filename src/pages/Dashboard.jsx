import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi';
import { FaStethoscope, FaUsers, FaCalendarDay } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getDashboard, getUltimosAgendamentos, updateConsultaStatus } from '../services/api';
import { formatDateTime, getStatusLabel, getStatusColor } from '../utils/formatters';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [ultimos, setUltimos] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [dash, ags] = await Promise.all([getDashboard(), getUltimosAgendamentos()]);
      setMetrics(dash);
      setUltimos(ags);
    } catch { toast.error('Erro ao carregar dashboard'); }
  };

  useEffect(() => { loadData(); }, []);

  const handleRealizar = async (id) => {
    try {
      await updateConsultaStatus(id, 'REALIZADA');
      toast.success('Consulta marcada como realizada!');
      loadData();
    } catch { toast.error('Erro ao atualizar status'); }
  };

  const hoje = new Date();
  const consultasHoje = ultimos.filter(c => {
    const d = new Date(c.dataConsulta);
    return d.toDateString() === hoje.toDateString() && c.status !== 'REALIZADA' && c.status !== 'CANCELADA';
  });
  const realizadas = ultimos.filter(c => c.status === 'REALIZADA');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Visão geral da clínica – {hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {metrics && (
        <div className="metric-cards">
          <div className="metric-card green">
            <div className="metric-card-header">
              <span className="metric-card-title">Agendamentos do Dia</span>
              <FaCalendarDay className="metric-card-icon" />
            </div>
            <div className="metric-card-value">{metrics.agendamentosHoje}</div>
            <div className="metric-card-subtitle">{consultasHoje.length} pendentes</div>
          </div>
          <div className="metric-card green">
            <div className="metric-card-header">
              <span className="metric-card-title">Total do Mês</span>
              <HiOutlineCalendar className="metric-card-icon" />
            </div>
            <div className="metric-card-value">{metrics.consultasNoMes}</div>
            <div className="metric-card-subtitle">Consultas agendadas</div>
          </div>
          <div className="metric-card purple">
            <div className="metric-card-header">
              <span className="metric-card-title">Médicos Parceiros</span>
              <FaStethoscope className="metric-card-icon" />
            </div>
            <div className="metric-card-value">{metrics.totalMedicos}</div>
            <div className="metric-card-subtitle">Ativos na clínica</div>
          </div>
          <div className="metric-card orange">
            <div className="metric-card-header">
              <span className="metric-card-title">Pacientes</span>
              <FaUsers className="metric-card-icon" />
            </div>
            <div className="metric-card-value">{metrics.totalPacientes}</div>
            <div className="metric-card-subtitle">Cadastrados</div>
          </div>
        </div>
      )}

      <div className="dashboard-panels">
        <div className="card">
          <div className="panel-header">
            <h3><HiOutlineClock /> Próximas Consultas de Hoje</h3>
            <span className="panel-badge green">{consultasHoje.length} agendadas</span>
          </div>
          {consultasHoje.length === 0 ? (
            <div className="empty-state"><p>Nenhuma consulta pendente para hoje</p></div>
          ) : consultasHoje.map(c => (
            <div className="panel-item" key={c.id}>
              <div className="panel-item-info">
                <h4>{c.paciente?.name}</h4>
                <p>{c.medico?.nome} · {new Date(c.dataConsulta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="panel-item-actions">
                <span className="status-badge" style={{ background: '#dbeafe', color: '#3b82f6' }}>{getStatusLabel(c.status)}</span>
                <button className="btn btn-primary btn-sm" onClick={() => handleRealizar(c.id)}>
                  <HiOutlineCheckCircle /> Realizar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="panel-header">
            <h3><HiOutlineCheckCircle style={{ color: 'var(--primary)' }} /> Últimas Consultas Realizadas</h3>
            <span className="panel-badge green">{realizadas.length} recentes</span>
          </div>
          {realizadas.length === 0 ? (
            <div className="empty-state"><p>Nenhuma consulta realizada recentemente</p></div>
          ) : realizadas.slice(0, 5).map(c => (
            <div className="panel-item" key={c.id}>
              <div className="panel-item-info">
                <h4>{c.paciente?.name}</h4>
                <p>{c.medico?.nome} · {formatDateTime(c.dataConsulta)}</p>
              </div>
              <span className="status-badge" style={{ background: '#d1fae5', color: '#059669' }}>{getStatusLabel(c.status)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
