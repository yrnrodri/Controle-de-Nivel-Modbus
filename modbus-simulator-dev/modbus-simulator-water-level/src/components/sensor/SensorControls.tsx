import React from 'react';

interface SensorControlsProps {
  isRunning: boolean;
  onToggle: () => void;
}

export function SensorControls({ isRunning, onToggle }: SensorControlsProps) {
  return (
    <button
      onClick={onToggle}
      className={`fancy-button w-full ${
        isRunning
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
    >
      {isRunning ? 'Stop Simulation' : 'Start Simulation'}
    </button>
  );
}