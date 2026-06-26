import React from 'react';
import { IconType } from 'react-icons';
import { MdTag, MdSwapVert } from 'react-icons/md';
import { Terminal } from '../Terminal';
import { LogEntry } from '../../types/modbus';
import { ControllerLogEntry } from '../../types/controller';
import { FUNCTION_CODE_DESCRIPTIONS } from '../../types/modbus';

interface LiveSensorCardProps {
  /** ID único do sensor (usado para aria e keys) */
  sensorId: string;
  /** Rótulo visível do sensor */
  label: string;
  /** Ícone do sensor (react-icons) */
  icon: IconType;
  /** Nome do parâmetro medido */
  parameterName: string;
  /** Valor atual do sensor */
  value: number;
  /** Unidade de medida */
  unit: string;
  /** Unit ID Modbus */
  unitId: number;
  /** Endereço do Input Register (1-based) */
  address: number;
  /** Código de função Modbus (ex: 4) */
  functionCode: number;
  /** Range de referência (apenas visual, não editável) */
  min?: number;
  max?: number;
  /** Logs filtrados deste sensor */
  logs: ControllerLogEntry[];
  /** Se a simulação está ativa */
  isRunning: boolean;
  onClearLogs: () => void;
  onExportLogs: () => void;
}

/** Converte ControllerLogEntry → LogEntry para reutilizar o Terminal existente */
function toTerminalLogs(entries: ControllerLogEntry[], unitId: number, parameterName: string, unit: string): LogEntry[] {
  return entries.map((e) => ({
    timestamp: e.timestamp,
    deviceId: unitId,
    frame: e.frame,
    value: String(e.value),
    parameterName: e.description || parameterName,
    unit: e.unit || unit,
  }));
}

export function LiveSensorCard({
  sensorId,
  label,
  icon: Icon,
  parameterName,
  value,
  unit,
  unitId,
  address,
  functionCode,
  min = 0,
  max = 100,
  logs,
  isRunning,
  onClearLogs,
  onExportLogs,
}: LiveSensorCardProps) {
  const terminalLogs = toTerminalLogs(logs, unitId, parameterName, unit);
  // const fcInfo = FUNCTION_CODE_DESCRIPTIONS[functionCode];
  const fcInfo = FUNCTION_CODE_DESCRIPTIONS[1];

  // Percentual do valor atual dentro do range (para a barra de progresso)
  const progressPct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="sensor-card p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Coluna esquerda — informações do sensor */}
        <div className="flex flex-col min-h-[600px]">
          {/* Título */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">{label}</h2>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {/* Painel de valor atual + range (mesmo estilo do SensorHeader) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                {/* Range */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <MdSwapVert size={20} />
                    <span className="text-sm font-semibold tracking-wide uppercase">Intervalo</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-medium text-gray-800">{min} – {max}</span>
                    <span className="text-sm text-blue-600 font-medium">{unit}</span>
                  </div>
                </div>

                {/* Device ID */}
                <div className="space-y-3 border-l border-blue-100 pl-6">
                  <div className="flex items-center gap-2 text-blue-700">
                    <MdTag size={20} />
                    <span className="text-sm font-semibold tracking-wide uppercase">Device ID</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-medium text-gray-800">{unitId}</span>
                      <span className="text-sm text-blue-600 font-medium">Unit Identifier</span>
                    </div>
                    {isRunning && (
                      <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-green-700">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Valor atual em destaque */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{parameterName}</p>
              <div className="flex items-end gap-2 mb-3">
                <span
                  id={`${sensorId}-value`}
                  className="text-4xl font-bold font-mono text-gray-800 tabular-nums"
                >
                  {value.toFixed(1)}
                </span>
                <span className="text-lg text-gray-400 mb-1">{unit}</span>
              </div>
              {/* Barra de progresso do valor */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-mono">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
              </div>
            </div>

            {/* Configuração Modbus estática (sem edição, pois é controlada automaticamente) */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                { label: 'Código de Função', value: `0${functionCode.toString(16).toUpperCase()} — FC ${functionCode}` },
                { label: 'Número de Registradores', value: '1' },
                { label: 'Endereço do Registrador', value: String(address) },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">{item.label}</p>
                  <p className="font-mono font-semibold text-gray-700 text-xs">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Descrição do Function Code */}
            {fcInfo && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <code className="px-2 py-1 bg-blue-100 rounded text-blue-700 text-sm font-mono">
                    {fcInfo.code}
                  </code>
                  <h4 className="font-medium text-blue-900">{fcInfo.name}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-blue-800">
                    <span className="font-medium">Propósito:</span> {fcInfo.purpose}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Uso:</span> {fcInfo.usage}
                  </p>
                </div>
              </div>
            )}

            {/* Indicador de controle automático no rodapé */}
            <div className="mt-auto">
              <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`} />
                Controlado Automaticamente pelo Controlador de Nível
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita — terminal de leituras */}
        <div className="h-[645px]">
          <Terminal
            logs={terminalLogs}
            onClear={onClearLogs}
            onExport={onExportLogs}
            title={`${label} Output`}
          />
        </div>
      </div>
    </div>
  );
}
