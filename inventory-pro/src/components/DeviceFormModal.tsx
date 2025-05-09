import React from 'react';
import DeviceForm from './DeviceForm';
import { MedicalDevice } from '../types/medical-device';

interface DeviceFormModalProps {
  device?: MedicalDevice;
  onSubmit: (device: Partial<MedicalDevice>) => Promise<boolean>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function DeviceFormModal({ 
  device, 
  onSubmit, 
  onClose,
  isSubmitting
}: DeviceFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <DeviceForm
            initialValues={device}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
