// lib/firebaseAdmin.js
import admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  // For development, you can use service account key
  // For production, use environment variables
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
    });
  } catch (error) {
    // If service account key is not available, try environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    // Validate required environment variables
    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin: Missing environment variables. Some features may not work.');
      // Initialize with minimal config to prevent build errors
      admin.initializeApp({
        projectId: projectId || 'default-project',
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'default-project'}.firebaseio.com`
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
      });
    }
  }
}

export const adminDb = admin.firestore();
export default admin;
