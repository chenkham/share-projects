import { motion } from 'motion/react';
import { AppCard } from './AppCard';
import type { AppData } from '../App';

interface AppShowcaseProps {
  apps: AppData[];
  onAppClick: (app: AppData) => void;
}

export function AppShowcase({ apps, onAppClick }: AppShowcaseProps) {
  return (
    <section id="projects" className="relative px-4 sm:px-6 lg:px-12 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
            Current{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Free, open-source Android applications designed for excellence
          </p>
        </div>

        {/* Single App Showcase */}
        <div className="max-w-2xl mx-auto">
          {apps.map((app, index) => (
            <AppCard
              key={app.id}
              app={app}
              onClick={() => onAppClick(app)}
              delay={index * 0.2}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}