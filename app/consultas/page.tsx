import AppointmentForm from "./AppointmentForm";
import ConsultasList from "./ConsultasList";

interface ConsultasPageProps {
  searchParams: Promise<{
    patientId?: string;
    specialtyId?: string;
    doctorId?: string;
  }>;
}

export default async function ConsultasPage({
  searchParams,
}: ConsultasPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 bg-gray-50 min-h-screen">
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 tracking-tight">
          Consultas Disponíveis
        </h2>
        <ConsultasList searchParams={searchParams} />
      </section>
    </div>
  );
}
