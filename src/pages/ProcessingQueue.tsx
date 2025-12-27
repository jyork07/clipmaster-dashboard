import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { JobCard } from '@/components/queue/JobCard';
import { Button } from '@/components/ui/button';
import { getJobs, cancelJob, retryJob } from '@/lib/api';
import { Job } from '@/types';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProcessingQueue() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (jobId: string) => {
    try {
      await cancelJob(jobId);
      toast.success('Job cancelled');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to cancel job');
    }
  };

  const handleRetry = async (jobId: string) => {
    try {
      await retryJob(jobId);
      toast.success('Job requeued');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to retry job');
    }
  };

  const activeJobs = jobs.filter(j => 
    ['queued', 'downloading', 'transcribing', 'clipping', 'rendering'].includes(j.status)
  );
  const failedJobs = jobs.filter(j => j.status === 'failed');
  const completedJobs = jobs.filter(j => j.status === 'completed' || j.status === 'cancelled');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Processing Queue"
        description="Monitor active and pending jobs"
        actions={
          <Button 
            variant="outline" 
            onClick={fetchJobs}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            Refresh
          </Button>
        }
      />

      {loading && jobs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center py-16">
          <Inbox className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No jobs in queue</h3>
          <p className="mt-1 text-muted-foreground">Add a source to start processing</p>
          <Button asChild className="mt-6">
            <Link to="/add-source">Add Source</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Jobs */}
          {activeJobs.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Active ({activeJobs.length})
              </h2>
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onCancel={handleCancel}
                    onRetry={handleRetry}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Failed Jobs */}
          {failedJobs.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Failed ({failedJobs.length})
              </h2>
              <div className="space-y-4">
                {failedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onCancel={handleCancel}
                    onRetry={handleRetry}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed Jobs */}
          {completedJobs.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
                Recently Completed ({completedJobs.length})
              </h2>
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onCancel={handleCancel}
                    onRetry={handleRetry}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
