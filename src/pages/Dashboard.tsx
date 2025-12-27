import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { getDashboardStats } from '@/lib/api';
import { DashboardStats } from '@/types';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Clock, 
  Film 
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Monitor your video processing pipeline"
      />

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <QuickActions />
      </section>

      {/* Stats */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Videos Processed"
              value={stats.totalProcessed}
              icon={CheckCircle}
              variant="success"
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              title="Failed Jobs"
              value={stats.totalFailed}
              icon={XCircle}
              variant="destructive"
            />
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs}
              icon={Loader2}
              variant="primary"
            />
            <StatCard
              title="Avg. Processing Time"
              value={formatTime(stats.averageProcessingTime)}
              icon={Clock}
            />
            <StatCard
              title="Total Clips"
              value={stats.totalClips}
              icon={Film}
              variant="primary"
            />
          </div>
        ) : null}
      </section>

      {/* Recent Activity Preview */}
      <section className="glass-panel p-6">
        <h2 className="mb-4 text-lg font-semibold">System Status</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="font-medium">Backend API</p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="font-medium">GPU Detection</p>
              <p className="text-sm text-muted-foreground">NVIDIA RTX 3080</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="font-medium">Whisper Model</p>
              <p className="text-sm text-muted-foreground">Medium (loaded)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
