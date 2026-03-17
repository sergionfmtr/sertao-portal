import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">
          Clínica Médica do Sertão
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Início
            </Link>
          </li>
          <li>
            <Link
              href="/consultas"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Agendamentos
            </Link>
          </li>
          <li>
            <Link
              href="/pacientes"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Pacientes
            </Link>
          </li>
          <li>
            <Link
              href="/medicos"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Medicos
            </Link>
          </li>
          <li>
            <Link
              href="/especialidades"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Especialidades
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 text-sm text-gray-500 text-center">
        &copy; 2026 Clínica Médica do Sertão
      </div>
    </aside>
  );
}
