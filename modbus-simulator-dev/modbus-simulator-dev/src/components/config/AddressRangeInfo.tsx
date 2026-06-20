import React from 'react';
import { FUNCTION_CODES } from '../../types/modbus';

interface AddressRangeInfoProps {
  startingAddress: number;
  endingAddress: number;
  numRegisters: number;
  functionCode: number;
}

export function AddressRangeInfo({
  startingAddress,
  endingAddress,
  numRegisters,
  functionCode,
}: AddressRangeInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="text-sm">
        <span className="font-medium">Address Range: </span>
        {startingAddress} - {endingAddress} ({numRegisters} registers)
      </div>
      {functionCode in FUNCTION_CODES && (
        <div className="text-sm mt-1">
          <span className="font-medium">Selected Function: </span>
          {FUNCTION_CODES[functionCode as keyof typeof FUNCTION_CODES]}
        </div>
      )}
    </div>
  );
}