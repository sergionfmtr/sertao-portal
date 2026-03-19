import ConsultasActionButtons from "./ConsultasActionButtons";
import Link from "next/link";

interface Doctor {
  id: number;
  nome: string;
  crm: string;
}

interface Patient {
  id: number;
  name: string;
  cpf: string;
}

interface Specialty {
  id: number;
  nome: string;
}

interface Appointment {
  id: number;
  medico: Doctor;
  paciente: Patient;
  especialidade: Specialty;
  dataConsulta: string;
  status: string;
}

async function getDoctors(): Promise<Doctor[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/medicos`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

async function getSpecialties(): Promise<Specialty[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/especialidades`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return [];
  }
}

async function getPatients(): Promise<Patient[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/pacientes`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
}

async function getAppointments(
  patientId?: string,
  specialtyId?: string,
  doctorId?: string,
): Promise<Appointment[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const url = new URL(`${apiUrl}/consultas`);

    if (patientId) {
      url.searchParams.append("pacienteId", patientId);
    }
    if (specialtyId) {
      url.searchParams.append("especialidadeId", specialtyId);
    }
    if (doctorId) {
      url.searchParams.append("medicoId", doctorId);
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

function getStatusStyles(status: string): string {
  switch (status) {
    case "AGENDADA":
      return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10";
    case "REALIZADA":
      return "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20";
    default:
      return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10";
  }
}

interface AppointmentCardProps {
  appointment: Appointment;
}

function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Paciente
          </span>
          <span className="block mt-1 text-sm font-medium text-gray-900">
            {appointment.paciente.name}
          </span>
        </div>

        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Médico / Especialidade
          </span>
          <span className="block mt-1 text-sm font-medium text-gray-900">
            {appointment.medico.nome}
          </span>
          <span className="block text-xs text-gray-500">
            {appointment.especialidade.nome}
          </span>
        </div>

        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Data e Hora
          </span>
          <span className="block mt-1 text-sm font-medium text-gray-900">
            {new Date(appointment.dataConsulta).toLocaleString("pt-BR", {
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
            className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusStyles(
              appointment.status,
            )}`}
          >
            {appointment.status}
          </span>
        </div>
      </div>

      <ConsultasActionButtons id={appointment.id} />
    </div>
  );
}

interface ConsultasListProps {
  patientId?: string;
  searchParams?:
    | Promise<{ patientId?: string; specialtyId?: string; doctorId?: string }>
    | { patientId?: string; specialtyId?: string; doctorId?: string };
}

export default async function ConsultasList({
  patientId,
  searchParams,
}: ConsultasListProps) {
  // Next.js 15: searchParams é uma Promise e deve ser resolvida (seguro também para Next.js 14)
  const resolvedSearchParams = await searchParams;

  const resolvedPatientId = patientId || resolvedSearchParams?.patientId;
  const resolvedSpecialtyId = resolvedSearchParams?.specialtyId;
  const resolvedDoctorId = resolvedSearchParams?.doctorId;

  const [appointments, doctors, specialties, patients] = await Promise.all([
    getAppointments(resolvedPatientId, resolvedSpecialtyId, resolvedDoctorId),
    getDoctors(),
    getSpecialties(),
    getPatients(),
  ]);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <form
        key={`${resolvedPatientId || ""}-${resolvedSpecialtyId || ""}-${resolvedDoctorId || ""}`}
        method="GET"
        action="/consultas"
        className="flex flex-col sm:flex-row gap-4 items-end"
      >
        {/* Combobox de Pacientes */}
        <div className="flex flex-col w-full max-w-sm">
          <label
            htmlFor="patientId"
            className="mb-1 text-sm font-semibold text-gray-700"
          >
            Paciente
          </label>
          <select
            id="patientId"
            name="patientId"
            defaultValue={resolvedPatientId}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
          >
            <option value="">Selecione um paciente...</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} - {patient.cpf}
              </option>
            ))}
          </select>
        </div>

        {/* Combobox de Especialidades */}
        <div className="flex flex-col w-full max-w-sm">
          <label
            htmlFor="specialtyId"
            className="mb-1 text-sm font-semibold text-gray-700"
          >
            Especialidade
          </label>
          <select
            id="specialtyId"
            name="specialtyId"
            defaultValue={resolvedSpecialtyId}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
          >
            <option value="">Selecione uma especialidade...</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Combobox de Médicos */}
        <div className="flex flex-col w-full max-w-sm">
          <label
            htmlFor="doctorId"
            className="mb-1 text-sm font-semibold text-gray-700"
          >
            Médico
          </label>
          <select
            id="doctorId"
            name="doctorId"
            defaultValue={resolvedDoctorId}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
          >
            <option value="">Selecione um médico...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.nome} - {doctor.crm}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full flex-row gap-2 sm:w-auto">
          <button
            type="submit"
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:flex-none"
          >
            Filtrar
          </button>
          <Link
            href="/consultas"
            className="flex-1 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:flex-none"
          >
            Limpar
          </Link>
        </div>
      </form>

      {appointments.length === 0 ? (
        <div className="rounded-md border border-gray-100 bg-gray-50 p-8 text-center text-gray-500">
          Nenhuma consulta disponível no momento.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
