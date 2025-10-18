# 🎯 Super Battle Mini App - Quick Start

## 🚀 Firebase Integration Complete!

Your app now has **full data persistence** with Firebase Realtime Database. All votes and opinions are stored permanently and update in real-time across all users.

## ✅ What's Working

- ✅ **Real-time Voting**: Vote counts update instantly for all users
- ✅ **Opinion Feed**: New opinions appear live across all devices
- ✅ **Data Persistence**: Everything stored in Firebase RTDB
- ✅ **Duplicate Prevention**: One vote per user per battle (enforced)
- ✅ **Live Percentages**: Automatic calculation from vote counts
- ✅ **Countdown Timer**: Shows time remaining until voting ends
- ✅ **Farcaster Auth**: Uses FID from Farcaster context
- ✅ **Deployed**: Live at https://mini.superuserz.com

## 📊 Current Battle

```
Battle ID: -Obqzj9LbMJY2yFp0kY-
Question: "Is buying NFTs in 2025 still worth it?"
Sides: 🔥 Yes, Worth It  vs  🧠 Not Worth It
Status: Active
Duration: 24 hours
```

## 🎮 Quick Commands

```bash
# Run development server
npm run dev

# Create a new battle
npm run seed-battle

# Build for production
npm run build

# Deploy to Vercel
npm run deploy:vercel
```

## 🔧 Environment Variables

Your `.env` file is already configured with Firebase:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://mini-superuserz-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCkngoFzecAWQmGKA4tPaZnyfFDeoK1760
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mini-superuserz
# ... (all other Firebase vars set)
```

## 📱 How to Test

1. **Start Dev Server**:
   ```bash
   npm run dev
   ```

2. **Open in Browser**: http://localhost:3000

3. **Test Voting**:
   - Click either side (🔥 or 🧠)
   - Vote is saved to Firebase
   - Percentages update instantly

4. **Test Opinions**:
   - Select a side first
   - Write your opinion (max 280 chars)
   - Click "Submit Opinion"
   - Opinion appears in feed immediately

5. **Test Real-time**:
   - Open app in two browser tabs
   - Vote/submit opinion in one tab
   - See updates instantly in the other tab

## 🌐 API Endpoints

All endpoints are connected to Firebase:

- `GET /api/battles` - Get active battle
- `POST /api/battles` - Create new battle (auth required)
- `GET /api/votes?battleId=X&fid=Y` - Check user vote
- `POST /api/votes` - Submit vote (auth required)
- `GET /api/opinions?battleId=X` - Get opinions
- `POST /api/opinions` - Submit opinion (auth required)

## 🗂️ Firebase Database Structure

```
firebase-rtdb/
├── battles/
│   └── {battleId}/
│       ├── id, creator, creatorFid
│       ├── question, votingEndsAt
│       ├── sideA: { emoji, label, votes }
│       ├── sideB: { emoji, label, votes }
│       └── status, createdAt
│
├── votes/
│   └── {battleId}/
│       └── {fid}/
│           ├── side: "A" | "B"
│           └── timestamp
│
└── opinions/
    └── {battleId}/
        └── {opinionId}/
            ├── id, battleId, username, fid
            ├── opinion, side, weight
            └── createdAt, upvotes
```

## 📄 Documentation Files

- **FIREBASE_SETUP.md** - Complete Firebase documentation
- **IMPLEMENTATION_SUMMARY.md** - Full feature list
- **DEPLOYMENT.md** - Vercel deployment guide
- **MANIFEST_SETUP.md** - Farcaster manifest setup

## 🎨 Key Files

### Firebase Integration
- `src/lib/firebase.ts` - Firebase initialization
- `src/lib/database.ts` - Database helper functions
- `scripts/seed-battle.ts` - Battle creation script

### Components
- `src/components/SuperBattle.tsx` - Main battle UI (real-time)
- `src/components/ui/OpinionCard.tsx` - Opinion display
- `src/components/ui/DuelResults.tsx` - Results view

### API Routes
- `src/app/api/battles/route.ts` - Battle management
- `src/app/api/votes/route.ts` - Voting system
- `src/app/api/opinions/route.ts` - Opinion submissions

## 🔥 Next Steps

### Deploy to Vercel
```bash
# Make sure NEXT_PUBLIC_URL is set in .env
npm run deploy:vercel

# Or deploy manually
vercel --prod
```

### Add Firebase Environment Variables in Vercel
All `NEXT_PUBLIC_FIREBASE_*` variables from your `.env` file should be added to Vercel's environment variables (they're already in your local `.env`).

### Test Live App
Visit https://mini.superuserz.com and test:
1. Voting on a side
2. Submitting opinions
3. Real-time updates (open in multiple tabs)

## 🐛 Troubleshooting

### "No active battle found"
```bash
npm run seed-battle
```

### Real-time updates not working
- Check Firebase console for active connections
- Verify DATABASE_URL in .env is correct
- Check browser console for errors

### Vote not registering
- Ensure Farcaster authentication is working
- Check if you already voted (409 error expected)
- Verify Firebase security rules allow writes

### Build fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 📞 Support

For issues or questions:
1. Check FIREBASE_SETUP.md for detailed docs
2. Review IMPLEMENTATION_SUMMARY.md for feature list
3. Check Firebase console: https://console.firebase.google.com/project/mini-superuserz

---

**Live App**: https://mini.superuserz.com  
**Database**: Firebase RTDB (mini-superuserz project)  
**Framework**: Next.js 15 + React 19 + TypeScript  
**Deployment**: Vercel
