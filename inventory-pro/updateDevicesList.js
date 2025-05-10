const fs = require('fs');
const path = require('path');

const newContent = `import React, { useState, useMemo } from 'react';
import GroupedDeviceCard from './GroupedDeviceCard';
import { useMedicalDevices } from '../hooks/useMedicalDevices';
import { useGroupedDevices, GroupedDevice } from '../hooks/useGroupedDevices';
import { MedicalDevice } from '../types/medical-device';
import DeviceFormModal from './DeviceFormModal';

// Type for sortable fields
type SortField = 'deviceName' | 'manufacturer' | 'dateReceived' | 'department';
type SortOrder = 'asc' | 'desc';

export default function DevicesList() {
  const { devices, loading, error, addDevice, editDevice, deleteDevice, isSubmitting } = useMedicalDevices();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('deviceName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deviceToEdit, setDeviceToEdit] = useState<MedicalDevice | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const devicesPerPage = 9;

  // Pagination button styles
  const paginationButtonStyles = {
    active: "relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-sky-50 border-sky-500 text-sky-600",
    inactive: "relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
  };

  // Extract unique departments for filter dropdown
  const departments = useMemo<string[]>(() => {
    return Array.from(new Set(devices.map(device => device.department || '').filter(Boolean))).sort();
  }, [devices]);
  
  // Filter devices based on search term and department
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = 
        device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = 
        departmentFilter === '' || device.department === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    });
  }, [devices, searchTerm, departmentFilter]);

  // Get grouped devices
  const { groupedDevices } = useGroupedDevices(filteredDevices);

  // Sort grouped devices
  const sortedItems = useMemo(() => {
    return [...groupedDevices].sort((a, b) => {
      // Special handling for date field
      if (sortField === 'dateReceived') {
        const dateA = new Date(a.dateReceived).getTime();
        const dateB = new Date(b.dateReceived).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // For string comparisons
      const valueA = String(a[sortField]);
      const valueB = String(b[sortField]);
      
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [groupedDevices, sortField, sortOrder]);

  // Get current page items
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * devicesPerPage;
    const indexOfFirstItem = indexOfLastItem - devicesPerPage;
    return sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedItems, currentPage, devicesPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedItems.length / devicesPerPage);

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Open edit modal
  const handleEditDevice = (device: MedicalDevice) => {
    setDeviceToEdit(device);
  };

  // Handle submit for add/edit
  const handleSubmit = async (deviceData: Partial<MedicalDevice>) => {
    if (deviceToEdit) {
      return await editDevice({ ...deviceToEdit, ...deviceData });
    } else {
      return await addDevice(deviceData as Omit<MedicalDevice, 'id' | 'originalId'>);
    }
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setDeviceToEdit(null);
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        <p>Error loading devices: {error.message}</p>
      </div>
    );
  }

  // Generate pagination
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center mt-8">
        <nav className="inline-flex shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={\`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-200 bg-white text-sm font-medium 
              \${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}\`}
          >
            <span className="sr-only">Previous</span>
            &larr;
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={paginationButtonStyles.inactive}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={number === currentPage ? paginationButtonStyles.active : paginationButtonStyles.inactive}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={paginationButtonStyles.inactive}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={\`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-200 bg-white text-sm font-medium 
              \${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}\`}
          >
            <span className="sr-only">Next</span>
            &rarr;
          </button>
        </nav>
      </div>
    );
  };

  // Sort button component
  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600"
    >
      {label}
      {sortField === field && (
        <span className="ml-1">
          {sortOrder === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </button>
  );

  const getDeviceCountSummary = () => {
    const totalUniqueDeviceTypes = groupedDevices.length;
    const totalIndividualDevices = filteredDevices.length;
    const totalDeviceQuantity = filteredDevices.reduce((sum, device) => sum + device.quantity, 0);
    
    return \`\${totalUniqueDeviceTypes} device types (\${totalIndividualDevices} units, \${totalDeviceQuantity} total quantity)\`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Medical Devices</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Device
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search devices..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64">
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option key="all" value="">All Departments</option>
            {departments.map((dept, index) => (
              <option key={\`dept-\${index}-\${dept}\`} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort options */}
      <div className="flex flex-wrap gap-4 bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-500">Sort by:</div>
        <SortButton field="deviceName" label="Device Name" />
        <SortButton field="manufacturer" label="Manufacturer" />
        <SortButton field="department" label="Department" />
        <SortButton field="dateReceived" label="Date Received" />
      </div>

      {sortedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No devices found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((groupedDevice) => (
              <GroupedDeviceCard 
                key={groupedDevice.key} 
                groupedDevice={groupedDevice}
                onEdit={handleEditDevice} 
                onDelete={deleteDevice}
              />
            ))}
          </div>
          
          {totalPages > 1 && renderPagination()}
        </>
      )}
      
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-sm">
          Showing {Math.min((currentPage - 1) * devicesPerPage + 1, sortedItems.length)}-{Math.min(currentPage * devicesPerPage, sortedItems.length)} of {getDeviceCountSummary()}
        </p>
      </div>

      {/* Add/Edit Device Modal */}
      {(deviceToEdit || isAddModalOpen) && (
        <DeviceFormModal
          device={deviceToEdit || undefined}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}`;

const filePath = path.join(process.cwd(), 'src', 'components', 'DevicesList.tsx');

try {
  fs.writeFileSync(filePath, newContent);
  console.log('Successfully updated DevicesList.tsx to remove individual view');
} catch (error) {
  console.error('Error updating file:', error);
}
