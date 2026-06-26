import React from 'react';
import { MdPlayArrow, MdStop, MdDownload, MdDelete, MdTerminal, MdWaterDrop } from 'react-icons/md';
import { TankVisual } from './TankVisual';
import { PumpControls } from './PumpControls';
import { useWaterLevelController } from '../hooks/useWaterLevelController';
import { ControllerLogEntry } from '../types/controller';

interface WaterLevelCardProps {
  shouldStop?: boolean;
}

/** Cor e rótulo de cada tipo de evento no terminal */
const LOG_STYLE: Record<ControllerLogEntry['type'], { label: string; color: string }> = {
  READ_LEVEL: { label: 'READ LEVEL', color: 'text-cyan-400' },
  READ_FLOW:  { label: 'READ FLOW',  color: 'text-teal-400' },
  WRITE_PUMP: { label: 'WRITE PUMP', color: 'text-yellow-400' },
  ALARM:      { label: 'ALARM',      color: 'text-red-400' },
};

export function WaterLevelCard({ shouldStop }: WaterLevelCardProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const terminalRef = React.useRef<HTMLDivElement>(null);

  const {
    level,
    flowRate,
    pumpActive,
    setpoint,
    pumpSpeed,
    logs,
    clearLogs,
    exportLogs,
    handleSetpointChange,
    handlePumpSpeedChange,
  } = useWaterLevelController({ isRunning });

  // Para a simulação quando o pai pede
  React.useEffect(() => {
    if (shouldStop && isRunning) setIsRunning(false);
  }, [shouldStop, isRunning]);

  // Auto-scroll do terminal
  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="sensor-card p-4 lg:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 bg-blue-100 rounded-lg">
          <MdWaterDrop className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            Controlador de Nível de Água
          </h2>
          <p className="text-sm text-gray-500">
            Modo Automático — Malha Fechada — Modbus TCP (Unit ID: 4)
          </p>
        </div>
        {/* Indicador de status */}
        <div className="ml-auto flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`}
          />
          <span className="text-xs font-medium text-gray-500">
            {isRunning ? 'ATIVO' : 'PARADO'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Coluna esquerda: controles */}
        <div className="flex flex-col gap-5">
          {/* Tanque visual + controles lado a lado */}
          <div className="flex gap-4 items-start">
            <TankVisual level={level} setpoint={setpoint} pumpActive={pumpActive} />
            <div className="flex-1">
              <PumpControls
                setpoint={setpoint}
                pumpSpeed={pumpSpeed}
                flowRate={flowRate}
                pumpActive={pumpActive}
                onSetpointChange={handleSetpointChange}
                onPumpSpeedChange={handlePumpSpeedChange}
                isRunning={isRunning}
              />
            </div>
          </div>

          {/* Endereços Modbus para referência */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-800 mb-2">Mapa de Registros Modbus</p>
            <table className="w-full text-xs text-blue-700 font-mono">
              <thead>
                <tr className="text-blue-500 border-b border-blue-200">
                  <th className="text-left pb-1">Endereço</th>
                  <th className="text-left pb-1">Tipo</th>
                  <th className="text-left pb-1">Variável</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                <tr><td>10</td><td>IR (FC 4)</td><td>Nível do Tanque (%)</td></tr>
                <tr><td>11</td><td>IR (FC 4)</td><td>Vazão de Entrada (m³/h)</td></tr>
                <tr><td>20</td><td>HR (FC 6)</td><td>Velocidade da Bomba (%)</td></tr>
              </tbody>
            </table>
          </div>

          {/* Botão de iniciar/parar */}
          <button
            id="controller-toggle"
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                        shadow-md active:scale-95 transition-all duration-200 focus:outline-none
                        focus:ring-2 focus:ring-offset-2 ${
                          isRunning
                            ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                            : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'
                        }`}
            aria-pressed={isRunning}
          >
            {isRunning ? (
              <><MdStop size={20} /> Parar Controlador</>
            ) : (
              <><MdPlayArrow size={20} /> Iniciar Controlador</>
            )}
          </button>
        </div>

        {/* Coluna direita: terminal de logs Modbus */}
        <div className="h-[520px] lg:h-full">
          <div className="terminal-window h-full flex flex-col">
            {/* Barra do terminal */}
            <div className="flex items-center justify-between p-1.5 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-gray-400">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <MdTerminal size={12} />
                  <span className="font-mono text-xs">Controlador de Nível — Logs Modbus</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={exportLogs}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded hover:bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
                  title="Exportar logs"
                >
                  <MdDownload size={12} />
                  <span className="hidden sm:inline text-xs">Exportar</span>
                </button>
                <button
                  onClick={clearLogs}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded hover:bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
                  title="Limpar logs"
                >
                  <MdDelete size={12} />
                  <span className="hidden sm:inline text-xs">Limpar</span>
                </button>
              </div>
            </div>

            {/* Logs */}
            <div
              ref={terminalRef}
              className="flex-1 font-mono text-[11px] leading-tight overflow-y-auto p-1.5"
            >
              {logs.length === 0 ? (
                <p className="text-gray-600 p-2 text-center">
                  Inicie o controlador para ver os logs Modbus...
                </p>
              ) : (
                <div className="space-y-0.5">
                  {logs.map((log, index) => {
                    const style = LOG_STYLE[log.type];
                    return (
                      <div key={index} className="opacity-90 hover:opacity-100">
                        <span className="text-gray-500">[{log.timestamp}] </span>
                        <span className={`font-semibold ${style.color}`}>[{style.label}] </span>
                        {log.frame && (
                          <span className="text-purple-400">Frame: {log.frame} | </span>
                        )}
                        <span className="text-green-400">
                          {log.description}
                          {log.type !== 'ALARM' && log.frame
                            ? ` → ${log.value}${log.unit}`
                            : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
