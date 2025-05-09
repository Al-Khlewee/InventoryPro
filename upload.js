// Firebase data upload script
const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjtNn3-kbQj4pHDBJUpfD6wSFxW2WpfdQ",
  authDomain: "inventorypro-63ee1.firebaseapp.com",
  databaseURL: "https://inventorypro-63ee1-default-rtdb.firebaseio.com",
  projectId: "inventorypro-63ee1",
  storageBucket: "inventorypro-63ee1.firebasestorage.app",
  messagingSenderId: "929851147131",
  appId: "1:929851147131:web:c28177a0a3970cceb073de",
  measurementId: "G-3SKLYNQ6TH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Read the JSON file
console.log('Reading JSON file...');
const jsonFilePath = '/Users/hatemal-khlewee/Desktop/InventoryPro/medical_devices_database.json';
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const devices = JSON.parse(data);
    console.log(`Parsed ${devices.length} devices from JSON file`);
    
    // Upload data to Firebase
    console.log('Uploading data to Firebase...');
    
    // Set the entire data at once
    const medicalDevicesRef = ref(db, 'medical_devices');
    set(medicalDevicesRef, devices)
      .then(() => {
        console.log('Data successfully uploaded to Firebase!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error uploading data to Firebase:', error);
        process.exit(1);
      });
      
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});
