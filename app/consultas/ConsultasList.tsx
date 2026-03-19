import ConsultasActionButtons from "./ConsultasActionButtons";

interface Medico {
  id: number;
  nome: string;
  crm: string;
}

interface Paciente {
  id: number;
  name: string;
}

interface Especialidade {
  id: number;
  nome: string;
}

interface Consulta {
  id: number;
  medico: Medico;
  paciente: Paciente;
  especialidade: Especialidade;
  dataConsulta: string;
  status: string;
}

async function getConsultas(): Promise<Consulta[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/consultas`, {
      cache: "no-store", // Evita cache para garantir que os dados estejam sempre atualizados
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    return [];
  }
}

export default async function ConsultasList() {
  const consultas = await getConsultas();

  if (consultas.length === 0) {
    return (
      <div className="rounded-md border border-gray-100 bg-gray-50 p-8 text-center text-gray-500">
        Nenhuma consulta disponível no momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {consultas.map((consulta) => (
        <div
          key={consulta.id}
          className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Informações da Consulta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Paciente
              </span>
              <span className="block mt-1 text-sm font-medium text-gray-900">
                {consulta.paciente.name}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Médico / Especialidade
              </span>
              <span className="block mt-1 text-sm font-medium text-gray-900">
                {consulta.medico.nome}
              </span>
              <span className="block text-xs text-gray-500">
                {consulta.especialidade.nome}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Data e Hora
              </span>
              <span className="block mt-1 text-sm font-medium text-gray-900">
                {new Date(consulta.dataConsulta).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </span>
              <span
                className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  consulta.status === "AGENDADA"
                    ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    : consulta.status === "REALIZADA"
                      ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                      : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
                }`}
              >
                {consulta.status}
              </span>
            </div>
          </div>

          {/* Ações */}
          <ConsultasActionButtons id={consulta.id} />
        </div>
      ))}
    </div>
  );
}
