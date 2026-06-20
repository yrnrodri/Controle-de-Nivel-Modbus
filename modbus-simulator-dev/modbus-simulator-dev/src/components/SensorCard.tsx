import React from 'react';
import { Terminal } from './Terminal';
import { ModbusConfig, FUNCTION_CODE_DESCRIPTIONS } from '../types/modbus';
import { SensorType } from '../types/sensors';
import { MdThermostat, MdSpeed, MdWaves } from 'react-icons/md';
import { SensorConfigForm } from './SensorConfigForm';
import { SensorHeader } from './sensor/SensorHeader';
import { SensorControls } from './sensor/SensorControls';
import { useModbusSimulation } from '../hooks/useModbusSimulation';

interface SensorCardProps {
  sensor: SensorType;
  shouldStop?: boolean;
}

const SENSOR_ICONS = {
  temperature: MdThermostat,
  pressure: MdSpeed,
  flow: MdWaves,
};

export function SensorCard({ sensor, shouldStop }: SensorCardProps) {
  const [config, setConfig] = React.useState<ModbusConfig>({
    ...sensor.config.modbusConfig,
    unitId: sensor.config.unitId
  });
  const [isRunning, setIsRunning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [range, setRange] = React.useState({ min: sensor.config.min, max: sensor.config.max });
  const [isEditingRange, setIsEditingRange] = React.useState(false);

  React.useEffect(() => {
    if (shouldStop && isRunning) {
      setIsRunning(false);
    }
  }, [shouldStop]);

  const Icon = SENSOR_ICONS[sensor.id as keyof typeof SENSOR_ICONS];
  const functionCodeInfo = FUNCTION_CODE_DESCRIPTIONS[config.functionCode];

  const { logs, clearLogs, exportLogs } = useModbusSimulation({
    isRunning,
    config: { ...config, unitId: sensor.config.unitId },
    range,
    parameterName: sensor.config.parameterName,
    unit: sensor.config.unit,
  });

  const handleRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingRange(false);
  };

  return (
    <div className="sensor-card p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="flex flex-col h-[600px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">{sensor.label}</h2>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <SensorHeader
              sensor={sensor}
              range={range}
              isEditingRange={isEditingRange}
              onEditRange={() => setIsEditingRange(true)}
              onRangeChange={setRange}
              onRangeSubmit={handleRangeSubmit}
              isRunning={isRunning}
            />

            <SensorConfigForm
              config={config}
              onChange={setConfig}
              error={error}
            />

            {functionCodeInfo && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <code className="px-2 py-1 bg-blue-100 rounded text-blue-700 text-sm font-mono">
                    {functionCodeInfo.code}
                  </code>
                  <h4 className="font-medium text-blue-900">{functionCodeInfo.name}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-blue-800">
                    <span className="font-medium">Purpose:</span> {functionCodeInfo.purpose}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Usage:</span> {functionCodeInfo.usage}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-auto">
              <SensorControls
                isRunning={isRunning}
                onToggle={() => setIsRunning((prev) => !prev)}
              />
            </div>
          </div>
        </div>

        <div className="h-[600px]">
          <Terminal
            logs={logs}
            onClear={clearLogs}
            onExport={exportLogs}
            title={`${sensor.label} Output`}
          />
        </div>
      </div>
    </div>
  );
}