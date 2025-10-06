import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';

interface ProposalEditorProps {
  proposalId?: string;
  onSave: () => void;
  onPreview: () => void;
  onBack: () => void;
}

interface EditorElement {
  id: string;
  type: 'text' | 'heading' | 'image' | 'table' | 'chart' | 'video' | 'embed';
  content: any;
  position: { x: number; y: number };
  width?: number;
  height?: number;
}

export const ProposalEditor: React.FC<ProposalEditorProps> = ({
  proposalId,
  onSave,
  onPreview,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(true);

  const [elements, setElements] = useState<EditorElement[]>([
    {
      id: '1',
      type: 'heading',
      content: { text: 'Website Redesign Project', level: 1 },
      position: { x: 50, y: 50 },
      width: 600,
    },
    {
      id: '2',
      type: 'text',
      content: { text: 'This proposal outlines our comprehensive approach to redesigning your company website with modern design principles, improved user experience, and enhanced functionality.' },
      position: { x: 50, y: 120 },
      width: 600,
    },
    {
      id: '3',
      type: 'heading',
      content: { text: 'Project Overview', level: 2 },
      position: { x: 50, y: 200 },
      width: 400,
    },
    {
      id: '4',
      type: 'text',
      content: { text: 'We will completely redesign your website to reflect your brand identity and improve user engagement. The new design will be responsive, accessible, and optimised for conversions.' },
      position: { x: 50, y: 250 },
      width: 600,
    },
    {
      id: '5',
      type: 'table',
      content: { 
        rows: 4, 
        cols: 3, 
        data: [
          ['Service', 'Timeline', 'Investment'],
          ['Design & UX', '2-3 weeks', '£8,000'],
          ['Development', '4-5 weeks', '£12,000'],
          ['Testing & Launch', '1 week', '£3,000']
        ]
      },
      position: { x: 50, y: 350 },
      width: 500,
    },
  ]);

  const toolbarItems = [
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'heading', label: 'Heading', icon: '📰' },
    { id: 'image', label: 'Image', icon: '🖼️' },
    { id: 'table', label: 'Table', icon: '📊' },
    { id: 'chart', label: 'Chart', icon: '📈' },
    { id: 'video', label: 'Video', icon: '🎥' },
    { id: 'embed', label: 'Embed', icon: '🔗' },
  ];

  const formatOptions = [
    { id: 'bold', label: 'Bold', icon: 'B' },
    { id: 'italic', label: 'Italic', icon: 'I' },
    { id: 'underline', label: 'Underline', icon: 'U' },
    { id: 'align-left', label: 'Align Left', icon: '⬅️' },
    { id: 'align-center', label: 'Align Center', icon: '↔️' },
    { id: 'align-right', label: 'Align Right', icon: '➡️' },
  ];

  const addElement = (type: string) => {
    const newElement: EditorElement = {
      id: Date.now().toString(),
      type: type as any,
      content: getDefaultContent(type),
      position: { x: 50, y: 200 + elements.length * 100 },
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Enter your text here...' };
      case 'heading':
        return { text: 'New Heading', level: 2 };
      case 'image':
        return { src: '', alt: 'Image', caption: '' };
      case 'table':
        return { rows: 3, cols: 3, data: [] };
      case 'chart':
        return { type: 'bar', data: [] };
      case 'video':
        return { url: '', title: 'Video' };
      case 'embed':
        return { code: '<div>Embedded content</div>' };
      default:
        return {};
    }
  };

  const updateElementContent = (elementId: string, newContent: any) => {
    setElements(elements.map(el => 
      el.id === elementId ? { ...el, content: { ...el.content, ...newContent } } : el
    ));
  };

  const renderElement = (element: EditorElement) => {
    const isSelected = selectedElement === element.id;
    
    return (
      <div
        key={element.id}
        className={`absolute cursor-pointer p-2 rounded ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/20'
        }`}
        style={{ 
          left: element.position.x, 
          top: element.position.y,
          width: element.width || 'auto',
          minWidth: element.width ? element.width : '200px'
        }}
        onClick={() => setSelectedElement(element.id)}
      >
        {element.type === 'heading' && (
          <input
            type="text"
            value={element.content.text}
            onChange={(e) => updateElementContent(element.id, { text: e.target.value })}
            className={`w-full bg-transparent border-none outline-none ${
              element.content.level === 1 ? 'text-2xl' : 'text-xl'
            } font-medium`}
            placeholder="Enter heading..."
            onFocus={() => setSelectedElement(element.id)}
          />
        )}
        {element.type === 'text' && (
          <textarea
            value={element.content.text}
            onChange={(e) => updateElementContent(element.id, { text: e.target.value })}
            className="w-full bg-transparent border-none outline-none text-base resize-none"
            placeholder="Enter text..."
            rows={Math.max(2, Math.ceil(element.content.text.length / 60))}
            onFocus={() => setSelectedElement(element.id)}
          />
        )}
        {element.type === 'image' && (
          <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground">🖼️ Image Placeholder</span>
          </div>
        )}
        {element.type === 'table' && (
          <div className="border border-border rounded overflow-hidden">
            <table className="w-full">
              <tbody>
                {element.content.data?.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, colIndex: number) => (
                      <td key={colIndex} className="border border-border p-2 text-sm">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const newData = [...element.content.data];
                            newData[rowIndex][colIndex] = e.target.value;
                            updateElementContent(element.id, { data: newData });
                          }}
                          className="w-full bg-transparent border-none outline-none"
                          placeholder={rowIndex === 0 ? "Header" : "Data"}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {element.type === 'chart' && (
          <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground">📈 Chart Placeholder</span>
          </div>
        )}
        {element.type === 'video' && (
          <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground">🎥 Video Placeholder</span>
          </div>
        )}
        {element.type === 'embed' && (
          <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground">🔗 Embedded Content</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <NeumorphButton onClick={onBack}>
            ← Back
          </NeumorphButton>
          <h1>Proposal Editor</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Page {currentPage} of 8</span>
          <NeumorphButton onClick={onPreview}>
            Preview
          </NeumorphButton>
          <NeumorphButton variant="primary" onClick={onSave}>
            Save
          </NeumorphButton>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Toolbar */}
        {showToolbar && (
          <div className="w-64 p-4 border-r border-border">
            <NeumorphCard>
              <h3 className="mb-4">Elements</h3>
              <div className="grid grid-cols-2 gap-2">
                {toolbarItems.map((item) => (
                  <NeumorphButton
                    key={item.id}
                    size="sm"
                    onClick={() => addElement(item.id)}
                    className="flex flex-col items-center gap-1 p-3 h-auto"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </NeumorphButton>
                ))}
              </div>
            </NeumorphCard>

            <NeumorphCard className="mt-4">
              <h3 className="mb-4">Formatting</h3>
              <div className="grid grid-cols-3 gap-2">
                {formatOptions.map((option) => (
                  <NeumorphButton
                    key={option.id}
                    size="sm"
                    className="p-2"
                  >
                    {option.icon}
                  </NeumorphButton>
                ))}
              </div>
            </NeumorphCard>

            {selectedElement && (
              <NeumorphCard className="mt-4">
                <h3 className="mb-4">Properties</h3>
                <div className="space-y-3">
                  {(() => {
                    const element = elements.find(el => el.id === selectedElement);
                    if (!element) return null;
                    
                    return (
                      <>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Width (px)</label>
                          <NeumorphInput
                            type="number"
                            placeholder="Width"
                            size="sm"
                            value={element.width || ''}
                            onChange={(e) => {
                              const newWidth = parseInt(e.target.value) || undefined;
                              setElements(elements.map(el => 
                                el.id === selectedElement ? { ...el, width: newWidth } : el
                              ));
                            }}
                          />
                        </div>
                        
                        {element.type === 'heading' && (
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Heading Level</label>
                            <select
                              className="neumorph-input w-full px-3 py-2 text-sm"
                              value={element.content.level}
                              onChange={(e) => updateElementContent(element.id, { level: parseInt(e.target.value) })}
                            >
                              <option value={1}>H1 - Large Heading</option>
                              <option value={2}>H2 - Medium Heading</option>
                              <option value={3}>H3 - Small Heading</option>
                            </select>
                          </div>
                        )}
                        
                        {element.type === 'table' && (
                          <>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Rows</label>
                              <NeumorphInput
                                type="number"
                                size="sm"
                                min="1"
                                max="10"
                                value={element.content.rows}
                                onChange={(e) => {
                                  const newRows = parseInt(e.target.value) || 1;
                                  const currentData = element.content.data || [];
                                  const newData = Array.from({ length: newRows }, (_, rowIndex) => 
                                    currentData[rowIndex] || Array.from({ length: element.content.cols }, () => '')
                                  );
                                  updateElementContent(element.id, { rows: newRows, data: newData });
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Columns</label>
                              <NeumorphInput
                                type="number"
                                size="sm"
                                min="1"
                                max="6"
                                value={element.content.cols}
                                onChange={(e) => {
                                  const newCols = parseInt(e.target.value) || 1;
                                  const currentData = element.content.data || [];
                                  const newData = currentData.map(row => 
                                    Array.from({ length: newCols }, (_, colIndex) => row[colIndex] || '')
                                  );
                                  updateElementContent(element.id, { cols: newCols, data: newData });
                                }}
                              />
                            </div>
                          </>
                        )}
                        
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Position X</label>
                          <NeumorphInput
                            type="number"
                            size="sm"
                            value={element.position.x}
                            onChange={(e) => {
                              const newX = parseInt(e.target.value) || 0;
                              setElements(elements.map(el => 
                                el.id === selectedElement ? { ...el, position: { ...el.position, x: newX } } : el
                              ));
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Position Y</label>
                          <NeumorphInput
                            type="number"
                            size="sm"
                            value={element.position.y}
                            onChange={(e) => {
                              const newY = parseInt(e.target.value) || 0;
                              setElements(elements.map(el => 
                                el.id === selectedElement ? { ...el, position: { ...el.position, y: newY } } : el
                              ));
                            }}
                          />
                        </div>
                        
                        <NeumorphButton 
                          size="sm" 
                          variant="destructive"
                          className="w-full mt-4"
                          onClick={() => {
                            setElements(elements.filter(el => el.id !== selectedElement));
                            setSelectedElement(null);
                          }}
                        >
                          Delete Element
                        </NeumorphButton>
                      </>
                    );
                  })()}
                </div>
              </NeumorphCard>
            )}
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 relative bg-white m-4 rounded-lg overflow-auto" style={{ minHeight: '800px' }}>
          <div className="relative w-full h-full p-8">
            {elements.map(renderElement)}
            
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="mb-4">Start building your proposal</p>
                  <p className="text-sm">Add elements from the toolbar on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Navigation */}
        <div className="w-48 p-4 border-l border-border">
          <NeumorphCard>
            <h3 className="mb-4">Pages</h3>
            <div className="space-y-2">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-full text-left p-2 rounded ${
                    currentPage === i + 1
                      ? 'neumorph-inset text-primary'
                      : 'hover:neumorph-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Page {i + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {i === 0 ? 'Cover' : `Page ${i + 1}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <NeumorphButton 
              className="w-full mt-4" 
              size="sm"
              onClick={() => console.log('Add page')}
            >
              + Add Page
            </NeumorphButton>
          </NeumorphCard>
        </div>
      </div>
    </div>
  );
};