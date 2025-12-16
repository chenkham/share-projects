// Appwrite Configuration
// =======================
// Update these values with your Appwrite credentials from the Console

import { Client, Databases, ID, Query } from 'appwrite';

// ============================================
// 🔧 UPDATE THESE VALUES WITH YOUR CREDENTIALS
// ============================================
const APPWRITE_ENDPOINT = 'https://syd.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '693c1265002efbd4af1f';
const DATABASE_ID = 'portfolio-db';  // Will be created by setup script

// Collection IDs (create these in Appwrite Console)
export const COLLECTIONS = {
  DOWNLOADS: 'downloads',     // For tracking app downloads
  REVIEWS: 'reviews',         // For user reviews/ratings
  SUBSCRIBERS: 'subscribers', // For newsletter signups
};
// ============================================

// Initialize Appwrite Client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Databases
const databases = new Databases(client);

// ============================================
// DOWNLOAD TRACKING
// ============================================
export interface DownloadRecord {
  $id?: string;
  name?: string;
  email?: string;
  location?: string;
  appId: string;
  appName: string;
  source?: string;
  userAgent?: string;
  createdAt: string;
}

// Simple download increment without personal data
export async function incrementDownloadCount(
  appId: string,
  appName: string,
  source: string
): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.DOWNLOADS,
      ID.unique(),
      {
        appId,
        appName,
        source,
        userAgent: navigator.userAgent,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Failed to increment download count:', error);
    // Don't throw - we don't want to block the download if tracking fails
  }
}

export async function createDownload(data: Omit<DownloadRecord, '$id' | 'createdAt'>): Promise<DownloadRecord> {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.DOWNLOADS,
      ID.unique(),
      {
        ...data,
        userAgent: navigator.userAgent,
        createdAt: new Date().toISOString(),
      }
    );
    return response as unknown as DownloadRecord;
  } catch (error) {
    console.error('Failed to create download record:', error);
    throw error;
  }
}

export async function getDownloads(limit = 100, offset = 0): Promise<{ documents: DownloadRecord[]; total: number }> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DOWNLOADS,
      [
        Query.orderDesc('createdAt'),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );
    return {
      documents: response.documents as unknown as DownloadRecord[],
      total: response.total,
    };
  } catch (error) {
    console.error('Failed to fetch downloads:', error);
    throw error;
  }
}

export async function getDownloadCount(appId?: string): Promise<number> {
  try {
    const queries = appId ? [Query.equal('appId', appId)] : [];
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DOWNLOADS,
      [...queries, Query.limit(1)]
    );
    return response.total;
  } catch (error) {
    console.error('Failed to fetch download count:', error);
    return 0;
  }
}

// ============================================
// USER REVIEWS
// ============================================
export interface Review {
  $id?: string;
  appId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export async function createReview(data: Omit<Review, '$id' | 'createdAt'>): Promise<Review> {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.REVIEWS,
      ID.unique(),
      {
        ...data,
        createdAt: new Date().toISOString(),
      }
    );
    return response as unknown as Review;
  } catch (error) {
    console.error('Failed to create review:', error);
    throw error;
  }
}

export async function getReviews(appId: string, limit = 20): Promise<{ documents: Review[]; total: number; average: number }> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.REVIEWS,
      [
        Query.equal('appId', appId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
      ]
    );

    const reviews = response.documents as unknown as Review[];
    const average = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      documents: reviews,
      total: response.total,
      average: Math.round(average * 10) / 10,
    };
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return { documents: [], total: 0, average: 0 };
  }
}

// ============================================
// NEWSLETTER SUBSCRIBERS
// ============================================
export interface Subscriber {
  $id?: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check for existing subscriber
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      [Query.equal('email', email)]
    );

    if (existing.total > 0) {
      return { success: false, message: 'Email already subscribed!' };
    }

    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      ID.unique(),
      {
        email,
        subscribedAt: new Date().toISOString(),
        isActive: true,
      }
    );

    return { success: true, message: 'Successfully subscribed!' };
  } catch (error) {
    console.error('Failed to add subscriber:', error);
    throw error;
  }
}

export async function getSubscribers(limit = 100, offset = 0): Promise<{ documents: Subscriber[]; total: number }> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      [
        Query.orderDesc('subscribedAt'),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );
    return {
      documents: response.documents as unknown as Subscriber[],
      total: response.total,
    };
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    throw error;
  }
}

// ============================================
// ANALYTICS HELPERS
// ============================================
export async function getAnalyticsSummary(): Promise<{
  totalDownloads: number;
  totalSubscribers: number;
  totalReviews: number;
}> {
  try {
    const [downloads, subscribers, reviews] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.DOWNLOADS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.SUBSCRIBERS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.REVIEWS, [Query.limit(1)]),
    ]);

    return {
      totalDownloads: downloads.total,
      totalSubscribers: subscribers.total,
      totalReviews: reviews.total,
    };
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    return { totalDownloads: 0, totalSubscribers: 0, totalReviews: 0 };
  }
}

// Export client for advanced usage
export { client, databases, ID, Query };
