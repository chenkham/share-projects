import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { createDownload } from '../lib/appwrite';

interface DownloadFormProps {
  appId: string;
  appName: string;
  downloadUrl: string;
  onClose: () => void;
}

export function DownloadForm({ appId, appName, downloadUrl, onClose }: DownloadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Save to Appwrite
      await createDownload({
        name: formData.name,
        email: formData.email,
        location: formData.location,
        appId,
        appName,
      });

      setIsSuccess(true);

      // Wait a moment then trigger download
      setTimeout(() => {
        window.open(downloadUrl, '_blank');
        setTimeout(() => {
          onClose();
        }, 1000);
      }, 1500);
    } catch (err) {
      // Fallback to localStorage if Appwrite fails
      console.warn('Appwrite failed, falling back to localStorage:', err);
      const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
      const newDownload = {
        id: Date.now().toString(),
        ...formData,
        appId,
        appName,
        timestamp: new Date().toISOString()
      };
      downloads.push(newDownload);
      localStorage.setItem('downloads', JSON.stringify(downloads));

      setIsSuccess(true);
      setTimeout(() => {
        window.open(downloadUrl, '_blank');
        setTimeout(() => {
          onClose();
        }, 1000);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
        </motion.div>
        <h3 className="text-2xl mb-2">Thank You!</h3>
        <p className="text-gray-400">Your download will start shortly...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-2xl mb-2">Download {appName}</h3>
        <p className="text-gray-400 text-sm">Please provide your details to download the APK</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm text-gray-300 mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download APK</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
