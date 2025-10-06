import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface EmbedEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export const EmbedEditor: React.FC<EmbedEditorProps> = ({ element, onUpdate, onClose }) => {
  const [embedCode, setEmbedCode] = useState(element.content.code || '');
  const [embedType, setEmbedType] = useState<'iframe' | 'code'>(element.content.embedType || 'iframe');

  const handleSave = () => {
    onUpdate({
      content: {
        code: embedCode,
        embedType: embedType,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeumorphCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Embed Editor</h2>
          <button onClick={onClose} className="text-2xl hover:text-destructive">×</button>
        </div>

        <Tabs value={embedType} onValueChange={(v: any) => setEmbedType(v as 'iframe' | 'code')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="iframe">IFrame Embed</TabsTrigger>
            <TabsTrigger value="code">HTML/JavaScript</TabsTrigger>
          </TabsList>

          <TabsContent value="iframe" className="space-y-4 mt-4">
            <div>
              <Label>IFrame Embed Code</Label>
              <textarea
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                placeholder='<iframe src="https://example.com" width="100%" height="400"></iframe>'
                className="neumorph-input w-full min-h-[150px] mt-2 font-mono text-sm p-3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste your iframe embed code here (e.g., from YouTube, Google Maps, etc.)
              </p>
            </div>

            {/* Preview */}
            <div>
              <Label>Preview</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 min-h-[200px] bg-muted/20">
                {embedCode ? (
                  <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No embed code provided
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4 mt-4">
            <div>
              <Label>HTML/JavaScript Code</Label>
              <textarea
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                placeholder='<div>Your custom HTML and JavaScript code here</div>'
                className="neumorph-input w-full min-h-[200px] mt-2 font-mono text-sm p-3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste HTML or JavaScript embed code (e.g., from Twitter, CodePen, etc.)
              </p>
            </div>

            {/* Preview */}
            <div>
              <Label>Preview</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 min-h-[200px] bg-muted/20">
                {embedCode ? (
                  <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No code provided
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
          <NeumorphButton onClick={onClose}>Cancel</NeumorphButton>
          <NeumorphButton variant="primary" onClick={handleSave}>
            Save Embed
          </NeumorphButton>
        </div>
      </NeumorphCard>
    </div>
  );
};
