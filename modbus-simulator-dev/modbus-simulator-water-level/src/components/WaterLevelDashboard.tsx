import React from 'react';
import { MdWaterDrop, MdWaves } from 'react-icons/md';
import { useWaterLevelController } from '../hooks/useWaterLevelController';
import { ControllerPanel } from './ControllerPanel';
import { LiveSensorCard } from './LiveSensorCard';

interface WaterLevelDashboardProps {
  shouldStop?: boolean;
}

export function WaterLevelDashboard({ shouldStop }: WaterLevelDashboardProps) {
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    if (shouldStop && isRunning) setIsRunning(false);
  }, [shouldStop, isRunning]);

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

  // Filtra os logs por categoria para cada componente filho
  const controlLogs = logs.filter((l) => l.type === 'WRITE_PUMP' || l.type === 'WRITE_SETPOINT' || l.type === 'ALARM');
  const levelLogs   = logs.filter((l) => l.type === 'READ_LEVEL'  || l.type === 'WRITE_SETPOINT' || l.type === 'ALARM');
  const flowLogs    = logs.filter((l) => l.type === 'READ_FLOW'   || l.type === 'WRITE_PUMP');

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Card 1: Painel de controle (tanque visual + setpoint + velocidade) */}
      <ControllerPanel
        level={level}
        flowRate={flowRate}
        pumpActive={pumpActive}
        setpoint={setpoint}
        pumpSpeed={pumpSpeed}
        logs={controlLogs}
        isRunning={isRunning}
        onToggle={() => setIsRunning((prev) => !prev)}
        onSetpointChange={handleSetpointChange}
        onPumpSpeedChange={handlePumpSpeedChange}
        onClearLogs={clearLogs}
        onExportLogs={exportLogs}
      />

      {/* Card 2: Sensor de Nível de Água (FC 4, endereço 10) */}
      <LiveSensorCard
        sensorId="water-level"
        label="Water Level Sensor"
        icon={MdWaterDrop}
        parameterName="Tank Level"
        value={level}
        unit="%"
        unitId={4}
        address={10}
        functionCode={4}
        min={0}
        max={100}
        logs={levelLogs}
        isRunning={isRunning}
        onClearLogs={clearLogs}
        onExportLogs={exportLogs}
      />

      {/* Card 3: Sensor de Vazão da Bomba (FC 4, endereço 11) */}
      <LiveSensorCard
        sensorId="pump-flow"
        label="Pump Flow Sensor"
        icon={MdWaves}
        parameterName="Flow Rate"
        value={flowRate}
        unit="m³/h"
        unitId={4}
        address={11}
        functionCode={4}
        min={2}
        max={40}
        logs={flowLogs}
        isRunning={isRunning}
        onClearLogs={clearLogs}
        onExportLogs={exportLogs}
      />
    </div>
  );
}
