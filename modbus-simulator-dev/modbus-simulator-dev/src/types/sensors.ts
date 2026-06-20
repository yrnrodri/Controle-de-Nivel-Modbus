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

export const SENSOR_TYPES: SensorType[] = [
  {
    id: 'temperature',
    label: 'Temperature Sensor',
    config: {
      min: 0,
      max: 100,
      unit: '°C',
      name: 'Temperature',
      parameterName: 'Temperature',
      unitId: 1,
      modbusConfig: { ...DEFAULT_MODBUS_CONFIG }
    }
  },
  {
    id: 'pressure',
    label: 'Pressure Sensor',
    config: {
      min: 0,
      max: 10,
      unit: 'bar',
      name: 'Pressure',
      parameterName: 'Pressure',
      unitId: 2,
      modbusConfig: { ...DEFAULT_MODBUS_CONFIG }
    }
  },
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