import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineCalendar, HiOutlineCheckCircle } from 'react-icons/hi';
import { FaStethoscope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getPacientes, searchPacientes, getMedicos, getEspecialidades, createConsulta } from '../services/api';
import { formatCPF, formatPhone, TIME_SLOTS } from '../utils/formatters';

const STEPS = ['Paciente', 'Médico', 'Especialidade', 'Data/Hora', 'Confirmar'];

export default function AgendarConsulta() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    Promise.all([getPacientes(), getMedicos()]).then(([p, m]) => { setPacientes(p); setMedicos(m); }).catch(() => {});
  }, []);

  const handleSearchPaciente = async (q) => {
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      try { setPacientes(await searchPacientes(q)); } catch {}
    } else if (q.trim() === '') {
      try { setPacientes(await getPacientes()); } catch {}
    }
  };

  const medicoEspecialidades = selectedMedico?.especialidades || [];

  const canNext = () => {
    if (step === 0) return !!selectedPaciente;
    if (step === 1) return !!selectedMedico;
    if (step === 2) return !!selectedEspecialidade;
    if (step === 3) return !!selectedDate && !!selectedTime;
    return true;
  };

  const handleConfirm = async () => {
    try {
      const [h, m] = selectedTime.split(':');
      const dataConsulta = `${selectedDate}T${h}:${m}:00`;
      await createConsulta({
        medicoId: selectedMedico.id,
        pacienteId: selectedPaciente.id,
        especialidadeId: selectedEspecialidade.id,
        dataConsulta,
        status: 'AGENDADA',
      });
      toast.success('Consulta agendada com sucesso!');
      navigate('/agendamentos');
    } catch (err) { toast.error(err.message || 'Erro ao agendar consulta'); }
  };

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h2>Agendar Consulta</h2>
          <p>Preencha os dados para agendar uma nova consulta</p>
        </div>
      </div>

      <div className="stepper">
        {STEPS.map((label, i) => (
          <div key={i} className="stepper-step">
            {i > 0 && <div className={`stepper-line ${i <= step ? 'active' : ''}`} />}
            <div className={`stepper-number ${i < step ? 'done' : i === step ? 'active' : ''}`}>{i + 1}</div>
            <span className={`stepper-label ${i === step ? 'active' : ''}`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Step 0: Paciente */}
        {step === 0 && (
          <div className="step-content">
            <div className="step-icon"><HiOutlineUser /></div>
            <div className="step-title">Selecione o Paciente</div>
            <div className="step-subtitle">Busque por CPF ou nome do paciente</div>

            {selectedPaciente ? (
              <div className="selected-card">
                <div>
                  <h4>{selectedPaciente.name}</h4>
                  <p>CPF: {formatCPF(selectedPaciente.cpf)} · Tel: {formatPhone(selectedPaciente.phone)}</p>
                </div>
                <button onClick={() => setSelectedPaciente(null)}>✕</button>
              </div>
            ) : (
              <>
                <div className="search-bar" style={{ marginBottom: 12 }}>
                  <input placeholder="Buscar paciente..." value={searchQuery} onChange={e => handleSearchPaciente(e.target.value)} style={{ paddingLeft: 16 }} />
                </div>
                <div className="selection-list">
                  {pacientes.map(p => (
                    <div key={p.id} className="selection-item" onClick={() => setSelectedPaciente(p)}>
                      <div className="selection-item-info">
                        <h4>{p.name}</h4>
                        <p>CPF: {formatCPF(p.cpf)} · Tel: {formatPhone(p.phone)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="step-actions">
              <div />
              <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(1)}>Próximo</button>
            </div>
          </div>
        )}

        {/* Step 1: Médico */}
        {step === 1 && (
          <div className="step-content">
            <div className="step-icon"><FaStethoscope /></div>
            <div className="step-title">Selecione o Médico</div>
            <div className="step-subtitle">Escolha o médico para a consulta</div>
            <div className="selection-list">
              {medicos.map(m => (
                <div key={m.id} className={`selection-item ${selectedMedico?.id === m.id ? 'selected' : ''}`} onClick={() => { setSelectedMedico(m); setSelectedEspecialidade(null); }}>
                  <input type="radio" checked={selectedMedico?.id === m.id} onChange={() => {}} />
                  <div className="selection-item-info">
                    <h4>{m.nome}</h4>
                    <p>CRM: {m.crm}</p>
                    <div>{m.especialidades?.map(e => <span key={e.id} className="pill">{e.nome}</span>)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(0)}>Voltar</button>
              <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(2)}>Próximo</button>
            </div>
          </div>
        )}

        {/* Step 2: Especialidade */}
        {step === 2 && (
          <div className="step-content">
            <div className="step-icon"><FaStethoscope /></div>
            <div className="step-title">Selecione a Especialidade</div>
            <div className="step-subtitle">Escolha a especialidade da consulta</div>
            <div className="selection-list">
              {medicoEspecialidades.map(e => (
                <div key={e.id} className={`selection-item ${selectedEspecialidade?.id === e.id ? 'selected' : ''}`} onClick={() => setSelectedEspecialidade(e)}>
                  <input type="radio" checked={selectedEspecialidade?.id === e.id} onChange={() => {}} />
                  <div className="selection-item-info"><h4>{e.nome}</h4></div>
                </div>
              ))}
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(1)}>Voltar</button>
              <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(3)}>Próximo</button>
            </div>
          </div>
        )}

        {/* Step 3: Data e Horário */}
        {step === 3 && (
          <div className="step-content">
            <div className="step-icon"><HiOutlineCalendar /></div>
            <div className="step-title">Selecione Data e Horário</div>
            <div className="step-subtitle">Escolha quando será a consulta</div>
            <div style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label>Data <span className="required">*</span></label>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={getTomorrow()} />
              </div>
              <div className="form-group">
                <label>Horário <span className="required">*</span></label>
                <div className="time-grid">
                  {TIME_SLOTS.map(t => (
                    <div key={t} className={`time-slot ${selectedTime === t ? 'selected' : ''}`} onClick={() => setSelectedTime(t)}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(2)}>Voltar</button>
              <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(4)}>Próximo</button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmar */}
        {step === 4 && (
          <div className="step-content">
            <div className="step-icon"><HiOutlineCheckCircle /></div>
            <div className="step-title">Confirmar Agendamento</div>
            <div className="step-subtitle">Revise os dados antes de confirmar</div>
            <div className="confirm-summary">
              <div className="confirm-row"><div className="confirm-label">Paciente</div><div className="confirm-value">{selectedPaciente?.name}</div></div>
              <div className="confirm-row"><div className="confirm-label">CPF</div><div className="confirm-value">{formatCPF(selectedPaciente?.cpf)}</div></div>
              <div className="confirm-row"><div className="confirm-label">Médico</div><div className="confirm-value">{selectedMedico?.nome}</div></div>
              <div className="confirm-row"><div className="confirm-label">CRM</div><div className="confirm-value">{selectedMedico?.crm}</div></div>
              <div className="confirm-row"><div className="confirm-label">Especialidade</div><div className="confirm-value">{selectedEspecialidade?.nome}</div></div>
              <div className="confirm-row"><div className="confirm-label">Data</div><div className="confirm-value">{selectedDate ? new Date(selectedDate + 'T12:00').toLocaleDateString('pt-BR') : ''}</div></div>
              <div className="confirm-row"><div className="confirm-label">Horário</div><div className="confirm-value">{selectedTime}</div></div>
            </div>
            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(3)}>Voltar</button>
              <button className="btn btn-primary" onClick={handleConfirm}><HiOutlineCheckCircle /> Confirmar Agendamento</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
