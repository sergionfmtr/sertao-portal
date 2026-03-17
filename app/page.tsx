export default function Home() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">
            Dr(a). Médico(a)
          </span>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            D
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Consultas Hoje</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">
            Pacientes Atendidos (Mês)
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">145</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Novos Pacientes</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">8</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Próximos Agendamentos
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Paciente Silva {index + 1}
                </p>
                <p className="text-xs text-gray-500">Consulta de Rotina</p>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {14 + index}:00
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
