import React from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import type { PlotMouseEvent } from 'plotly.js';

type Props = {
  data: any[];
  selected: { [key: string]: { chartType: 'bar' | 'pie' | 'histogram' } };
};

const ChartRenderer: React.FC<Props> = ({ data, selected }) => {
  if (!data || data.length === 0) return null;

  const handleDownload = (filteredData: any[], col: string, label: string) => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `report-${col}-${label}.csv`);
  };

  const handleClick = (
    col: string,
    point: PlotMouseEvent['points'][0],
    type: 'bar' | 'pie' | 'histogram'
  ) => {
    let filtered: any[] = [];

    if (type === 'histogram') {
      const binStart = point.x as number;
      const binWidth = (point.data.xbins?.size as number) || 1;
      const binEnd = binStart + binWidth;
      filtered = data.filter((row) => {
        const val = Number(row[col]);
        return !isNaN(val) && val >= binStart && val < binEnd;
      });
      handleDownload(filtered, col, `${binStart}-${binEnd}`);
    } else {
      const clickedValue = point.x || (point as any).label;
      filtered = data.filter((row) => row[col] === clickedValue);
      handleDownload(filtered, col, clickedValue);
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {Object.entries(selected).map(([col, { chartType }]) => {
        const values = data.map((row) => row[col]);
        const counts: Record<string, number> = {};

        values.forEach((v) => {
          const key = typeof v === 'string' ? v : String(v);
          counts[key] = (counts[key] || 0) + 1;
        });

        let plotData: Partial<Plotly.PlotData>[] = [];
        const layout = {
          width: 600,
          height: 400,
          title: `${chartType} of ${col}`,
          paper_bgcolor: '#f0f0f3',
          plot_bgcolor: '#f0f0f3',
        };

        if (chartType === 'bar') {
          plotData = [
            {
              type: 'bar',
              x: Object.keys(counts),
              y: Object.values(counts),
              marker: { color: '#3b82f6' },
            },
          ];
        } else if (chartType === 'pie') {
          plotData = [
            {
              type: 'pie',
              labels: Object.keys(counts),
              values: Object.values(counts),
              textinfo: 'label+percent',
              hole: 0.3,
            },
          ];
        } else if (chartType === 'histogram') {
          plotData = [
            {
              type: 'histogram',
              x: values.map(Number).filter((v) => !isNaN(v)),
              xbins: { start: 0, end: Math.max(...values.map(Number).filter((v) => !isNaN(v))), size: 10 },
              marker: { color: '#10b981' },
            },
          ];
        }

        return (
          <div
            key={col}
            className="p-6 m-4 rounded-xl shadow-neumorph-light bg-gray-100 dark:bg-gray-800"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">{col}</h2>
            <Plot
              data={plotData}
              layout={layout}
              config={{ responsive: true }}
              onClick={(event: Readonly<PlotMouseEvent>) =>
                handleClick(col, event.points[0], chartType)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChartRenderer;