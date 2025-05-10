import { useMemo } from 'react';
import { MedicalDevice } from '../types/medical-device';

interface GroupedDevice {
  key: string;
  deviceName: string;
  model: string;
  manufacturer: string;
  department: string;
  dateReceived: string;
  warrantyPeriod: string;
  supplier: string;
  countryOfOrigin: string;
  itmCode: string;
  totalQuantity: number;
  devices: MedicalDevice[];
  imageUrl?: string | null;
}

export function useGroupedDevices(devices: MedicalDevice[]) {
  const groupedDevices = useMemo<GroupedDevice[]>(() => {
    // Group by ITM code which is the unique device record identifier
    const groups = devices.reduce((acc: Record<string, MedicalDevice[]>, device) => {
      // Use ITM code as the unique identifier
      const groupKey = device.itmCode;
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      
      acc[groupKey].push(device);
      return acc;
    }, {});
    
    // Convert grouped devices into the GroupedDevice format
    return Object.entries(groups).map(([key, devicesList]) => {
      // Use the first device for shared properties
      const firstDevice = devicesList[0];
      
      // Calculate total quantity
      const totalQuantity = devicesList.reduce((sum, device) => sum + device.quantity, 0);
      
      return {
        key,
        deviceName: firstDevice.deviceName,
        model: firstDevice.model,
        manufacturer: firstDevice.manufacturer, 
        department: firstDevice.department,
        dateReceived: firstDevice.dateReceived,
        warrantyPeriod: firstDevice.warrantyPeriod,
        supplier: firstDevice.supplier,
        countryOfOrigin: firstDevice.countryOfOrigin,
        itmCode: firstDevice.itmCode,
        totalQuantity,
        devices: devicesList,
        imageUrl: firstDevice.imageUrl
      };
    });
  }, [devices]);

  return { groupedDevices };
}

export type { GroupedDevice };
