import React, { useState, useMemo } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate, onClose }) => {
  const [content, setContent] = useState(element.content.text || '');
  const [fontSize, setFontSize] = useState(element.content.fontSize || 16);
  const [textAlign, setTextAlign] = useState(element.content.textAlign || 'left');
  const [color, setColor] = useState(element.content.color || '#000000');

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
  ];

  const handleSave = () => {
    onUpdate({
      content: {
        text: content,
        fontSize,
        textAlign,
        color,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeumorphCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Text Editor</h2>
          <button onClick={onClose} className="text-2xl hover:text-destructive">×</button>
        </div>

        <div className="space-y-4">
          {/* Text Formatting Options */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <NeumorphInput
                id="font-size"
                type="number"
                min="8"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value) || 16)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="text-align">Text Align</Label>
              <select
                id="text-align"
                value={textAlign}
                onChange={(e) => setTextAlign(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-border rounded-lg"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  id="text-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-20 border border-border rounded-lg cursor-pointer"
                />
                <NeumorphInput
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <Label>Content</Label>
            <div className="mt-2 bg-white rounded-lg border border-border overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                style={{ minHeight: '300px' }}
              />
            </div>
          </div>

          {/* Preview */}
          <div>
            <Label>Preview</Label>
            <div
              className="mt-2 border-2 border-border rounded-lg p-6 bg-white min-h-[200px]"
              style={{
                fontSize: `${fontSize}px`,
                textAlign: textAlign as any,
                color: color,
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <NeumorphButton onClick={onClose}>Cancel</NeumorphButton>
            <NeumorphButton variant="primary" onClick={handleSave}>
              Save Text
            </NeumorphButton>
          </div>
        </div>
      </NeumorphCard>
    </div>
  );
};
