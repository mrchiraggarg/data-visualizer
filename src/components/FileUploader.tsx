import React from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

type ParseResult<T> = {
  data: T[];
  errors: any[];
  meta: any;
};

type Props = {
  onFileLoaded: (columns: string[], data: any[]) => void;
};

const FileUploader: React.FC<Props> = ({ onFileLoaded }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const result = evt.target?.result;

      if (!result) return;

      if (file.name.endsWith('.xlsx')) {
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<any>(sheet);

        const columns = jsonData.length > 0 && typeof jsonData[0] === 'object' && jsonData[0] !== null
          ? Object.keys(jsonData[0])
          : [];

        onFileLoaded(columns, jsonData);
      } else if (file.name.endsWith('.csv')) {
        Papa.parse(result as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<any>) => {
            const data = results.data;
            const columns = data.length > 0 && typeof data[0] === 'object' && data[0] !== null
              ? Object.keys(data[0])
              : [];
            onFileLoaded(columns, data);
          },
        });
      } else {
        alert('Unsupported file type!');
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-neumorph-light bg-gray-100 dark:bg-gray-800 max-w-md mx-auto">
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFile}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-300 file:text-gray-900 hover:file:bg-gray-400 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600"
      />
    </div>
  );
};

export default FileUploader;
