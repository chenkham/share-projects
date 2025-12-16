import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Loader2, CheckCircle, ExternalLink, Github, ArrowLeft, CloudDownload, Sparkles, TrendingUp } from 'lucide-react';
import { incrementDownloadCount, getDownloadCount } from '../lib/appwrite';
import { useTheme } from '../context/ThemeContext';
import type { DownloadSource } from '../App';

// Google Drive icon component
function GoogleDriveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.433 22l3.943-6.826H22l-3.943 6.826H4.433zm1.566-17L2 12.174l3.943 6.826 3.999-7H6L9.943 5H5.999zM9.943 5l3.943 6.826L22 12.174 17.057 5H9.943z" />
    </svg>
  );
}

interface DownloadSectionProps {
  appId: string;
  appName: string;
  downloadSources: DownloadSource[];
  onClose: () => void;
}

export function DownloadForm({ appId, appName, downloadSources, onClose }: DownloadSectionProps) {
  const [downloadingSource, setDownloadingSource] = useState<string | null>(null);
  const [downloadedSources, setDownloadedSources] = useState<Set<string>>(new Set());
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const { theme } = useTheme();

  // Fetch download count on mount
  useEffect(() => {
    getDownloadCount(appId).then(count => setTotalDownloads(count));
  }, [appId]);

  const handleDownload = async (source: DownloadSource) => {
    setDownloadingSource(source.name);

    // Increment download count (don't await - let it happen in background)
    incrementDownloadCount(appId, appName, source.provider);
    setTotalDownloads(prev => prev + 1);

    // Brief delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));

    // Open download URL
    window.open(source.url, '_blank');

    setDownloadingSource(null);
    setDownloadedSources(prev => new Set([...prev, source.name]));
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return <Github className="w-6 h-6" />;
      case 'drive':
        return <GoogleDriveIcon className="w-6 h-6" />;
      default:
        return <CloudDownload className="w-6 h-6" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'github':
        return theme === 'dark' ? 'from-gray-600 to-gray-800' : 'from-gray-700 to-gray-900';
      case 'drive':
        return 'from-blue-500 to-green-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const latestSource = downloadSources.find(s => s.isLatest);
  const otherSources = downloadSources.filter(s => !s.isLatest);

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${theme === 'dark'
            ? 'text-gray-400 hover:text-white hover:bg-white/10'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        {/* Download Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme === 'dark'
            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30'
            : 'bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-300'
            }`}
        >
          <TrendingUp className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span className={`font-semibold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
            {totalDownloads.toLocaleString()}
          </span>
          <span className={theme === 'dark' ? 'text-emerald-400/70' : 'text-emerald-600/70'}>downloads</span>
        </motion.div>
      </div>

      {/* Title Section */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            Choose Your Download Source
          </span>
        </motion.div>
        <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Download {appName}
        </h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Select your preferred download source below
        </p>
      </div>

      {/* Latest Version - Featured Card */}
      {latestSource && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-50"></div>
          <div className={`relative rounded-2xl overflow-hidden ${theme === 'dark'
            ? 'bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-white/20'
            : 'bg-gradient-to-br from-white to-gray-100 border border-gray-300'
            }`}>
            {/* Recommended Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                ✨ RECOMMENDED
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Provider Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getProviderColor(latestSource.provider)} flex items-center justify-center text-white shadow-lg`}>
                  {getProviderIcon(latestSource.provider)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {latestSource.name}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      v{latestSource.version}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>📦 {latestSource.fileSize}</span>
                    <span>•</span>
                    <span>Latest Release</span>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => handleDownload(latestSource)}
                disabled={downloadingSource !== null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {downloadingSource === latestSource.name ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Preparing Download...</span>
                  </>
                ) : downloadedSources.has(latestSource.name) ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Download Started!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>Download Latest Version</span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Other Sources */}
      {otherSources.length > 0 && (
        <div className="space-y-4">
          <h4 className={`text-sm font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Alternative Sources
          </h4>
          <div className="grid gap-4">
            {otherSources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`rounded-xl overflow-hidden ${theme === 'dark'
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  } transition-all duration-300`}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Provider Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getProviderColor(source.provider)} flex items-center justify-center text-white shadow-md`}>
                    {getProviderIcon(source.provider)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {source.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-600'
                        }`}>
                        v{source.version}
                      </span>
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      📦 {source.fileSize}
                    </span>
                  </div>

                  <motion.button
                    onClick={() => handleDownload(source)}
                    disabled={downloadingSource !== null}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 ${theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300'
                      }`}
                  >
                    {downloadingSource === source.name ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : downloadedSources.has(source.name) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`flex items-start gap-3 p-4 rounded-xl ${theme === 'dark'
          ? 'bg-blue-500/10 border border-blue-500/20'
          : 'bg-blue-50 border border-blue-200'
          }`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">💡</span>
        </div>
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
            <strong>Tip:</strong> Having trouble? Try an alternative download source. All files are identical and verified.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
