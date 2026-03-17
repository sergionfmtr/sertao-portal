"use client";

import { useState, FormEvent } from "react";

interface SpecialtyFormData {
  name: string;
  description: string;
}

const INITIAL_FORM_DATA: SpecialtyFormData = {
  name: "",
  description: "",
};

export default function SpecialtyForm() {
  const [formData, setFormData] =
    useState<SpecialtyFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Simulando a chamada para uma API com delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!formData.name) {
        throw new Error("Por favor, preencha o nome da especialidade.");
      }

      setSubmitSuccess(true);
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Ocorreu um erro inesperado. Tente novamente.");
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
          Especialidade Cadastrada com Sucesso!
        </h3>
        <p className="text-gray-500">
          A nova especialidade médica foi adicionada ao sistema.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Cadastrar Outra Especialidade
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
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Nome da Especialidade
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Ex: Cardiologia"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Descrição (Opcional)
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Breve descrição sobre a especialidade..."
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
          {isSubmitting ? "Salvando..." : "Salvar Especialidade"}
        </button>
      </div>
    </form>
  );
}
