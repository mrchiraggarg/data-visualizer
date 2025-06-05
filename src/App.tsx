import { useState } from 'react';
import FileUploader from './components/FileUploader';
import ColumnSelector from './components/ColumnSelector';
import ChartRenderer from './components/ChartRenderer';

function App() {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleFileLoaded = (cols: string[], parsedData: any[]) => {
    setColumns(cols);
    setData(parsedData);
    setSelectedColumns([]); // reset selected columns
  };

  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 select-none">
        📊 Data Visualizer
      </h1>
      <FileUploader onFileLoaded={handleFileLoaded} />

      {columns.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-center select-none">
            Select Columns to Visualize
          </h2>
          <ColumnSelector
            columns={columns}
            selectedColumns={selectedColumns}
            toggleColumn={toggleColumn}
          />
        </>
      )}

      {selectedColumns.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-10 mb-6 text-center select-none">
            Charts
          </h2>
          <ChartRenderer data={data} columnsToShow={selectedColumns} />
        </>
      )}
    </div>
  );
}

export default App;
