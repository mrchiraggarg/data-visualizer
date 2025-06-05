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
            onClick={() => onToggle(col)}
            className={`min-w-[200px] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 shadow-neumorph ${
              isSelected ? 'bg-accent text-white' : 'bg-cardBg text-gray-200'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold">{col}</span>

              {isSelected && (
                <select
                  value={selected[col].chartType}
                  onChange={(e) =>
                    onChartTypeChange(col, e.target.value as 'bar' | 'pie' | 'histogram')
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 px-3 py-1 text-sm rounded-md bg-darkBg border border-slate-600 text-white shadow-inner"
                >
                  {chartOptions.map((type) => (
                    <option key={type} value={type}>
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
