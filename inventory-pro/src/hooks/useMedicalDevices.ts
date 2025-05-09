import { useState, useEffect } from 'react';
import { ref, get, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import { MedicalDevice } from '../types/medical-device';

export function useMedicalDevices() {
  const [devices, setDevices] = useState<MedicalDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const devicesRef = ref(db, 'medical_devices');
        const snapshot = await get(devicesRef);
        
        if (snapshot.exists()) {
          const devicesData = snapshot.val();
          // If the data is an array, use it directly; otherwise, convert from object
          const devicesArray = Array.isArray(devicesData) 
            ? devicesData 
            : Object.keys(devicesData).map(key => devicesData[key]);
          
          setDevices(devicesArray);
        } else {
          setDevices([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  return { devices, loading, error };
}