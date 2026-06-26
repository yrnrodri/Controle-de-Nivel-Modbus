import { ModbusConfig, VALIDATION_RULES } from '../types/modbus';

export const PROTOCOL_ID = 0x0000;

// Function code specific data generators
function generateCoilData(): boolean {
  return Math.random() > 0.5;
}

function generateDiscreteInputData(): boolean {
  return Math.random() > 0.5;
}

function generateRegisterData(min: number, max: number, scaleFactor: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min) * scaleFactor;
}

function generateExceptionStatus(): number {
  return Math.floor(Math.random() * 256);
}

export function generateRandomValue(min: number, max: number, functionCode: number): number | boolean {
  switch (functionCode) {
    case 1: return generateCoilData();
    case 2: return generateDiscreteInputData();
    case 3:
    case 4: return generateRegisterData(min, max, 1);
    case 7: return generateExceptionStatus();
    default: return 0;
  }
}

export function createModbusFrame(config: ModbusConfig, value: number | boolean): string {
  let dataBytes: number[] = [];

  switch (config.functionCode) {
    case 1:
    case 2:
      dataBytes = [(value as boolean) ? 0x01 : 0x00];
      break;
    case 3:
    case 4: {
      const scaledValue = new Int16Array([(value as number) * config.scaleFactor]);
      dataBytes = [(scaledValue[0] >> 8) & 0xFF, scaledValue[0] & 0xFF];
      break;
    }
    case 7:
      dataBytes = [(value as number) & 0xFF];
      break;
  }

  const dataLength = 2 + dataBytes.length;

  const frame = [
    (config.transactionId >> 8) & 0xFF,
    config.transactionId & 0xFF,
    (PROTOCOL_ID >> 8) & 0xFF,
    PROTOCOL_ID & 0xFF,
    (dataLength >> 8) & 0xFF,
    dataLength & 0xFF,
    config.unitId & 0xFF,
    config.functionCode & 0xFF,
    ...dataBytes,
  ];

  return frame.map((byte) => byte.toString(16).padStart(2, '0')).join(' ').toUpperCase();
}

export function validateConfig(config: ModbusConfig): string | null {
  for (const [key, rule] of Object.entries(VALIDATION_RULES)) {
    const value = config[key as keyof typeof VALIDATION_RULES];
    if (value === undefined || value < rule.min || value > rule.max) {
      return rule.message;
    }
  }
  return null;
}

export function formatValue(value: number | boolean, functionCode: number): string {
  switch (functionCode) {
    case 1:
    case 2:
      return (value as boolean) ? 'ON' : 'OFF';
    case 7:
      return `0x${(value as number).toString(16).toUpperCase().padStart(2, '0')}`;
    default:
      return value.toString();
  }
}

/**
 * Gera um frame Modbus TCP para FC 6 — Write Single Register.
 * Usado pelo controlador para enviar a velocidade da bomba ao dispositivo escravo.
 */
export function createWriteRegisterFrame(
  unitId: number,
  address: number,
  value: number,
  txId: number
): string {
  const clampedValue = Math.max(0, Math.min(65535, Math.round(value)));
  const registerAddress = Math.max(0, address - 1);
  const pduLength = 6;

  const frame = [
    (txId >> 8) & 0xFF,
    txId & 0xFF,
    (PROTOCOL_ID >> 8) & 0xFF,
    PROTOCOL_ID & 0xFF,
    (pduLength >> 8) & 0xFF,
    pduLength & 0xFF,
    unitId & 0xFF,
    0x06,
    (registerAddress >> 8) & 0xFF,
    registerAddress & 0xFF,
    (clampedValue >> 8) & 0xFF,
    clampedValue & 0xFF,
  ];

  return frame.map((byte) => byte.toString(16).padStart(2, '0')).join(' ').toUpperCase();
}

/**
 * Gera um frame Modbus TCP para FC 4 — Read Input Registers (resposta).
 * Usado pelo controlador para registrar leituras de nível e vazão.
 * O valor é multiplicado por 10 para preservar uma casa decimal como inteiro.
 */
export function createReadInputRegisterFrame(
  unitId: number,
  address: number,
  value: number,
  txId: number
): string {
  const scaledValue = Math.max(0, Math.round(value * 10));
  const registerAddress = Math.max(0, address - 1);
  const byteCount = 2;
  const pduLength = 2 + 1 + byteCount;

  const frame = [
    (txId >> 8) & 0xFF,
    txId & 0xFF,
    (PROTOCOL_ID >> 8) & 0xFF,
    PROTOCOL_ID & 0xFF,
    (pduLength >> 8) & 0xFF,
    pduLength & 0xFF,
    unitId & 0xFF,
    0x04,
    byteCount,
    (scaledValue >> 8) & 0xFF,
    scaledValue & 0xFF,
  ];

  return frame.map((byte) => byte.toString(16).padStart(2, '0')).join(' ').toUpperCase();
}