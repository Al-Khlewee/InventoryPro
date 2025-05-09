import React from 'react';
import { useMedicalDevices } from '../hooks/useMedicalDevices';
import DeviceStatistics from './DeviceStatistics';

export default function Dashboard() {
  const { devices, loading } = useMedicalDevices();
  
  // Calculate summary data
  const totalDevices = devices.length;
  const totalQuantity = devices.reduce((sum, device) => sum + device.quantity, 0);
  
  // Get unique departments
  const departments = [...new Set(devices.map(device => device.department))];
  const totalDepartments = departments.length;
  
  // Get unique manufacturers
  const manufacturers = [...new Set(devices.map(device => device.manufacturer))];
  const totalManufacturers = manufacturers.length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 h-32 rounded-lg"></div>
          ))}
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 h-64 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Devices"
          value={totalDevices}
          description="Unique device records"
          color="blue"
        />
        <DashboardCard
          title="Total Quantity"
          value={totalQuantity}
          description="Devices in inventory"
          color="green"
        />
        <DashboardCard
          title="Departments"
          value={totalDepartments}
          description="Using devices"
          color="purple"
        />
        <DashboardCard
          title="Manufacturers"
          value={totalManufacturers}
          description="Represented brands"
          color="amber"
        />
      </div>
      
      {/* Recent Device Addition */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recently Added Devices</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b dark:border-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Device Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Department</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Sort by date received (newest first) and take only the first 5 */}
              {[...devices]
                .sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime())
                .slice(0, 5)
                .map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{device.deviceName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{device.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{device.dateReceived}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Statistics Section */}
      <DeviceStatistics devices={devices} />
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: number;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

function DashboardCard({ title, value, description, color }: DashboardCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
    green: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
    purple: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300',
    amber: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300',
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} transition-all hover:shadow-md`}>
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold">{value.toLocaleString()}</p>
        <p className="ml-2 text-sm opacity-70">{description}</p>
      </div>
    </div>
  );
}