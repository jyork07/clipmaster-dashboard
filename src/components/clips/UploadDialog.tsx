import { ProcessedClip } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { copyToClipboard } from '@/lib/api';
import { toast } from 'sonner';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';

interface UploadDialogProps {
  clip: ProcessedClip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platforms = [
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    url: 'https://www.tiktok.com/upload',
    color: 'bg-[#010101] hover:bg-[#1a1a1a] border-[#fe2c55]/50',
  },
  {
    id: 'youtube',
    name: 'YouTube Shorts',
    icon: '▶️',
    url: 'https://www.youtube.com/upload',
    color: 'bg-[#ff0000]/10 hover:bg-[#ff0000]/20 border-[#ff0000]/50',
  },
  {
    id: 'instagram',
    name: 'Instagram Reels',
    icon: '📸',
    url: 'https://www.instagram.com/',
    color: 'bg-gradient-to-r from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10 hover:from-[#833ab4]/20 hover:via-[#fd1d1d]/20 hover:to-[#fcb045]/20 border-[#fd1d1d]/50',
  },
];

export function UploadDialog({ clip, open, onOpenChange }: UploadDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!clip) return null;

  const captionText = `${clip.title}\n\n${clip.description}`;
  const hashtagText = clip.hashtags.map(t => `#${t}`).join(' ');
  const fullText = `${captionText}\n\n${hashtagText}`;

  const handleCopy = async (text: string, field: string) => {
    await copyToClipboard(text);
    setCopiedField(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUpload = (platform: typeof platforms[0]) => {
    // Copy full text to clipboard
    copyToClipboard(fullText);
    toast.success(`Caption and hashtags copied! Opening ${platform.name}...`);
    
    // Open platform upload page
    window.open(platform.url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Clip</DialogTitle>
          <DialogDescription>
            Choose a platform to upload your clip. Caption and hashtags will be copied automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Clip Preview */}
        <div className="flex gap-4 rounded-lg bg-muted/50 p-4">
          <img
            src={clip.thumbnail}
            alt={clip.title}
            className="h-24 w-14 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold line-clamp-2">{clip.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{clip.description}</p>
          </div>
        </div>

        {/* Caption & Hashtags */}
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Caption</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(captionText, 'caption')}
                className="h-7 gap-1 text-xs"
              >
                {copiedField === 'caption' ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                Copy
              </Button>
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium">{clip.title}</p>
              <p className="mt-1 text-muted-foreground">{clip.description}</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Hashtags</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(hashtagText, 'hashtags')}
                className="h-7 gap-1 text-xs"
              >
                {copiedField === 'hashtags' ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                Copy
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {clip.hashtags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Buttons */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Upload to Platform</span>
          <div className="grid gap-2">
            {platforms.map((platform) => (
              <Button
                key={platform.id}
                variant="outline"
                onClick={() => handleUpload(platform)}
                className={`h-14 justify-between ${platform.color}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{platform.icon}</span>
                  <span className="font-medium">{platform.name}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          💡 Tip: Caption and hashtags are automatically copied when you click a platform button
        </p>
      </DialogContent>
    </Dialog>
  );
}
