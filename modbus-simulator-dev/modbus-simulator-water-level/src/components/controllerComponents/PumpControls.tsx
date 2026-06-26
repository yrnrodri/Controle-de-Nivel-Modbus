import React, { useState } from 'react';
import { MdAdd, MdRemove, MdSpeed, MdWaterDrop } from 'react-icons/md';

interface PumpControlsProps {
  setpoint: number;
  pumpSpeed: number;
  flowRate: number;
  pumpActive: boolean;
  onSetpointChange: (value: number) => void;
  onPumpSpeedChange: (delta: number) => void;
  isRunning: boolean;
}

export function PumpControls({
  setpoint,
  pumpSpeed,
  flowRate,
  pumpActive,
  onSetpointChange,
  onPumpSpeedChange,
  isRunning,
}: PumpControlsProps) {
  const [inputValue, setInputValue] = useState(String(setpoint));

  const handleSetpointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onSetpointChange(parsed);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onSetpointChange(parsed);
    }
  };

  return (
    <div className="space-y-5">
      {/* Setpoint */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <MdWaterDrop className="inline mr-1 text-blue-500" size={16} />
          Nível Desejado (Setpoint)
        </label>
        <form onSubmit={handleSetpointSubmit} className="flex items-center gap-2">
          <input
            id="setpoint-input"
            type="number"
            min={5}
            max={100}
            step={1}
            value={inputValue}
            onChange={handleInputChange}
            disabled={!isRunning}
            className="w-24 px-3 py-2 text-center text-lg font-mono font-bold border-2 border-blue-200 rounded-xl
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       bg-white text-blue-700"
            aria-label="Nível desejado em porcentagem"
          />
          <span className="text-gray-500 font-semibold text-sm">%</span>
          <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-xs text-blue-700 text-center">
            Automático: bomba desliga em <strong>{setpoint}%</strong>
          </div>
        </form>
        {/* Barra visual do setpoint */}
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${setpoint}%` }}
          />
        </div>
      </div>

      {/* Velocidade da Bomba */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <MdSpeed className="inline mr-1 text-indigo-500" size={16} />
          Velocidade da Bomba
        </label>
        <div className="flex items-center gap-3">
          <button
            id="pump-speed-decrease"
            type="button"
            onClick={() => onPumpSpeedChange(-10)}
            disabled={!isRunning || pumpSpeed <= 5}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 hover:bg-indigo-200
                       active:scale-95 transition-all duration-150 text-indigo-700 font-bold text-lg
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            aria-label="Diminuir velocidade da bomba"
          >
            <MdRemove size={20} />
          </button>

          <div className="flex-1 text-center">
            <span className="text-2xl font-bold font-mono text-indigo-700">{pumpSpeed}</span>
            <span className="text-sm text-gray-500 ml-1">%</span>
            <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  pumpActive
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-500'
                    : 'bg-gray-300'
                }`}
                style={{ width: `${pumpSpeed}%` }}
              />
            </div>
          </div>

          <button
            id="pump-speed-increase"
            type="button"
            onClick={() => onPumpSpeedChange(10)}
            disabled={!isRunning || pumpSpeed >= 100}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 hover:bg-indigo-200
                       active:scale-95 transition-all duration-150 text-indigo-700 font-bold text-lg
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            aria-label="Aumentar velocidade da bomba"
          >
            <MdAdd size={20} />
          </button>
        </div>

        {/* Vazão atual */}
        <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <div
            className={`w-2 h-2 rounded-full ${pumpActive ? 'bg-cyan-500 animate-pulse' : 'bg-gray-300'}`}
          />
          <span className="text-xs text-gray-500">Vazão atual:</span>
          <span className="text-xs font-mono font-bold text-cyan-700 ml-auto">
            {flowRate.toFixed(1)} m³/h
          </span>
        </div>
      </div>
    </div>
  );
}
