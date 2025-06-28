import React from 'react';

type Props = {
  columns: string[];
  selected: { [key: string]: { chartType: 'bar' | 'pie' | 'histogram' } };
  onToggle: (col: string) => void;
  onChartTypeChange: (col: string, type: 'bar' | 'pie' | 'histogram') => void;
};

const chartOptions = [
  { value: 'bar', label: 'Bar Chart', icon: '📊' },
  { value: 'pie', label: 'Pie Chart', icon: '🥧' },
  { value: 'histogram', label: 'Histogram', icon: '📈' }
];

const ColumnSelector: React.FC<Props> = ({ columns, selected, onToggle, onChartTypeChange }) => {
  return (
    <div className="space-y-3">
      {columns.map((col) => {
        const isSelected = selected[col];
        return (
          <div
            key={col}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer ${
              isSelected 
                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
            onClick={() => onToggle(col)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}>
                    {isSelected && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className={`font-medium transition-colors duration-300 ${
                    isSelected ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {col}
                  </span>
                </div>

                {isSelected && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-600 font-medium">Chart Type:</span>
                    <select
                      value={selected[col].chartType}
                      onChange={(e) =>
                        onChartTypeChange(col, e.target.value as 'bar' | 'pie' | 'histogram')
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm px-3 py-1 rounded-lg border border-blue-200 bg-white text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                    >
                      {chartOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ColumnSelector;