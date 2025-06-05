import React from 'react';
import Plot from 'react-plotly.js';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

type Props = {
  data: any[];
  columnsToShow: string[];
};

const ChartRenderer: React.FC<Props> = ({ data, columnsToShow }) => {
  if (!data || data.length === 0) return null;

  const handleDownload = (filteredData: any[], col: string, value: string | number) => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `report-${col}-${value}.csv`);
  };

  const handleClick = (col: string, point: any, isNumeric: boolean) => {
    let filtered: any[] = [];

    if (isNumeric) {
      const binStart = point.x;
      const binWidth = point.data.xbins?.size || 1;
      const binEnd = binStart + binWidth;
      filtered = data.filter((row) => {
        const val = Number(row[col]);
        return !isNaN(val) && val >= binStart && val < binEnd;
      });
      handleDownload(filtered, col, `${binStart}-${binEnd}`);
    } else {
      const clickedCategory = point.x;
      filtered = data.filter((row) => row[col] === clickedCategory);
      handleDownload(filtered, col, clickedCategory);
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {columnsToShow.map((col) => {
        const values = data.map((row) => row[col]);
        const numericValues = values.filter((v) => !isNaN(Number(v)));
        const isNumeric = numericValues.length >= values.length * 0.5;

        if (isNumeric) {
          return (
            <div
              key={col}
              className="p-6 m-4 rounded-xl shadow-neumorph-light bg-gray-100 dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">{col}</h2>
              <Plot
                data={[
                  {
                    type: 'histogram',
                    x: numericValues.map(Number),
                    xbins: { size: 10 },
                    marker: { color: '#3b82f6' },
                  },
                ]}
                layout={{ width: 600, height: 400, title: `Distribution of ${col}` }}
                config={{ responsive: true }}
                onClick={(event) => handleClick(col, event.points[0], true)}
              />
            </div>
          );
        } else {
          const counts: Record<string, number> = {};
          values.forEach((val) => {
            if (val) counts[val] = (counts[val] || 0) + 1;
          });

          return (
            <div
              key={col}
              className="p-6 m-4 rounded-xl shadow-neumorph-light bg-gray-100 dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">{col}</h2>
              <Plot
                data={[
                  {
                    type: 'bar',
                    x: Object.keys(counts),
                    y: Object.values(counts),
                    marker: { color: '#6366f1' },
                  },
                ]}
                layout={{ width: 600, height: 400, title: `Category Frequency of ${col}` }}
                config={{ responsive: true }}
                onClick={(event) => handleClick(col, event.points[0], false)}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default ChartRenderer;
