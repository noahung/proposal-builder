import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';

interface SavedElement {
  id: string;
  name: string;
  type: 'text' | 'table' | 'button' | 'image' | 'chart' | 'form';
  description: string;
  thumbnail: string;
  lastUsed: string;
  usageCount: number;
  category: string;
}

interface ElementLibraryProps {
  onNavigate: (page: string, elementId?: string) => void;
}

export const ElementLibrary: React.FC<ElementLibraryProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<SavedElement | null>(null);

  const savedElements: SavedElement[] = [
    {
      id: '1',
      name: 'Pricing Table - Premium',
      type: 'table',
      description: 'Three-tier pricing table with highlighted premium option',
      thumbnail: '💰',
      lastUsed: '2024-01-15',
      usageCount: 12,
      category: 'pricing',
    },
    {
      id: '2',
      name: 'Call to Action - Primary',
      type: 'button',
      description: 'Large primary CTA button with hover effects',
      thumbnail: '🔘',
      lastUsed: '2024-01-14',
      usageCount: 18,
      category: 'buttons',
    },
    {
      id: '3',
      name: 'Team Introduction Block',
      type: 'text',
      description: 'Formatted text block for team member introductions',
      thumbnail: '👥',
      lastUsed: '2024-01-12',
      usageCount: 8,
      category: 'content',
    },
    {
      id: '4',
      name: 'Service Benefits Chart',
      type: 'chart',
      description: 'Horizontal bar chart showing service benefits comparison',
      thumbnail: '📊',
      lastUsed: '2024-01-10',
      usageCount: 15,
      category: 'charts',
    },
    {
      id: '5',
      name: 'Hero Image with Overlay',
      type: 'image',
      description: 'Hero image with text overlay and gradient effect',
      thumbnail: '🖼️',
      lastUsed: '2024-01-08',
      usageCount: 6,
      category: 'images',
    },
    {
      id: '6',
      name: 'Contact Form - Simple',
      type: 'form',
      description: 'Basic contact form with name, email, and message fields',
      thumbnail: '📝',
      lastUsed: '2024-01-06',
      usageCount: 4,
      category: 'forms',
    },
  ];

  const categories = ['all', 'pricing', 'buttons', 'content', 'charts', 'images', 'forms'];

  const filteredElements = savedElements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseElement = (element: SavedElement) => {
    console.log('Using element:', element);
    onNavigate('proposal-editor');
  };

  const handleDuplicateElement = (element: SavedElement) => {
    console.log('Duplicating element:', element);
  };

  const handleDeleteElement = (element: SavedElement) => {
    console.log('Deleting element:', element);
    setSelectedElement(null);
  };

  if (selectedElement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <NeumorphButton onClick={() => setSelectedElement(null)}>
            ← Back
          </NeumorphButton>
          <h1>{selectedElement.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NeumorphCard className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedElement.thumbnail}</div>
                <p className="text-muted-foreground">Element Preview</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Interactive preview would be shown here
                </p>
              </div>
            </NeumorphCard>
          </div>
          
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-4">Element Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="capitalize">{selectedElement.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="capitalize">{selectedElement.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedElement.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Used</p>
                  <p>{new Date(selectedElement.lastUsed).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usage Count</p>
                  <p>{selectedElement.usageCount} times</p>
                </div>
              </div>
            </NeumorphCard>
            
            <NeumorphCard>
              <h3 className="mb-4">Actions</h3>
              <div className="space-y-3">
                <NeumorphButton 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleUseElement(selectedElement)}
                >
                  Use Element
                </NeumorphButton>
                <NeumorphButton 
                  className="w-full"
                  onClick={() => handleDuplicateElement(selectedElement)}
                >
                  Duplicate
                </NeumorphButton>
                <NeumorphButton className="w-full">
                  Edit Element
                </NeumorphButton>
                <NeumorphButton 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleDeleteElement(selectedElement)}
                >
                  Delete Element
                </NeumorphButton>
              </div>
            </NeumorphCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Element Library</h1>
        <NeumorphButton variant="primary">
          Save Current Element
        </NeumorphButton>
      </div>
      
      {/* Filters */}
      <NeumorphCard>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <NeumorphInput
              placeholder="Search elements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <NeumorphButton
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {category !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({savedElements.filter(e => e.category === category).length})
                  </span>
                )}
              </NeumorphButton>
            ))}
          </div>
        </div>
      </NeumorphCard>
      
      {/* Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredElements.map((element) => (
          <NeumorphCard 
            key={element.id}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedElement(element)}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{element.thumbnail}</div>
              <h3 className="mb-1">{element.name}</h3>
              <p className="text-sm text-muted-foreground">{element.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{element.type}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Used:</span>
                <span>{element.usageCount} times</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Last used:</span>
                <span>{new Date(element.lastUsed).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <NeumorphButton 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseElement(element);
                }}
              >
                Use
              </NeumorphButton>
              <NeumorphButton 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(element);
                }}
              >
                View
              </NeumorphButton>
            </div>
          </NeumorphCard>
        ))}
      </div>
      
      {filteredElements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No elements found matching your criteria</p>
          <NeumorphButton variant="primary">
            Create Your First Element
          </NeumorphButton>
        </div>
      )}
    </div>
  );
};