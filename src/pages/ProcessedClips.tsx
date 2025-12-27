import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ClipCard } from '@/components/clips/ClipCard';
import { UploadDialog } from '@/components/clips/UploadDialog';
import { VideoPreviewDialog } from '@/components/clips/VideoPreviewDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProcessedClips, openFileLocation } from '@/lib/api';
import { ProcessedClip } from '@/types';
import { Loader2, Search, Film, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProcessedClips() {
  const [clips, setClips] = useState<ProcessedClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClip, setSelectedClip] = useState<ProcessedClip | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  useEffect(() => {
    getProcessedClips()
      .then(setClips)
      .finally(() => setLoading(false));
  }, []);

  const filteredClips = clips.filter(clip =>
    clip.title.toLowerCase().includes(search.toLowerCase()) ||
    clip.description.toLowerCase().includes(search.toLowerCase()) ||
    clip.hashtags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePlay = (clip: ProcessedClip) => {
    setSelectedClip(clip);
    setPreviewDialogOpen(true);
  };

  const handleOpenLocation = async (clip: ProcessedClip) => {
    await openFileLocation(clip.id);
  };

  const handleUpload = (clip: ProcessedClip) => {
    setSelectedClip(clip);
    setUploadDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Processed Clips"
        description="Browse and manage your generated short-form videos"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clips..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
            <div className="flex rounded-lg border border-border">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredClips.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center py-16">
          <Film className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            {search ? 'No clips found' : 'No clips yet'}
          </h3>
          <p className="mt-1 text-muted-foreground">
            {search 
              ? 'Try a different search term'
              : 'Process some videos to see clips here'
            }
          </p>
          {!search && (
            <Button asChild className="mt-6">
              <Link to="/add-source">Add Source</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'space-y-4'
        }>
          {filteredClips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onPlay={handlePlay}
              onOpenLocation={handleOpenLocation}
              onUpload={handleUpload}
            />
          ))}
        </div>
      )}

      <VideoPreviewDialog
        clip={selectedClip}
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
      />

      <UploadDialog
        clip={selectedClip}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
