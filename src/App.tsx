import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AppShowcase } from './components/AppShowcase';
import { AppDetailModal } from './components/AppDetailModal';
import { AdminPanel } from './components/AdminPanel';
import { BlogSection } from './components/BlogSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { useTheme } from './context/ThemeContext';

export interface DownloadSource {
  name: string;
  version: string;
  url: string;
  provider: 'github' | 'drive' | 'direct';
  fileSize: string;
  isLatest?: boolean;
}

export interface AppData {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  description: string;
  version: string;
  fileSize: string;
  lastUpdated: string;
  minAndroid: string;
  features: { icon: string; text: string }[];
  screenshots: string[];
  changelog: string[];
  gradient: string;
  downloadSources: DownloadSource[];
  isOpenSource: boolean;
  githubUrl: string;
}

const apps: AppData[] = [
  {
    id: 'echofy',
    name: 'Echofy',
    tagline: 'An Open-Source, Ad-Free Music Streaming App.',
    icon: '/assets/echofy/logo.jpg',
    description: 'A free, open-source, and ad-free music streaming app. Enjoy a modern Material Design 3 interface with advanced features for streaming and managing your music.',
    version: '2.2.0',
    fileSize: '~15 MB',
    lastUpdated: 'December 16, 2025',
    minAndroid: 'Android 7.0+',
    features: [
      { icon: 'youtube', text: 'YouTube Music Integration: Stream millions of songs from YouTube Music library seamlessly' },
      { icon: 'shield-off', text: 'Ad-Free Experience: Pure, uninterrupted music listening without any advertisements' },
      { icon: 'play', text: 'Background Playback: Keep your music playing while using other apps or with screen off' },
      { icon: 'wifi-off', text: 'Offline Mode: Download your favorite songs for listening without internet' },
      { icon: 'palette', text: 'Material Design 3: Beautiful modern interface with dynamic theming based on album art' },
      { icon: 'music', text: 'Synchronized Lyrics: Follow along with time-synced lyrics as you listen' },
      { icon: 'volume-2', text: 'Audio Normalization: Consistent volume levels across all tracks for smooth listening' },
      { icon: 'clock', text: 'Sleep Timer: Fall asleep to music with auto-stop timer functionality' },
      { icon: 'list-plus', text: 'Custom Playlists: Create, manage, and organize your personal playlists locally' },
      { icon: 'list-ordered', text: 'Queue Management: Full control over your playback queue with drag and drop' },
      { icon: 'users', text: 'Listen Together: Real-time music sharing sessions with friends and family' },
      { icon: 'radio', text: 'Personalized Radio: Discover new music based on your listening habits' }
    ],
    screenshots: [
      'echofy-player',
      'echofy-library',
      'echofy-home'
    ],
    changelog: [
      'NEW: Listen Together - Share music sessions with friends in real-time',
      'NEW: Enhanced personalized recommendations',
      'Improved audio quality and streaming stability',
      'Enhanced Material Design 3 with dynamic theming',
      'Better performance and battery optimization'
    ],
    gradient: 'from-cyan-500 via-blue-500 to-purple-500',
    downloadSources: [
      {
        name: 'GitHub Release',
        version: '2.2.0',
        url: 'https://github.com/chenkham/Echofy-android/releases/download/Echofy-2/Echofy_2.2.0_universal.apk',
        provider: 'github',
        fileSize: '15 MB',
        isLatest: true
      },
      {
        name: 'Google Drive',
        version: '2.2.0',
        url: 'https://drive.google.com/file/d/1_eSFCtCN6L3ZnelCWKJuIwuS0BP58OPl/view?usp=drivesdk',
        provider: 'drive',
        fileSize: '15 MB'
      },
      {
        name: 'GitHub (Legacy)',
        version: '2.0.0',
        url: 'https://github.com/chenkham/Echofy-android/releases/download/Echofy/app-universal-release.apk',
        provider: 'github',
        fileSize: '8 MB'
      }
    ],
    isOpenSource: true,
    githubUrl: 'https://github.com/Chenkham/Echofy'
  }
];

export default function App() {
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const { theme } = useTheme();

  // Secret key combination to show admin panel (Ctrl + Shift + A)
  useState(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a2e] text-white'
      : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900'
      }`}>
      {/* Animated background pattern */}
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'opacity-20' : 'opacity-10'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.15),transparent_50%)]"></div>
      </div>

      <Header />
      <Hero />
      <AppShowcase apps={apps} onAppClick={setSelectedApp} />
      <BlogSection />
      <NewsletterSection />
      <Footer />

      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}