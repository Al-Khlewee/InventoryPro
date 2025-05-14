import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { ref, get, update } from 'firebase/database';

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const deviceId = context.params.id;
    const updateData = await request.json();

    // Find the device in Firebase by ID
    const devicesRef = ref(db, 'medical_devices');
    const snapshot = await get(devicesRef);
    let deviceFirebaseKey: string | null = null;
    
    if (snapshot.exists()) {
      const devicesData = snapshot.val();
      // Find the device with the matching ID
      for (const key in devicesData) {
        if (devicesData[key].id.toString() === deviceId) {
          deviceFirebaseKey = key;
          break;
        }
      }
    }
    
    // If we found the device's Firebase key, update it
    if (deviceFirebaseKey) {
      const deviceRef = ref(db, `medical_devices/${deviceFirebaseKey}`);
      await update(deviceRef, updateData);
      
      return NextResponse.json({ 
        success: true,
        message: `Device ${deviceId} updated successfully`,
        device: {
          ...updateData,
          id: parseInt(deviceId),
          firebaseKey: deviceFirebaseKey
        }
      });
    } else {
      return NextResponse.json(
        { error: `Device with ID ${deviceId} not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error updating device ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update device' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const deviceId = context.params.id;
    
    // Find the device in Firebase by ID
    const devicesRef = ref(db, 'medical_devices');
    const snapshot = await get(devicesRef);
    let device = null;
    
    if (snapshot.exists()) {
      const devicesData = snapshot.val();
      // Find the device with the matching ID
      for (const key in devicesData) {
        if (devicesData[key].id.toString() === deviceId) {
          device = {
            ...devicesData[key],
            firebaseKey: key
          };
          break;
        }
      }
    }
    
    if (device) {
      return NextResponse.json({ 
        success: true,
        device
      });
    } else {
      return NextResponse.json(
        { error: `Device with ID ${deviceId} not found` },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error(`Error fetching device ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch device' },
      { status: 500 }
    );
  }
}
