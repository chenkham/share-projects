import { motion } from 'motion/react';
import { Code, Zap, Heart, Shield } from 'lucide-react';

const posts = [
  {
    icon: Code,
    title: 'Open Source Philosophy',
    description: 'All our applications are open source and free. We believe in transparency and community-driven development.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Performance First',
    description: 'Built with the latest Android technologies and optimized for smooth performance even on older devices.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Heart,
    title: 'User-Centric Design',
    description: 'Material Design 3 with dynamic theming provides a modern, beautiful, and accessible user experience.',
    gradient: 'from-pink-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'We collect minimal data to improve our apps, but we never share your information with third parties. Your privacy matters.',
    gradient: 'from-green-500 to-emerald-500'
  }
];

export function BlogSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Philosophy
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            What makes our apps different
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <post.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl mb-3">{post.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
