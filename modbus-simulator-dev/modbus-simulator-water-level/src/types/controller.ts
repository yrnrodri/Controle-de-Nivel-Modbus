/** Tipos de operação registrados no log do controlador. */
export type ControllerLogType =
  | 'READ_LEVEL'     // FC 4 — Leitura do nível (Input Register)
  | 'READ_FLOW'      // FC 4 — Leitura da vazão (Input Register)
  | 'WRITE_PUMP'     // FC 6 — Escrita da velocidade da bomba (Holding Register)
  | 'WRITE_SETPOINT' // FC 6 — Escrita do setpoint (Holding Register)
  | 'ALARM';         // Alarme de limite atingido

/** Entrada de log do controlador para exibição no terminal. */
export interface ControllerLogEntry {
  timestamp: string;
  type: ControllerLogType;
  /** Frame hexadecimal Modbus TCP gerado. */
  frame: string;
  /** Descrição legível do evento. */
  description: string;
  /** Valor numérico associado ao evento. */
  value: number;
  /** Unidade de medida do valor. */
  unit: string;
}

/** Parâmetros físicos da simulação do tanque. */
export interface TankPhysics {
  /** Volume máximo do tanque em m³. */
  maxVolume: number;
  /** Taxa de dreno passivo (consumo) em %/s. */
  drainRatePerSecond: number;
  /** Vazão máxima da bomba em %/s a 100% de velocidade. */
  maxFillRatePerSecond: number;
}

export const DEFAULT_TANK_PHYSICS: TankPhysics = {
  maxVolume: 2.8,
  drainRatePerSecond: 0.05,   // Tanque perde ~3%/min passivamente
  maxFillRatePerSecond: 0.4,  // A 100% de velocidade, enche ~24%/min
};
