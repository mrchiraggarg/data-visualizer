import { useState } from 'react';
import FileUploader from './components/FileUploader';
import ChartRenderer from './components/ChartRenderer';

function App() {
  const [parsedData, setParsedData] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Auto Data Visualizer</h1>
      <FileUploader onDataParsed={setParsedData} />
      {parsedData.length > 0 && (
        <>
          <h2 className="text-2xl mt-8 mb-4">Generated Charts</h2>
          <ChartRenderer data={parsedData} />
        </>
      )}
    </div>
  );
}

export default App;
