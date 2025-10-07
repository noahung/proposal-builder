import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';

interface HeadingEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export const HeadingEditor: React.FC<HeadingEditorProps> = ({ element, onUpdate, onClose }) => {
  const [text, setText] = useState(element.content.text || '');
  const [level, setLevel] = useState(element.content.level || 2);

  const handleSave = () => {
    onUpdate({
      content: {
        text,
        level,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeumorphCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Edit Heading</h2>
            <button
              onClick={onClose}
              className="text-2xl text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Heading Text */}
            <div>
              <label className="block text-sm font-medium mb-2">Heading Text</label>
              <NeumorphInput
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter heading text..."
                className="w-full"
              />
            </div>

            {/* Heading Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Heading Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="neumorph-input w-full px-4 py-2"
              >
                <option value={1}>H1 - Large (Main Title)</option>
                <option value={2}>H2 - Medium (Section Title)</option>
                <option value={3}>H3 - Small (Subsection)</option>
              </select>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium mb-2">Preview</label>
              <div className="neumorph-card p-4">
                {level === 1 && (
                  <h1 className="text-3xl font-bold">{text || 'Your heading will appear here'}</h1>
                )}
                {level === 2 && (
                  <h2 className="text-2xl font-bold">{text || 'Your heading will appear here'}</h2>
                )}
                {level === 3 && (
                  <h3 className="text-xl font-bold">{text || 'Your heading will appear here'}</h3>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <NeumorphButton onClick={onClose} className="flex-1">
              Cancel
            </NeumorphButton>
            <NeumorphButton onClick={handleSave} variant="primary" className="flex-1">
              Save Changes
            </NeumorphButton>
          </div>
        </div>
      </NeumorphCard>
    </div>
  );
};
