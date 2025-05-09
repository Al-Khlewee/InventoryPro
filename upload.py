# Firebase data upload script
import json
import os
import sys

# File path
json_file_path = '/Users/hatemal-khlewee/Desktop/InventoryPro/medical_devices_database.json'

# Firebase configuration
firebase_url = "https://inventorypro-63ee1-default-rtdb.firebaseio.com/medical_devices.json"

def main():
    # Install requests package
    print("Installing requests package...")
    os.system(f"{sys.executable} -m pip install requests")
    
    # Now try to import requests
    try:
        import requests
    except ImportError:
        print("Failed to import requests. Please install it manually with: pip install requests")
        sys.exit(1)
    
    # Read the JSON file
    print("Reading JSON file...")
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            print(f"Parsed {len(data)} devices from JSON file")
    except Exception as e:
        print(f"Error reading or parsing JSON file: {e}")
        sys.exit(1)
    
    # Upload data to Firebase
    print("Uploading data to Firebase...")
    try:
        response = requests.put(firebase_url, json=data)
        response.raise_for_status()  # Raises an exception for 4XX/5XX responses
        print("Data successfully uploaded to Firebase!")
    except Exception as e:
        print(f"Error uploading data to Firebase: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
