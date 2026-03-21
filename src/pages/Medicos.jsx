import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { FaStethoscope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getMedicos, searchMedicos, createMedico, updateMedico, deleteMedico, getEspecialidades } from '../services/api';

export default function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ nome: '', crm: '', telefone: '', email: '', especialidades: [] });

  const loadData = async () => {
    try {
      const [m, e] = await Promise.all([getMedicos(), getEspecialidades()]);
      setMedicos(m);
      setEspecialidades(e);
    } catch { toast.error('Erro ao carregar médicos'); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.trim().length >= 2) {
      try { setMedicos(await searchMedicos(q)); } catch {}
    } else if (q.trim() === '') {
      try { setMedicos(await getMedicos()); } catch {}
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ nome: '', crm: '', telefone: '', email: '', especialidades: [] });
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({ nome: m.nome, crm: m.crm, telefone: m.telefone || '', email: m.email || '', especialidades: m.especialidades?.map(e => e.id) || [] });
    setShowModal(true);
  };

  const toggleEsp = (id) => {
    setForm(f => ({
      ...f,
      especialidades: f.especialidades.includes(id)
        ? f.especialidades.filter(e => e !== id)
        : [...f.especialidades, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { nome: form.nome, crm: form.crm, telefone: form.telefone, email: form.email, especialidades: form.especialidades };
      if (editing) {
        await updateMedico(editing.id, data);
        toast.success('Médico atualizado com sucesso!');
      } else {
        await createMedico(data);
        toast.success('Médico cadastrado com sucesso!');
      }
      setShowModal(false);
      loadData();
    } catch (err) { toast.error(err.message || 'Erro ao salvar médico'); }
  };

  const handleDelete = async () => {
    try {
      await deleteMedico(confirmDelete.id);
      toast.success('Médico excluído com sucesso!');
      setConfirmDelete(null);
      loadData();
    } catch { toast.error('Erro ao excluir médico'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Médicos</h2>
          <p>Gerencie os médicos parceiros da clínica</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> Cadastrar Médico</button>
      </div>

      <div className="search-bar">
        <HiOutlineSearch />
        <input placeholder="Buscar médico por nome ou CRM..." value={search} onChange={e => handleSearch(e.target.value)} />
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Lista de Médicos</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Nome</th><th>CRM</th><th>Especialidades</th><th>Contato</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {medicos.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.nome}</td>
                  <td>{m.crm}</td>
                  <td>{m.especialidades?.map(e => <span key={e.id} className="pill">{e.nome}</span>)}</td>
                  <td>
                    <div>{m.telefone}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.email}</div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => openEdit(m)} title="Editar"><HiOutlinePencil /></button>
                      <button className="btn-icon danger" onClick={() => setConfirmDelete(m)} title="Excluir"><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Total de médicos: {medicos.length}</span>
          <span>Exibindo: {medicos.length}</span>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FaStethoscope /> {editing ? 'Editar Médico' : 'Cadastrar Médico'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome Completo <span className="required">*</span></label>
                  <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Dr. João Silva" required />
                </div>
                <div className="form-group">
                  <label>CRM <span className="required">*</span></label>
                  <input type="text" value={form.crm} onChange={e => setForm({...form, crm: e.target.value})} placeholder="12345-PE" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone <span className="required">*</span></label>
                    <input type="tel" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(87) 99999-9999" required />
                  </div>
                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="medico@email.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Especialidades <span className="required">*</span></label>
                  <div className="checkbox-list">
                    {especialidades.map(esp => (
                      <div className="checkbox-item" key={esp.id} onClick={() => toggleEsp(esp.id)}>
                        <input type="checkbox" checked={form.especialidades.includes(esp.id)} onChange={() => toggleEsp(esp.id)} />
                        <label>{esp.nome}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Salvar' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente excluir o médico <strong>{confirmDelete.nome}</strong>?</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
