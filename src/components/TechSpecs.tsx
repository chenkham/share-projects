import { motion } from 'motion/react';
import { Package, HardDrive, Calendar, Smartphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TechSpecsProps {
  version: string;
  fileSize: string;
  lastUpdated: string;
  minAndroid: string;
}

export function TechSpecs({ version, fileSize, lastUpdated, minAndroid }: TechSpecsProps) {
  const { theme } = useTheme();

  const specs = [
    { icon: Package, label: 'Version', value: version },
    { icon: HardDrive, label: 'File Size', value: fileSize },
    { icon: Calendar, label: 'Last Updated', value: lastUpdated },
    { icon: Smartphone, label: 'Minimum OS', value: minAndroid }
  ];

  return (
    <div className="space-y-4">
      {specs.map((spec, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`backdrop-blur-xl border rounded-xl p-5 transition-all duration-300 ${theme === 'dark'
              ? 'bg-white/5 border-white/10 hover:bg-white/10'
              : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <spec.icon className="w-5 h-5" />
              </div>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{spec.label}</span>
            </div>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{spec.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

