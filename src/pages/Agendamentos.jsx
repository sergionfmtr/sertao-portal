import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getConsultas, updateConsultaStatus, deleteConsulta } from '../services/api';
import { formatDateTime, getStatusLabel, getStatusColor } from '../utils/formatters';

export default function Agendamentos() {
  const [consultas, setConsultas] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const loadData = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const data = await getConsultas(params);
      setConsultas(data);
    } catch { toast.error('Erro ao carregar agendamentos'); }
  };

  useEffect(() => { loadData(); }, [filterStatus]);

  const filtered = consultas.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.paciente?.name?.toLowerCase().includes(q) || c.medico?.nome?.toLowerCase().includes(q) || c.especialidade?.nome?.toLowerCase().includes(q));
  });

  const handleStatusChange = async (id, status) => {
    try {
      await updateConsultaStatus(id, status);
      toast.success(`Status atualizado para ${getStatusLabel(status)}!`);
      loadData();
    } catch { toast.error('Erro ao atualizar status'); }
  };

  const handleCancel = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'cancel') {
        await updateConsultaStatus(confirmAction.id, 'CANCELADA');
        toast.success('Consulta cancelada!');
      } else if (confirmAction.type === 'delete') {
        await deleteConsulta(confirmAction.id);
        toast.success('Consulta excluída!');
      }
      setConfirmAction(null);
      loadData();
    } catch { toast.error('Erro na operação'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Agendamentos</h2><p>Visualize e gerencie todas as consultas agendadas</p></div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <HiOutlineSearch />
          <input placeholder="Buscar por paciente, médico ou especialidade..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, fontFamily: 'inherit', background: 'white', minWidth: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="AGENDADA">Agendado</option>
          <option value="CONFIRMADA">Confirmado</option>
          <option value="EM_ATENDIMENTO">Em Atendimento</option>
          <option value="REALIZADA">Realizado</option>
          <option value="CANCELADA">Cancelado</option>
        </select>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <HiOutlineCalendar /> Lista de Agendamentos
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Paciente</th><th>Médico</th><th>Especialidade</th><th>Data / Hora</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Nenhum agendamento encontrado</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.paciente?.name || '—'}</td>
                  <td>{c.medico?.nome || '—'}</td>
                  <td><span className="pill">{c.especialidade?.nome || '—'}</span></td>
                  <td>{formatDateTime(c.dataConsulta)}</td>
                  <td>
                    <span className="status-badge" style={{ background: getStatusColor(c.status) + '22', color: getStatusColor(c.status) }}>
                      {getStatusLabel(c.status)}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ gap: 4 }}>
                      {c.status === 'AGENDADA' && (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(c.id, 'CONFIRMADA')} title="Confirmar">Confirmar</button>
                          <button className="btn btn-sm" style={{ background: '#ef4444', color: 'white' }} onClick={() => setConfirmAction({ type: 'cancel', id: c.id, name: c.paciente?.name })} title="Cancelar">Cancelar</button>
                        </>
                      )}
                      {c.status === 'CONFIRMADA' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(c.id, 'REALIZADA')} title="Realizar">Realizar</button>
                      )}
                      {(c.status === 'CANCELADA' || c.status === 'REALIZADA') && (
                        <button className="btn-icon danger" onClick={() => setConfirmAction({ type: 'delete', id: c.id, name: c.paciente?.name })} title="Excluir"><HiOutlineTrash /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Total de agendamentos: {filtered.length}</span>
        </div>
      </div>

      {confirmAction && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>{confirmAction.type === 'cancel' ? 'Cancelar Consulta' : 'Excluir Consulta'}</h3>
            <p>Deseja realmente {confirmAction.type === 'cancel' ? 'cancelar' : 'excluir'} a consulta de <strong>{confirmAction.name}</strong>?</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={() => setConfirmAction(null)}>Voltar</button>
              <button className="btn btn-danger" onClick={handleCancel}>{confirmAction.type === 'cancel' ? 'Cancelar Consulta' : 'Excluir'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
