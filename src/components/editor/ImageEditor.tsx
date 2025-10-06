import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';

interface ImageEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ element, onUpdate, onClose }) => {
  const [imageUrl, setImageUrl] = useState(element.content.src || '');
  const [alt, setAlt] = useState(element.content.alt || '');
  const [caption, setCaption] = useState(element.content.caption || '');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload to Supabase Storage
    setUploading(true);
    try {
      // Placeholder: In production, upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  const handleSave = () => {
    onUpdate({
      content: {
        src: imageUrl,
        alt,
        caption,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <NeumorphCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Image Editor</h2>
          <button onClick={onClose} className="text-2xl hover:text-destructive">×</button>
        </div>

        <div className="space-y-4">
          {/* Image Preview */}
          <div>
            <Label>Preview</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-muted/20">
              {imageUrl ? (
                <img src={imageUrl} alt={alt} className="max-h-[300px] max-w-full object-contain" />
              ) : (
                <span className="text-muted-foreground">No image selected</span>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div>
            <Label>Upload Image</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
            </div>
          </div>

          {/* Or URL */}
          <div>
            <Label>Or Image URL</Label>
            <NeumorphInput
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-2"
            />
          </div>

          {/* Alt Text */}
          <div>
            <Label>Alt Text (for accessibility)</Label>
            <NeumorphInput
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image"
              className="mt-2"
            />
          </div>

          {/* Caption */}
          <div>
            <Label>Caption (optional)</Label>
            <NeumorphInput
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Image caption"
              className="mt-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <NeumorphButton onClick={onClose}>Cancel</NeumorphButton>
            <NeumorphButton variant="primary" onClick={handleSave}>
              Save Image
            </NeumorphButton>
          </div>
        </div>
      </NeumorphCard>
    </div>
  );
};
