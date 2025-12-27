import { Link } from 'react-router-dom';
import { Plus, ListOrdered, Film, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  {
    label: 'Add Source',
    description: 'Add new video or playlist',
    icon: Plus,
    path: '/add-source',
    variant: 'primary' as const,
  },
  {
    label: 'Processing Queue',
    description: 'View active jobs',
    icon: ListOrdered,
    path: '/queue',
    variant: 'default' as const,
  },
  {
    label: 'Processed Clips',
    description: 'Browse your library',
    icon: Film,
    path: '/clips',
    variant: 'default' as const,
  },
  {
    label: 'Settings',
    description: 'Configure pipeline',
    icon: Settings,
    path: '/settings',
    variant: 'default' as const,
  },
  {
    label: 'Logs',
    description: 'View activity logs',
    icon: FileText,
    path: '/logs',
    variant: 'default' as const,
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {actions.map((action) => (
        <Link
          key={action.path}
          to={action.path}
          className={cn(
            'group glass-panel flex flex-col items-center justify-center gap-3 p-6 text-center transition-all duration-300 hover:scale-[1.02]',
            action.variant === 'primary' && 'border-primary/30 bg-primary/5 hover:bg-primary/10'
          )}
        >
          <div
            className={cn(
              'rounded-xl p-4 transition-all duration-300',
              action.variant === 'primary'
                ? 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                : 'bg-muted text-muted-foreground group-hover:bg-secondary group-hover:text-foreground'
            )}
          >
            <action.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">{action.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
