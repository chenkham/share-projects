import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface Feature {
  icon: string;
  text: string;
}

interface FeatureListProps {
  features: Feature[];
}

export function FeatureList({ features }: FeatureListProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[
      iconName.split('-').map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('').replace(/^\w/, (c: string) => c.toUpperCase())
    ];
    return IconComponent || LucideIcons.Circle;
  };

  return (
    <div className="space-y-4">
      {features.map((feature, index) => {
        const Icon = getIcon(feature.icon);
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-gray-300 flex-1 pt-2">{feature.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
