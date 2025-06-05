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
    <div className="min-h-screen bg-darkBg text-white font-poppins">
      <header className="text-center py-6 text-3xl font-bold text-accent shadow-glass">
        📊 Data Visualizer
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-6 gap-6">
        <section className="col-span-6 lg:col-span-2">
          <FileUploader onFileLoaded={handleFileLoaded} />
          {columns.length > 0 && (
            <ColumnSelector
              columns={columns}
              selected={selectedColumns}
              onToggle={toggleColumn}
              onChartTypeChange={changeChartType}
            />
          )}
        </section>

        <section className="col-span-6 lg:col-span-4">
          <ChartRenderer data={data} selected={selectedColumns} />
        </section>
      </main>
    </div>
  );
};

export default App;
