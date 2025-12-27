import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchVideoMetadata, createJob } from '@/lib/api';
import { SourceType } from '@/types';
import { toast } from 'sonner';
import { 
  Link, 
  ListVideo, 
  User, 
  Upload, 
  Loader2, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AddSource() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [metadata, setMetadata] = useState<{
    title: string;
    thumbnail: string;
    duration: number;
    channel: string;
    type: SourceType;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (input: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(input);
  };

  const handleFetchMetadata = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      const data = await fetchVideoMetadata(url);
      setMetadata(data);
    } catch (err) {
      setError('Failed to fetch video metadata. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!metadata) return;

    setSubmitting(true);
    try {
      await createJob({
        sourceUrl: url,
        sourceType: metadata.type,
      });
      toast.success('Job added to processing queue!');
      navigate('/queue');
    } catch (err) {
      toast.error('Failed to create job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSourceTypeLabel = (type: SourceType) => {
    switch (type) {
      case 'youtube_video': return 'Single Video';
      case 'youtube_playlist': return 'Playlist';
      case 'youtube_channel': return 'Channel';
      case 'local_file': return 'Local File';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Source"
        description="Add a YouTube video, playlist, or channel to process"
      />

      <div className="max-w-2xl">
        <Tabs defaultValue="url" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="url" className="gap-2">
              <Link className="h-4 w-4" />
              Video URL
            </TabsTrigger>
            <TabsTrigger value="playlist" className="gap-2">
              <ListVideo className="h-4 w-4" />
              Playlist
            </TabsTrigger>
            <TabsTrigger value="channel" className="gap-2">
              <User className="h-4 w-4" />
              Channel
            </TabsTrigger>
            <TabsTrigger value="file" className="gap-2">
              <Upload className="h-4 w-4" />
              Local File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-url">YouTube Video URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="video-url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                      setMetadata(null);
                    }}
                    className="font-mono"
                  />
                  <Button 
                    onClick={handleFetchMetadata}
                    disabled={loading || !url.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Validate'
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="playlist" className="space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-url">YouTube Playlist URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="playlist-url"
                    placeholder="https://youtube.com/playlist?list=..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                      setMetadata(null);
                    }}
                    className="font-mono"
                  />
                  <Button 
                    onClick={handleFetchMetadata}
                    disabled={loading || !url.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Validate'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="channel" className="space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channel-url">YouTube Channel URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="channel-url"
                    placeholder="https://youtube.com/@channelname"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                      setMetadata(null);
                    }}
                    className="font-mono"
                  />
                  <Button 
                    onClick={handleFetchMetadata}
                    disabled={loading || !url.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Validate'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-6">
            <div className="glass-panel p-6">
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Upload Local Video</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drag and drop or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  Select File
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Supported: MP4, MOV, AVI, MKV (max 4GB)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Metadata Preview */}
        {metadata && (
          <div className="glass-panel mt-6 p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Video Validated</h3>
            </div>
            
            <div className="flex gap-4">
              <img
                src={metadata.thumbnail}
                alt={metadata.title}
                className="h-24 w-40 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold line-clamp-2">{metadata.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{metadata.channel}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(metadata.duration)}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">
                    {getSourceTypeLabel(metadata.type)}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              className="mt-6 w-full" 
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding to Queue...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Add to Processing Queue
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
