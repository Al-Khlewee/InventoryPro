import React, { useState, useEffect } from 'react';
import { MedicalDevice } from '../types/medical-device';

interface DeviceFormProps {
  initialValues?: MedicalDevice;
  onSubmit: (device: Partial<MedicalDevice>) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const defaultDevice: Partial<MedicalDevice> = {
  deviceName: '',
  quantity: 1,
  serialNumber: '',
  manufacturer: '',
  model: '',
  itmCode: '',
  department: '',
  recipientName: '',
  dateReceived: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  supplier: '',
  accessories: '',
  countryOfOrigin: '',
  warrantyPeriod: '1 year',
  remarks: '',
  imageUrl: null,
  entryVoucherNumber: '',
};

export default function DeviceForm({ initialValues, onSubmit, onCancel, isSubmitting }: DeviceFormProps) {
  const isEditMode = !!initialValues;
  const [formValues, setFormValues] = useState<Partial<MedicalDevice>>(
    initialValues || defaultDevice
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset the form when initialValues changes (switching between add/edit)
    if (initialValues) {
      setFormValues(initialValues);
    } else {
      setFormValues(defaultDevice);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    // Handle special input types
    if (name === 'quantity' && !isNaN(parseInt(value))) {
      parsedValue = parseInt(value);
    }

    setFormValues(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear any error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    const requiredFields: Array<keyof MedicalDevice> = [
      'deviceName', 'serialNumber', 'manufacturer', 'model', 
      'itmCode', 'department', 'dateReceived', 'supplier'
    ];
    
    requiredFields.forEach(field => {
      if (!formValues[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Quantity validation
    if (formValues.quantity !== undefined && formValues.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const success = await onSubmit(formValues);
    if (success) {
      onCancel(); // Close the form on success
    }
  };

  // Common classes for form elements
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Medical Device' : 'Add New Medical Device'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Basic Information</h3>
          
          <div>
            <label htmlFor="deviceName" className={labelClass}>Device Name*</label>
            <input
              type="text"
              id="deviceName"
              name="deviceName"
              value={formValues.deviceName || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.deviceName && <p className={errorClass}>{errors.deviceName}</p>}
          </div>
          
          <div>
            <label htmlFor="model" className={labelClass}>Model*</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formValues.model || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.model && <p className={errorClass}>{errors.model}</p>}
          </div>
          
          <div>
            <label htmlFor="manufacturer" className={labelClass}>Manufacturer*</label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formValues.manufacturer || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.manufacturer && <p className={errorClass}>{errors.manufacturer}</p>}
          </div>
          
          <div>
            <label htmlFor="serialNumber" className={labelClass}>Serial Number*</label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formValues.serialNumber || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.serialNumber && <p className={errorClass}>{errors.serialNumber}</p>}
          </div>
          
          <div>
            <label htmlFor="itmCode" className={labelClass}>ITM Code*</label>
            <input
              type="text"
              id="itmCode"
              name="itmCode"
              value={formValues.itmCode || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.itmCode && <p className={errorClass}>{errors.itmCode}</p>}
          </div>
          
          <div>
            <label htmlFor="entryVoucherNumber" className={labelClass}>Entry Voucher Number</label>
            <input
              type="text"
              id="entryVoucherNumber"
              name="entryVoucherNumber"
              value={formValues.entryVoucherNumber || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        
        {/* Inventory Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Inventory Information</h3>
          
          <div>
            <label htmlFor="quantity" className={labelClass}>Quantity*</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formValues.quantity || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.quantity && <p className={errorClass}>{errors.quantity}</p>}
          </div>
          
          <div>
            <label htmlFor="department" className={labelClass}>Department*</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formValues.department || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.department && <p className={errorClass}>{errors.department}</p>}
          </div>
          
          <div>
            <label htmlFor="recipientName" className={labelClass}>Recipient Name*</label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formValues.recipientName || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.recipientName && <p className={errorClass}>{errors.recipientName}</p>}
          </div>
          
          <div>
            <label htmlFor="dateReceived" className={labelClass}>Date Received*</label>
            <input
              type="date"
              id="dateReceived"
              name="dateReceived"
              value={formValues.dateReceived || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.dateReceived && <p className={errorClass}>{errors.dateReceived}</p>}
          </div>
          
          <div>
            <label htmlFor="warrantyPeriod" className={labelClass}>Warranty Period</label>
            <input
              type="text"
              id="warrantyPeriod"
              name="warrantyPeriod"
              placeholder="e.g. 1 year"
              value={formValues.warrantyPeriod || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        
        {/* Source Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Source Information</h3>
          
          <div>
            <label htmlFor="supplier" className={labelClass}>Supplier*</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formValues.supplier || ''}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.supplier && <p className={errorClass}>{errors.supplier}</p>}
          </div>
          
          <div>
            <label htmlFor="countryOfOrigin" className={labelClass}>Country of Origin</label>
            <input
              type="text"
              id="countryOfOrigin"
              name="countryOfOrigin"
              value={formValues.countryOfOrigin || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Additional Information</h3>
          
          <div>
            <label htmlFor="accessories" className={labelClass}>Accessories</label>
            <textarea
              id="accessories"
              name="accessories"
              rows={3}
              value={formValues.accessories || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="List of accessories included with the device"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="remarks" className={labelClass}>Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formValues.remarks || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="Additional notes or comments about this device"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Device' : 'Add Device'}
        </button>
      </div>
    </form>
  );
}
