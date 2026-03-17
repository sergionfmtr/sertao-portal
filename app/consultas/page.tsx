import { Metadata } from "next";
import AppointmentForm from "./AppointmentForm";

export const metadata: Metadata = {
  title: "Book an Appointment | Medical Clinic",
  description: "Schedule your medical appointment easily and quickly.",
};

export default function ConsultasPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Book an Appointment
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please fill out the form below to schedule your visit to our clinic.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:p-8">
          <AppointmentForm />
        </section>
      </div>
    </main>
  );
}
