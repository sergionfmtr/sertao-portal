import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { FaBookMedical } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getEspecialidades, createEspecialidade, updateEspecialidade, deleteEspecialidade } from '../services/api';

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [nome, setNome] = useState('');

  const loadData = async () => {
    try { setEspecialidades(await getEspecialidades()); } catch { toast.error('Erro ao carregar especialidades'); }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = especialidades.filter(e =>
    !search || e.nome.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setNome(''); setShowModal(true); };
  const openEdit = (e) => { setEditing(e); setNome(e.nome); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateEspecialidade(editing.id, { nome });
        toast.success('Especialidade atualizada com sucesso!');
      } else {
        await createEspecialidade({ nome });
        toast.success('Especialidade cadastrada com sucesso!');
      }
      setShowModal(false);
      loadData();
    } catch (err) { toast.error(err.message || 'Erro ao salvar especialidade'); }
  };

  const handleDelete = async () => {
    try {
      await deleteEspecialidade(confirmDelete.id);
      toast.success('Especialidade excluída com sucesso!');
      setConfirmDelete(null);
      loadData();
    } catch { toast.error('Erro ao excluir. Verifique se a especialidade não está vinculada a médicos.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Especialidades</h2>
          <p>Gerencie as especialidades médicas da clínica</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> Nova Especialidade</button>
      </div>

      <div className="search-bar">
        <HiOutlineSearch />
        <input placeholder="Buscar especialidade..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Lista de Especialidades</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Nome</th><th style={{ width: 120 }}>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Nenhuma especialidade encontrada</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id}>
                  <td style={{ color: 'var(--text-muted)', width: 60 }}>{e.id}</td>
                  <td style={{ fontWeight: 600 }}>{e.nome}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => openEdit(e)} title="Editar"><HiOutlinePencil /></button>
                      <button className="btn-icon danger" onClick={() => setConfirmDelete(e)} title="Excluir"><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Total de especialidades: {filtered.length}</span>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3><FaBookMedical /> {editing ? 'Editar Especialidade' : 'Nova Especialidade'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome da Especialidade <span className="required">*</span></label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Cardiologia, Pediatria, Ortopedia..." required autoFocus />
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
            <p>Deseja realmente excluir a especialidade <strong>{confirmDelete.nome}</strong>?</p>
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
