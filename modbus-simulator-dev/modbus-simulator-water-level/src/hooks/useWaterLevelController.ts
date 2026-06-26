import { useState, useEffect, useRef, useCallback } from 'react';
import { ControllerLogEntry, TankPhysics, DEFAULT_TANK_PHYSICS } from '../types/controller';
import { createWriteRegisterFrame, createReadInputRegisterFrame } from '../utils/modbusUtils';
import { formatTimestamp } from '../utils/dateUtils';

// Endereços Modbus do controlador
const MODBUS_UNIT_ID = 4;
const ADDR_TANK_LEVEL = 10;  // Input Register: nível do tanque (FC 4)
const ADDR_FLOW_RATE = 11;   // Input Register: vazão atual (FC 4)
const ADDR_PUMP_SPEED = 20;  // Holding Register: velocidade da bomba (FC 6)
const ADDR_SETPOINT = 21;    // Holding Register: setpoint de nível (FC 6)

// Histerese para evitar ligar/desligar em loop na borda do setpoint
const HYSTERESIS = 2; // %

interface UseWaterLevelControllerOptions {
  physics?: TankPhysics;
  isRunning: boolean;
}

export function useWaterLevelController({
  physics = DEFAULT_TANK_PHYSICS,
  isRunning,
}: UseWaterLevelControllerOptions) {
  const [level, setLevel] = useState(50);          // Nível atual do tanque (%)
  const [flowRate, setFlowRate] = useState(0);     // Vazão atual de entrada (m³/h)
  const [pumpActive, setPumpActive] = useState(false);
  const [setpoint, setSetpoint] = useState(80);    // Nível alvo (%)
  const [pumpSpeed, setPumpSpeed] = useState(50);  // Velocidade da bomba (%)
  const [logs, setLogs] = useState<ControllerLogEntry[]>([]);
  const [txId, setTxId] = useState(1);

  // Refs para evitar stale closures no loop de animação
  const levelRef = useRef(50);
  const pumpActiveRef = useRef(false);
  const setpointRef = useRef(80);
  const pumpSpeedRef = useRef(50);
  const txIdRef = useRef(1);
  const lastTickRef = useRef<number>(0);
  const rafRef = useRef<number>();

  // Sincroniza refs com estado
  levelRef.current = level;
  pumpActiveRef.current = pumpActive;
  setpointRef.current = setpoint;
  pumpSpeedRef.current = pumpSpeed;
  txIdRef.current = txId;

  /** Adiciona uma entrada ao log (máx 100 linhas) */
  const addLog = useCallback((entry: Omit<ControllerLogEntry, 'timestamp'>) => {
    const newEntry: ControllerLogEntry = {
      ...entry,
      timestamp: formatTimestamp(new Date()),
    };
    setLogs((prev) => [...prev.slice(-99), newEntry]);
  }, []);

  /** Incrementa e retorna o próximo Transaction ID (1–65535 cíclico) */
  const nextTxId = useCallback((): number => {
    const next = (txIdRef.current % 65535) + 1;
    txIdRef.current = next;
    setTxId(next);
    return next;
  }, []);

  // Envia um comando FC 6 — Write Single Register para a bomba
  const writePumpSpeed = useCallback((speed: number) => {
    const id = nextTxId();
    const frame = createWriteRegisterFrame(MODBUS_UNIT_ID, ADDR_PUMP_SPEED, speed, id);
    addLog({
      type: 'WRITE_PUMP',
      frame,
      description: 'Escrita de velocidade da bomba',
      value: speed,
      unit: '%',
    });
  }, [addLog, nextTxId]);

  // Envia um comando FC 6 para o setpoint
  const writeSetpoint = useCallback((value: number) => {
    const id = nextTxId();
    const frame = createWriteRegisterFrame(MODBUS_UNIT_ID, ADDR_SETPOINT, value, id);
    addLog({
      type: 'WRITE_SETPOINT',
      frame,
      description: 'Escrita de setpoint de nível',
      value,
      unit: '%',
    });
  }, [addLog, nextTxId]);

  /** Loop de simulação físico (roda no requestAnimationFrame) */
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (timestamp: number) => {
      const deltaMs = lastTickRef.current ? timestamp - lastTickRef.current : 16;
      lastTickRef.current = timestamp;
      const deltaSeconds = Math.min(deltaMs / 1000, 0.1); // Clamp para evitar saltos

      const currentLevel = levelRef.current;
      const currentSetpoint = setpointRef.current;
      const currentPumpActive = pumpActiveRef.current;
      const currentPumpSpeed = pumpSpeedRef.current;

      // --- Lógica de controle automático (malha fechada) ---
      let nextPumpActive = currentPumpActive;

      if (!currentPumpActive && currentLevel <= currentSetpoint - HYSTERESIS) {
        // Nível caiu abaixo do setpoint menos histerese -> liga bomba
        nextPumpActive = true;
        writePumpSpeed(currentPumpSpeed);
        setPumpActive(true);
        pumpActiveRef.current = true;
      } else if (currentPumpActive && currentLevel >= currentSetpoint) {
        // Nível atingiu o setpoint → desliga bomba
        nextPumpActive = false;
        writePumpSpeed(0);
        setPumpActive(false);
        pumpActiveRef.current = false;
      }

      // --- Física do tanque ---
      const fillRate = nextPumpActive
        ? physics.maxFillRatePerSecond * (currentPumpSpeed / 100)
        : 0;
      const netRate = fillRate - physics.drainRatePerSecond;
      const newLevel = Math.min(100, Math.max(0, currentLevel + netRate * deltaSeconds));

      levelRef.current = newLevel;
      setLevel(Math.round(newLevel * 10) / 10);

      const newFlowRate = Math.round(fillRate * 100 * 10) / 10;
      setFlowRate(newFlowRate);

      // --- Log de leituras a cada ~1 s (limitado por timestamp) ---
      const shouldLog = Math.floor(timestamp / 1000) > Math.floor((timestamp - deltaMs) / 1000);
      if (shouldLog) {
        const levelId = nextTxId();
        addLog({
          type: 'READ_LEVEL',
          frame: createReadInputRegisterFrame(MODBUS_UNIT_ID, newLevel, levelId),
          description: `Leitura de nível do tanque`,
          value: Math.round(newLevel * 10) / 10,
          unit: '%',
        });

        const flowId = nextTxId();
        addLog({
          type: 'READ_FLOW',
          frame: createReadInputRegisterFrame(MODBUS_UNIT_ID, newFlowRate, flowId),
          description: `Leitura de vazão de entrada`,
          value: newFlowRate,
          unit: 'm³/h',
        });

        // Alarme se o tanque transbordar ou esvaziar completamente
        if (newLevel >= 99.9) {
          addLog({ type: 'ALARM', frame: '', description: 'ALARME: Tanque no nível máximo!', value: newLevel, unit: '%' });
        } else if (newLevel <= 0.1) {
          addLog({ type: 'ALARM', frame: '', description: 'ALARME: Tanque vazio!', value: newLevel, unit: '%' });
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
    };
  }, [isRunning, physics, addLog, nextTxId, writePumpSpeed]);

  const clearLogs = useCallback(() => setLogs([]), []);

  const exportLogs = useCallback(() => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `water-level-controller-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [logs]);

  const handleSetpointChange = useCallback((value: number) => {
    const clamped = Math.max(5, Math.min(100, value));
    setSetpoint(clamped);
    setpointRef.current = clamped;
    if (isRunning) {
      writeSetpoint(clamped);
    }
  }, [isRunning, writeSetpoint]);

  // Registra a escrita inicial do setpoint no registrador holding ao iniciar o controlador
  useEffect(() => {
    if (isRunning) {
      writeSetpoint(setpointRef.current);
    }
  }, [isRunning, writeSetpoint]);

  const handlePumpSpeedChange = useCallback((delta: number) => {
    const next = Math.max(5, Math.min(100, pumpSpeedRef.current + delta));
    setPumpSpeed(next);
    pumpSpeedRef.current = next;
    if (isRunning && pumpActiveRef.current) {
      writePumpSpeed(next);
    }
  }, [isRunning, writePumpSpeed]);

  return {
    // Estado da simulação
    level,
    flowRate,
    pumpActive,
    setpoint,
    pumpSpeed,
    // Logs Modbus
    logs,
    clearLogs,
    exportLogs,
    // Controles
    handleSetpointChange,
    handlePumpSpeedChange,
  };
}
