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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (!result) {
        setIsLoading(false);
        return;
      }

      try {
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
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check the file format.');
      } finally {
        setIsLoading(false);
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="relative">
      <div className="relative group">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFile}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-label="File upload"
        />
        
        <div className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
          isLoading 
            ? 'border-blue-300 bg-blue-50' 
            : fileName 
              ? 'border-green-400 bg-green-50 group-hover:border-green-500' 
              : 'border-gray-300 bg-gray-50 group-hover:border-blue-400 group-hover:bg-blue-50'
        }`}>
          <div className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              {isLoading ? (
                <>
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-blue-600 font-medium">Processing file...</p>
                </>
              ) : fileName ? (
                <>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-green-700 font-semibold">File uploaded successfully!</p>
                    <p className="text-sm text-green-600 mt-1 break-all">{fileName}</p>
                    <p className="text-xs text-gray-500 mt-2">Click to upload a different file</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports CSV and Excel files
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;