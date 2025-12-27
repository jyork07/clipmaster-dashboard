export type JobStatus = 'queued' | 'downloading' | 'transcribing' | 'clipping' | 'rendering' | 'completed' | 'failed' | 'cancelled';

export type SourceType = 'youtube_video' | 'youtube_playlist' | 'youtube_channel' | 'local_file';

export interface Job {
  id: string;
  sourceUrl: string;
  sourceType: SourceType;
  title: string;
  thumbnail?: string;
  duration?: number;
  status: JobStatus;
  progress: number;
  currentTask: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessedClip {
  id: string;
  jobId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  filePath: string;
  sourceTitle: string;
  sourceUrl: string;
  hashtags: string[];
  createdAt: Date;
  status: 'ready' | 'uploading' | 'uploaded';
  uploadedTo?: ('tiktok' | 'youtube' | 'instagram')[];
}

export interface AppSettings {
  apiKeys: {
    openai?: string;
    tiktok?: string;
    youtube?: string;
    instagram?: string;
  };
  gpuAutoDetect: boolean;
  deleteRawAfterProcessing: boolean;
  libraryPath: string;
  outputPath: string;
  whisperModel: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  maxConcurrentJobs: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
  jobId?: string;
}

export interface DashboardStats {
  totalProcessed: number;
  totalFailed: number;
  activeJobs: number;
  averageProcessingTime: number;
  totalClips: number;
}
