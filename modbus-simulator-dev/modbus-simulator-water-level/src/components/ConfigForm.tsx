import React from 'react';
import { ModbusConfig, VALIDATION_RULES, FUNCTION_CODES } from '../types/modbus';
import { Info } from 'lucide-react';

interface ConfigFormProps {
  config: ModbusConfig;
  onChange: (config: ModbusConfig) => void;
  error: string | null;
  hideRangeInfo?: boolean;
}

export function ConfigForm({ config, onChange, error, hideRangeInfo }: ConfigFormProps) {
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

  const fields: Array<{ 
    key: keyof ModbusConfig; 
    label: string;
    type?: string;
    tooltip?: string;
    component?: 'select';
  }> = [
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
      key: 'unitId', 
      label: 'Unit ID',
      tooltip: 'Slave device identifier (1-247)'
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
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map(({ key, label, type = 'number', tooltip, component }) => (
          <div key={key} className="relative">
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              {label}
              {tooltip && (
                <div className="group relative">
                  <Info size={16} className="text-gray-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded hidden group-hover:block w-48 text-center">
                    {tooltip}
                  </div>
                </div>
              )}
            </label>
            {component === 'select' ? (
              <select
                value={config[key]}
                onChange={handleChange(key)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Object.entries(FUNCTION_CODES).map(([code, description]) => (
                  <option key={code} value={code}>
                    {code.padStart(2, '0')} - {description}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                checked={type === 'checkbox' ? config[key] as boolean : undefined}
                value={type === 'checkbox' ? undefined : config[key]}
                onChange={handleChange(key)}
                min={type === 'number' ? VALIDATION_RULES[key]?.min : undefined}
                max={type === 'number' ? VALIDATION_RULES[key]?.max : undefined}
                className={
                  type === 'checkbox'
                    ? 'rounded border-gray-300 text-blue-500 focus:ring-blue-500'
                    : 'w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                }
              />
            )}
            {type === 'number' && VALIDATION_RULES[key] && (
              <span className="text-xs text-gray-500">
                Range: {VALIDATION_RULES[key].min}-{VALIDATION_RULES[key].max}
              </span>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      {!hideRangeInfo && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm">
            <span className="font-medium">Address Range: </span>
            {config.startingAddress} - {config.endingAddress} ({config.numRegisters} registers)
          </div>
          {config.functionCode in FUNCTION_CODES && (
            <div className="text-sm mt-1">
              <span className="font-medium">Selected Function: </span>
              {FUNCTION_CODES[config.functionCode as keyof typeof FUNCTION_CODES]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}