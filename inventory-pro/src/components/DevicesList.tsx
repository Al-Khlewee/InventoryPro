import React, { useState, useMemo } from 'react';
import DeviceCard from './DeviceCard';
import { useMedicalDevices } from '../hooks/useMedicalDevices';
import { MedicalDevice } from '../types/medical-device';

// Type for sortable fields
type SortField = 'deviceName' | 'manufacturer' | 'dateReceived' | 'department';
type SortOrder = 'asc' | 'desc';

export default function DevicesList() {
  const { devices, loading, error } = useMedicalDevices();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('deviceName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 9;
  
  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    return Array.from(new Set(devices.map(device => device.department))).sort();
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

  // Sort devices
  const sortedDevices = useMemo(() => {
    return [...filteredDevices].sort((a, b) => {
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
  }, [filteredDevices, sortField, sortOrder]);

  // Get current page devices
  const currentDevices = useMemo(() => {
    const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    return sortedDevices.slice(indexOfFirstDevice, indexOfLastDevice);
  }, [sortedDevices, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedDevices.length / devicesPerPage);

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
              ${currentPage === 1 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'}`}
          >
            <span className="sr-only">Previous</span>
            &larr;
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  ...
                </span>
              )}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                ${number === currentPage
                  ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'}`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  ...
                </span>
              )}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
              ${currentPage === totalPages ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'}`}
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
      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    >
      {label}
      {sortField === field && (
        <span className="ml-1">
          {sortOrder === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search devices..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64">
          <select
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {(departments || []).map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort options */}
      <div className="flex flex-wrap gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div className="text-sm text-gray-500 dark:text-gray-400">Sort by:</div>
        <SortButton field="deviceName" label="Device Name" />
        <SortButton field="manufacturer" label="Manufacturer" />
        <SortButton field="department" label="Department" />
        <SortButton field="dateReceived" label="Date Received" />
      </div>

      {sortedDevices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No devices found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
          
          {totalPages > 1 && renderPagination()}
        </>
      )}
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Showing {Math.min((currentPage - 1) * devicesPerPage + 1, sortedDevices.length)}-{Math.min(currentPage * devicesPerPage, sortedDevices.length)} of {sortedDevices.length} devices (filtered from {devices.length} total)
        </p>
      </div>
    </div>
  );
}
