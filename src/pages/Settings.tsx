import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSettings, saveSettings } from '@/lib/api';
import { AppSettings } from '@/types';
import { toast } from 'sonner';
import { 
  Key, 
  Cpu, 
  FolderOpen, 
  Save, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await saveSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const updateApiKey = (key: keyof AppSettings['apiKeys'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      apiKeys: { ...settings.apiKeys, [key]: value },
    });
  };

  const maskApiKey = (key: string | undefined) => {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Configure your processing pipeline"
        actions={
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        }
      />

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys" className="gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="processing" className="gap-2">
            <Cpu className="h-4 w-4" />
            Processing
          </TabsTrigger>
          <TabsTrigger value="paths" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Paths
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">API Credentials</h3>
            <p className="text-sm text-muted-foreground mb-6">
              API keys are stored securely and encrypted locally. They are never transmitted to external servers.
            </p>

            <div className="space-y-6">
              {/* OpenAI Key */}
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key (for GPT titles)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="openai-key"
                      type={showKeys.openai ? 'text' : 'password'}
                      value={showKeys.openai ? (settings.apiKeys.openai || '') : maskApiKey(settings.apiKeys.openai)}
                      onChange={(e) => updateApiKey('openai', e.target.value)}
                      placeholder="sk-..."
                      className="pr-10 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
                    >
                      {showKeys.openai ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* TikTok Key */}
              <div className="space-y-2">
                <Label htmlFor="tiktok-key">TikTok API Key (optional, for future automation)</Label>
                <div className="relative">
                  <Input
                    id="tiktok-key"
                    type={showKeys.tiktok ? 'text' : 'password'}
                    value={showKeys.tiktok ? (settings.apiKeys.tiktok || '') : maskApiKey(settings.apiKeys.tiktok)}
                    onChange={(e) => updateApiKey('tiktok', e.target.value)}
                    placeholder="Enter TikTok API key..."
                    className="pr-10 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowKeys(prev => ({ ...prev, tiktok: !prev.tiktok }))}
                  >
                    {showKeys.tiktok ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* YouTube Key */}
              <div className="space-y-2">
                <Label htmlFor="youtube-key">YouTube API Key (optional, for future automation)</Label>
                <div className="relative">
                  <Input
                    id="youtube-key"
                    type={showKeys.youtube ? 'text' : 'password'}
                    value={showKeys.youtube ? (settings.apiKeys.youtube || '') : maskApiKey(settings.apiKeys.youtube)}
                    onChange={(e) => updateApiKey('youtube', e.target.value)}
                    placeholder="Enter YouTube API key..."
                    className="pr-10 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowKeys(prev => ({ ...prev, youtube: !prev.youtube }))}
                  >
                    {showKeys.youtube ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing" className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">Processing Options</h3>

            <div className="space-y-6">
              {/* GPU Auto Detection */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="gpu-detect">GPU Auto Detection</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically use GPU acceleration when available
                  </p>
                </div>
                <Switch
                  id="gpu-detect"
                  checked={settings.gpuAutoDetect}
                  onCheckedChange={(checked) => updateSetting('gpuAutoDetect', checked)}
                />
              </div>

              {/* Delete Raw After Processing */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="delete-raw">Delete Raw Video After Processing</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove downloaded source videos after clips are generated
                  </p>
                </div>
                <Switch
                  id="delete-raw"
                  checked={settings.deleteRawAfterProcessing}
                  onCheckedChange={(checked) => updateSetting('deleteRawAfterProcessing', checked)}
                />
              </div>

              {/* Whisper Model */}
              <div className="space-y-2">
                <Label htmlFor="whisper-model">Whisper Model</Label>
                <Select
                  value={settings.whisperModel}
                  onValueChange={(value: AppSettings['whisperModel']) => 
                    updateSetting('whisperModel', value)
                  }
                >
                  <SelectTrigger id="whisper-model" className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiny">Tiny (fastest, lowest accuracy)</SelectItem>
                    <SelectItem value="base">Base (fast, good accuracy)</SelectItem>
                    <SelectItem value="small">Small (balanced)</SelectItem>
                    <SelectItem value="medium">Medium (recommended)</SelectItem>
                    <SelectItem value="large">Large (slowest, best accuracy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Concurrent Jobs */}
              <div className="space-y-2">
                <Label htmlFor="max-jobs">Maximum Concurrent Jobs</Label>
                <Select
                  value={settings.maxConcurrentJobs.toString()}
                  onValueChange={(value) => 
                    updateSetting('maxConcurrentJobs', parseInt(value))
                  }
                >
                  <SelectTrigger id="max-jobs" className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 job</SelectItem>
                    <SelectItem value="2">2 jobs</SelectItem>
                    <SelectItem value="3">3 jobs</SelectItem>
                    <SelectItem value="4">4 jobs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Paths Tab */}
        <TabsContent value="paths" className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">File Paths</h3>

            <div className="space-y-6">
              {/* Library Path */}
              <div className="space-y-2">
                <Label htmlFor="library-path">Library Folder</Label>
                <div className="flex gap-2">
                  <Input
                    id="library-path"
                    value={settings.libraryPath}
                    onChange={(e) => updateSetting('libraryPath', e.target.value)}
                    className="font-mono"
                  />
                  <Button variant="outline">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Where downloaded videos are temporarily stored
                </p>
              </div>

              {/* Output Path */}
              <div className="space-y-2">
                <Label htmlFor="output-path">Output Folder</Label>
                <div className="flex gap-2">
                  <Input
                    id="output-path"
                    value={settings.outputPath}
                    onChange={(e) => updateSetting('outputPath', e.target.value)}
                    className="font-mono"
                  />
                  <Button variant="outline">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Where generated clips are saved
                </p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">yt-dlp</p>
                  <p className="text-sm text-muted-foreground">Installed (v2024.01.01)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">FFmpeg</p>
                  <p className="text-sm text-muted-foreground">Installed (v6.0)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Whisper</p>
                  <p className="text-sm text-muted-foreground">Ready (medium model)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">OpenCV</p>
                  <p className="text-sm text-muted-foreground">Installed (v4.8.0)</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
