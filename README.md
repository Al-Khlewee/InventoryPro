# InventoryPro - Medical Devices Inventory System

A web application for tracking and managing medical device inventory with Firebase Realtime Database integration.

## Features

- **Dashboard View**: Overview of key metrics and statistics for all medical devices
- **Device Management**: List, filter, sort, and search for medical devices
- **Add/Edit Devices**: Create new device entries and modify existing ones
- **Delete Devices**: Remove devices from the inventory
- **Responsive UI**: Works on mobile and desktop devices
- **Real-time Data**: Connected to Firebase Realtime Database
- **Detailed Device Info**: View comprehensive details for each device

## Tech Stack

- Next.js 15
- React 19
- Firebase Realtime Database
- TypeScript
- TailwindCSS

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Al-Khlewee/InventoryPro.git
   cd InventoryPro
   ```

2. Install the dependencies:
   ```bash
   cd inventory-pro
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

The application connects to Firebase using the configuration in `src/lib/firebase.ts`. If you want to use your own Firebase project, update the configuration with your own Firebase settings.

### Database Structure

The application expects a Firebase Realtime Database with a structure like:

```
{
  "medical_devices": {
    "device_key_1": {
      "id": 1,
      "deviceName": "Device 1",
      ...other device fields
    },
    "device_key_2": {
      "id": 2,
      "deviceName": "Device 2",
      ...other device fields
    }
  }
}
```

## License

[MIT](LICENSE)
