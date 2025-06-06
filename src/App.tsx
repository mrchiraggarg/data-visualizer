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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span className="text-indigo-600">📊</span>
              <span>Data Visualizer</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <section className="col-span-6 lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <FileUploader onFileLoaded={handleFileLoaded} />
            </div>
            {columns.length > 0 && (
              <div className="p-6">
                <ColumnSelector
                  columns={columns}
                  selected={selectedColumns}
                  onToggle={toggleColumn}
                  onChartTypeChange={changeChartType}
                />
              </div>
            )}
          </section>

          <section className="col-span-6 lg:col-span-4 bg-white rounded-lg shadow-sm p-6">
            <ChartRenderer data={data} selected={selectedColumns} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;