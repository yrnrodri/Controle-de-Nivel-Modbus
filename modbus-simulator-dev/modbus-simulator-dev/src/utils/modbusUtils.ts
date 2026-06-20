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
  // Generate random exception status (0-255)
  return Math.floor(Math.random() * 256);
}

export function generateRandomValue(min: number, max: number, functionCode: number): number | boolean {
  switch (functionCode) {
    case 1: // Read Coils
      return generateCoilData();
    case 2: // Read Discrete Inputs
      return generateDiscreteInputData();
    case 3: // Read Holding Registers
    case 4: // Read Input Registers
      return generateRegisterData(min, max, 1);
    case 7: // Read Exception Status
      return generateExceptionStatus();
    default:
      return 0;
  }
}

export function createModbusFrame(
  config: ModbusConfig,
  value: number | boolean
): string {
  let dataBytes: number[] = [];
  
  // Convert value to appropriate format based on function code
  switch (config.functionCode) {
    case 1: // Read Coils
    case 2: // Read Discrete Inputs
      dataBytes = [(value as boolean) ? 0x01 : 0x00];
      break;
    case 3: // Read Holding Registers
    case 4: // Read Input Registers
      const scaledValue = new Int16Array([(value as number) * config.scaleFactor]);
      dataBytes = [
        (scaledValue[0] >> 8) & 0xFF,
        scaledValue[0] & 0xFF
      ];
      break;
    case 7: // Read Exception Status
      dataBytes = [value as number & 0xFF];
      break;
  }

  const dataLength = 2 + dataBytes.length; // Unit ID (1) + Function Code (1) + Data

  const frame = [
    // Transaction ID (2 bytes)
    (config.transactionId >> 8) & 0xFF,
    config.transactionId & 0xFF,
    // Protocol ID (2 bytes)
    (PROTOCOL_ID >> 8) & 0xFF,
    PROTOCOL_ID & 0xFF,
    // Length (2 bytes)
    (dataLength >> 8) & 0xFF,
    dataLength & 0xFF,
    // Unit ID (1 byte)
    config.unitId & 0xFF,
    // Function Code (1 byte)
    config.functionCode & 0xFF,
    // Data
    ...dataBytes
  ];

  return frame
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ')
    .toUpperCase();
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
    case 1: // Read Coils
    case 2: // Read Discrete Inputs
      return (value as boolean) ? 'ON' : 'OFF';
    case 7: // Read Exception Status
      return `0x${(value as number).toString(16).toUpperCase().padStart(2, '0')}`;
    default:
      return value.toString();
  }
}