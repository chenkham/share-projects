import { Instagram, MessageCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

// Discord icon component (Lucide doesn't have Discord)
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 px-4 sm:px-6 lg:px-12 py-4 backdrop-blur-xl border-b ${theme === 'dark'
          ? 'bg-white/5 border-white/10'
          : 'bg-white/80 border-gray-200'
        }`}
      style={{
        boxShadow: theme === 'dark' ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' : '0 4px 16px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo - FREE Apps */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <div className="relative">
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 shadow-lg shadow-green-500/30">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                FREE
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <span className="hidden sm:block text-lg text-gray-400">
            Apps & Tools
          </span>
        </motion.div>

        {/* Right Side Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-400" />
            )}
          </motion.button>

          {/* Discord */}
          <motion.a
            href="https://discord.com/users/1023371340432031844"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg backdrop-blur-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/40 border border-[#5865F2]/50 flex items-center justify-center transition-all duration-300"
          >
            <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
          </motion.a>

          {/* Instagram */}
          <motion.a
            href="https://www.instagram.com/chenkham__"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg backdrop-blur-xl bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/50 flex items-center justify-center transition-all duration-300"
          >
            <Instagram className="w-5 h-5 text-pink-400" />
          </motion.a>

          {/* WhatsApp Contact Button */}
          <motion.a
            href="https://wa.me/919395535864"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">WhatsApp</span>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}