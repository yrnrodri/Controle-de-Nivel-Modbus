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
  1: 'Read Input Registers',
  2: 'Write Single Register'
} as const;

export interface FunctionCodeDescription {
  name: string;
  purpose: string;
  usage: string;
  code: string;
}

export const FUNCTION_CODE_DESCRIPTIONS: Record<number, FunctionCodeDescription> = {

  1: {
    name: 'Ler Registradores de Entrada',
    purpose: 'Lê registradores de entrada, que são somente leitura e fornecem dados de sensores em tempo real.',
    usage: 'Usado para obter dados em tempo real de sensores (por exemplo, leituras de temperatura em tempo real).',
    code: '0x04'
  },
  2: {
    name: 'Escrever Um Único Registrador de Memória',
    purpose: 'Escreve um valor em um único registrador de memória do dispositivo escravo.',
    usage: 'Usado para definir parâmetros de controle, como velocidade da bomba, setpoint ou posição da válvula.',
    code: '0x06'
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