import { ProcessedClip } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  FolderOpen, 
  Upload, 
  Clock, 
  ExternalLink,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ClipCardProps {
  clip: ProcessedClip;
  onPlay: (clip: ProcessedClip) => void;
  onOpenLocation: (clip: ProcessedClip) => void;
  onUpload: (clip: ProcessedClip) => void;
}

export function ClipCard({ clip, onPlay, onOpenLocation, onUpload }: ClipCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel overflow-hidden transition-all duration-300 hover:scale-[1.02] animate-slide-up group">
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] max-h-64 overflow-hidden">
        <img
          src={clip.thumbnail}
          alt={clip.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        <button
          onClick={() => onPlay(clip)}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <div className="rounded-full bg-primary/90 p-4 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
            <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
          </div>
        </button>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-mono font-medium backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          {formatDuration(clip.duration)}
        </div>

        {/* Upload Status */}
        {clip.uploadedTo && clip.uploadedTo.length > 0 && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-success/20 px-2 py-1 text-xs font-medium text-success backdrop-blur-sm">
            <Check className="h-3 w-3" />
            Uploaded
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{clip.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{clip.description}</p>

        {/* Source */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          <span className="line-clamp-1">{clip.sourceTitle}</span>
        </div>

        {/* Hashtags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {clip.hashtags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {clip.hashtags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{clip.hashtags.length - 3}
            </Badge>
          )}
        </div>

        {/* Created Date */}
        <p className="mt-3 text-xs text-muted-foreground">
          Created {formatDistanceToNow(clip.createdAt, { addSuffix: true })}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenLocation(clip)}
            className="flex-1 gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Open
          </Button>
          <Button
            size="sm"
            onClick={() => onUpload(clip)}
            className="flex-1 gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
