/**
 * Appwrite Database Setup Script
 * ===============================
 * Run: npx tsx scripts/setup-appwrite.ts
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

// Appwrite Credentials
const APPWRITE_ENDPOINT = 'https://syd.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '693c1265002efbd4af1f';
const APPWRITE_API_KEY = 'YOUR_API_KEY';  // ← Add your API key here if you need to run setup again

const DATABASE_NAME = 'portfolio';
const DATABASE_ID = 'portfolio-db';

// Initialize Appwrite
const client = new Client();
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDatabase() {
    console.log('📦 Creating database...');
    try {
        const db = await databases.create(DATABASE_ID, DATABASE_NAME);
        console.log(`✅ Database created: ${db.name} (${db.$id})`);
        return db.$id;
    } catch (error: any) {
        if (error.code === 409) {
            console.log('ℹ️ Database already exists, continuing...');
            return DATABASE_ID;
        }
        throw error;
    }
}

async function createDownloadsTable(databaseId: string) {
    const collectionId = 'downloads';
    console.log('\n📥 Creating downloads table...');

    try {
        await databases.createCollection(
            databaseId,
            collectionId,
            'Downloads',
            [
                Permission.read(Role.any()),
                Permission.create(Role.any()),
            ]
        );
        console.log('✅ Table created: downloads');
    } catch (error: any) {
        if (error.code === 409) {
            console.log('ℹ️ downloads table already exists');
        } else throw error;
    }

    // Create attributes
    const attributes = [
        { name: 'name', size: 255 },
        { name: 'email', size: 255 },
        { name: 'location', size: 255 },
        { name: 'appId', size: 50 },
        { name: 'appName', size: 100 },
        { name: 'userAgent', size: 500, required: false },
        { name: 'createdAt', size: 50 },
    ];

    for (const attr of attributes) {
        try {
            await databases.createStringAttribute(
                databaseId,
                collectionId,
                attr.name,
                attr.size,
                attr.required !== false
            );
            console.log(`  ✓ Added column: ${attr.name}`);
            await sleep(1500);
        } catch (error: any) {
            if (error.code === 409) {
                console.log(`  ℹ️ Column ${attr.name} already exists`);
            } else {
                console.log(`  ⚠️ Failed to create ${attr.name}: ${error.message}`);
            }
        }
    }
}

async function createReviewsTable(databaseId: string) {
    const collectionId = 'reviews';
    console.log('\n⭐ Creating reviews table...');

    try {
        await databases.createCollection(
            databaseId,
            collectionId,
            'Reviews',
            [
                Permission.read(Role.any()),
                Permission.create(Role.any()),
            ]
        );
        console.log('✅ Table created: reviews');
    } catch (error: any) {
        if (error.code === 409) {
            console.log('ℹ️ reviews table already exists');
        } else throw error;
    }

    // String attributes
    const stringAttrs = [
        { name: 'appId', size: 50 },
        { name: 'userName', size: 100 },
        { name: 'comment', size: 1000 },
        { name: 'createdAt', size: 50 },
    ];

    for (const attr of stringAttrs) {
        try {
            await databases.createStringAttribute(databaseId, collectionId, attr.name, attr.size, true);
            console.log(`  ✓ Added column: ${attr.name}`);
            await sleep(1500);
        } catch (error: any) {
            if (error.code === 409) {
                console.log(`  ℹ️ Column ${attr.name} already exists`);
            } else {
                console.log(`  ⚠️ Failed to create ${attr.name}: ${error.message}`);
            }
        }
    }

    // Integer attribute for rating
    try {
        await databases.createIntegerAttribute(databaseId, collectionId, 'rating', true, 1, 5);
        console.log('  ✓ Added column: rating (1-5)');
    } catch (error: any) {
        if (error.code === 409) {
            console.log('  ℹ️ Column rating already exists');
        } else {
            console.log(`  ⚠️ Failed to create rating: ${error.message}`);
        }
    }
}

async function createSubscribersTable(databaseId: string) {
    const collectionId = 'subscribers';
    console.log('\n📧 Creating subscribers table...');

    try {
        await databases.createCollection(
            databaseId,
            collectionId,
            'Subscribers',
            [
                Permission.read(Role.any()),
                Permission.create(Role.any()),
            ]
        );
        console.log('✅ Table created: subscribers');
    } catch (error: any) {
        if (error.code === 409) {
            console.log('ℹ️ subscribers table already exists');
        } else throw error;
    }

    // Email attribute
    try {
        await databases.createEmailAttribute(databaseId, collectionId, 'email', true);
        console.log('  ✓ Added column: email');
        await sleep(1500);
    } catch (error: any) {
        if (error.code === 409) {
            console.log('  ℹ️ Column email already exists');
        } else {
            console.log(`  ⚠️ Failed to create email: ${error.message}`);
        }
    }

    // DateTime for subscribedAt
    try {
        await databases.createStringAttribute(databaseId, collectionId, 'subscribedAt', 50, true);
        console.log('  ✓ Added column: subscribedAt');
        await sleep(1500);
    } catch (error: any) {
        if (error.code === 409) {
            console.log('  ℹ️ Column subscribedAt already exists');
        } else {
            console.log(`  ⚠️ Failed to create subscribedAt: ${error.message}`);
        }
    }

    // Boolean for isActive
    try {
        await databases.createBooleanAttribute(databaseId, collectionId, 'isActive', true, true);
        console.log('  ✓ Added column: isActive');
    } catch (error: any) {
        if (error.code === 409) {
            console.log('  ℹ️ Column isActive already exists');
        } else {
            console.log(`  ⚠️ Failed to create isActive: ${error.message}`);
        }
    }
}

async function main() {
    console.log('🚀 Appwrite Database Setup');
    console.log('==========================\n');

    try {
        const databaseId = await createDatabase();

        await createDownloadsTable(databaseId);
        await createReviewsTable(databaseId);
        await createSubscribersTable(databaseId);

        console.log('\n==========================');
        console.log('✅ Setup Complete!');
        console.log('==========================\n');
        console.log('🎉 Your portfolio database is ready!');

    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    }
}

main();
