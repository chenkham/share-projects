import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, Star } from 'lucide-react';
import type { AppData } from '../App';
import { getDownloadCount, getReviews } from '../lib/appwrite';

interface AppCardProps {
  app: AppData;
  onClick: () => void;
  delay: number;
}

export function AppCard({ app, onClick, delay }: AppCardProps) {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    loadStats();
  }, [app.id]);

  const loadStats = async () => {
    try {
      const [count, reviewsData] = await Promise.all([
        getDownloadCount(app.id),
        getReviews(app.id, 1),
      ]);
      setDownloadCount(count);
      if (reviewsData.total > 0) {
        setAverageRating(reviewsData.average);
      }
    } catch (error) {
      console.warn('Failed to load stats:', error);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 cursor-pointer"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
      onClick={onClick}
    >
      {/* Background gradient that shows on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Stats Badges */}
        <div className="absolute top-0 right-0 flex gap-2">
          {downloadCount !== null && downloadCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm"
            >
              <Download className="w-3 h-3" />
              <span>{formatCount(downloadCount)}</span>
            </motion.div>
          )}
          {averageRating !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm"
            >
              <Star className="w-3 h-3 fill-yellow-400" />
              <span>{averageRating.toFixed(1)}</span>
            </motion.div>
          )}
        </div>

        {/* App Icon */}
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 overflow-hidden"
        >
          {app.icon.startsWith('/') ? (
            <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">{app.icon}</span>
          )}
        </motion.div>

        {/* App Info */}
        <h3 className="text-2xl sm:text-3xl mb-3">
          {app.name}
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {app.tagline}
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group-hover:shadow-2xl"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span>Explore & Download</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* Hover effect - subtle glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} blur-2xl opacity-30`}></div>
      </div>
    </motion.div>
  );
}

