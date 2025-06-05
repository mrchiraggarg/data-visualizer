import React from 'react';
import Plot from 'react-plotly.js';

type Props = {
  data: any[];
};

const ChartRenderer: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const charts = columns.map((col) => {
    const values = data.map((row) => row[col]);

    const numericValues = values.filter((v) => !isNaN(Number(v)));

    if (numericValues.length >= values.length * 0.5) {
      // Numeric column → Histogram
      return (
        <div key={col} className="p-4">
          <h2 className="text-xl font-semibold mb-2">{col}</h2>
          <Plot
            data={[
              {
                type: 'histogram',
                x: numericValues.map(Number),
                marker: { color: '#3b82f6' },
              },
            ]}
            layout={{ width: 600, height: 400, title: `Distribution of ${col}` }}
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
        <div key={col} className="p-4">
          <h2 className="text-xl font-semibold mb-2">{col}</h2>
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
          />
        </div>
      );
    }
  });

  return <div className="grid grid-cols-1 md:grid-cols-2">{charts}</div>;
};

export default ChartRenderer;
