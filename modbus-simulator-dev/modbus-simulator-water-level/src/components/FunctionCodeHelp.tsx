import React from 'react';
import { MdHelpOutline } from 'react-icons/md';
import { FUNCTION_CODE_DESCRIPTIONS } from '../types/modbus';

export function FunctionCodeHelp() {
  return (
    <div className="glass-effect p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <MdHelpOutline size={20} className="text-blue-600" />
        Function Code Reference
      </h3>
      <div className="overflow-x-auto -mx-4 lg:mx-0">
        <div className="min-w-[768px] lg:w-full rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-20 px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Code
                </th>
                <th className="w-40 px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(FUNCTION_CODE_DESCRIPTIONS).map(([code, description]) => (
                <tr key={code}>
                  <td className="w-20 px-3 py-2 whitespace-nowrap font-mono text-sm text-blue-600 font-medium">
                    {description.code}
                  </td>
                  <td className="w-40 px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                    {description.name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium text-gray-700">Purpose: </span>
                        <span>{description.purpose}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Usage: </span>
                        <span>{description.usage}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}