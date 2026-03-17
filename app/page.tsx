interface DashboardData {
  consultasNoMes: number;
  pacientesAtendidosNoMes: number;
  consultasPendentesNoMes: number;
}

interface Agendamento {
  id: number;
  paciente: {
    name: string;
  };
  especialidade: {
    nome: string;
  };
  dataConsulta: string;
}

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/dashboard`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar dados do dashboard");
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
    return null;
  }
}

async function getUltimosAgendamentos(): Promise<Agendamento[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/dashboard/ultimos-agendamentos`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar últimos agendamentos:", error);
    return [];
  }
}

export default async function Home() {
  const [dashboardData, agendamentos] = await Promise.all([
    getDashboardData(),
    getUltimosAgendamentos(),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">
            Dr(a). Médico(a)
          </span>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            D
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">
            Consultas no Mês
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {dashboardData?.consultasNoMes ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">
            Pacientes Atendidos (Mês)
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {dashboardData?.pacientesAtendidosNoMes ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">
            Consultas Pendentes (Mês)
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {dashboardData?.consultasPendentesNoMes ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Próximos Agendamentos
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {agendamentos.length > 0 ? (
            agendamentos.map((agendamento) => {
              const data = new Date(agendamento.dataConsulta);
              return (
                <div
                  key={agendamento.id}
                  className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {agendamento.paciente.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {agendamento.especialidade.nome}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 font-medium text-right">
                    <div>{data.toLocaleDateString("pt-BR")}</div>
                    <div className="text-xs text-gray-500">
                      {data.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-4 text-sm text-gray-500 text-center">
              Nenhum agendamento encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
