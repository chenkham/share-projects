import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ChevronLeft, ChevronRight, Github } from 'lucide-react';
import type { AppData } from '../App';
import { ScreenshotCarousel } from './ScreenshotCarousel';
import { FeatureList } from './FeatureList';
import { TechSpecs } from './TechSpecs';
import { DownloadForm } from './DownloadForm';
import { ReviewSection } from './ReviewSection';

interface AppDetailModalProps {
  app: AppData;
  onClose: () => void;
}

const screenshotUrls: Record<string, string[]> = {
  echofy: [
    '/assets/echofy/screenshot1.jpg',
    '/assets/echofy/screenshot2.jpg',
    '/assets/echofy/screenshot3.jpg',
    '/assets/echofy/screenshot4.jpg'
  ]
};

export function AppDetailModal({ app, onClose }: AppDetailModalProps) {
  const [showDownloadForm, setShowDownloadForm] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full h-full md:h-[90vh] md:max-w-6xl mx-4 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a2e] rounded-none md:rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            <div className="p-6 md:p-10">
              {showDownloadForm ? (
                <div className="max-w-md mx-auto">
                  <DownloadForm
                    appId={app.id}
                    appName={app.name}
                    downloadUrl={app.downloadUrl}
                    onClose={() => setShowDownloadForm(false)}
                  />
                </div>
              ) : (
                <>
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 overflow-hidden flex-shrink-0">
                        {app.icon.startsWith('/') ? (
                          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl md:text-5xl">{app.icon}</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl mb-2">{app.name}</h2>
                        <p className="text-gray-400">{app.description}</p>
                        {app.isOpenSource && (
                          <motion.a
                            href={app.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center space-x-2 mt-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                          >
                            <Github className="w-4 h-4" />
                            <span className="text-sm">Open Source on GitHub</span>
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Download Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDownloadForm(true)}
                      className="flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 w-full md:w-auto justify-center"
                    >
                      <Download className="w-5 h-5" />
                      <span className="text-lg">Download APK</span>
                    </motion.button>
                  </div>

                  {/* Reviews Section - Prominently placed */}
                  <div className="mb-10">
                    <ReviewSection appId={app.id} appName={app.name} />
                  </div>

                  {/* Screenshot Carousel */}
                  <div className="mb-10">
                    <h3 className="text-xl md:text-2xl mb-6">App Screenshots</h3>
                    <ScreenshotCarousel screenshots={screenshotUrls[app.id]} />
                  </div>

                  {/* Features & Tech Specs Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Features Column */}
                    <div>
                      <h3 className="text-xl md:text-2xl mb-6">Core Functionality</h3>
                      <FeatureList features={app.features} />
                    </div>

                    {/* Tech Specs Column */}
                    <div>
                      <h3 className="text-xl md:text-2xl mb-6">Technical Specifications</h3>
                      <TechSpecs
                        version={app.version}
                        fileSize={app.fileSize}
                        lastUpdated={app.lastUpdated}
                        minAndroid={app.minAndroid}
                      />
                    </div>
                  </div>

                  {/* Changelog Section */}
                  <div className="mb-8">
                    <h3 className="text-xl md:text-2xl mb-4">Recent Updates</h3>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                      <ul className="space-y-3">
                        {app.changelog.map((update, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300">{update}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}