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
    <div className="flex flex-wrap justify-center p-4 gap-4">
      {columns.map((col) => {
        const isSelected = selected[col];
        return (
          <div
            key={col}
            className={`px-4 py-2 rounded-xl cursor-pointer shadow-neumorph-light ${
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
            onClick={() => onToggle(col)}
          >
            <div className="flex items-center gap-2">
              <span>{col}</span>
              {isSelected && (
                <select
                  value={selected[col].chartType}
                  onChange={(e) =>
                    onChartTypeChange(col, e.target.value as 'bar' | 'pie' | 'histogram')
                  }
                  className="ml-2 text-sm px-2 py-1 rounded-md bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {chartOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
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
