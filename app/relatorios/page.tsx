import SpecialtyChart, {
  SpecialtyReportData,
} from "./components/SpecialtyChart";

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

export default async function ReportsPage() {
  const specialtyData = await getSpecialtyReport();

  return (
    <main className="p-6 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Relatórios Gerenciais
      </h1>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">
          Consultas por Especialidade
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Volume total de atendimentos divididos por área clínica.
        </p>

        <SpecialtyChart data={specialtyData} />
      </section>
    </main>
  );
}
