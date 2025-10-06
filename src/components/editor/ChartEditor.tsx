import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const CHART_TYPES = ['bar', 'line', 'pie', 'area'] as const;
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export const ChartEditor: React.FC<ChartEditorProps> = ({ element, onUpdate, onClose }) => {
  const [chartType, setChartType] = useState(element.content.chartType || 'bar');
  const [title, setTitle] = useState(element.content.title || '');
  const [data, setData] = useState<any[]>(
    element.content.data || [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
    ]
  );
  const [dataKeys, setDataKeys] = useState({
    nameKey: element.content.nameKey || 'name',
    valueKey: element.content.valueKey || 'value',
  });

  const addDataPoint = () => {
    setData([...data, { [dataKeys.nameKey]: `Item ${data.length + 1}`, [dataKeys.valueKey]: 0 }]);
  };

  const removeDataPoint = (index: number) => {
    if (data.length <= 1) return;
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const updateDataPoint = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index][field] = field === dataKeys.valueKey ? parseFloat(value) || 0 : value;
    setData(newData);
  };

  const handleSave = () => {
    onUpdate({
      content: {
        chartType,
        title,
        data,
        nameKey: dataKeys.nameKey,
        valueKey: dataKeys.valueKey,
      },
    });
    onClose();
  };

  const renderPreview = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeys.nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKeys.valueKey} fill="#8884d8" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeys.nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKeys.valueKey} stroke="#8884d8" />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys.valueKey}
              nameKey={dataKeys.nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeys.nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKeys.valueKey} stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeumorphCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Chart Editor</h2>
          <button onClick={onClose} className="text-2xl hover:text-destructive">×</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Chart Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="chart-title">Chart Title</Label>
              <NeumorphInput
                id="chart-title"
                type="text"
                placeholder="Enter chart title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Chart Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CHART_TYPES.map((type) => (
                  <NeumorphButton
                    key={type}
                    variant={chartType === type ? 'primary' : 'default'}
                    onClick={() => setChartType(type)}
                    className="capitalize"
                  >
                    {type}
                  </NeumorphButton>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Data Points</Label>
                <NeumorphButton size="sm" onClick={addDataPoint}>
                  + Add Point
                </NeumorphButton>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto border border-border rounded-lg p-3">
                {data.map((point, index) => (
                  <div key={index} className="flex items-center gap-2 pb-2 border-b border-border last:border-0">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Label"
                        value={point[dataKeys.nameKey] || ''}
                        onChange={(e) => updateDataPoint(index, dataKeys.nameKey, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Value"
                        value={point[dataKeys.valueKey] || 0}
                        onChange={(e) => updateDataPoint(index, dataKeys.valueKey, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeDataPoint(index)}
                      className="text-destructive hover:underline text-xl px-2"
                      title="Remove data point"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="border-2 border-border rounded-lg p-6 bg-white">
              {title && (
                <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
              )}
              <ResponsiveContainer width="100%" height={300}>
                {renderPreview() || <div>No chart preview available</div>}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
          <NeumorphButton onClick={onClose}>Cancel</NeumorphButton>
          <NeumorphButton variant="primary" onClick={handleSave}>
            Save Chart
          </NeumorphButton>
        </div>
      </NeumorphCard>
    </div>
  );
};
