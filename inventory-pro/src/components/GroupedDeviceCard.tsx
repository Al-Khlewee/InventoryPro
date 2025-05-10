import React, { useState } from 'react';
import { MedicalDevice } from '../types/medical-device';
import { GroupedDevice } from '../hooks/useGroupedDevices';
import GroupedDeviceDetails from './GroupedDeviceDetails';

interface GroupedDeviceCardProps {
  groupedDevice: GroupedDevice;
  onEdit: (device: MedicalDevice) => void;
  onDelete: (deviceId: number) => Promise<boolean>;
}

export default function GroupedDeviceCard({ 
  groupedDevice, 
  onEdit, 
  onDelete 
}: GroupedDeviceCardProps) {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    deviceName, 
    model, 
    manufacturer, 
    totalQuantity, 
    department, 
    devices
  } = groupedDevice;

  // Get the first device's serial number to show as a sample
  const sampleSerialNumber = devices[0]?.serialNumber;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-gray-800 truncate max-w-[80%]">
            {deviceName}
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
            <span className="font-medium">ITM Code:</span> {groupedDevice.itmCode}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Model:</span> {model}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Manufacturer:</span> {manufacturer}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">S/N Sample:</span> {sampleSerialNumber ? `${sampleSerialNumber.substring(0, 12)}...` : 'N/A'}
          </div>
        </div>

        {isDetailsVisible && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Additional Details</h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600">
                <span className="font-medium">Supplier:</span> {groupedDevice.supplier}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Country of Origin:</span> {groupedDevice.countryOfOrigin}
              </div>
              <div className="text-gray-600 col-span-2">
                <span className="font-medium">Units:</span> {devices.length}
              </div>
              {devices[0]?.accessories && (
                <div className="text-gray-600 col-span-2">
                  <span className="font-medium">Accessories:</span> {devices[0].accessories.substring(0, 100)}{devices[0].accessories.length > 100 ? '...' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-medium">
            {department}
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
            Total Qty: {totalQuantity}
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            <span className="font-medium ml-1">Last Received:</span> {groupedDevice.dateReceived} •
            <span className="font-medium ml-1">Warranty:</span> {groupedDevice.warrantyPeriod}
          </p>
        </div>
      </div>

      {/* Full details modal for grouped device */}
      {isModalOpen && (
        <GroupedDeviceDetails 
          groupedDevice={groupedDevice}
          onClose={() => setIsModalOpen(false)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
