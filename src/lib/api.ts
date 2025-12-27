/**
 * API Stubs for TrendClip Lite
 * These functions simulate backend calls and should be replaced
 * with actual API endpoints when the FastAPI backend is ready.
 */

import { Job, ProcessedClip, AppSettings, LogEntry, DashboardStats, SourceType } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Simulated delay for demo purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  // TODO: Replace with actual API call
  // return fetch(`${API_BASE_URL}/stats`).then(r => r.json());
  await delay(300);
  return {
    totalProcessed: 47,
    totalFailed: 3,
    activeJobs: 2,
    averageProcessingTime: 245,
    totalClips: 156,
  };
}

// Jobs
export async function getJobs(): Promise<Job[]> {
  // TODO: Replace with actual API call
  // return fetch(`${API_BASE_URL}/jobs`).then(r => r.json());
  await delay(300);
  return mockJobs;
}

export async function createJob(data: {
  sourceUrl: string;
  sourceType: SourceType;
}): Promise<Job> {
  // TODO: Replace with actual API call
  // return fetch(`${API_BASE_URL}/jobs`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // }).then(r => r.json());
  await delay(500);
  const newJob: Job = {
    id: `job-${Date.now()}`,
    sourceUrl: data.sourceUrl,
    sourceType: data.sourceType,
    title: 'New Video Processing',
    status: 'queued',
    progress: 0,
    currentTask: 'Waiting in queue...',
    retryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return newJob;
}

export async function cancelJob(jobId: string): Promise<void> {
  // TODO: Replace with actual API call
  // return fetch(`${API_BASE_URL}/jobs/${jobId}/cancel`, { method: 'POST' });
  await delay(200);
}

export async function retryJob(jobId: string): Promise<Job> {
  // TODO: Replace with actual API call
  await delay(200);
  return mockJobs[0];
}

// Processed Clips
export async function getProcessedClips(): Promise<ProcessedClip[]> {
  // TODO: Replace with actual API call
  await delay(300);
  return mockClips;
}

export async function openFileLocation(clipId: string): Promise<void> {
  // TODO: This should trigger the backend to open the file explorer
  // return fetch(`${API_BASE_URL}/clips/${clipId}/open-location`, { method: 'POST' });
  console.log(`Opening file location for clip: ${clipId}`);
}

// Video Metadata
export async function fetchVideoMetadata(url: string): Promise<{
  title: string;
  thumbnail: string;
  duration: number;
  channel: string;
  type: SourceType;
}> {
  // TODO: Replace with actual API call that uses yt-dlp
  await delay(800);
  
  // Detect source type from URL
  let type: SourceType = 'youtube_video';
  if (url.includes('playlist')) {
    type = 'youtube_playlist';
  } else if (url.includes('@') || url.includes('/c/') || url.includes('/channel/')) {
    type = 'youtube_channel';
  }
  
  return {
    title: 'Sample Video Title - This is a Test',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=480&h=270&fit=crop',
    duration: 634,
    channel: 'Sample Channel',
    type,
  };
}

// Settings
export async function getSettings(): Promise<AppSettings> {
  // Load from localStorage for now, backend will handle encryption
  const stored = localStorage.getItem('trendclip_settings');
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultSettings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  // TODO: Send to backend for secure storage
  // For now, store in localStorage (API keys should be encrypted by backend)
  localStorage.setItem('trendclip_settings', JSON.stringify(settings));
}

// Logs
export async function getLogs(): Promise<LogEntry[]> {
  // TODO: Replace with actual API call
  await delay(200);
  return mockLogs;
}

export async function openRawLogs(): Promise<void> {
  // TODO: Trigger backend to open log file
  console.log('Opening raw logs...');
}

// Clipboard utility
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

// Mock Data
const mockJobs: Job[] = [
  {
    id: 'job-1',
    sourceUrl: 'https://youtube.com/watch?v=abc123',
    sourceType: 'youtube_video',
    title: 'How to Build a Successful Startup in 2024',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=320&h=180&fit=crop',
    duration: 1245,
    status: 'transcribing',
    progress: 45,
    currentTask: 'Transcribing audio with Whisper...',
    retryCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(),
  },
  {
    id: 'job-2',
    sourceUrl: 'https://youtube.com/watch?v=def456',
    sourceType: 'youtube_video',
    title: 'The Future of AI - A Deep Dive',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=320&h=180&fit=crop',
    duration: 890,
    status: 'downloading',
    progress: 23,
    currentTask: 'Downloading video (45MB / 200MB)...',
    retryCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    updatedAt: new Date(),
  },
  {
    id: 'job-3',
    sourceUrl: 'https://youtube.com/watch?v=ghi789',
    sourceType: 'youtube_video',
    title: 'Marketing Tips for Small Businesses',
    status: 'failed',
    progress: 0,
    currentTask: '',
    errorMessage: 'Network timeout during download. Please retry.',
    retryCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

const mockClips: ProcessedClip[] = [
  {
    id: 'clip-1',
    jobId: 'job-old-1',
    title: 'The Secret to Productivity',
    description: 'Discover the one habit that changed everything',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=320&h=568&fit=crop',
    duration: 58,
    filePath: 'C:/TrendClip/output/clip-001.mp4',
    sourceTitle: 'Complete Productivity Masterclass',
    sourceUrl: 'https://youtube.com/watch?v=prod123',
    hashtags: ['productivity', 'motivation', 'success', 'habits', 'mindset'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'ready',
  },
  {
    id: 'clip-2',
    jobId: 'job-old-2',
    title: 'Why Most Startups Fail',
    description: 'The brutal truth about entrepreneurship',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=320&h=568&fit=crop',
    duration: 45,
    filePath: 'C:/TrendClip/output/clip-002.mp4',
    sourceTitle: 'Startup Secrets Revealed',
    sourceUrl: 'https://youtube.com/watch?v=start456',
    hashtags: ['startup', 'entrepreneur', 'business', 'failure', 'lessons'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'uploaded',
    uploadedTo: ['tiktok', 'youtube'],
  },
  {
    id: 'clip-3',
    jobId: 'job-old-3',
    title: 'AI Will Change Everything',
    description: 'How artificial intelligence is reshaping our world',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=320&h=568&fit=crop',
    duration: 52,
    filePath: 'C:/TrendClip/output/clip-003.mp4',
    sourceTitle: 'The AI Revolution Documentary',
    sourceUrl: 'https://youtube.com/watch?v=ai789',
    hashtags: ['ai', 'technology', 'future', 'innovation', 'chatgpt'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'ready',
  },
];

const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(),
    level: 'success',
    message: 'Clip "The Secret to Productivity" exported successfully',
    jobId: 'job-old-1',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    level: 'info',
    message: 'Starting transcription with Whisper (medium model)',
    jobId: 'job-1',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    level: 'info',
    message: 'Download started for "The Future of AI"',
    jobId: 'job-2',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    level: 'error',
    message: 'Network timeout during download',
    details: 'Connection reset after 30 seconds. Retry 2/3 failed.',
    jobId: 'job-3',
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    level: 'warning',
    message: 'GPU not detected, falling back to CPU processing',
  },
];

const defaultSettings: AppSettings = {
  apiKeys: {},
  gpuAutoDetect: true,
  deleteRawAfterProcessing: true,
  libraryPath: 'C:/TrendClip/library',
  outputPath: 'C:/TrendClip/output',
  whisperModel: 'medium',
  maxConcurrentJobs: 2,
};
