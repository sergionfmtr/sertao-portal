import { Metadata } from "next";
import SpecialtyForm from "./SpecialtyForm";

export const metadata: Metadata = {
  title: "Manutenção de Especialidades | Clínica Sertão",
  description: "Gerencie as especialidades médicas da clínica.",
};

export default function EspecialidadesPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Manutenção de Especialidades
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Cadastre e gerencie as especialidades médicas oferecidas pela
            clínica.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:p-8">
          <SpecialtyForm />
        </section>
      </div>
    </main>
  );
}
