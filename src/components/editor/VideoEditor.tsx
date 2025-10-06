import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';

interface VideoEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ element, onUpdate, onClose }) => {
  const [url, setUrl] = useState(element.content.url || '');
  const [title, setTitle] = useState(element.content.title || '');
  const [autoplay, setAutoplay] = useState(element.content.autoplay || false);
  const [muted, setMuted] = useState(element.content.muted || false);
  const [loop, setLoop] = useState(element.content.loop || false);

  const getEmbedUrl = (videoUrl: string) => {
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('youtu.be')
        ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
        : videoUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`;
    }
    // Vimeo
    if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`;
    }
    // Direct video URL
    return videoUrl;
  };

  const handleSave = () => {
    onUpdate({
      content: {
        url,
        embedUrl: getEmbedUrl(url),
        title,
        autoplay,
        muted,
        loop,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <NeumorphCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Video Editor</h2>
          <button onClick={onClose} className="text-2xl hover:text-destructive">×</button>
        </div>

        <div className="space-y-4">
          {/* Video Preview */}
          <div>
            <Label>Preview</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-muted/20">
              {url ? (
                <iframe
                  src={getEmbedUrl(url)}
                  className="w-full h-[300px] rounded"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <span className="text-muted-foreground">No video URL provided</span>
              )}
            </div>
          </div>

          {/* Video URL */}
          <div>
            <Label>Video URL</Label>
            <NeumorphInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports YouTube, Vimeo, and direct video URLs
            </p>
          </div>

          {/* Title */}
          <div>
            <Label>Video Title</Label>
            <NeumorphInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="mt-2"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label>Playback Options</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Autoplay</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={muted}
                  onChange={(e) => setMuted(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Muted</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Loop</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <NeumorphButton onClick={onClose}>Cancel</NeumorphButton>
            <NeumorphButton variant="primary" onClick={handleSave}>
              Save Video
            </NeumorphButton>
          </div>
        </div>
      </NeumorphCard>
    </div>
  );
};
