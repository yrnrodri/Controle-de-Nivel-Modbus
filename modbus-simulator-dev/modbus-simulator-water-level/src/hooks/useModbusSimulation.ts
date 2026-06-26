import { useState, useEffect, useRef } from 'react';
import { ModbusConfig, LogEntry } from '../types/modbus';
import { createModbusFrame, generateRandomValue, formatValue } from '../utils/modbusUtils';
import { formatTimestamp } from '../utils/dateUtils';

interface UseModbusSimulationProps {
  isRunning: boolean;
  config: ModbusConfig;
  range: { min: number; max: number };
  parameterName: string;
  unit: string;
}

export function useModbusSimulation({
  isRunning,
  config,
  range,
  parameterName,
  unit,
}: UseModbusSimulationProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const lastUpdateRef = useRef<number>(0);
  const intervalRef = useRef<number>();
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket setup
  useEffect(() => {
    if (isRunning) {
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isRunning]);

  // Data generation and broadcasting
  useEffect(() => {
    const generateLog = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 1000) {
        return;
      }
      
      lastUpdateRef.current = now;
      const value = generateRandomValue(range.min, range.max, config.functionCode);
      const currentTransactionId = config.autoIncrementTxId
        ? ((config.transactionId + logs.length) % 65535) || 1
        : config.transactionId;

      const frame = createModbusFrame({
        ...config,
        transactionId: currentTransactionId,
      }, value);

      const timestamp = formatTimestamp(new Date());
      const formattedValue = formatValue(value, config.functionCode);

      const newLog = {
        timestamp,
        deviceId: config.unitId,
        frame,
        value: formattedValue,
        parameterName,
        unit: config.functionCode <= 2 ? '' : unit,
      };

      // Broadcast to WebSocket if connected
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(newLog));
      }

      setLogs(prev => [...prev.slice(-49), newLog]);
    };

    if (isRunning) {
      // Generate first log immediately
      generateLog();
      
      // Use requestAnimationFrame for smoother updates
      const animate = () => {
        generateLog();
        intervalRef.current = requestAnimationFrame(animate);
      };
      
      intervalRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (intervalRef.current !== undefined) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isRunning, config, range, parameterName, unit, logs.length]);

  const clearLogs = () => {
    setLogs([]);
    lastUpdateRef.current = 0;
  };

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modbus-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { logs, clearLogs, exportLogs };
}