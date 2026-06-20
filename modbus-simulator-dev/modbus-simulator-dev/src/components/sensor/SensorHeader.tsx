import React from 'react';
import { MdEdit, MdTag, MdSwapVert } from 'react-icons/md';
import { SensorType } from '../../types/sensors';

interface SensorHeaderProps {
  sensor: SensorType;
  range: { min: number; max: number };
  isEditingRange: boolean;
  onEditRange: () => void;
  onRangeChange: (range: { min: number; max: number }) => void;
  onRangeSubmit: (e: React.FormEvent) => void;
  isRunning: boolean;
}

export function SensorHeader({
  sensor,
  range,
  isEditingRange,
  onEditRange,
  onRangeChange,
  onRangeSubmit,
  isRunning,
}: SensorHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="grid grid-cols-2 gap-6">
        {/* Range Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <MdSwapVert size={20} className="flex-shrink-0" />
            <span className="text-sm font-semibold tracking-wide uppercase">Range</span>
          </div>
          {!isEditingRange ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-medium text-gray-800">
                  {range.min} - {range.max}
                </span>
                <span className="text-sm text-blue-600 font-medium">{sensor.config.unit}</span>
              </div>
              <button
                onClick={onEditRange}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
                         transform hover:-translate-y-0.5 transition-all duration-300 
                         shadow-sm hover:shadow-md"
                title="Edit Range"
              >
                <MdEdit size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={onRangeSubmit} className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <input
                  type="number"
                  value={range.min}
                  onChange={(e) => onRangeChange({ ...range, min: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-lg bg-white/80 border border-blue-200 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                           hover:border-blue-300"
                  placeholder="Min"
                />
                <span className="text-xs text-blue-600 font-medium pl-1">Minimum</span>
              </div>
              <div className="flex items-center h-full pt-3">
                <div className="w-8 h-0.5 bg-blue-200 rounded-full"></div>
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="number"
                  value={range.max}
                  onChange={(e) => onRangeChange({ ...range, max: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-lg bg-white/80 border border-blue-200 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                           hover:border-blue-300"
                  placeholder="Max"
                />
                <span className="text-xs text-blue-600 font-medium pl-1">Maximum</span>
              </div>
              <button
                type="submit"
                className="h-[42px] px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 
                         transform hover:-translate-y-0.5 transition-all duration-300 
                         shadow-sm hover:shadow-md"
              >
                Save
              </button>
            </form>
          )}
        </div>

        {/* Device ID Section */}
        <div className="space-y-3 border-l border-blue-100 pl-6">
          <div className="flex items-center gap-2 text-blue-700">
            <MdTag size={20} className="flex-shrink-0" />
            <span className="text-sm font-semibold tracking-wide uppercase">Device ID</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-medium text-gray-800">
                {sensor.config.unitId}
              </span>
              <span className="text-sm text-blue-600 font-medium">Unit Identifier</span>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}