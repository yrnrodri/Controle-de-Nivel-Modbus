export interface SensorConfig {
  min: number;
  max: number;
  unit: string;
  name: string;
  parameterName: string;
  unitId: number;
  modbusConfig: ModbusConfig;
}

export interface SensorType {
  id: string;
  label: string;
  config: SensorConfig;
}

const DEFAULT_MODBUS_CONFIG = {
  transactionId: 1,
  functionCode: 3,
  scaleFactor: 10,
  numRegisters: 2,
  startingAddress: 1,
  endingAddress: 2,
  autoIncrementTxId: true,
};

// Apenas o sensor de vazão permanece como sensor genérico configurável.
// Nível e bomba são gerenciados exclusivamente pelo controlador automático.
export const SENSOR_TYPES: SensorType[] = [
  {
    id: 'flow',
    label: 'Flow Sensor',
    config: {
      min: 0,
      max: 100,
      unit: 'm³/h',
      name: 'Flow',
      parameterName: 'Flow Rate',
      unitId: 3,
      modbusConfig: { ...DEFAULT_MODBUS_CONFIG }
    }
  }
];