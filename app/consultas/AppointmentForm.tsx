"use client";

import { useState, FormEvent } from "react";

interface AppointmentFormData {
  patientName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
}

const INITIAL_FORM_DATA: AppointmentFormData = {
  patientName: "",
  specialty: "",
  appointmentDate: "",
  appointmentTime: "",
};

export default function AppointmentForm() {
  const [formData, setFormData] =
    useState<AppointmentFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    // Imutabilidade: Atualizando o estado através de um pattern funcional
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Simulando uma requisição de API com delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!formData.patientName || !formData.specialty) {
        throw new Error("Please fill in all required fields.");
      }

      setSubmitSuccess(true);
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean Code: Early Return para o estado de sucesso (evitando ternários complexos na UI principal)
  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl text-green-600">✓</span>
        </div>
        <h3 className="text-xl font-medium text-gray-900">
          Appointment Requested!
        </h3>
        <p className="text-gray-500">
          We have received your request and will confirm shortly.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="patientName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Full Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="specialty"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Medical Specialty
          </label>
          <div className="mt-2">
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="" disabled>
                Select a specialty
              </option>
              <option value="cardiology">Cardiology</option>
              <option value="dermatology">Dermatology</option>
              <option value="general_practice">General Practice</option>
              <option value="pediatrics">Pediatrics</option>
            </select>
          </div>
        </div>

        {/* Demais campos nativos de data e hora usando input padrão do HTML5 estilizados via Tailwind */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="appointmentDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Preferred Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="appointmentTime"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Preferred Time
            </label>
            <div className="mt-2">
              <input
                type="time"
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 transition-colors"
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </form>
  );
}
