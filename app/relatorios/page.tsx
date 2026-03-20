import SpecialtyChart, {
  SpecialtyReportData,
} from "./components/SpecialtyChart";
import ConsultationStatusChart, {
  ConsultationStatusData,
} from "./components/ConsultationStatusChart";
import MonthlyEvolutionChart, {
  MonthlyEvolutionData,
} from "./components/MonthlyEvolutionChart";
import TopDoctorsChart, { TopDoctorsData } from "./components/TopDoctorsChart";
import AgeGroupChart, { AgeGroupData } from "./components/AgeGroupChart";
import ConsultationsByDayOfWeekChart, {
  ConsultationsByDayOfWeekData,
} from "./components/ConsultationsByDayOfWeekChart";

async function getSpecialtyReport(): Promise<SpecialtyReportData[]> {
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

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
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

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

async function getMonthlyEvolutionReport(): Promise<MonthlyEvolutionData[]> {
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

  const response = await fetch(`${baseUrl}/relatorio/evolucao-mensal`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      "Falha ao carregar os dados do relatório de evolução mensal.",
    );
  }

  return response.json();
}

async function getTopDoctorsReport(): Promise<TopDoctorsData[]> {
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

  const response = await fetch(`${baseUrl}/relatorio/top-medicos`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar os dados do relatório de top médicos.");
  }

  return response.json();
}

async function getAgeGroupReport(): Promise<AgeGroupData[]> {
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

  const response = await fetch(
    `${baseUrl}/relatorio/pacientes-por-faixa-etaria`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Falha ao carregar os dados do relatório de faixa etária.");
  }

  return response.json();
}

async function getConsultationsByDayOfWeekReport(): Promise<
  ConsultationsByDayOfWeekData[]
> {
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

  const response = await fetch(
    `${baseUrl}/relatorio/consultas-por-dia-semana`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Falha ao carregar os dados do relatório de consultas por dia da semana.",
    );
  }

  return response.json();
}

export default async function ReportsPage() {
  const [
    specialtyData,
    statusData,
    evolutionData,
    topDoctorsData,
    ageGroupData,
    dayOfWeekData,
  ] = await Promise.all([
    getSpecialtyReport(),
    getConsultationStatusReport(),
    getMonthlyEvolutionReport(),
    getTopDoctorsReport(),
    getAgeGroupReport(),
    getConsultationsByDayOfWeekReport(),
  ]);

  return (
    <main className="p-6 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Relatórios Gerenciais
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700">
            Evolução Mensal
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Acompanhamento do volume de consultas ao longo dos dias do mês.
          </p>

          <MonthlyEvolutionChart data={evolutionData} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Top Médicos</h2>
          <p className="text-sm text-gray-500 mb-4">
            Os médicos com maior volume de atendimentos realizados.
          </p>

          <TopDoctorsChart data={topDoctorsData} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Pacientes por Faixa Etária
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Perfil demográfico dos pacientes atendidos na clínica.
          </p>

          <AgeGroupChart data={ageGroupData} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700">
            Consultas por Dia da Semana
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Média de fluxo de atendimentos por dia útil.
          </p>

          <ConsultationsByDayOfWeekChart data={dayOfWeekData} />
        </section>
      </div>
    </main>
  );
}
