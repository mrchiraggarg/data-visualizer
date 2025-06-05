import React from 'react';
import clsx from 'clsx';

type Props = {
  columns: string[];
  selectedColumns: string[];
  toggleColumn: (col: string) => void;
};

const ColumnSelector: React.FC<Props> = ({ columns, selectedColumns, toggleColumn }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center my-6">
      {columns.map((col) => {
        const isSelected = selectedColumns.includes(col);

        return (
          <button
            key={col}
            onClick={() => toggleColumn(col)}
            className={clsx(
              "px-5 py-3 rounded-xl cursor-pointer select-none transition-shadow",
              "bg-gray-200 dark:bg-gray-800",
              "shadow-neumorph-light",
              isSelected
                ? "shadow-neumorph-inset text-blue-600 font-semibold"
                : "hover:shadow-neumorph-hover"
            )}
          >
            {col}
          </button>
        );
      })}
    </div>
  );
};

export default ColumnSelector;
