import React from 'react';
import { MedicalDevice } from '../types/medical-device';

interface DeviceDetailsProps {
  device: MedicalDevice;
  onClose: () => void;
}

export default function DeviceDetails({ device, onClose }: DeviceDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {device.deviceName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Device Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">ID</span>
                    <span className="block text-gray-900 dark:text-white">{device.id}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Model</span>
                    <span className="block text-gray-900 dark:text-white">{device.model}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Manufacturer</span>
                    <span className="block text-gray-900 dark:text-white">{device.manufacturer}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</span>
                    <span className="block text-gray-900 dark:text-white">{device.serialNumber}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">ITM Code</span>
                    <span className="block text-gray-900 dark:text-white">{device.itmCode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Inventory Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</span>
                    <span className="block text-gray-900 dark:text-white">{device.quantity}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Department</span>
                    <span className="block text-gray-900 dark:text-white">{device.department}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date Received</span>
                    <span className="block text-gray-900 dark:text-white">{device.dateReceived}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Warranty Period</span>
                    <span className="block text-gray-900 dark:text-white">{device.warrantyPeriod}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Source Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</span>
                    <span className="block text-gray-900 dark:text-white">{device.supplier}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Country of Origin</span>
                    <span className="block text-gray-900 dark:text-white">{device.countryOfOrigin}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Recipient</span>
                    <span className="block text-gray-900 dark:text-white">{device.recipientName}</span>
                  </div>
                  {device.entryVoucherNumber && (
                    <div>
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Entry Voucher</span>
                      <span className="block text-gray-900 dark:text-white">{device.entryVoucherNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {device.accessories && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Accessories</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                    {device.accessories}
                  </p>
                </div>
              )}

              {device.remarks && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Remarks</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{device.remarks}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
