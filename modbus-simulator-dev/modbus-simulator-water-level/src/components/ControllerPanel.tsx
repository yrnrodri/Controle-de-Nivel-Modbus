import React from 'react';
import { MdPlayArrow, MdStop, MdSettings } from 'react-icons/md';
import { TankVisual } from './TankVisual';
import { PumpControls } from './PumpControls';
import { ControllerLogEntry } from '../types/controller';

interface ControllerPanelProps {
  level: number;
  flowRate: number;
  pumpActive: boolean;
  setpoint: number;
  pumpSpeed: number;
  logs: ControllerLogEntry[]; // Mantido na prop caso precise no futuro, mas não usaremos o terminal aqui
  isRunning: boolean;
  onToggle: () => void;
  onSetpointChange: (value: number) => void;
  onPumpSpeedChange: (delta: number) => void;
  onClearLogs: () => void;
  onExportLogs: () => void;
}

export function ControllerPanel({
  level,
  flowRate,
  pumpActive,
  setpoint,
  pumpSpeed,
  isRunning,
  onToggle,
  onSetpointChange,
  onPumpSpeedChange,
}: ControllerPanelProps) {
  return (
    <div className="sensor-card p-4 lg:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
          <MdSettings className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
            Controlador de Nível de Água
          </h2>
          <p className="text-sm text-gray-500">
            Modo Automático — Malha Fechada
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Conteúdo compacto: Tanque + Controles */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center max-w-4xl mx-auto">
        {/* Tanque visual */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <TankVisual level={level} setpoint={setpoint} pumpActive={pumpActive} />
        </div>

        {/* Controles de Nível e Vazão */}
        <div className="flex-1 w-full max-w-sm mx-auto lg:mx-0 space-y-6">
          <PumpControls
            setpoint={setpoint}
            pumpSpeed={pumpSpeed}
            flowRate={flowRate}
            pumpActive={pumpActive}
            onSetpointChange={onSetpointChange}
            onPumpSpeedChange={onPumpSpeedChange}
            isRunning={isRunning}
          />

          {/* Botão iniciar/parar compacto */}
          <div className="pt-2">
            <button
              id="controller-toggle"
              type="button"
              onClick={onToggle}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                          shadow-md active:scale-95 transition-all duration-200 focus:outline-none
                          focus:ring-2 focus:ring-offset-2 ${
                            isRunning
                              ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                              : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'
                          }`}
              aria-pressed={isRunning}
            >
              {isRunning
                ? <><MdStop size={20} /> Parar Controlador</>
                : <><MdPlayArrow size={20} /> Iniciar Controlador</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
