import { Job } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Mic, 
  Scissors, 
  Film, 
  Clock, 
  AlertCircle, 
  RotateCcw,
  X,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  onCancel: (jobId: string) => void;
  onRetry: (jobId: string) => void;
}

const statusConfig = {
  queued: { icon: Clock, label: 'Queued', color: 'text-muted-foreground' },
  downloading: { icon: Download, label: 'Downloading', color: 'text-primary' },
  transcribing: { icon: Mic, label: 'Transcribing', color: 'text-primary' },
  clipping: { icon: Scissors, label: 'Clipping', color: 'text-primary' },
  rendering: { icon: Film, label: 'Rendering', color: 'text-primary' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'text-success' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-destructive' },
  cancelled: { icon: X, label: 'Cancelled', color: 'text-muted-foreground' },
};

export function JobCard({ job, onCancel, onRetry }: JobCardProps) {
  const config = statusConfig[job.status];
  const StatusIcon = config.icon;
  const isActive = ['downloading', 'transcribing', 'clipping', 'rendering'].includes(job.status);
  const canRetry = job.status === 'failed';
  const canCancel = isActive || job.status === 'queued';

  return (
    <div className={cn(
      'glass-panel p-5 transition-all duration-300 animate-slide-up',
      job.status === 'failed' && 'border-destructive/30',
      isActive && 'border-primary/30'
    )}>
      <div className="flex gap-4">
        {/* Thumbnail */}
        {job.thumbnail ? (
          <img
            src={job.thumbnail}
            alt={job.title}
            className="h-20 w-36 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-20 w-36 items-center justify-center rounded-lg bg-muted">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold line-clamp-1">{job.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1 font-mono">
                {job.sourceUrl}
              </p>
            </div>
            <div className={cn('flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium', config.color)}>
              <StatusIcon className={cn('h-3.5 w-3.5', isActive && 'animate-pulse')} />
              {config.label}
            </div>
          </div>

          {/* Progress */}
          {isActive && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{job.currentTask}</span>
                <span className="font-mono font-medium text-primary">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>
          )}

          {/* Error Message */}
          {job.status === 'failed' && job.errorMessage && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{job.errorMessage}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Created {formatDistanceToNow(job.createdAt, { addSuffix: true })}</span>
              {job.retryCount > 0 && (
                <span className="flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" />
                  {job.retryCount} retries
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {canRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRetry(job.id)}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </Button>
              )}
              {canCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancel(job.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
