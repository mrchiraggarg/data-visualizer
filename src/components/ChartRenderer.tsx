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

    const getChartColors = (index: number) => {
        const colorPalettes = [
            ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
            ['#10b981', '#34d399', '#6ee7b7', '#9deccd', '#c6f6d5'],
            ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
            ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
            ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
            ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe']
        ];
        return colorPalettes[index % colorPalettes.length];
    };

    return (
        <div className="space-y-8">
            {Object.entries(selected).map(([col, { chartType }], index) => {
                const values = data.map((row) => row[col]);
                const counts: Record<string, number> = {};

                values.forEach((v) => {
                    const key = typeof v === 'string' ? v : String(v);
                    counts[key] = (counts[key] || 0) + 1;
                });

                let plotData: Partial<Plotly.PlotData>[] = [];
                const colors = getChartColors(index);
                
                const layout = {
                    width: undefined,
                    height: 400,
                    title: {
                        text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart: ${col}`,
                        font: { size: 18, color: '#1f2937', family: 'Inter, sans-serif' },
                        x: 0.5,
                        xanchor: 'center' as const
                    },
                    paper_bgcolor: 'rgba(255,255,255,0)',
                    plot_bgcolor: 'rgba(255,255,255,0.8)',
                    font: { color: '#374151', size: 12, family: 'Inter, sans-serif' },
                    margin: { t: 60, b: 60, l: 60, r: 60 },
                    showlegend: chartType === 'pie',
                    legend: {
                        orientation: 'v' as const,
                        x: 1.02,
                        y: 0.5,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        bordercolor: '#e5e7eb',
                        borderwidth: 1
                    },
                    xaxis: {
                        gridcolor: '#f3f4f6',
                        linecolor: '#d1d5db',
                        tickfont: { color: '#6b7280' }
                    },
                    yaxis: {
                        gridcolor: '#f3f4f6',
                        linecolor: '#d1d5db',
                        tickfont: { color: '#6b7280' }
                    }
                };

                if (chartType === 'bar') {
                    plotData = [
                        {
                            type: 'bar',
                            x: Object.keys(counts),
                            y: Object.values(counts),
                            marker: { 
                                color: colors[0],
                                opacity: 0.8,
                                line: { color: colors[1], width: 1 }
                            },
                            hovertemplate: '<b>%{x}</b><br>Count: %{y}<extra></extra>',
                        },
                    ];
                } else if (chartType === 'pie') {
                    plotData = [
                        {
                            type: 'pie',
                            labels: Object.keys(counts),
                            values: Object.values(counts),
                            textinfo: 'label+percent',
                            textposition: 'auto',
                            hole: 0.4,
                            marker: {
                                colors: colors,
                                line: { color: '#ffffff', width: 2 }
                            },
                            hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>',
                        },
                    ];
                } else if (chartType === 'histogram') {
                    const numericValues = values.map(Number).filter((v) => !isNaN(v));
                    plotData = [
                        {
                            type: 'histogram',
                            x: numericValues,
                            xbins: { 
                                start: Math.min(...numericValues), 
                                end: Math.max(...numericValues), 
                                size: (Math.max(...numericValues) - Math.min(...numericValues)) / 20 
                            },
                            marker: { 
                                color: colors[0],
                                opacity: 0.8,
                                line: { color: colors[1], width: 1 }
                            },
                            hovertemplate: 'Range: %{x}<br>Count: %{y}<extra></extra>',
                        },
                    ];
                }

                return (
                    <div key={col} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[0] }}></div>
                                    <h3 className="text-lg font-semibold text-gray-800">{col}</h3>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                        {chartType}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                        {data.length} records
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <Plot
                                    data={plotData}
                                    layout={layout}
                                    config={{ 
                                        responsive: true,
                                        displayModeBar: true,
                                        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                                        displaylogo: false
                                    }}
                                    onClick={(event: Readonly<PlotMouseEvent>) =>
                                        handleClick(col, event.points[0], chartType)
                                    }
                                    style={{ width: '100%' }}
                                />
                            </div>
                            
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    💡 <strong>Tip:</strong> Click on any data point to download a filtered CSV report
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChartRenderer;