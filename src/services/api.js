const API_BASE = 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text().catch(() => 'Erro desconhecido');
    throw new Error(error);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Dashboard
export const getDashboard = () => request('/dashboard');
export const getUltimosAgendamentos = () => request('/dashboard/ultimos-agendamentos');

// Especialidades
export const getEspecialidades = () => request('/especialidades');
export const getEspecialidadeById = (id) => request(`/especialidades/${id}`);
export const createEspecialidade = (data) => request('/especialidades', { method: 'POST', body: JSON.stringify(data) });
export const updateEspecialidade = (id, data) => request(`/especialidades/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEspecialidade = (id) => request(`/especialidades/${id}`, { method: 'DELETE' });

// Relatórios
export const getConsultasPorEspecialidade = () => request('/relatorio/consultas-por-especialidade');
export const getStatusConsultas = () => request('/relatorio/status-consultas');
export const getEvolucaoMensal = () => request('/relatorio/evolucao-mensal');
export const getTopMedicos = () => request('/relatorio/top-medicos');
export const getPacientesPorFaixaEtaria = () => request('/relatorio/pacientes-por-faixa-etaria');
export const getConsultasPorDiaSemana = () => request('/relatorio/consultas-por-dia-semana');

// Médicos
export const getMedicos = () => request('/medicos');
export const getMedicoById = (id) => request(`/medicos/${id}`);
export const searchMedicos = (q) => request(`/medicos/busca?q=${encodeURIComponent(q)}`);
export const getMedicosByEspecialidade = (id) => request(`/medicos/especialidade/${id}`);
export const createMedico = (data) => request('/medicos', { method: 'POST', body: JSON.stringify(data) });
export const updateMedico = (id, data) => request(`/medicos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMedico = (id) => request(`/medicos/${id}`, { method: 'DELETE' });

// Pacientes
export const getPacientes = () => request('/pacientes');
export const getPacienteById = (id) => request(`/pacientes/${id}`);
export const searchPacientes = (q) => request(`/pacientes/busca?q=${encodeURIComponent(q)}`);
export const createPaciente = (data) => request('/pacientes', { method: 'POST', body: JSON.stringify(data) });
export const updatePaciente = (id, data) => request(`/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePaciente = (id) => request(`/pacientes/${id}`, { method: 'DELETE' });

// Consultas
export const getConsultas = (params = {}) => {
  const query = Object.entries(params).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  return request(`/consultas${query ? '?' + query : ''}`);
};
export const getConsultaById = (id) => request(`/consultas/${id}`);
export const createConsulta = (data) => request('/consultas', { method: 'POST', body: JSON.stringify(data) });
export const updateConsulta = (id, data) => request(`/consultas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteConsulta = (id) => request(`/consultas/${id}`, { method: 'DELETE' });
export const updateConsultaStatus = (id, status) => request(`/consultas/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
