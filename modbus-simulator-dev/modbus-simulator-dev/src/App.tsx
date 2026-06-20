import React, { useEffect, useState } from 'react';
import { ModbusSimulator } from './components/ModbusSimulator';
import { Footer } from './components/Footer';

function App() {
  const [countdown, setCountdown] = useState(180);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShouldRefresh(true);
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      // Give time for simulations to stop gracefully
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [shouldRefresh]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 gradient-bg">
        <ModbusSimulator countdown={countdown} shouldRefresh={shouldRefresh} />
      </main>
      <Footer />
    </div>
  );
}

export default App;