import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';

interface ShapeEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

type ShapeType = 'line' | 'divider' | 'rectangle' | 'circle' | 'arrow';

export const ShapeEditor: React.FC<ShapeEditorProps> = ({ element, onUpdate, onClose }) => {
  const [shapeType, setShapeType] = useState<ShapeType>(element.content.shapeType || 'divider');
  const [color, setColor] = useState(element.content.color || '#000000');
  const [backgroundColor, setBackgroundColor] = useState(element.content.backgroundColor || 'transparent');
  const [borderWidth, setBorderWidth] = useState(element.content.borderWidth || 2);
  const [borderStyle, setBorderStyle] = useState(element.content.borderStyle || 'solid');
  const [opacity, setOpacity] = useState(element.content.opacity || 100);

  const handleSave = () => {
    onUpdate({
      content: {
        shapeType,
        color,
        backgroundColor,
        borderWidth,
        borderStyle,
        opacity,
      },
    });
    onClose();
  };

  const renderPreview = () => {
    const baseStyle: React.CSSProperties = {
      borderColor: color,
      borderWidth: `${borderWidth}px`,
      borderStyle: borderStyle,
      opacity: opacity / 100,
    };

    switch (shapeType) {
      case 'line':
        return (
          <div
            style={{
              ...baseStyle,
              width: '100%',
              height: '0',
              borderTop: `${borderWidth}px ${borderStyle} ${color}`,
            }}
          />
        );
      case 'divider':
        return (
          <div className="flex items-center gap-4">
            <div
              style={{
                flex: 1,
                height: '0',
                borderTop: `${borderWidth}px ${borderStyle} ${color}`,
                opacity: opacity / 100,
              }}
            />
            <div className="text-sm text-muted-foreground">Divider</div>
            <div
              style={{
                flex: 1,
                height: '0',
                borderTop: `${borderWidth}px ${borderStyle} ${color}`,
                opacity: opacity / 100,
              }}
            />
          </div>
        );
      case 'rectangle':
        return (
          <div
            style={{
              ...baseStyle,
              width: '200px',
              height: '120px',
              backgroundColor: backgroundColor,
            }}
          />
        );
      case 'circle':
        return (
          <div
            style={{
              ...baseStyle,
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: backgroundColor,
            }}
          />
        );
      case 'arrow':
        return (
          <svg width="200" height="40" viewBox="0 0 200 40">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  fill={color}
                  opacity={opacity / 100}
                />
              </marker>
            </defs>
            <line
              x1="0"
              y1="20"
              x2="190"
              y2="20"
              stroke={color}
              strokeWidth={borderWidth}
              markerEnd="url(#arrowhead)"
              opacity={opacity / 100}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeumorphCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Shape Editor</h2>
          <button onClick={onClose} className="text-2xl hover:text-destructive">×</button>
        </div>

        <div className="space-y-6">
          {/* Shape Type Selector */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Shape Type</Label>
            <div className="grid grid-cols-5 gap-3 mt-2">
              {(['line', 'divider', 'rectangle', 'circle', 'arrow'] as ShapeType[]).map((type) => (
                <NeumorphButton
                  key={type}
                  variant={shapeType === type ? 'primary' : 'default'}
                  onClick={() => setShapeType(type)}
                  className="capitalize"
                >
                  {type}
                </NeumorphButton>
              ))}
            </div>
          </div>

          {/* Styling Options */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Style Settings</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="border-color" className="text-xs text-muted-foreground mb-1 block">Border/Line Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="border-color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-16 border border-border rounded-lg cursor-pointer"
                  />
                  <NeumorphInput
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {(shapeType === 'rectangle' || shapeType === 'circle') && (
                <div>
                  <Label htmlFor="bg-color" className="text-xs text-muted-foreground mb-1 block">Fill Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      id="bg-color"
                      type="color"
                      value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-10 w-16 border border-border rounded-lg cursor-pointer"
                    />
                    <NeumorphInput
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                    placeholder="transparent"
                  />
                </div>
                </div>
            )}

              <div>
                <Label htmlFor="border-width" className="text-xs text-muted-foreground mb-1 block">Border Width (px)</Label>
                <NeumorphInput
                  id="border-width"
                  type="number"
                  min="1"
                  max="20"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value) || 1)}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="border-style" className="text-xs text-muted-foreground mb-1 block">Border Style</Label>
                <select
                  id="border-style"
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white"
                >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                </select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="opacity" className="text-xs text-muted-foreground mb-1 block">Opacity (%)</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    id="opacity"
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-sm font-medium w-12 text-right">{opacity}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Preview</Label>
            <div className="mt-2 border-2 border-border rounded-lg p-8 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center min-h-[180px]">
              {renderPreview()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <NeumorphButton onClick={onClose}>Cancel</NeumorphButton>
            <NeumorphButton variant="primary" onClick={handleSave}>
              Save Shape
            </NeumorphButton>
          </div>
        </div>
      </NeumorphCard>
    </div>
  );
};
