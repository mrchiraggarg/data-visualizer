import React from 'react';
import Plot from 'react-plotly.js';

type Props = {
  data: any[];
  columnsToShow: string[];
};

const ChartRenderer: React.FC<Props> = ({ data, columnsToShow }) => {
  if (!data || data.length === 0) return null;

  const charts = columnsToShow.map((col) => {
    const values = data.map((row) => row[col]);

    const numericValues = values.filter((v) => !isNaN(Number(v)));

    if (numericValues.length >= values.length * 0.5) {
      // Numeric column → Histogram
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
                marker: { color: '#3b82f6' },
              },
            ]}
            layout={{ width: 600, height: 400, title: `Distribution of ${col}` }}
            config={{ responsive: true }}
          />
        </div>
      );
    } else {
      // Categorical → Bar Chart
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
          />
        </div>
      );
    }
  });

  return <div className="flex flex-wrap justify-center">{charts}</div>;
};

export default ChartRenderer;
