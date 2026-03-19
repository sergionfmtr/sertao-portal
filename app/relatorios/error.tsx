"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ReportsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Erro detectado na rota de relatórios:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Oops! Ocorreu um erro.
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Não foi possível carregar os relatórios no momento. {error.message}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
