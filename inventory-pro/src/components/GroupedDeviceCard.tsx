import React, { useState, useRef } from 'react';
import Image from 'next/image';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    deviceName, 
    model, 
    manufacturer, 
    totalQuantity, 
    devices
  } = groupedDevice;
  
  // Get image URL from groupedDevice or from the first device in the group
  const defaultImageUrl = groupedDevice.imageUrl || devices[0]?.imageUrl || '/file.svg';
  
  // Use local state for image URL to immediately update UI
  // This will be synchronized with the server on component mount and after uploads
  const [localImageUrl, setLocalImageUrl] = useState(defaultImageUrl);
  
  // When groupedDevice or devices change, update the local image URL
  React.useEffect(() => {
    const newImageUrl = groupedDevice.imageUrl || devices[0]?.imageUrl || '/file.svg';
    setLocalImageUrl(newImageUrl);
  }, [groupedDevice.imageUrl, devices]);
  
  // Use local state for image URL to immediately update UI
  const imageUrl = localImageUrl;

  const handleEditClick = () => {
    // If there's at least one device in the group, use it as the representative for editing
    if (devices.length > 0) {
      onEdit(devices[0]);
    }
  };

  const handleDeleteClick = async () => {
    // For deletion, we'll use the first device's ID
    if (devices.length > 0 && window.confirm('Are you sure you want to delete this device group?')) {
      await onDelete(devices[0].id);
    }
  };

  const handleImageUploadClick = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show loading state
    setLocalImageUrl('/uploads/loading-spinner.svg');

    // Create a FormData object to upload the image
    const formData = new FormData();
    formData.append('image', file);
    formData.append('deviceId', devices[0].id.toString()); // Use the first device's ID

    try {
      // This endpoint now updates Firebase directly
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Update the local image URL immediately for visual feedback
          setLocalImageUrl(data.imageUrl);
          
          // Create an updated device object with the new image URL
          const updatedDevice = {
            ...devices[0],
            imageUrl: data.imageUrl
          };
          
          // Call the onEdit function passed as a prop to update the parent's state
          onEdit(updatedDevice);
          
          // Show success notification
          const notification = document.createElement('div');
          notification.className = 'fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50';
          notification.innerHTML = 'Image uploaded successfully!';
          document.body.appendChild(notification);
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 3000);
        } else {
          throw new Error(data.error || 'Unknown error occurred during upload');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Revert the local image on error
      setLocalImageUrl(defaultImageUrl);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50';
      notification.innerHTML = error instanceof Error 
        ? `Error: ${error.message}` 
        : 'An error occurred while uploading the image.';
      document.body.appendChild(notification);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 5000);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
        {/* Device Image Section with Edit/Upload buttons */}
        <div className="mb-4 flex justify-center relative">
          <div className="relative h-40 w-full max-w-md rounded-md overflow-hidden group">
            {/* Check if the URL is for loading spinner */}
            {imageUrl === '/uploads/loading-spinner.svg' ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-50">
                <Image
                  src={imageUrl}
                  alt="Loading..."
                  width={40}
                  height={40}
                  className="animate-spin"
                />
              </div>
            ) : imageUrl && !imageUrl.endsWith('/file.svg') ? (
              <div className="relative h-full w-full">
                <Image
                  src={imageUrl}
                  alt={deviceName}
                  fill
                  className="rounded-md object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  onError={() => setLocalImageUrl('/file.svg')} // Fallback to default if image fails to load
                />
                <div className="absolute bottom-2 right-2">
                  <span className="bg-gray-700 bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {imageUrl.split('/').pop()?.substring(0, 10)}...
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Overlay with buttons for image actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              {/* Only show upload button for default images or when explicitly in upload mode */}
              {(imageUrl.endsWith('/file.svg') || !imageUrl) && (
                <button 
                  onClick={handleImageUploadClick}
                  className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white p-3 rounded-full text-sm font-medium transition-colors"
                  title="Upload Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
              
              {/* Show replace button if there's already an image */}
              {!imageUrl.endsWith('/file.svg') && imageUrl !== '/uploads/loading-spinner.svg' && (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleImageUploadClick}
                    className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white p-3 rounded-full text-sm font-medium transition-colors"
                    title="Replace Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Hidden file input for image upload */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

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
          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
              title="Edit Device"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Delete Device"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
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
