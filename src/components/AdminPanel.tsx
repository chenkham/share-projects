import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Download, Mail, MapPin, User, Calendar, Star, Users, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { getDownloads, getSubscribers, getReviews, getAnalyticsSummary, type DownloadRecord, type Subscriber, type Review } from '../lib/appwrite';

interface AdminPanelProps {
  onClose: () => void;
}

type TabType = 'downloads' | 'subscribers' | 'reviews';

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('downloads');
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalDownloads: 0, totalSubscribers: 0, totalReviews: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [downloadsRes, subscribersRes, reviewsRes, analyticsRes] = await Promise.all([
        getDownloads(100),
        getSubscribers(100),
        getReviews('echofy', 100), // Default app for now
        getAnalyticsSummary(),
      ]);
      setDownloads(downloadsRes.documents);
      setSubscribers(subscribersRes.documents);
      setReviews(reviewsRes.documents);
      setStats(analyticsRes);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      // Fallback to localStorage for downloads
      const localDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
      setDownloads(localDownloads.reverse());
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'downloads', label: 'Downloads', icon: <Download className="w-4 h-4" />, count: stats.totalDownloads },
    { id: 'subscribers', label: 'Subscribers', icon: <Mail className="w-4 h-4" />, count: stats.totalSubscribers },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" />, count: stats.totalReviews },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a2e] rounded-3xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div>
            <h2 className="text-2xl">Admin Dashboard</h2>
            <p className="text-gray-400 text-sm mt-1">Analytics & Management</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-white/10">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Downloads</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalDownloads}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Newsletter Subscribers</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalSubscribers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-orange-600/10 border border-yellow-500/30 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">User Reviews</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalReviews}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-4 border-b border-white/10">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20">{tab.count}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-380px)] scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
              <p className="text-gray-400">Loading data...</p>
            </div>
          ) : (
            <>
              {/* Downloads Tab */}
              {activeTab === 'downloads' && (
                <div className="space-y-4">
                  {downloads.length === 0 ? (
                    <div className="text-center py-20">
                      <Download className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">No download records yet</p>
                    </div>
                  ) : (
                    downloads.map((record) => (
                      <motion.div
                        key={record.$id || record.createdAt}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Name</p>
                                <p className="text-white">{record.name}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white truncate max-w-[150px]">{record.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Location</p>
                                <p className="text-white">{record.location}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Downloaded</p>
                                <p className="text-white">{new Date(record.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-white/10">
                            <span className="text-sm">{record.appName}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Subscribers Tab */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  {subscribers.length === 0 ? (
                    <div className="text-center py-20">
                      <Mail className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">No subscribers yet</p>
                    </div>
                  ) : (
                    subscribers.map((subscriber) => (
                      <motion.div
                        key={subscriber.$id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                              <Mail className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-white">{subscriber.email}</p>
                              <p className="text-sm text-gray-400">
                                Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${subscriber.isActive
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {subscriber.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-20">
                      <Star className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">No reviews yet</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <motion.div
                        key={review.$id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-medium">{review.userName}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-600'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
