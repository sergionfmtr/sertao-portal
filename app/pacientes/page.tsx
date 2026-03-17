export default function PacientesPage() {
  // Dados simulados para o modelo da tela
  const mockPacientes = [
    { id: 1, nome: "João Silva", idade: 45, telefone: "(11) 99999-9999" },
    { id: 2, nome: "Maria Souza", idade: 32, telefone: "(11) 88888-8888" },
    { id: 3, nome: "José Santos", idade: 50, telefone: "(11) 77777-7777" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pacientes</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Novo Paciente
        </button>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Paciente
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Contato
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {mockPacientes.map((paciente) => (
            <div
              key={paciente.id}
              className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {paciente.nome}
                </p>
                <p className="text-xs text-gray-500">{paciente.idade} anos</p>
              </div>
              <div className="text-sm text-gray-600">{paciente.telefone}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
