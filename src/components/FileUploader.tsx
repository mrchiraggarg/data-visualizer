import React from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
// import type { ParseResult } from 'papaparse';

type Props = {
    onDataParsed: (data: any[]) => void;
};

type CsvRow = Record<string, string | number>;
type PapaResults = { data: CsvRow[] };

const FileUploader: React.FC<Props> = ({ onDataParsed }) => {
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const binaryStr = evt.target?.result;

            if (file.name.endsWith('.xlsx')) {
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                onDataParsed(jsonData as any[]);
            } else if (file.name.endsWith('.csv')) {
                Papa.parse(binaryStr as string, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results: any) => {
                        onDataParsed(results.data as any[]);
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
        <div className="p-4 border border-dashed border-gray-500 rounded-lg text-center">
            <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFile}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800"
            />
        </div>
    );
};

export default FileUploader;
