import { Metadata } from "next";
import DoctorRegistrationForm from "./DoctorRegistrationForm";

export const metadata: Metadata = {
  title: "Register Doctor | Medical Clinic",
  description: "Add a new doctor to the clinic's administrative system.",
};

export default function MedicosPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Doctor Registration
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please provide the required information to register a new doctor in
            the system.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:p-8">
          <DoctorRegistrationForm />
        </section>
      </div>
    </main>
  );
}
