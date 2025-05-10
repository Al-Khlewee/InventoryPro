import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { createHash } from 'crypto';
import { db } from '../../../lib/firebase';
import { ref, get, update } from 'firebase/database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const deviceId = formData.get('deviceId') as string | null;

    if (!image || !deviceId) {
      return NextResponse.json(
        { error: 'Image and deviceId are required' },
        { status: 400 }
      );
    }

    // Generate a unique filename to prevent overwriting
    const fileExtension = path.extname(image.name);
    const fileNameHash = createHash('md5')
      .update(`${image.name}-${Date.now()}`)
      .digest('hex');
    const fileName = `${fileNameHash}${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads/device-images');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Convert the file to an ArrayBuffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file to the uploads directory
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    // Create a URL path that can be used in the app
    const imageUrl = `/uploads/device-images/${fileName}`;

    // Update the device in Firebase with the new image URL
    // First, find the device in Firebase by ID
    const devicesRef = ref(db, 'medical_devices');
    const snapshot = await get(devicesRef);
    let deviceFirebaseKey = null;
    
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
    
    // If we found the device's Firebase key, update the imageUrl
    if (deviceFirebaseKey) {
      const deviceRef = ref(db, `medical_devices/${deviceFirebaseKey}`);
      await update(deviceRef, { imageUrl });
    } else {
      console.error(`Device with ID ${deviceId} not found in Firebase`);
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      firebaseKey: deviceFirebaseKey,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
