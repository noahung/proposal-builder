import React, { useState, useEffect } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { useProposal, useUpdateProposal } from '../../hooks/useProposals';
import { useSections, useCreateSection, useUpdateSection, useDeleteSection } from '../../hooks/useSections';
import { LoadingScreen } from '../utility/LoadingScreen';
import { ErrorScreen } from '../utility/ErrorScreen';

interface ProposalEditorProps {
  proposalId: string;
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
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(true);
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

  // Auto-save functionality (every 30 seconds)
  useEffect(() => {
    if (!currentSectionId || !sections) return;

    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [currentSectionId, sections]);

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

  // Loading and error states
  if (proposalLoading || sectionsLoading) {
    return <LoadingScreen />;
  }

  if (proposalError || !proposal) {
    return <ErrorScreen message="Failed to load proposal" onRetry={() => window.location.reload()} />;
  }

  // Auto-save function
  const handleAutoSave = async () => {
    if (!currentSectionId || !currentSection) return;

    try {
      await updateSection.mutateAsync({
        id: currentSectionId,
        data: {
          elements: elements,
        },
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

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
      onSave();
    } catch (error: any) {
      alert(`Failed to save proposal: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Add new section
  const handleAddSection = async () => {
    const nextOrderIndex = sections ? sections.length : 0;
    try {
      await createSection.mutateAsync({
        proposal_id: proposalId,
        title: `Section ${nextOrderIndex + 1}`,
        order_index: nextOrderIndex,
        elements: [],
      });
    } catch (error: any) {
      alert(`Failed to create section: ${error.message}`);
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
    } catch (error: any) {
      console.error('Failed to update section title:', error);
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
          <NeumorphButton onClick={onPreview}>
            Preview
          </NeumorphButton>
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

        {/* Sections Navigation */}
        <div className="w-48 p-4 border-l border-border">
          <NeumorphCard>
            <h3 className="mb-4">Sections</h3>
            <div className="space-y-2">
              {sections?.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    handleAutoSave(); // Save current section before switching
                    setCurrentSectionId(section.id);
                  }}
                  className={`w-full text-left p-2 rounded ${
                    currentSectionId === section.id
                      ? 'neumorph-inset text-primary'
                      : 'hover:neumorph-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{section.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section.id);
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive ml-2"
                    >
                      ×
                    </button>
                  </div>
                </button>
              ))}
            </div>
            
            <NeumorphButton 
              className="w-full mt-4" 
              size="sm"
              onClick={handleAddSection}
            >
              + Add Section
            </NeumorphButton>
          </NeumorphCard>
        </div>
      </div>
    </div>
  );
};