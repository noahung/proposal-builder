import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';

interface TableEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export const TableEditor: React.FC<TableEditorProps> = ({ element, onUpdate, onClose }) => {
  const [rows, setRows] = useState(element.content.rows || 3);
  const [cols, setCols] = useState(element.content.cols || 3);
  const [data, setData] = useState<string[][]>(
    element.content.data || Array.from({ length: 3 }, () => Array(3).fill(''))
  );
  const [hasHeader, setHasHeader] = useState(element.content.hasHeader !== false);
  const [bordered, setBordered] = useState(element.content.bordered !== false);
  const [striped, setStriped] = useState(element.content.striped || false);

  const handleRowsChange = (newRows: number) => {
    const currentData = [...data];
    if (newRows > rows) {
      // Add rows
      for (let i = rows; i < newRows; i++) {
        currentData.push(Array(cols).fill(''));
      }
    } else {
      // Remove rows
      currentData.splice(newRows);
    }
    setRows(newRows);
    setData(currentData);
  };

  const handleColsChange = (newCols: number) => {
    const currentData = data.map((row) => {
      if (newCols > cols) {
        // Add columns
        return [...row, ...Array(newCols - cols).fill('')];
      } else {
        // Remove columns
        return row.slice(0, newCols);
      }
    });
    setCols(newCols);
    setData(currentData);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const addRow = () => {
    const newRow = Array(cols).fill('');
    setData([...data, newRow]);
    setRows(rows + 1);
  };

  const addColumn = () => {
    const newData = data.map((row) => [...row, '']);
    setData(newData);
    setCols(cols + 1);
  };

  const deleteRow = (rowIndex: number) => {
    if (data.length <= 1) return;
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
    setRows(rows - 1);
  };

  const deleteColumn = (colIndex: number) => {
    if (cols <= 1) return;
    const newData = data.map((row) => row.filter((_, index) => index !== colIndex));
    setData(newData);
    setCols(cols - 1);
  };

  const handleSave = () => {
    onUpdate({
      content: {
        rows,
        cols,
        data,
        hasHeader,
        bordered,
        striped,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeumorphCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Table Editor</h2>
          <button onClick={onClose} className="text-2xl hover:text-destructive">×</button>
        </div>

        <div className="space-y-4">
          {/* Table Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Rows</Label>
              <div className="flex items-center gap-2 mt-2">
                <NeumorphInput
                  type="number"
                  min="1"
                  max="20"
                  value={rows}
                  onChange={(e) => handleRowsChange(parseInt(e.target.value) || 1)}
                  className="text-sm"
                />
                <NeumorphButton size="sm" onClick={addRow}>+</NeumorphButton>
              </div>
            </div>
            <div>
              <Label>Columns</Label>
              <div className="flex items-center gap-2 mt-2">
                <NeumorphInput
                  type="number"
                  min="1"
                  max="10"
                  value={cols}
                  onChange={(e) => handleColsChange(parseInt(e.target.value) || 1)}
                  className="text-sm"
                />
                <NeumorphButton size="sm" onClick={addColumn}>+</NeumorphButton>
              </div>
            </div>
          </div>

          {/* Table Styling Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Header Row</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bordered}
                onChange={(e) => setBordered(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Borders</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={striped}
                onChange={(e) => setStriped(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Striped Rows</span>
            </label>
          </div>

          {/* Table Editor */}
          <div className="border-2 border-border rounded-lg p-4 bg-white overflow-x-auto">
            <table className={`w-full ${bordered ? 'border-collapse' : ''}`}>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${striped && rowIndex % 2 === 1 ? 'bg-muted/30' : ''} group`}
                  >
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`${bordered ? 'border border-border' : ''} p-2 relative`}
                      >
                        {/* Column Delete Button */}
                        {rowIndex === 0 && (
                          <button
                            onClick={() => deleteColumn(colIndex)}
                            className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-destructive hover:underline"
                            title="Delete column"
                          >
                            ×
                          </button>
                        )}
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className={`w-full bg-transparent outline-none text-sm px-2 py-1 ${
                            hasHeader && rowIndex === 0 ? 'font-semibold' : ''
                          }`}
                          placeholder={hasHeader && rowIndex === 0 ? 'Header' : 'Data'}
                        />
                      </td>
                    ))}
                    {/* Row Delete Button */}
                    <td className="pl-2">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="text-destructive hover:underline text-xs opacity-0 group-hover:opacity-100"
                        title="Delete row"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <NeumorphButton onClick={onClose}>Cancel</NeumorphButton>
            <NeumorphButton variant="primary" onClick={handleSave}>
              Save Table
            </NeumorphButton>
          </div>
        </div>
      </NeumorphCard>
    </div>
  );
};
