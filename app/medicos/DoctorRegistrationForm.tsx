"use client";

import { useState, FormEvent } from "react";

interface DoctorFormData {
  fullName: string;
  licenseNumber: string; // CRM
  specialty: string;
  email: string;
  phoneNumber: string;
}

const INITIAL_FORM_DATA: DoctorFormData = {
  fullName: "",
  licenseNumber: "",
  specialty: "",
  email: "",
  phoneNumber: "",
};

export default function DoctorRegistrationForm() {
  const [formData, setFormData] = useState<DoctorFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Simulando uma requisição de API com delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (
        !formData.fullName ||
        !formData.licenseNumber ||
        !formData.specialty
      ) {
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

  // Early Return para exibir o sucesso e manter o código JSX limpo
  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl text-green-600">✓</span>
        </div>
        <h3 className="text-xl font-medium text-gray-900">
          Doctor Registered Successfully!
        </h3>
        <p className="text-gray-500">
          The new doctor has been added to the clinic's system.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Register Another Doctor
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Full Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Dr. Jane Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="licenseNumber"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Medical License Number (CRM)
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="CRM 12345-CE"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="specialty"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Specialty
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
              <option value="neurology">Neurology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="psychiatry">Psychiatry</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email Address
          </label>
          <div className="mt-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="doctor@clinic.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Phone Number
          </label>
          <div className="mt-2">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 transition-colors"
        >
          {isSubmitting ? "Registering..." : "Register Doctor"}
        </button>
      </div>
    </form>
  );
}
