import React, { useState } from 'react';
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
  const [fileName, setFileName] = useState<string>('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
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
    <div className="p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-2xl mx-auto mb-8">
      <div className="flex flex-col items-center space-y-6">
        {/* <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ minWidth: '32px', minHeight: '32px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div> */}

        {/* <label className="text-2xl font-bold text-gray-800">
          Upload your file
        </label>
        
        <p className="text-sm text-gray-600">
          Supported formats: CSV, XLSX
        </p> */}

        <div className="relative w-full group">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFile}
            className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
            aria-label="File upload"
          />
          <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-dashed border-blue-300 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8" style={{ maxWidth: '32px', maxHeight: '32px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-blue-600 group-hover:text-blue-700">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">Supported formats: CSV, XLSX</p>

                {fileName && (
                  <div className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                    Selected file: {fileName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;