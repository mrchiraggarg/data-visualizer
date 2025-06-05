import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import ColumnSelector from './components/ColumnSelector';
import ChartRenderer from './components/ChartRenderer';

type ChartType = 'bar' | 'pie' | 'histogram';

const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: { chartType: ChartType };
  }>({});

  const handleFileLoaded = (cols: string[], dataRows: any[]) => {
    setColumns(cols);
    setData(dataRows);
    setSelectedColumns({});
  };

  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) => {
      const newSelected = { ...prev };
      if (newSelected[col]) {
        delete newSelected[col];
      } else {
        newSelected[col] = { chartType: 'bar' };
      }
      return newSelected;
    });
  };

  const changeChartType = (col: string, chartType: ChartType) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [col]: { chartType },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Data Visualizer</h1>

      <FileUploader onFileLoaded={handleFileLoaded} />

      {columns.length > 0 && (
        <ColumnSelector
          columns={columns}
          selected={selectedColumns}
          onToggle={toggleColumn}
          onChartTypeChange={changeChartType}
        />
      )}

      <ChartRenderer data={data} selected={selectedColumns} />
    </div>
  );
};

export default App;
