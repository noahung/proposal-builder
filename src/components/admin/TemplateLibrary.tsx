import React, { useState, useMemo } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { useTemplates, useDeleteTemplate } from '../../hooks/useTemplates';
import { LoadingScreen } from '../utility/LoadingScreen';

interface TemplateLibraryProps {
  onNavigate: (page: string, templateId?: string) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'proposal' | 'section'>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Fetch real templates data
  const { data: templatesResponse, isLoading } = useTemplates();
  const deleteTemplate = useDeleteTemplate();

  const templates = templatesResponse?.data;

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (template.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const selectedTemplate = useMemo(() => {
    return templates?.find(t => t.id === selectedTemplateId);
  }, [templates, selectedTemplateId]);

  const handleUseTemplate = (templateId: string) => {
    onNavigate('proposal-create', templateId);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate.mutateAsync(templateId);
      setSelectedTemplateId(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === 'proposal' ? '📄' : '📋';
  };

  // Show loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <NeumorphButton onClick={() => setSelectedTemplateId(null)}>
            ← Back
          </NeumorphButton>
          <h1>{selectedTemplate.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NeumorphCard className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{getCategoryIcon(selectedTemplate.category || 'proposal')}</div>
                <p className="text-muted-foreground">Template Preview</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Full preview functionality will be implemented in Phase 3
                </p>
              </div>
            </NeumorphCard>
          </div>
          
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-4">Template Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="capitalize">{selectedTemplate.category || 'proposal'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedTemplate.description || 'No description'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Modified</p>
                  <p>{new Date(selectedTemplate.updated_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{new Date(selectedTemplate.created_at).toLocaleDateString()}</p>
                </div>
                {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTemplate.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </NeumorphCard>
            
            <NeumorphCard>
              <h3 className="mb-4">Actions</h3>
              <div className="space-y-3">
                <NeumorphButton 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleUseTemplate(selectedTemplate.id)}
                >
                  Use Template
                </NeumorphButton>
                <NeumorphButton 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                >
                  Delete Template
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
        <h1>Template Library</h1>
        <NeumorphButton variant="primary">
          Create New Template
        </NeumorphButton>
      </div>
      
      {/* Filters */}
      <NeumorphCard>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <NeumorphInput
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'proposal', 'section'] as const).map((category) => (
              <NeumorphButton
                key={category}
                variant={selectedCategory === category ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {category !== 'all' && templates && (
                  <span className="ml-2 text-xs opacity-70">
                    ({templates.filter(t => t.category === category).length})
                  </span>
                )}
              </NeumorphButton>
            ))}
          </div>
        </div>
      </NeumorphCard>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <NeumorphCard 
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedTemplateId(template.id)}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{getCategoryIcon(template.category || 'proposal')}</div>
              <h3 className="mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description || 'No description'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Category:</span>
                <span className="capitalize">{template.category || 'proposal'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Public:</span>
                <span>{template.is_public ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Modified:</span>
                <span>{new Date(template.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            {template.tags && template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {template.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-muted rounded-full text-xs">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <NeumorphButton 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseTemplate(template.id);
                }}
              >
                Use
              </NeumorphButton>
              <NeumorphButton 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTemplateId(template.id);
                }}
              >
                View
              </NeumorphButton>
            </div>
          </NeumorphCard>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No templates found matching your criteria</p>
          <NeumorphButton variant="primary">
            Create Your First Template
          </NeumorphButton>
        </div>
      )}
    </div>
  );
};