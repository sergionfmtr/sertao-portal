"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Specialty {
  id: number;
  nome: string;
}

interface SpecialtySelectProps {
  specialties: Specialty[];
  defaultValue?: string;
}

export default function SpecialtySelect({
  specialties,
  defaultValue,
}: SpecialtySelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("specialtyId", e.target.value);
    } else {
      params.delete("specialtyId");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      id="specialtyId"
      name="specialtyId"
      defaultValue={defaultValue ?? ""}
      onChange={handleChange}
      className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
    >
      <option value="">Selecione uma especialidade...</option>
      {specialties.map((specialty) => (
        <option key={specialty.id} value={specialty.id}>
          {specialty.nome}
        </option>
      ))}
    </select>
  );
}
