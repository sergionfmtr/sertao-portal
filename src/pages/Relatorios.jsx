import { useState, useEffect } from 'react';
import { HiOutlineChartBar, HiOutlineRefresh } from 'react-icons/hi';
import { FaChartPie, FaChartLine, FaUserMd, FaUsers, FaCalendarWeek } from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  getConsultasPorEspecialidade,
  getStatusConsultas,
  getEvolucaoMensal,
  getTopMedicos,
  getPacientesPorFaixaEtaria,
  getConsultasPorDiaSemana,
} from '../services/api';
import { getStatusLabel } from '../utils/formatters';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4'];
const STATUS_COLORS = { AGENDADA: '#3b82f6', CONFIRMADA: '#10b981', EM_ATENDIMENTO: '#f59e0b', REALIZADA: '#059669', CANCELADA: '#ef4444' };

function BarChart({ data, colorMap }) {
  if (!data || data.length === 0) return <div className="empty-state"><p>Sem dados disponíveis</p></div>;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 130, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.label}>
            {colorMap ? getStatusLabel(item.label) : item.label}
          </div>
          <div style={{ flex: 1, height: 28, background: 'var(--border-light)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: `${(item.value / maxVal) * 100}%`, height: '100%',
              background: colorMap ? (colorMap[item.label] || COLORS[i % COLORS.length]) : COLORS[i % COLORS.length],
              borderRadius: 6, transition: 'width 0.6s ease',
              minWidth: item.value > 0 ? 24 : 0,
            }} />
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, colorMap }) {
  if (!data || data.length === 0) return <div className="empty-state"><p>Sem dados disponíveis</p></div>;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="empty-state"><p>Sem dados disponíveis</p></div>;
  let cumPercent = 0;
  const segments = data.map((item, i) => {
    const percent = (item.value / total) * 100;
    const startPercent = cumPercent;
    cumPercent += percent;
    return { ...item, percent, startPercent, color: colorMap ? (colorMap[item.label] || COLORS[i]) : COLORS[i] };
  });
  const gradientParts = segments.map(s => `${s.color} ${s.startPercent}% ${s.startPercent + s.percent}%`);
  const gradient = `conic-gradient(${gradientParts.join(', ')})`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
      <div style={{
        width: 160, height: 160, borderRadius: '50%', background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{total}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>{colorMap ? getStatusLabel(s.label) : s.label}</span>
            <span style={{ fontWeight: 700, marginLeft: 'auto' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data }) {
  if (!data || data.length === 0) return <div className="empty-state"><p>Sem dados disponíveis</p></div>;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const width = Math.max(data.length * 28, 600);
  const h = 180;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1 || 1)) * (width - 40) + 20,
    y: h - 20 - ((d.value / maxVal) * (h - 40)),
    ...d,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L ${points[points.length - 1].x} ${h - 20} L ${points[0].x} ${h - 20} Z`;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={width} height={h + 20} style={{ display: 'block' }}>
        <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.3" /><stop offset="100%" stopColor="#10b981" stopOpacity="0.02" /></linearGradient></defs>
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const y = h - 20 - f * (h - 40);
          return <line key={f} x1={20} y1={y} x2={width - 20} y2={y} stroke="var(--border)" strokeDasharray="4" />;
        })}
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="#10b981" stroke="white" strokeWidth={2} />
            {i % 3 === 0 && (
              <text x={p.x} y={h + 12} textAnchor="middle" fontSize={10} fill="var(--text-muted)">{p.label}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Relatorios() {
  const [porEspecialidade, setPorEspecialidade] = useState([]);
  const [statusConsultas, setStatusConsultas] = useState([]);
  const [evolucao, setEvolucao] = useState([]);
  const [topMedicos, setTopMedicos] = useState([]);
  const [faixaEtaria, setFaixaEtaria] = useState([]);
  const [porDiaSemana, setPorDiaSemana] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [esp, stat, evol, top, faixa, dia] = await Promise.all([
        getConsultasPorEspecialidade(),
        getStatusConsultas(),
        getEvolucaoMensal(),
        getTopMedicos(),
        getPacientesPorFaixaEtaria(),
        getConsultasPorDiaSemana(),
      ]);
      setPorEspecialidade(esp);
      setStatusConsultas(stat);
      setEvolucao(evol);
      setTopMedicos(top);
      setFaixaEtaria(faixa);
      setPorDiaSemana(dia);
    } catch { toast.error('Erro ao carregar relatórios'); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Relatórios & Gráficos</h2>
          <p>Análises e estatísticas da clínica</p>
        </div>
        <button className="btn btn-outline" onClick={loadData} disabled={loading}>
          <HiOutlineRefresh style={loading ? { animation: 'spin 1s linear infinite' } : {}} /> Atualizar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Consultas por Especialidade */}
        <div className="card">
          <div className="panel-header">
            <h3><HiOutlineChartBar style={{ color: 'var(--primary)' }} /> Consultas por Especialidade</h3>
          </div>
          <BarChart data={porEspecialidade} />
        </div>

        {/* Status das Consultas */}
        <div className="card">
          <div className="panel-header">
            <h3><FaChartPie style={{ color: 'var(--secondary)' }} /> Status das Consultas</h3>
          </div>
          <DonutChart data={statusConsultas} colorMap={STATUS_COLORS} />
        </div>
      </div>

      {/* Evolução Mensal */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="panel-header">
          <h3><FaChartLine style={{ color: 'var(--primary)' }} /> Evolução Mensal de Consultas</h3>
          <span className="panel-badge green">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
        </div>
        <LineChart data={evolucao} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Top Médicos */}
        <div className="card">
          <div className="panel-header">
            <h3><FaUserMd style={{ color: 'var(--orange)' }} /> Top Médicos</h3>
          </div>
          <BarChart data={topMedicos} />
        </div>

        {/* Faixa Etária */}
        <div className="card">
          <div className="panel-header">
            <h3><FaUsers style={{ color: 'var(--info)' }} /> Pacientes por Faixa Etária</h3>
          </div>
          <DonutChart data={faixaEtaria} />
        </div>

        {/* Consultas por Dia da Semana */}
        <div className="card">
          <div className="panel-header">
            <h3><FaCalendarWeek style={{ color: 'var(--secondary)' }} /> Consultas por Dia da Semana</h3>
          </div>
          <BarChart data={porDiaSemana} />
        </div>
      </div>
    </div>
  );
}
