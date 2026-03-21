import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getPacientes, searchPacientes, createPaciente, updatePaciente, deletePaciente } from '../services/api';
import { formatCPF, formatPhone, calculateAge } from '../utils/formatters';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const emptyForm = { name: '', cpf: '', birthDate: '', phone: '', email: '', endereco: { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' } };
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    try { setPacientes(await getPacientes()); } catch { toast.error('Erro ao carregar pacientes'); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.trim().length >= 2) {
      try { setPacientes(await searchPacientes(q)); } catch {}
    } else if (q.trim() === '') {
      try { setPacientes(await getPacientes()); } catch {}
    }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '', cpf: p.cpf || '', birthDate: p.birthDate || '', phone: p.phone || '', email: p.email || '',
      endereco: p.endereco || { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' }
    });
    setShowModal(true);
  };

  const setField = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const setEndereco = (field, value) => setForm(f => ({ ...f, endereco: { ...f.endereco, [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatePaciente(editing.id, form);
        toast.success('Paciente atualizado com sucesso!');
      } else {
        await createPaciente(form);
        toast.success('Paciente cadastrado com sucesso!');
      }
      setShowModal(false);
      loadData();
    } catch (err) { toast.error(err.message || 'Erro ao salvar paciente'); }
  };

  const handleDelete = async () => {
    try {
      await deletePaciente(confirmDelete.id);
      toast.success('Paciente excluído com sucesso!');
      setConfirmDelete(null);
      loadData();
    } catch { toast.error('Erro ao excluir paciente'); }
  };

  const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  return (
    <div>
      <div className="page-header">
        <div><h2>Pacientes</h2><p>Gerencie os pacientes da clínica</p></div>
        <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> Cadastrar Paciente</button>
      </div>

      <div className="search-bar">
        <HiOutlineSearch />
        <input placeholder="Buscar paciente por nome ou CPF..." value={search} onChange={e => handleSearch(e.target.value)} />
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Lista de Pacientes</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Nome</th><th>CPF</th><th>Idade</th><th>Contato</th><th>Ações</th></tr></thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{formatCPF(p.cpf)}</td>
                  <td>{calculateAge(p.birthDate)} anos</td>
                  <td>
                    <div>{formatPhone(p.phone)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.email}</div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => openEdit(p)} title="Editar"><HiOutlinePencil /></button>
                      <button className="btn-icon danger" onClick={() => setConfirmDelete(p)} title="Excluir"><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Total de pacientes: {pacientes.length}</span>
          <span>Exibindo: {pacientes.length}</span>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3><FaUsers /> {editing ? 'Editar Paciente' : 'Cadastrar Paciente'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-section">Informações Pessoais</div>
                <div className="form-group">
                  <label>Nome Completo <span className="required">*</span></label>
                  <input type="text" value={form.name} onChange={e => setField('name', e.target.value)} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CPF <span className="required">*</span></label>
                    <input type="text" value={form.cpf} onChange={e => setField('cpf', e.target.value)} placeholder="000.000.000-00" required />
                  </div>
                  <div className="form-group">
                    <label>Data de Nascimento <span className="required">*</span></label>
                    <input type="date" value={form.birthDate} onChange={e => setField('birthDate', e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="(87) 98888-1111" />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="paciente@email.com" />
                  </div>
                </div>

                <div className="form-section">Endereço</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CEP <span className="required">*</span></label>
                    <input type="text" value={form.endereco.cep} onChange={e => setEndereco('cep', e.target.value)} placeholder="00000-000" required />
                  </div>
                  <div className="form-group">
                    <label>Logradouro <span className="required">*</span></label>
                    <input type="text" value={form.endereco.logradouro} onChange={e => setEndereco('logradouro', e.target.value)} required />
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label>Número</label>
                    <input type="text" value={form.endereco.numero} onChange={e => setEndereco('numero', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Complemento</label>
                    <input type="text" value={form.endereco.complemento} onChange={e => setEndereco('complemento', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Bairro <span className="required">*</span></label>
                    <input type="text" value={form.endereco.bairro} onChange={e => setEndereco('bairro', e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cidade <span className="required">*</span></label>
                    <input type="text" value={form.endereco.cidade} onChange={e => setEndereco('cidade', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Estado (UF) <span className="required">*</span></label>
                    <select value={form.endereco.estado} onChange={e => setEndereco('estado', e.target.value)} required>
                      <option value="">Selecione</option>
                      {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
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
            <p>Deseja realmente excluir o paciente <strong>{confirmDelete.name}</strong>?</p>
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
