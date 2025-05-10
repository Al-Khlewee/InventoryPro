import React from 'react';
import { MedicalDevice } from '../types/medical-device';
import { GroupedDevice } from '../hooks/useGroupedDevices';

interface GroupedDeviceDetailsProps {
  groupedDevice: GroupedDevice;
  onClose: () => void;
  onEdit: (device: MedicalDevice) => void;
  onDelete: (deviceId: number) => Promise<boolean>;
}

export default function GroupedDeviceDetails({ 
  groupedDevice, 
  onClose, 
  onEdit,
  onDelete
}: GroupedDeviceDetailsProps) {
  const { deviceName, model, manufacturer, totalQuantity, devices } = groupedDevice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {deviceName} - {model}
              </h2>
              <p className="text-md text-gray-600">
                ITM Code: {groupedDevice.itmCode} | Total Qty: {totalQuantity}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Device Image */}
              {(groupedDevice.imageUrl || devices[0]?.imageUrl) && (
                <div className="mb-6">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                    <img 
                      src={groupedDevice.imageUrl || devices[0]?.imageUrl || '/file.svg'} 
                      alt={deviceName}
                      className="object-contain w-full h-full" 
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Device Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Model</span>
                    <span className="block text-gray-900">{model}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Manufacturer</span>
                    <span className="block text-gray-900">{manufacturer}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">ITM Code</span>
                    <span className="block text-gray-900">{groupedDevice.itmCode}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Department</span>
                    <span className="block text-gray-900">{groupedDevice.department}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Total Units</span>
                    <span className="block text-gray-900">{devices.length}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Total Quantity</span>
                    <span className="block text-gray-900">{totalQuantity}</span>
                  </div>
                  {devices[0]?.accessories && (
                    <div className="col-span-2">
                      <span className="block text-sm font-medium text-gray-500">Accessories</span>
                      <span className="block text-gray-900 text-sm whitespace-pre-line">{devices[0].accessories}</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Warranty Period</span>
                    <span className="block text-gray-900">{groupedDevice.warrantyPeriod}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Supplier</span>
                    <span className="block text-gray-900">{groupedDevice.supplier}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Country of Origin</span>
                    <span className="block text-gray-900">{groupedDevice.countryOfOrigin}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3 text-gray-800">Device Instances ({devices.length})</h3>
              <div className="overflow-y-auto max-h-80">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{device.id}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{device.serialNumber}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{device.recipientName}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{device.department}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{device.quantity}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onEdit(device)}
                              className="p-1 text-sky-600 hover:text-sky-800 transition-colors"
                              title="Edit device"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => onDelete(device.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete device"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
