'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import DevicesList from '../components/DevicesList';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'devices'>('dashboard');
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="border-b border-gray-100">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'dashboard' 
                    ? 'border-sky-600 text-sky-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'devices' 
                    ? 'border-sky-600 text-sky-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Devices
              </button>
            </nav>
          </div>
        </div>
        
        <div className="py-4">
          {activeTab === 'dashboard' ? (
            <Dashboard />
          ) : (
            <DevicesList />
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} InventoryPro - Medical Devices Inventory Management
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm text-gray-500 mr-2">Connected to:</span>
              <span className="text-sm font-medium text-sky-600">
                Firebase Realtime Database
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
