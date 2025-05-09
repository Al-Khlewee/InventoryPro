import { useState, useEffect, useCallback } from 'react';
import { ref, get, set, push, update, remove } from 'firebase/database';
import { db } from '../lib/firebase';
import { MedicalDevice } from '../types/medical-device';

export function useMedicalDevices() {
  const [devices, setDevices] = useState<MedicalDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const devicesRef = ref(db, 'medical_devices');
      const snapshot = await get(devicesRef);
      
      if (snapshot.exists()) {
        const devicesData = snapshot.val();
        // If the data is an array, use it directly; otherwise, convert from object
        const devicesArray = Array.isArray(devicesData) 
          ? devicesData 
          : Object.keys(devicesData).map(key => ({
              ...devicesData[key],
              firebaseKey: key, // Store the Firebase key for updates
            }));
        
        setDevices(devicesArray);
      } else {
        setDevices([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Add a new device
  const addDevice = async (device: Omit<MedicalDevice, 'id' | 'originalId'>) => {
    try {
      setIsSubmitting(true);
      
      // Generate a new ID based on the highest existing ID + 1
      const newId = devices.length > 0 
        ? Math.max(...devices.map(d => d.id)) + 1 
        : 1;
      
      const newDevice: MedicalDevice = {
        ...device,
        id: newId,
        originalId: newId, // Initially same as id
      };

      // Push to Firebase to get a new unique key
      const devicesRef = ref(db, 'medical_devices');
      const newDeviceRef = push(devicesRef);
      await set(newDeviceRef, newDevice);
      
      // Refetch to get the updated list with Firebase keys
      await fetchDevices();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add device'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit an existing device
  const editDevice = async (updatedDevice: MedicalDevice) => {
    try {
      setIsSubmitting(true);
      
      // Find the device with its Firebase key
      const deviceToUpdate = devices.find(d => d.id === updatedDevice.id);
      
      if (!deviceToUpdate || !('firebaseKey' in deviceToUpdate)) {
        throw new Error('Device not found or missing Firebase key');
      }
      
      const firebaseKey = deviceToUpdate.firebaseKey as string;
      const deviceRef = ref(db, `medical_devices/${firebaseKey}`);
      
      // Update in Firebase (remove the firebaseKey before saving)
      const { firebaseKey: _, ...deviceData } = updatedDevice as any;
      await update(deviceRef, deviceData);
      
      // Refetch to get the updated list
      await fetchDevices();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update device'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a device
  const deleteDevice = async (deviceId: number) => {
    try {
      setIsSubmitting(true);
      
      // Find the device with its Firebase key
      const deviceToDelete = devices.find(d => d.id === deviceId);
      
      if (!deviceToDelete || !('firebaseKey' in deviceToDelete)) {
        throw new Error('Device not found or missing Firebase key');
      }
      
      const firebaseKey = deviceToDelete.firebaseKey as string;
      const deviceRef = ref(db, `medical_devices/${firebaseKey}`);
      
      // Remove from Firebase
      await remove(deviceRef);
      
      // Update local state
      await fetchDevices();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete device'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    devices, 
    loading, 
    error, 
    addDevice, 
    editDevice, 
    deleteDevice,
    isSubmitting,
    refreshDevices: fetchDevices 
  };
}