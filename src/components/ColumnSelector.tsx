import React from 'react';

type Props = {
  columns: string[];
  selected: { [key: string]: { chartType: 'bar' | 'pie' | 'histogram' } };
  onToggle: (col: string) => void;
  onChartTypeChange: (col: string, type: 'bar' | 'pie' | 'histogram') => void;
};

const chartOptions = ['bar', 'pie', 'histogram'];

const ColumnSelector: React.FC<Props> = ({ columns, selected, onToggle, onChartTypeChange }) => {
  return (
    <div className="flex flex-wrap justify-center p-12 gap-8 bg-white rounded-xl">
      {columns.map((col) => {
        const isSelected = selected[col];
        return (
          <div
            key={col}
            onClick={() => onToggle(col)}
            className={`min-w-[240px] px-8 py-6 rounded-xl cursor-pointer transition-all duration-300 
              ${isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } hover:transform hover:scale-105`}
          >
            <div className="flex flex-col items-center gap-4">
              <span className="font-bold text-xl tracking-wide">{col}</span>

              {isSelected && (
                <select
                  value={selected[col].chartType}
                  onChange={(e) =>
                    onChartTypeChange(col, e.target.value as 'bar' | 'pie' | 'histogram')
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 px-6 py-3 text-sm rounded-lg bg-white text-gray-800 border border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
                    transition-all duration-300"
                >
                  {chartOptions.map((type) => (
                    <option key={type} value={type} className="bg-white text-gray-800 py-2">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColumnSelector;