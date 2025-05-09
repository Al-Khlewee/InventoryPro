export interface MedicalDevice {
  id: number;
  originalId: number;
  deviceName: string;
  quantity: number;
  serialNumber: string;
  manufacturer: string;
  model: string;
  itmCode: string;
  department: string;
  recipientName: string;
  dateReceived: string;
  supplier: string;
  accessories: string;
  countryOfOrigin: string;
  warrantyPeriod: string;
  detailsLink: string;
  remarks: string | null;
  imageUrl: string | null;
  entryVoucherNumber: string | null;
}