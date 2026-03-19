"use client";

import { useRouter } from "next/navigation";

export default function ConsultasActionButtons({ id }: { id: number }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/consultas?action=edit&id=${id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta consulta?",
    );
    if (!confirmDelete) return;

    try {
      // Quando for ligar a exclusão real na API, você utilizará a sua variável de ambiente do cliente:
      // const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      // await fetch(`${baseUrl}/consultas/${id}`, { method: 'DELETE' });

      // O router.refresh() faz o Server Component pai (ConsultasList) rodar novamente e buscar os dados mais atualizados!
      router.refresh();
    } catch (err) {
      console.error("Erro ao excluir consulta", err);
      alert("Não foi possível excluir a consulta.");
    }
  };

  return (
    <div className="mt-4 flex gap-2 md:mt-0 md:ml-6 shrink-0 border-t border-gray-100 md:border-t-0 pt-4 md:pt-0">
      <button
        onClick={handleEdit}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 ring-1 ring-inset ring-blue-100 hover:bg-blue-50 transition-colors"
      >
        Editar
      </button>
      <button
        onClick={handleDelete}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-100 hover:bg-red-50 transition-colors"
      >
        Excluir
      </button>
    </div>
  );
}
