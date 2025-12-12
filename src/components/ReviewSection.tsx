import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Send, Loader2 } from 'lucide-react';
import { createReview, getReviews, type Review } from '../lib/appwrite';
import { useEffect } from 'react';

interface ReviewSectionProps {
    appId: string;
    appName: string;
}

export function ReviewSection({ appId, appName }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        rating: 5,
        comment: ''
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [appId]);

    const loadReviews = async () => {
        setIsLoading(true);
        try {
            const result = await getReviews(appId);
            setReviews(result.documents);
            setAverageRating(result.average);
            setTotalReviews(result.total);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createReview({
                appId,
                userName: formData.userName,
                rating: formData.rating,
                comment: formData.comment,
            });
            setSubmitSuccess(true);
            setFormData({ userName: '', rating: 5, comment: '' });
            await loadReviews();
            setTimeout(() => {
                setShowForm(false);
                setSubmitSuccess(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number, interactive = false, onSelect?: (r: number) => void) => {
        const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

        return (
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                            key={star}
                            type="button"
                            whileHover={interactive ? { scale: 1.3 } : {}}
                            whileTap={interactive ? { scale: 0.9 } : {}}
                            onClick={() => interactive && onSelect?.(star)}
                            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${interactive ? 'p-1 rounded-lg hover:bg-yellow-500/20' : ''
                                }`}
                            disabled={!interactive}
                        >
                            <Star
                                className={`${interactive ? 'w-8 h-8' : 'w-5 h-5'} ${star <= rating
                                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                    : 'fill-transparent text-gray-600 hover:text-yellow-300'
                                    } transition-all duration-200`}
                            />
                        </motion.button>
                    ))}
                </div>
                {interactive && (
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-medium text-lg">{rating}/5</span>
                        <span className="text-gray-400">- {ratingLabels[rating]}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with Average Rating */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl md:text-2xl">User Reviews</h3>
                    {!isLoading && totalReviews > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">{averageRating.toFixed(1)}</span>
                            <span className="text-gray-400 text-sm">({totalReviews})</span>
                        </div>
                    )}
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                >
                    {showForm ? 'Cancel' : 'Write a Review'}
                </motion.button>
            </div>

            {/* Review Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
                >
                    {submitSuccess ? (
                        <div className="text-center py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-green-400 text-lg"
                            >
                                ✓ Review submitted successfully!
                            </motion.div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Rating</label>
                                {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Your Review</label>
                                <textarea
                                    required
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 min-h-[100px] resize-none"
                                    placeholder="Share your experience with this app..."
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Submit Review</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    )}
                </motion.div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
                        <p className="text-gray-400 mt-2">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
                        <Star className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    <>
                        {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
                            <motion.div
                                key={review.$id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-medium text-white">{review.userName}</h4>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-gray-300">{review.comment}</p>
                            </motion.div>
                        ))}
                        {reviews.length > 2 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="w-full py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 text-gray-300 hover:text-white"
                            >
                                {showAllReviews ? `Show less` : `Show all ${reviews.length} reviews`}
                            </motion.button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
