import { ProcessedClip } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink } from 'lucide-react';

interface VideoPreviewDialogProps {
  clip: ProcessedClip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPreviewDialog({ clip, open, onOpenChange }: VideoPreviewDialogProps) {
  if (!clip) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="line-clamp-1">{clip.title}</DialogTitle>
        </DialogHeader>

        {/* Video Preview Area */}
        <div className="relative aspect-[9/16] max-h-[60vh] overflow-hidden rounded-lg bg-muted">
          <img
            src={clip.thumbnail}
            alt={clip.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <p className="text-sm text-muted-foreground">
              Video preview will play when backend is connected
            </p>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-mono font-medium backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {formatDuration(clip.duration)}
          </div>
        </div>

        {/* Clip Info */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{clip.description}</p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span className="line-clamp-1">{clip.sourceTitle}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {clip.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">File Path</p>
            <p className="mt-1 text-sm font-mono">{clip.filePath}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
