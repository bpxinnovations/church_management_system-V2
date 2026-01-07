'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('membership');

  const reportTypes = [
    { id: 'membership', name: 'Membership Growth', icon: '📈' },
    { id: 'attendance', name: 'Attendance Trends', icon: '✅' },
    { id: 'financial', name: 'Financial Summary', icon: '💰' },
    { id: 'department', name: 'Department Performance', icon: '🏢' },
  ];

  const membershipData = [
    { month: 'Jan 2024', new: 24, total: 1247, growth: '+2.0%' },
    { month: 'Dec 2023', new: 18, total: 1223, growth: '+1.5%' },
    { month: 'Nov 2023', new: 15, total: 1205, growth: '+1.3%' },
    { month: 'Oct 2023', new: 22, total: 1190, growth: '+1.9%' },
  ];

  const attendanceData = [
    { week: 'Week 1', sunday: 865, midweek: 420, youth: 210 },
    { week: 'Week 2', sunday: 892, midweek: 456, youth: 234 },
    { week: 'Week 3', sunday: 878, midweek: 445, youth: 225 },
    { week: 'Week 4', sunday: 910, midweek: 468, youth: 245 },
  ];

  const financialData = [
    { month: 'Jan 2024', income: 24580, expenses: 18240, net: 6340 },
    { month: 'Dec 2023', income: 22340, expenses: 19500, net: 2840 },
    { month: 'Nov 2023', income: 21890, expenses: 18750, net: 3140 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View comprehensive reports and analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Export Report
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
            Generate Custom Report
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedReport === report.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="text-3xl mb-2">{report.icon}</div>
            <h3 className="font-semibold text-gray-900">{report.name}</h3>
          </button>
        ))}
      </div>

      {/* Membership Growth Report */}
      {selectedReport === 'membership' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Membership Growth</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      New Members
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Total Members
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Growth Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {membershipData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.new}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {data.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Chart</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {membershipData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors"
                    style={{ height: `${(data.total / 1300) * 100}%` }}
                  />
                  <p className="text-xs text-gray-600 mt-2">{data.month.split(' ')[0]}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{data.total}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Trends Report */}
      {selectedReport === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Sunday Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Midweek Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Youth Meeting
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.week}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.sunday}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.midweek}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.youth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        {data.sunday + data.midweek + data.youth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Financial Summary Report */}
      {selectedReport === 'financial' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Income
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        ${data.income.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        ${data.expenses.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                        ${data.net.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Department Performance Report */}
      {selectedReport === 'department' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h2>
            <div className="space-y-4">
              {[
                { name: 'Choir', attendance: 95, members: 50, events: 12 },
                { name: 'Ushers', attendance: 93, members: 30, events: 8 },
                { name: 'Youth', attendance: 80, members: 150, events: 20 },
                { name: "Women's Fellowship", attendance: 85, members: 100, events: 6 },
              ].map((dept, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                    <span className="text-sm text-gray-600">{dept.members} members</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Attendance Rate</p>
                      <p className="text-lg font-semibold text-green-600">{dept.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Members</p>
                      <p className="text-lg font-semibold text-blue-600">{dept.members}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Events This Month</p>
                      <p className="text-lg font-semibold text-purple-600">{dept.events}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

