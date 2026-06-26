import React from 'react';
import { FunctionCodeHelp } from './FunctionCodeHelp';
import { WaterLevelDashboard } from './WaterLevelDashboard';
import { Github, AlertTriangle, Clock } from 'lucide-react';

interface ModbusSimulatorProps {
  countdown: number;
  shouldRefresh: boolean;
}

export function ModbusSimulator({ countdown, shouldRefresh }: ModbusSimulatorProps) {
  const [showFunctionCodes, setShowFunctionCodes] = React.useState(false);
  const showTimer = import.meta.env.VITE_SHOW_TIMER !== 'false';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarningTime = countdown <= 30;

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-[1200px] w-full p-4 lg:p-6 space-y-4 lg:space-y-6">

        {/* Aviso de ambiente demo */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-stretch">
            <div className="flex-grow p-4 flex items-center gap-3">
              <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">Demo Environment Notice</h3>
                <p className="text-sm text-yellow-700 mt-0.5">
                  For stability and security reasons, all demo state is reset periodically.
                  For production usage, please deploy your own instance.
                </p>
              </div>
            </div>

            {showTimer && (
              <>
                <div className="w-px bg-yellow-200 my-4" />
                <div className="p-4 bg-yellow-100/50 flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Clock className={`w-4 h-4 ${isWarningTime ? 'animate-spin text-red-600' : ''}`} />
                      <span className="text-sm font-medium">Reset in</span>
                    </div>
                    <div className={`font-mono font-bold text-lg ${isWarningTime ? 'text-red-600 animate-pulse' : 'text-yellow-900'}`}>
                      {formatTime(countdown)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Título */}
        <div className="text-center text-white py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Modbus TCP — Controlador de Nível de Água
          </h1>
          <p className="text-sm lg:text-base opacity-90 mb-4">
            Simulação de controle automático de nível com protocolo Modbus TCP
          </p>

          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-white/90">
              <Github className="w-4 h-4 lg:w-5 lg:h-5" />
              <h2 className="text-base lg:text-lg font-semibold">GitHub Repository</h2>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="https://github.com/tunasakar/modbus-simulator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#24292f] text-white rounded-md hover:bg-[#31363d] transition-all duration-200 shadow hover:shadow-md"
              >
                <Github className="w-4 h-4" />
                <span className="font-medium text-sm">modbus-simulator</span>
              </a>
            </div>
          </div>
        </div>

        {/* Referência de Códigos de Função (toggle em mobile) */}
        <div className="lg:hidden flex justify-center">
          <button
            onClick={() => setShowFunctionCodes(!showFunctionCodes)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            {showFunctionCodes ? 'Hide' : 'Show'} Function Codes
          </button>
        </div>
        <div className={`${showFunctionCodes ? 'block' : 'hidden'} lg:block`}>
          <FunctionCodeHelp />
        </div>

        {/* Dashboard do Controlador de Nível */}
        <WaterLevelDashboard shouldStop={shouldRefresh} />

      </div>
    </div>
  );
}