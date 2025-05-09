import React, { useState } from 'react';
import { MedicalDevice } from '../types/medical-device';
import DeviceDetails from './DeviceDetails';

interface DeviceCardProps {
  device: MedicalDevice;
  onEdit: (device: MedicalDevice) => void;
  onDelete: (deviceId: number) => Promise<boolean>;
}

export default function DeviceCard({ device, onEdit, onDelete }: DeviceCardProps) {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const success = await onDelete(device.id);
      if (success) {
        setShowDeleteConfirm(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

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
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Received:</span> {device.dateReceived} • 
            <span className="font-medium ml-1">Warranty:</span> {device.warrantyPeriod}
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(device)}
              className="p-1 text-sky-600 hover:text-sky-800 transition-colors"
              title="Edit device"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Delete device"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Full details modal */}
      {isModalOpen && (
        <DeviceDetails device={device} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Device</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <strong>{device.deviceName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}