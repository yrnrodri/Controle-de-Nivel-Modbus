import React from 'react';

interface TankVisualProps {
  level: number;       // 0–100%
  setpoint: number;    // linha de setpoint (0–100%)
  pumpActive: boolean;
}

export function TankVisual({ level, setpoint, pumpActive }: TankVisualProps) {
  // Cor da água muda conforme o nível
  const waterColor =
    level >= 90
      ? 'from-red-400 to-red-600'
      : level <= 15
      ? 'from-orange-300 to-orange-500'
      : 'from-cyan-400 to-blue-600';

  const levelClamped = Math.min(100, Math.max(0, level));

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Escala lateral + tanque */}
      <div className="flex items-stretch gap-2 w-full max-w-[160px]">
        {/* Escala de porcentagem */}
        <div className="flex flex-col justify-between text-[10px] text-gray-400 font-mono py-1 w-7 text-right">
          {[100, 75, 50, 25, 0].map((v) => (
            <span key={v}>{v}%</span>
          ))}
        </div>

        {/* Corpo do tanque */}
        <div
          className="relative flex-1 rounded-b-2xl rounded-t-md border-2 border-blue-300 bg-gray-100 overflow-hidden"
          style={{ height: 200 }}
          aria-label={`Nível do tanque: ${levelClamped.toFixed(1)}%`}
          role="img"
        >
          {/* Linha de setpoint */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 z-10 transition-all duration-300"
            style={{ bottom: `${setpoint}%` }}
            title={`Setpoint: ${setpoint}%`}
          >
            <span className="absolute right-1 -top-3.5 text-[9px] text-yellow-600 font-semibold bg-yellow-50 rounded px-0.5">
              SP {setpoint}%
            </span>
          </div>

          {/* Água */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${waterColor} transition-all duration-700 ease-in-out`}
            style={{ height: `${levelClamped}%` }}
          >
            {/* Animação de ondulação quando bomba ativa */}
            {pumpActive && (
              <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden">
                <div className="wave-animation w-full h-full opacity-50" />
              </div>
            )}
          </div>

          {/* Texto do nível no centro */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span
              className={`text-sm font-bold font-mono drop-shadow-sm ${
                levelClamped > 40 ? 'text-white' : 'text-blue-700'
              }`}
            >
              {levelClamped.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Status da bomba */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            pumpActive ? 'bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-gray-300'
          }`}
        />
        <span className={`text-xs font-semibold ${pumpActive ? 'text-green-600' : 'text-gray-400'}`}>
          Bomba {pumpActive ? 'LIGADA' : 'DESLIGADA'}
        </span>
      </div>
    </div>
  );
}
