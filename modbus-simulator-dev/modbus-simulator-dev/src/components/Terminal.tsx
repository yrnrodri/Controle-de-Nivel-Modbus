import React from 'react';
import { MdTerminal, MdDownload, MdDelete } from 'react-icons/md';
import { LogEntry } from '../types/modbus';

interface TerminalProps {
  logs: LogEntry[];
  onClear: () => void;
  onExport: () => void;
  title: string;
}

export function Terminal({ logs, onClear, onExport, title }: TerminalProps) {
  const terminalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal-window h-full flex flex-col">
      <div className="flex items-center justify-between p-1.5 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-gray-400">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <MdTerminal size={12} />
            <span className="font-mono text-xs truncate max-w-[120px] lg:max-w-none">{title}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onExport}
            className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded hover:bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
            title="Export"
          >
            <MdDownload size={12} />
            <span className="hidden sm:inline text-xs">Export</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded hover:bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
            title="Clear"
          >
            <MdDelete size={12} />
            <span className="hidden sm:inline text-xs">Clear</span>
          </button>
        </div>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 font-mono text-[11px] leading-tight text-green-400 overflow-y-auto p-1.5"
      >
        <div className="space-y-0.5">
          {logs.map((log, index) => (
            <div key={index} className="opacity-90 hover:opacity-100">
              <span className="text-gray-500">[{log.timestamp}]</span>{' '}
              <span className="text-blue-400">Device {log.deviceId}</span> |{' '}
              <span className="text-purple-400 break-all">Frame: {log.frame}</span> |{' '}
              <span className="text-green-400">{log.parameterName}: {log.value}{log.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}