[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tunasakar_modbus-simulator&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=tunasakar_modbus-simulator)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=tunasakar_modbus-simulator&metric=bugs)](https://sonarcloud.io/summary/new_code?id=tunasakar_modbus-simulator)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=tunasakar_modbus-simulator&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=tunasakar_modbus-simulator)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=tunasakar_modbus-simulator&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=tunasakar_modbus-simulator)
[![SonarCloud](https://github.com/tunasakar/modbus-simulator/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/tunasakar/modbus-simulator/actions/workflows/sonarcloud.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Modbus TCP Multi-Sensor Simulator

A modern, real-time Modbus TCP simulator for industrial sensors with a beautiful React interface. Simulate multiple industrial sensors simultaneously and generate Modbus TCP frames in real-time.

## 🚀 Demo

Experience the simulator live at [**modbus.tunasakar.com**](https://modbus.tunasakar.com)  
An interactive Modbus TCP environment, reset every 3 minutes for a clean demo cycle.

> 🔗 Hosted publicly for educational & integration testing purposes.

## 🌟 Features

- **Multi-Sensor Support**: Simulate multiple industrial sensors simultaneously
- **Real-time Frame Generation**: Generate Modbus TCP frames in real-time
- **Configurable Parameters**: Adjust sensor ranges, function codes, and Modbus parameters
- **Export Capability**: Export simulation logs for analysis
- **Function Code Reference**: Built-in documentation for Modbus function codes
- **Auto-Refresh**: Page automatically refreshes every 180 seconds to maintain optimal performance

### Supported Sensors

- Temperature Sensor (°C)
- Pressure Sensor (bar)
- Flow Sensor (m³/h)

### Supported Modbus Function Codes

- `0x01` - Read Coils
- `0x02` - Read Discrete Inputs
- `0x03` - Read Holding Registers
- `0x04` - Read Input Registers
- `0x07` - Read Exception Status

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tunasakar/modbus-simulator.git
cd modbus-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 💻 Usage

1. **Configure Sensor Parameters**:
   - Adjust the sensor range (min/max values)
   - Set the Modbus parameters (Transaction ID, Unit ID, etc.)
   - Select the appropriate function code

2. **Start Simulation**:
   - Click "Start Simulation" for each sensor you want to activate
   - Monitor real-time Modbus frames and values in the terminal window

3. **Export Data**:
   - Use the export button to save simulation logs
   - Logs are saved in JSON format for further analysis

> **Note**: The simulator automatically refreshes every 60 seconds to ensure optimal performance and prevent memory leaks during extended demo sessions.

## 🔌 WebSocket Integration

The simulator provides a WebSocket interface for real-time data access. Connect to:

```
ws://localhost:5173/ws
```

Example message format:
```json
{
  "timestamp": "14:30:45",
  "deviceId": 1,
  "frame": "00 01 00 00 00 06 01 03 00 6B 00 03",
  "value": "23.5",
  "parameterName": "Temperature",
  "unit": "°C"
}
```

## 🛠️ Technical Details

### Built With

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React Icons

### Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

# Timer Control Documentation

## Overview
The demo environment timer can be controlled through environment variables. This document explains how to disable or enable the timer display.

## Configuration

### Using Environment Variables

Create or modify the `.env` file in your project root:

```env
VITE_SHOW_TIMER=false
```

### Values
- `true` - Shows the timer (default)
- `false` - Hides the timer

## Implementation Details

The timer visibility is controlled by the `showTimer` state in `ModbusSimulator.tsx`. To properly implement this:

1. Update your `.env` file with the desired setting
2. The environment variable will be automatically loaded by Vite
3. The timer section will be conditionally rendered based on this setting

## Example Usage

```typescript
// In ModbusSimulator.tsx
const showTimer = import.meta.env.VITE_SHOW_TIMER !== 'false';
```

## Notes
- The timer functionality continues to run in the background even when hidden.
- Changes to the environment variable require a restart of the development server.
- For production builds, ensure the environment variable is set during the build process.


## 📝 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Tuna Sakar**
- DevOps & Platform Engineer
- IIoT Enthusiast

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/tunasakar/modbus-simulator/issues).

## ⭐ Show your support

Give a ⭐️ if this project helped you!