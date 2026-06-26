import React from 'react';
import { MdInfo } from 'react-icons/md';
import { ValidationRule } from '../../types/modbus';

interface ConfigFieldProps {
  fieldKey: string;
  label: string;
  type?: string;
  tooltip?: string;
  component?: 'select';
  value: number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validationRule?: ValidationRule;
  options?: Record<number, string>;
}

export function ConfigField({
  fieldKey,
  label,
  type = 'number',
  tooltip,
  component,
  value,
  onChange,
  validationRule,
  options,
}: ConfigFieldProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 flex items-center gap-1">
        {label}
        {tooltip && (
          <div className="group relative">
            <MdInfo size={16} className="text-gray-400" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded hidden group-hover:block w-48 text-center z-10">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      
      {component === 'select' ? (
        <select
          value={value as number}
          onChange={onChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:border-blue-300 transition-colors"
        >
          {options && Object.entries(options).map(([code, description]) => (
            <option key={code} value={code}>
              {code.padStart(2, '0')} - {description}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          checked={type === 'checkbox' ? value as boolean : undefined}
          value={type === 'checkbox' ? undefined : value}
          onChange={onChange}
          min={type === 'number' ? validationRule?.min : undefined}
          max={type === 'number' ? validationRule?.max : undefined}
          className={
            type === 'checkbox'
              ? 'rounded border-gray-300 text-blue-500 focus:ring-blue-500'
              : 'w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:border-blue-300 transition-colors'
          }
        />
      )}
      
      {type === 'number' && validationRule && (
        <span className="text-xs text-gray-500">
          Range: {validationRule.min}-{validationRule.max}
        </span>
      )}
    </div>
  );
}