import React from 'react';
import { MedicalDevice } from '../types/medical-device';

interface DeviceStatisticsProps {
  devices: MedicalDevice[];
}

export default function DeviceStatistics({ devices }: DeviceStatisticsProps) {
  // Calculate statistics
  const devicesByDepartment = devices.reduce((acc, device) => {
    const dept = device.department;
    if (!acc[dept]) {
      acc[dept] = { count: 0, totalQuantity: 0 };
    }
    acc[dept].count += 1;
    acc[dept].totalQuantity += device.quantity;
    return acc;
  }, {} as Record<string, { count: number; totalQuantity: number }>);

  // Convert to array and sort by total quantity (descending)
  const departmentStats = Object.entries(devicesByDepartment)
    .map(([dept, stats]) => ({ 
      department: dept, 
      count: stats.count, 
      totalQuantity: stats.totalQuantity 
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity);

  // Calculate statistics by manufacturer
  const devicesByManufacturer = devices.reduce((acc, device) => {
    const manufacturer = device.manufacturer;
    if (!acc[manufacturer]) {
      acc[manufacturer] = { count: 0, totalQuantity: 0 };
    }
    acc[manufacturer].count += 1;
    acc[manufacturer].totalQuantity += device.quantity;
    return acc;
  }, {} as Record<string, { count: number; totalQuantity: number }>);

  // Convert to array and sort by device count (descending)
  const manufacturerStats = Object.entries(devicesByManufacturer)
    .map(([manufacturer, stats]) => ({ 
      manufacturer, 
      count: stats.count, 
      totalQuantity: stats.totalQuantity 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 manufacturers

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Department Distribution</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Department</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Device Models</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {departmentStats.map((stat) => (
                <tr key={stat.department} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{stat.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{stat.count}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{stat.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Top Manufacturers</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {manufacturerStats.map((stat) => (
            <div key={stat.manufacturer} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white truncate">{stat.manufacturer}</h3>
              <div className="mt-2">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Device Models:</span> {stat.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Total Units:</span> {stat.totalQuantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
