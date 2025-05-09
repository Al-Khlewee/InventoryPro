import React, { useState } from 'react';
import { MedicalDevice } from '../types/medical-device';
import DeviceDetails from './DeviceDetails';

interface DeviceCardProps {
  device: MedicalDevice;
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-gray-800 truncate max-w-[80%]">
            {device.deviceName}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsDetailsVisible(!isDetailsVisible)}
              className="text-sky-600 hover:text-sky-800 text-sm font-medium"
            >
              {isDetailsVisible ? 'Less' : 'More'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
            >
              Full View
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">ID:</span> {device.id}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Model:</span> {device.model}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Manufacturer:</span> {device.manufacturer}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">S/N:</span> {device.serialNumber}
          </div>
        </div>

        {isDetailsVisible && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Additional Details</h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600">
                <span className="font-medium">Supplier:</span> {device.supplier}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Country of Origin:</span> {device.countryOfOrigin}
              </div>
              <div className="text-gray-600 col-span-2">
                <span className="font-medium">Recipient:</span> {device.recipientName}
              </div>
              <div className="text-gray-600 col-span-2">
                <span className="font-medium">ITM Code:</span> {device.itmCode}
              </div>
              {device.accessories && (
                <div className="text-gray-600 col-span-2">
                  <span className="font-medium">Accessories:</span> {device.accessories?.substring(0, 100)}{device.accessories?.length > 100 ? '...' : ''}
                </div>
              )}
              {device.remarks && (
                <div className="text-gray-600 col-span-2">
                  <span className="font-medium">Remarks:</span> {device.remarks}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-medium">
            {device.department}
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
            Quantity: {device.quantity}
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Received:</span> {device.dateReceived} • 
            <span className="font-medium ml-1">Warranty:</span> {device.warrantyPeriod}
          </p>
        </div>
      </div>

      {/* Full details modal */}
      {isModalOpen && (
        <DeviceDetails device={device} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}