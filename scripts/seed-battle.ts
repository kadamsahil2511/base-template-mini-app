import { config } from 'dotenv';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

// Load environment variables from .env file
config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://mini-superuserz-default-rtdb.firebaseio.com/',
};

// Validate required config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.databaseURL) {
  console.error('❌ Missing required Firebase environment variables!');
  console.error('Please ensure your .env file has:');
  console.error('  - NEXT_PUBLIC_FIREBASE_API_KEY');
  console.error('  - NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  console.error('  - NEXT_PUBLIC_FIREBASE_DATABASE_URL');
  process.exit(1);
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app, firebaseConfig.databaseURL);

async function seedInitialBattle() {
  try {
    console.log('🌱 Seeding initial battle to Firebase...');
    
    const battlesRef = ref(database, 'battles');
    const newBattleRef = push(battlesRef);
    const battleId = newBattleRef.key!;
    
    const battle = {
      id: battleId,
      creator: 'superuserz',
      creatorFid: 1391325,
      question: 'Is buying NFTs in 2025 still worth it?',
      votingEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      sideA: {
        emoji: '🔥',
        label: 'Yes, Worth It',
        votes: 0,
      },
      sideB: {
        emoji: '🧠',
        label: 'Not Worth It',
        votes: 0,
      },
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    await set(newBattleRef, battle);
    
    console.log('✅ Initial battle created successfully!');
    console.log('Battle ID:', battleId);
    console.log('Question:', battle.question);
    console.log('\nYou can now visit your app to vote and share opinions!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding battle:', error);
    process.exit(1);
  }
}

seedInitialBattle();
