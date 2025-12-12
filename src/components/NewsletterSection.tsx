import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { addSubscriber } from '../lib/appwrite';

export function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        try {
            const result = await addSubscriber(email);
            setStatus(result);
            if (result.success) {
                setEmail('');
            }
        } catch (error) {
            setStatus({ success: false, message: 'Failed to subscribe. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative px-4 sm:px-6 lg:px-12 py-16">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                        >
                            <Sparkles className="w-8 h-8" />
                        </motion.div>

                        <h2 className="text-2xl md:text-3xl mb-3">
                            Stay Updated with{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                New Releases
                            </span>
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            Get notified when we release new apps, updates, and exclusive features. No spam, unsubscribe anytime.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Subscribing...</span>
                                    </>
                                ) : (
                                    <span>Subscribe</span>
                                )}
                            </motion.button>
                        </form>

                        {/* Status Message */}
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 flex items-center justify-center gap-2 ${status.success ? 'text-green-400' : 'text-red-400'
                                    }`}
                            >
                                {status.success && <CheckCircle className="w-5 h-5" />}
                                <span>{status.message}</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
