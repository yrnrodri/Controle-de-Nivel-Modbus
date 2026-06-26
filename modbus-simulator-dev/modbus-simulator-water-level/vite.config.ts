import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { WebSocketServer } from 'ws';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'websocket-server',
      configureServer(server) {
        const wss = new WebSocketServer({ noServer: true });
        const clients = new Set<WebSocket>();

        server.httpServer?.on('upgrade', (request, socket, head) => {
          if (request.url === '/ws') {
            wss.handleUpgrade(request, socket, head, (ws) => {
              wss.emit('connection', ws, request);
            });
          }
        });

        wss.on('connection', (ws) => {
          clients.add(ws);
          console.log('Client connected');

          // Send client ID
          const clientId = Math.random().toString(36).substr(2, 9);
          ws.send(JSON.stringify({ type: 'client_id', client_id: clientId }));

          ws.on('close', () => {
            clients.delete(ws);
            console.log('Client disconnected');
          });
        });

        // Add broadcast method to server context
        server.ws = {
          broadcast: (data: any) => {
            clients.forEach((client) => {
              if (client.readyState === 1) { // OPEN
                client.send(JSON.stringify(data));
              }
            });
          }
        };
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

declare module 'vite' {
  interface ViteDevServer {
    ws?: {
      broadcast: (data: any) => void;
    };
  }
}