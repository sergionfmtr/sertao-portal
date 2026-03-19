import Link from "next/link";
import SpecialtySelect from "./SpecialtySelect";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface Patient {
  id: number;
  name: string;
  cpf: string;
}

interface Specialty {
  id: number;
  nome: string;
}

interface Doctor {
  id: number;
  nome: string;
  crm: string;
}

interface Appointment {
  id: number;
  medico: Doctor;
  paciente: Patient;
  especialidade: Specialty;
  dataConsulta: string;
  status: string;
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

async function getDoctors(specialtyId?: string): Promise<Doctor[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const url = specialtyId
      ? `${apiUrl}/medicos/especialidade/${specialtyId}`
      : `${apiUrl}/medicos`;
    const response = await fetch(url, {
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

async function getAppointment(id?: string): Promise<Appointment | null> {
  if (!id) return null;
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/consultas/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error);
    return null;
  }
}

async function saveAppointmentAction(formData: FormData) {
  "use server";

  const idconsulta = formData.get("idconsulta");
  const patientId = formData.get("patientId");
  const specialtyId = formData.get("specialtyId");
  const doctorId = formData.get("doctorId");
  const appointmentDate = formData.get("appointmentDate");

  if (!patientId || !specialtyId || !doctorId || !appointmentDate) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const dateStr = appointmentDate.toString();
  // O input datetime-local gera o formato "YYYY-MM-DDTHH:mm".
  // Adicionamos os segundos (":00") para garantir conformidade com o formato esperado pela API.
  const formattedDate = dateStr.length === 16 ? `${dateStr}:00` : dateStr;

  const payload = {
    medicoId: Number(doctorId),
    pacienteId: Number(patientId),
    especialidadeId: Number(specialtyId),
    dataConsulta: formattedDate,
    status: "AGENDADA",
  };

  const apiUrl = process.env.API_URL || "http://localhost:8080";
  const url = idconsulta
    ? `${apiUrl}/consultas/${idconsulta}`
    : `${apiUrl}/consultas`;
  const method = idconsulta ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar consulta.");
  }

  revalidatePath("/consultas");
  redirect("/consultas");
}

interface ConsultasCadastroProps {
  specialtyId?: string;
  appointmentId?: string;
}

export default async function ConsultasCadastro({
  specialtyId,
  appointmentId,
}: ConsultasCadastroProps) {
  const [patients, specialties, appointment] = await Promise.all([
    getPatients(),
    getSpecialties(),
    getAppointment(appointmentId),
  ]);

  const activeSpecialtyId =
    specialtyId || appointment?.especialidade?.id?.toString();
  const doctors = await getDoctors(activeSpecialtyId);

  const defaultDate = appointment?.dataConsulta
    ? appointment.dataConsulta.substring(0, 16)
    : undefined;

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <form action={saveAppointmentAction} className="space-y-6">
        {appointment && (
          <input type="hidden" name="idconsulta" value={appointment.id} />
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col w-full">
            <label
              htmlFor="patientId"
              className="mb-1 text-sm font-semibold text-gray-700"
            >
              Paciente
            </label>
            <select
              id="patientId"
              name="patientId"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
              required
              defaultValue={appointment?.paciente?.id}
            >
              <option value="">Selecione um paciente...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="specialtyId"
              className="mb-1 text-sm font-semibold text-gray-700"
            >
              Especialidade
            </label>
            <Suspense
              fallback={
                <div className="h-10 w-full rounded-md border border-gray-300 bg-gray-50"></div>
              }
            >
              <SpecialtySelect
                specialties={specialties}
                defaultValue={activeSpecialtyId}
              />
            </Suspense>
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="doctorId"
              className="mb-1 text-sm font-semibold text-gray-700"
            >
              Médico
            </label>
            <select
              id="doctorId"
              name="doctorId"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
              required
              defaultValue={appointment?.medico?.id}
            >
              <option value="">Selecione um médico...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nome} - {doctor.crm}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="appointmentDate"
              className="mb-1 text-sm font-semibold text-gray-700"
            >
              Data e Hora
            </label>
            <input
              type="datetime-local"
              id="appointmentDate"
              name="appointmentDate"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
              required
              defaultValue={defaultDate}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end border-t border-gray-100 pt-6">
          <Link
            href="/consultas"
            className="inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
          >
            Salvar Consulta
          </button>
        </div>
      </form>
    </div>
  );
}
