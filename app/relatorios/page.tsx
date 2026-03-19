import SpecialtyChart, {
  SpecialtyReportData,
} from "./components/SpecialtyChart";
import ConsultationStatusChart, {
  ConsultationStatusData,
} from "./components/ConsultationStatusChart";

async function getSpecialtyReport(): Promise<SpecialtyReportData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const response = await fetch(
    `${baseUrl}/relatorio/consultas-por-especialidade`,
    {
      cache: "no-store", // Sempre busca os dados mais recentes (ideal para relatórios)
    },
  );

  if (!response.ok) {
    throw new Error(
      "Falha ao carregar os dados do relatório de especialidades.",
    );
  }

  return response.json();
}

async function getConsultationStatusReport(): Promise<
  ConsultationStatusData[]
> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const response = await fetch(`${baseUrl}/relatorio/status-consultas`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      "Falha ao carregar os dados do relatório de status das consultas.",
    );
  }

  return response.json();
}

export default async function ReportsPage() {
  const [specialtyData, statusData] = await Promise.all([
    getSpecialtyReport(),
    getConsultationStatusReport(),
  ]);

  return (
    <main className="p-6 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Relatórios Gerenciais
      </h1>

      <div className="flex flex-col gap-8">
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Consultas por Especialidade
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Volume total de atendimentos divididos por área clínica.
          </p>

          <SpecialtyChart data={specialtyData} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Status das Consultas
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Proporção de consultas realizadas, agendadas ou canceladas.
          </p>

          <ConsultationStatusChart data={statusData} />
        </section>
      </div>
    </main>
  );
}
