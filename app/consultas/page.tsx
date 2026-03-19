import AppointmentForm from "./AppointmentForm";
import ConsultasList from "./ConsultasList";
import ConsultasCadastro from "./ConsultasCadastro";

interface ConsultasPageProps {
  searchParams: Promise<{
    patientId?: string;
    specialtyId?: string;
    doctorId?: string;
    action?: string;
    id?: string;
  }>;
}

export default async function ConsultasPage({
  searchParams,
}: ConsultasPageProps) {
  const resolvedSearchParams = await searchParams;
  const isNewAppointment = resolvedSearchParams?.action === "new";
  const isEditAppointment = resolvedSearchParams?.action === "edit";
  const isFormActive = isNewAppointment || isEditAppointment;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 bg-gray-50 min-h-screen">
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 tracking-tight">
          {isNewAppointment
            ? "Nova Consulta"
            : isEditAppointment
              ? "Editar Consulta"
              : "Consultas Disponíveis"}
        </h2>
        {isFormActive ? (
          <ConsultasCadastro
            specialtyId={resolvedSearchParams?.specialtyId}
            appointmentId={resolvedSearchParams?.id}
          />
        ) : (
          <ConsultasList searchParams={searchParams} />
        )}
      </section>
    </div>
  );
}
