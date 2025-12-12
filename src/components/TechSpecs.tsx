import { motion } from 'motion/react';
import { Package, HardDrive, Calendar, Smartphone } from 'lucide-react';

interface TechSpecsProps {
  version: string;
  fileSize: string;
  lastUpdated: string;
  minAndroid: string;
}

export function TechSpecs({ version, fileSize, lastUpdated, minAndroid }: TechSpecsProps) {
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
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <spec.icon className="w-5 h-5" />
              </div>
              <span className="text-gray-400">{spec.label}</span>
            </div>
            <span className="text-white">{spec.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
