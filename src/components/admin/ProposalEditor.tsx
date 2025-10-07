import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
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
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { useProposal, useUpdateProposal } from '../../hooks/useProposals';
import { useSections, useCreateSection, useUpdateSection, useDeleteSection } from '../../hooks/useSections';
import { LoadingScreen } from '../utility/LoadingScreen';
import { ErrorScreen } from '../utility/ErrorScreen';
import { ImageEditor } from '../editor/ImageEditor';
import { VideoEditor } from '../editor/VideoEditor';
import { EmbedEditor } from '../editor/EmbedEditor';
import { ChartEditor } from '../editor/ChartEditor';
import { TableEditor } from '../editor/TableEditor';
import { TextEditor } from '../editor/TextEditor';
import { ShapeEditor } from '../editor/ShapeEditor';
import { HeadingEditor } from '../editor/HeadingEditor';

interface ProposalEditorProps {
  proposalId: string;
  onSave: () => void;
  onPreview: () => void;
  onBack: () => void;
}

interface EditorElement {
  id: string;
  type: 'text' | 'heading' | 'image' | 'table' | 'chart' | 'video' | 'embed' | 'shape';
  content: any;
  position: { x: number; y: number };
  width: number;
  height: number;
  locked?: boolean;
  zIndex?: number;
}

export const ProposalEditor: React.FC<ProposalEditorProps> = ({
  proposalId,
  onSave,
  onPreview,
  onBack,
}) => {
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [showToolbar, setShowToolbar] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Fetch proposal data
  const { data: proposal, isLoading: proposalLoading, error: proposalError } = useProposal(proposalId);
  
  // Fetch sections
  const { data: sections, isLoading: sectionsLoading } = useSections(proposalId);
  
  // Mutations
  const updateProposal = useUpdateProposal();
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();

  // Set first section as current when sections load
  useEffect(() => {
    if (sections && sections.length > 0 && !currentSectionId) {
      setCurrentSectionId(sections[0].id);
    }
  }, [sections, currentSectionId]);

  const currentSection = sections?.find(s => s.id === currentSectionId);
  const [elements, setElements] = useState<EditorElement[]>([]);

  // Load elements from current section
  useEffect(() => {
    if (currentSection && currentSection.elements) {
      setElements(currentSection.elements as unknown as EditorElement[]);
    } else {
      setElements([]);
    }
  }, [currentSection]);

  // Keyboard event handler for Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace key to delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        // Don't delete if user is typing in an input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        
        e.preventDefault();
        if (confirm('Delete this element?')) {
          setElements(elements.filter(el => el.id !== selectedElement));
          setSelectedElement(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, elements]);

  // Loading and error states
  // Only show loading screen on initial load, not during refetches
  // This prevents the loading overlay from blocking content (like embeds) when mutations invalidate queries
  if (proposalLoading || (sectionsLoading && !sections)) {
    return <LoadingScreen />;
  }

  if (proposalError || !proposal) {
    return <ErrorScreen message="Failed to load proposal" onRetry={() => window.location.reload()} />;
  }

  // Manual save function
  const handleSave = async () => {
    if (!currentSectionId || !currentSection) return;

    setIsSaving(true);
    try {
      await updateSection.mutateAsync({
        id: currentSectionId,
        data: {
          elements: elements,
        },
      });
      setLastSaved(new Date());
      alert('Proposal saved successfully!');
      // Don't navigate back - stay on editor
    } catch (error: any) {
      alert(`Failed to save proposal: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Add new section
  const handleAddSection = async () => {
    if (!sections) return;
    
    // Calculate the next order_index by finding the max existing order_index
    const maxOrderIndex = sections.length > 0
      ? Math.max(...sections.map(s => s.order_index))
      : -1;
    const nextOrderIndex = maxOrderIndex + 1;
    
    console.log('Adding page:', {
      sectionsCount: sections.length,
      existingOrderIndexes: sections.map(s => s.order_index),
      maxOrderIndex,
      nextOrderIndex,
    });
    
    try {
      const result = await createSection.mutateAsync({
        proposal_id: proposalId,
        title: `Page ${nextOrderIndex + 1}`,
        order_index: nextOrderIndex,
        elements: [],
      });
      
      console.log('Page created successfully:', result.data);
      
      // Set the newly created section as current
      if (result.data) {
        setCurrentSectionId(result.data.id);
      }
    } catch (error: any) {
      console.error('Add page error:', error);
      alert(`Failed to create page: ${error.message}`);
    }
  };

  // Delete section
  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await deleteSection.mutateAsync(sectionId);
      
      // Switch to first available section
      if (sections && sections.length > 1) {
        const remainingSections = sections.filter(s => s.id !== sectionId);
        if (remainingSections.length > 0) {
          setCurrentSectionId(remainingSections[0].id);
          
          // Reorder remaining sections to avoid gaps in order_index
          const reorderUpdates = remainingSections.map((section, index) => ({
            id: section.id,
            order_index: index,
          }));
          
          // Update order indices in the background
          if (reorderUpdates.length > 0) {
            try {
              await Promise.all(
                reorderUpdates.map(({ id, order_index }) =>
                  updateSection.mutateAsync({
                    id,
                    data: { order_index },
                  })
                )
              );
            } catch (reorderError) {
              console.error('Failed to reorder sections:', reorderError);
            }
          }
        }
      }
    } catch (error: any) {
      alert(`Failed to delete section: ${error.message}`);
    }
  };

  // Update section title
  const handleUpdateSectionTitle = async (sectionId: string, newTitle: string) => {
    try {
      await updateSection.mutateAsync({
        id: sectionId,
        data: { title: newTitle },
      });
      // Close editing mode after successful update
      setEditingSectionId(null);
      setEditingSectionTitle('');
    } catch (error: any) {
      console.error('Failed to update section title:', error);
      alert(`Failed to update section title: ${error.message}`);
    }
  };

  const toolbarItems = [
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'heading', label: 'Heading', icon: '📰' },
    { id: 'image', label: 'Image', icon: '🖼️' },
    { id: 'table', label: 'Table', icon: '📊' },
    { id: 'chart', label: 'Chart', icon: '📈' },
    { id: 'video', label: 'Video', icon: '🎥' },
    { id: 'embed', label: 'Embed', icon: '🔗' },
    { id: 'shape', label: 'Shape', icon: '▭' },
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
    const defaultSizes = {
      text: { width: 400, height: 100 },
      heading: { width: 500, height: 60 },
      image: { width: 400, height: 300 },
      table: { width: 500, height: 300 },
      chart: { width: 500, height: 350 },
      video: { width: 560, height: 315 },
      embed: { width: 500, height: 400 },
      shape: { width: 300, height: 150 },
    };

    const size = defaultSizes[type as keyof typeof defaultSizes] || { width: 400, height: 200 };

    const newElement: EditorElement = {
      id: Date.now().toString(),
      type: type as any,
      content: getDefaultContent(type),
      position: { x: 50, y: 200 + elements.length * 100 },
      width: size.width,
      height: size.height,
      zIndex: elements.length,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    // Auto-open editor for new element
    setEditingElement(newElement.id);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Enter your text here...', fontSize: 16, textAlign: 'left', color: '#000000' };
      case 'heading':
        return { text: 'New Heading', level: 2 };
      case 'image':
        return { src: '', alt: 'Image', caption: '' };
      case 'table':
        return { rows: 3, cols: 3, data: Array.from({ length: 3 }, () => Array(3).fill('')), hasHeader: true, bordered: true };
      case 'chart':
        return { chartType: 'bar', data: [{ name: 'A', value: 100 }, { name: 'B', value: 200 }], nameKey: 'name', valueKey: 'value', title: '' };
      case 'video':
        return { url: '', title: 'Video', autoplay: false, muted: false, loop: false };
      case 'embed':
        return { code: '<div>Embedded content</div>', embedType: 'iframe' };
      case 'shape':
        return { shapeType: 'divider', color: '#000000', backgroundColor: 'transparent', borderWidth: 2, borderStyle: 'solid', opacity: 100 };
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
      <Rnd
        key={element.id}
        size={{ width: element.width, height: element.height }}
        position={{ x: element.position.x, y: element.position.y }}
        onDragStop={(e, d) => {
          setElements(elements.map(el =>
            el.id === element.id ? { ...el, position: { x: d.x, y: d.y } } : el
          ));
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setElements(elements.map(el =>
            el.id === element.id
              ? {
                  ...el,
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  position,
                }
              : el
          ));
        }}
        bounds="parent"
        enableResizing={!element.locked}
        disableDragging={element.locked}
        className={`${isSelected ? 'ring-2 ring-primary' : ''}`}
        style={{ zIndex: element.zIndex || 0 }}
      >
        <div
          className={`w-full h-full p-2 rounded cursor-move ${
            isSelected ? 'bg-primary/5' : 'hover:bg-muted/20'
          } ${element.locked ? 'cursor-not-allowed' : ''}`}
          onClick={() => setSelectedElement(element.id)}
          onDoubleClick={() => setEditingElement(element.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            setSelectedElement(element.id);
            
            // Show context menu options
            const shouldDelete = window.confirm('Delete this element?');
            if (shouldDelete) {
              setElements(elements.filter(el => el.id !== element.id));
              setSelectedElement(null);
            }
          }}
        >
          {element.type === 'heading' && (
            <div
              className={`w-full h-full ${
                element.content.level === 1 ? 'text-3xl' : element.content.level === 2 ? 'text-2xl' : 'text-xl'
              } font-semibold overflow-hidden flex items-center`}
            >
              {element.content.text}
            </div>
          )}
          {element.type === 'text' && (
            <div
              className="w-full h-full overflow-auto"
              style={{
                fontSize: `${element.content.fontSize || 16}px`,
                textAlign: element.content.textAlign || 'left',
                color: element.content.color || '#000000',
              }}
              dangerouslySetInnerHTML={{ __html: element.content.text || 'Double-click to edit text' }}
            />
          )}
          {element.type === 'image' && (
            <div className="w-full h-full bg-muted rounded flex items-center justify-center overflow-hidden">
              {element.content.src ? (
                <img src={element.content.src} alt={element.content.alt} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-muted-foreground">🖼️ Double-click to add image</span>
              )}
            </div>
          )}
          {element.type === 'table' && (
            <div className="w-full h-full overflow-auto border border-border rounded bg-white">
              <table className={`w-full ${element.content.bordered ? 'border-collapse' : ''}`}>
                <tbody>
                  {element.content.data?.map((row: string[], rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className={`${element.content.striped && rowIndex % 2 === 1 ? 'bg-muted/30' : ''}`}
                    >
                      {row.map((cell: string, colIndex: number) => (
                        <td
                          key={colIndex}
                          className={`${element.content.bordered ? 'border border-border' : ''} p-2 text-sm ${
                            element.content.hasHeader && rowIndex === 0 ? 'font-semibold' : ''
                          }`}
                        >
                          {cell || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {element.type === 'chart' && (
            <div className="w-full h-full bg-white rounded p-2 overflow-hidden">
              {element.content.data && element.content.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {(() => {
                    const { chartType, data, nameKey, valueKey, title } = element.content;
                    const commonProps = {
                      data,
                      margin: { top: title ? 30 : 10, right: 10, left: 0, bottom: 5 },
                    };

                    switch (chartType) {
                      case 'bar':
                        return (
                          <BarChart {...commonProps}>
                            {title && <text x="50%" y="15" textAnchor="middle" className="text-sm font-semibold">{title}</text>}
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={nameKey || 'name'} tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey={valueKey || 'value'} fill="#8884d8" />
                          </BarChart>
                        );
                      case 'line':
                        return (
                          <LineChart {...commonProps}>
                            {title && <text x="50%" y="15" textAnchor="middle" className="text-sm font-semibold">{title}</text>}
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={nameKey || 'name'} tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey={valueKey || 'value'} stroke="#8884d8" />
                          </LineChart>
                        );
                      case 'pie':
                        return (
                          <PieChart>
                            {title && <text x="50%" y="15" textAnchor="middle" className="text-sm font-semibold">{title}</text>}
                            <Pie
                              data={data}
                              dataKey={valueKey || 'value'}
                              nameKey={nameKey || 'name'}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              label
                            >
                              {data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'][index % 6]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        );
                      case 'area':
                        return (
                          <AreaChart {...commonProps}>
                            {title && <text x="50%" y="15" textAnchor="middle" className="text-sm font-semibold">{title}</text>}
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={nameKey || 'name'} tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey={valueKey || 'value'} stroke="#8884d8" fill="#8884d8" />
                          </AreaChart>
                        );
                      default:
                        return <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Invalid chart type</div>;
                    }
                  })()}
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">📈 Double-click to add chart data</span>
                </div>
              )}
            </div>
          )}
          {element.type === 'video' && (
            <div className="w-full h-full bg-muted rounded overflow-hidden">
              {element.content.embedUrl ? (
                <iframe
                  src={element.content.embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">🎥 Double-click to add video</span>
                </div>
              )}
            </div>
          )}
          {element.type === 'embed' && (
            <div className="w-full h-full overflow-hidden">
              {element.content.embedType === 'iframe' ? (
                element.content.code ? (
                  <iframe src={element.content.code} className="w-full h-full" frameBorder="0" />
                ) : (
                  <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground">� Double-click to add embed</span>
                  </div>
                )
              ) : (
                element.content.code ? (
                  <div dangerouslySetInnerHTML={{ __html: element.content.code }} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground">🔗 Double-click to add embed</span>
                  </div>
                )
              )}
            </div>
          )}
          {element.type === 'shape' && (
            <div className="w-full h-full flex items-center justify-center">
              {(() => {
                const { shapeType, color, backgroundColor, borderWidth, borderStyle, opacity } = element.content;
                const baseStyle: React.CSSProperties = {
                  borderColor: color,
                  borderWidth: `${borderWidth}px`,
                  borderStyle: borderStyle,
                  opacity: opacity / 100,
                };

                switch (shapeType) {
                  case 'line':
                  case 'divider':
                    return (
                      <div
                        style={{
                          width: '100%',
                          height: '0',
                          borderTop: `${borderWidth}px ${borderStyle} ${color}`,
                          opacity: opacity / 100,
                        }}
                      />
                    );
                  case 'rectangle':
                    return (
                      <div
                        style={{
                          ...baseStyle,
                          width: '100%',
                          height: '100%',
                          backgroundColor: backgroundColor,
                        }}
                      />
                    );
                  case 'circle':
                    return (
                      <div
                        style={{
                          ...baseStyle,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          backgroundColor: backgroundColor,
                        }}
                      />
                    );
                  case 'arrow':
                    return (
                      <svg width="100%" height="100%" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <defs>
                          <marker
                            id={`arrowhead-${element.id}`}
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3, 0 6" fill={color} opacity={opacity / 100} />
                          </marker>
                        </defs>
                        <line
                          x1="0"
                          y1="20"
                          x2="190"
                          y2="20"
                          stroke={color}
                          strokeWidth={borderWidth}
                          markerEnd={`url(#arrowhead-${element.id})`}
                          opacity={opacity / 100}
                        />
                      </svg>
                    );
                  default:
                    return <span className="text-muted-foreground">Shape</span>;
                }
              })()}
            </div>
          )}
        </div>
      </Rnd>
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
          <div>
            <h1 className="font-semibold">{proposal.title}</h1>
            {currentSection && (
              <p className="text-sm text-muted-foreground">
                Editing: {currentSection.title}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            Section {(sections?.findIndex(s => s.id === currentSectionId) ?? -1) + 1} of {sections?.length || 0}
          </span>
          <NeumorphButton variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
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
                            className="text-sm"
                            value={element.width}
                            onChange={(e) => {
                              const newWidth = parseInt(e.target.value) || 100;
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
                                className="text-sm"
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
                                className="text-sm"
                                min="1"
                                max="6"
                                value={element.content.cols}
                                onChange={(e) => {
                                  const newCols = parseInt(e.target.value) || 1;
                                  const currentData = element.content.data || [];
                                  const newData = currentData.map((row: any) =>
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
                            className="text-sm"
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
                            className="text-sm"
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
                          className="w-full mt-4 text-sm" 
                          variant="destructive"
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
          {/* Canvas Controls */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <NeumorphButton
              size="sm"
              variant={showGrid ? 'primary' : 'default'}
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
            >
              ⊞
            </NeumorphButton>
            <div className="flex items-center gap-2 neumorph-card px-2 py-1">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="px-2 py-1 hover:text-primary"
              >
                −
              </button>
              <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="px-2 py-1 hover:text-primary"
              >
                +
              </button>
            </div>
            {selectedElement && (
              <>
                <NeumorphButton
                  size="sm"
                  onClick={() => {
                    const element = elements.find(el => el.id === selectedElement);
                    if (element) {
                      setElements(elements.map(el =>
                        el.id === selectedElement ? { ...el, locked: !el.locked } : el
                      ));
                    }
                  }}
                  title="Lock/Unlock Element"
                >
                  {elements.find(el => el.id === selectedElement)?.locked ? '🔒' : '🔓'}
                </NeumorphButton>
                <NeumorphButton
                  size="sm"
                  onClick={() => {
                    const element = elements.find(el => el.id === selectedElement);
                    if (element) {
                      const newElement = {
                        ...element,
                        id: Date.now().toString(),
                        position: { x: element.position.x + 20, y: element.position.y + 20 },
                      };
                      setElements([...elements, newElement]);
                    }
                  }}
                  title="Duplicate Element"
                >
                  📋
                </NeumorphButton>
                <NeumorphButton
                  size="sm"
                  onClick={() => {
                    if (confirm('Delete this element?')) {
                      setElements(elements.filter(el => el.id !== selectedElement));
                      setSelectedElement(null);
                    }
                  }}
                  title="Delete Element"
                  className="text-destructive"
                >
                  🗑️
                </NeumorphButton>
              </>
            )}
          </div>

          <div
            className="relative w-full h-full p-8"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              backgroundImage: showGrid
                ? 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)'
                : undefined,
              backgroundSize: showGrid ? '20px 20px' : undefined,
            }}
          >
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

        {/* Sections Navigation */}
        <div className="w-64 p-4 border-l border-border flex flex-col">
          <NeumorphCard className="flex-1 flex flex-col">
            <h3 className="mb-4 font-semibold">Sections</h3>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {sections?.map((section, index) => (
                <div
                  key={section.id}
                  className={`rounded ${
                    currentSectionId === section.id
                      ? 'neumorph-inset'
                      : ''
                  }`}
                >
                  {editingSectionId === section.id ? (
                    <div className="p-2">
                      <input
                        type="text"
                        value={editingSectionTitle}
                        onChange={(e) => setEditingSectionTitle(e.target.value)}
                        onBlur={async () => {
                          if (editingSectionTitle.trim() && editingSectionTitle !== section.title) {
                            await handleUpdateSectionTitle(section.id, editingSectionTitle);
                          } else {
                            setEditingSectionId(null);
                          }
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter') {
                            if (editingSectionTitle.trim() && editingSectionTitle !== section.title) {
                              await handleUpdateSectionTitle(section.id, editingSectionTitle);
                            } else {
                              setEditingSectionId(null);
                            }
                          } else if (e.key === 'Escape') {
                            setEditingSectionId(null);
                            setEditingSectionTitle(section.title);
                          }
                        }}
                        autoFocus
                        className="w-full px-2 py-1 text-sm border border-primary rounded"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setCurrentSectionId(section.id);
                      }}
                      className="w-full text-left p-2 hover:bg-muted/20 rounded transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm truncate flex-1">{section.title}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSectionId(section.id);
                              setEditingSectionTitle(section.title);
                            }}
                            className="text-xs text-muted-foreground hover:text-primary p-1"
                            title="Rename section"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSection(section.id);
                            }}
                            className="text-xs text-muted-foreground hover:text-destructive p-1"
                            title="Delete section"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <NeumorphButton 
              className="w-full mt-4" 
              size="sm"
              onClick={handleAddSection}
            >
              + Add Page
            </NeumorphButton>

            {/* Preview Button at Bottom */}
            <NeumorphButton
              className="w-full mt-6"
              variant="primary"
              onClick={onPreview}
            >
              🎭 View as Client
            </NeumorphButton>
          </NeumorphCard>
        </div>
      </div>

      {/* Modal Editors */}
      {editingElement && (() => {
        const element = elements.find(el => el.id === editingElement);
        if (!element) return null;

        const handleUpdate = (updates: any) => {
          setElements(elements.map(el => 
            el.id === editingElement ? { ...el, ...updates } : el
          ));
        };

        const handleClose = () => setEditingElement(null);

        switch (element.type) {
          case 'heading':
            return <HeadingEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          case 'image':
            return <ImageEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          case 'video':
            return <VideoEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          case 'embed':
            return <EmbedEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          case 'chart':
            return <ChartEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          case 'table':
            return <TableEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          case 'text':
            return <TextEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          case 'shape':
            return <ShapeEditor element={element} onUpdate={handleUpdate} onClose={handleClose} />;
          default:
            return null;
        }
      })()}
    </div>
  );
};