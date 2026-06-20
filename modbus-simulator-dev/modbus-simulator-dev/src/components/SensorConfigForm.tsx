import React from 'react';
import { ModbusConfig, VALIDATION_RULES, FUNCTION_CODES } from '../types/modbus';
import { ConfigField } from './config/ConfigField';

interface ConfigFormProps {
  config: ModbusConfig;
  onChange: (config: ModbusConfig) => void;
  error: string | null;
}

const CONFIG_FIELDS = [
  { 
    key: 'transactionId', 
    label: 'Transaction ID',
    tooltip: 'Unique identifier for each Modbus request'
  },
  { 
    key: 'autoIncrementTxId', 
    label: 'Auto-increment Transaction ID', 
    type: 'checkbox',
    tooltip: 'Automatically increment Transaction ID for each new frame'
  },
  { 
    key: 'functionCode', 
    label: 'Function Code',
    tooltip: 'Modbus function code for the operation',
    component: 'select'
  },
  { 
    key: 'scaleFactor', 
    label: 'Scale Factor',
    tooltip: 'Multiplier for the register value'
  },
  { 
    key: 'numRegisters', 
    label: 'Number of Registers',
    tooltip: 'Number of consecutive registers to access'
  },
  { 
    key: 'startingAddress', 
    label: 'Starting Address',
    tooltip: 'First register address to access'
  },
] as const;

export function SensorConfigForm({ config, onChange, error }: ConfigFormProps) {
  const handleChange = (field: keyof ModbusConfig) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : Number(e.target.value);
    
    if (field === 'startingAddress') {
      const endingAddress = value + config.numRegisters - 1;
      onChange({ ...config, [field]: value, endingAddress });
    } else if (field === 'numRegisters') {
      const endingAddress = config.startingAddress + value - 1;
      onChange({ ...config, [field]: value, endingAddress });
    } else {
      onChange({ ...config, [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONFIG_FIELDS.map(({ key, label, type = 'number', tooltip, component }) => (
          <ConfigField
            key={key}
            fieldKey={key}
            label={label}
            type={type}
            tooltip={tooltip}
            component={component}
            value={config[key as keyof ModbusConfig]}
            onChange={handleChange(key as keyof ModbusConfig)}
            validationRule={VALIDATION_RULES[key as keyof typeof VALIDATION_RULES]}
            options={component === 'select' ? FUNCTION_CODES : undefined}
          />
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}