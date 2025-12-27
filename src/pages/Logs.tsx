import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getLogs, openRawLogs } from '@/lib/api';
import { LogEntry } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Loader2, 
  RefreshCw, 
  FileText, 
  Search,
  Filter,
  Inbox,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const levelConfig = {
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
  success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
};

function LogEntryComponent({ log }: { log: LogEntry }) {
  const config = levelConfig[log.level];
  const Icon = config.icon;
  return (
    <div className={cn('flex gap-4 rounded-lg border p-4', config.bg, config.border)}>
      <div className={cn('rounded-lg p-2', config.bg)}>
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <p className="font-medium">{log.message}</p>
          <span className="shrink-0 text-xs text-muted-foreground font-mono">{format(log.timestamp, 'HH:mm:ss')}</span>
        </div>
        {log.details && <p className="mt-2 text-sm text-muted-foreground font-mono bg-muted/50 rounded p-2">{log.details}</p>}
        {log.jobId && <p className="mt-2 text-xs text-muted-foreground">Job ID: <span className="font-mono">{log.jobId}</span></p>}
      </div>
    </div>
  );
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleOpenRawLogs = () => {
    openRawLogs();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity Logs"
        description="View processing activity and system events"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={fetchLogs}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={handleOpenRawLogs}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Open Raw Logs
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      {loading && logs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center py-16">
          <Inbox className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            {search || levelFilter !== 'all' ? 'No matching logs' : 'No logs yet'}
          </h3>
          <p className="mt-1 text-muted-foreground">
            {search || levelFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'Activity will appear here as jobs are processed'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <LogEntryComponent key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
