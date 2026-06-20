import { ModbusConfig, VALIDATION_RULES } from '../types/modbus';

export interface ModbusConfig {
  transactionId: number;
  functionCode: number;
  scaleFactor: number;
  numRegisters: number;
  startingAddress: number;
  endingAddress: number;
  autoIncrementTxId: boolean;
  unitId: number;
}

export interface ValidationRule {
  min: number;
  max: number;
  message: string;
}

export interface LogEntry {
  timestamp: string;
  deviceId: number;
  frame: string;
  value: string;
  parameterName: string;
  unit: string;
}

export const FUNCTION_CODES = {
  1: 'Read Coils',
  2: 'Read Discrete Inputs',
  3: 'Read Holding Registers',
  4: 'Read Input Registers',
  7: 'Read Exception Status'
} as const;

export interface FunctionCodeDescription {
  name: string;
  purpose: string;
  usage: string;
  code: string;
}

export const FUNCTION_CODE_DESCRIPTIONS: Record<number, FunctionCodeDescription> = {
  1: {
    name: 'Read Coils',
    purpose: 'Reads coil (bobin) states from the slave device. Coils are 1-bit digital outputs (on/off).',
    usage: 'Used to read digital output states (e.g., relay open/closed).',
    code: '0x01'
  },
  2: {
    name: 'Read Discrete Inputs',
    purpose: 'Reads digital input (discrete input) states from the slave device. These inputs are 1-bit.',
    usage: 'Used to get information from digital sensors (e.g., button state).',
    code: '0x02'
  },
  3: {
    name: 'Read Holding Registers',
    purpose: 'Reads holding registers from the slave device. Holding registers are 16-bit and can be modified.',
    usage: 'Used to read & write analog values like temperature setpoints, calibration data, or control parameters.',
    code: '0x03'
  },
  4: {
    name: 'Read Input Registers',
    purpose: 'Reads input registers, which are read-only and provide real-time sensor data.',
    usage: 'Used to get real-time data from sensors (e.g., live temperature readings).',
    code: '0x04'
  },
  7: {
    name: 'Read Exception Status',
    purpose: 'Reads error states from the slave device.',
    usage: 'Used to monitor errors, alarms, or fault statuses.',
    code: '0x07'
  }
};

export const VALIDATION_RULES: Record<keyof Omit<ModbusConfig, 'autoIncrementTxId' | 'endingAddress' | 'unitId'>, ValidationRule> = {
  transactionId: {
    min: 1,
    max: 65535,
    message: 'Transaction ID must be between 1 and 65535',
  },
  functionCode: {
    min: 1,
    max: 16,
    message: 'Function Code must be between 1 and 16',
  },
  scaleFactor: {
    min: 1,
    max: 100,
    message: 'Scale Factor must be between 1 and 100',
  },
  numRegisters: {
    min: 1,
    max: 125,
    message: 'Number of Registers must be between 1 and 125',
  },
  startingAddress: {
    min: 1,
    max: 9999,
    message: 'Starting Address must be between 1 and 9999',
  },
};