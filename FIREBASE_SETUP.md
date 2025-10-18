# Firebase Realtime Database Setup

## Overview

The Super Battle mini app now uses Firebase Realtime Database for persistent data storage. This enables real-time voting, opinion sharing, and battle management across all users.

## Database Structure

```
firebase-rtdb
├── battles/
│   └── {battleId}/
│       ├── id: string
│       ├── creator: string
│       ├── creatorFid: number
│       ├── question: string
│       ├── votingEndsAt: ISO string
│       ├── sideA: { emoji, label, votes }
│       ├── sideB: { emoji, label, votes }
│       ├── status: "active" | "ended"
│       └── createdAt: ISO string
│
├── votes/
│   └── {battleId}/
│       └── {fid}/
│           ├── side: "A" | "B"
│           └── timestamp: ISO string
│
└── opinions/
    └── {battleId}/
        └── {opinionId}/
            ├── id: string
            ├── battleId: string
            ├── username: string
            ├── fid: number
            ├── opinion: string
            ├── side: "A" | "B"
            ├── weight: number
            ├── createdAt: ISO string
            └── upvotes: number
```

## Environment Variables

The following Firebase configuration variables are already set in `.env`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCkngoFzecAWQmGKA4tPaZnyfFDeoK1760
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mini-superuserz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mini-superuserz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mini-superuserz.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=888615621877
NEXT_PUBLIC_FIREBASE_APP_ID=1:888615621877:web:4e44b931eb95a86a4e21bc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RZ5EPEPLVC
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://mini-superuserz-default-rtdb.firebaseio.com
```

## Firebase Security Rules

Make sure your Firebase Realtime Database has the following security rules configured:

```json
{
  "rules": {
    "battles": {
      "$battleId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "votes": {
      "$battleId": {
        "$fid": {
          ".read": true,
          ".write": "!data.exists() && auth != null"
        }
      }
    },
    "opinions": {
      "$battleId": {
        "$opinionId": {
          ".read": true,
          ".write": "auth != null"
        }
      }
    }
  }
}
```

These rules allow:
- Anyone to read battles, votes, and opinions
- Only authenticated users to create/update battles and opinions
- Users can only vote once per battle (write only if data doesn't exist)

## Seeding Initial Data

To create an initial battle for testing, run:

```bash
npm run seed-battle
```

Or manually using the Node script:

```bash
npx tsx scripts/seed-battle.ts
```

## API Endpoints

### Battles

**GET /api/battles**
- Returns the first active battle
- Query params: `battleId` (optional) to get a specific battle

**POST /api/battles**
- Creates a new battle
- Requires authentication (Authorization header with FID)
- Body:
  ```json
  {
    "question": "Your question?",
    "sideALabel": "Option A",
    "sideAEmoji": "🔥",
    "sideBLabel": "Option B",
    "sideBEmoji": "🧠",
    "duration": 24,
    "username": "your_username"
  }
  ```

### Votes

**GET /api/votes**
- Check if a user has voted
- Query params: `battleId`, `fid`

**POST /api/votes**
- Submit a vote
- Requires authentication
- Body:
  ```json
  {
    "battleId": "battle-id",
    "side": "A" or "B"
  }
  ```

### Opinions

**GET /api/opinions**
- Get opinions for a battle
- Query params: `battleId`, `limit` (default 10)

**POST /api/opinions**
- Submit an opinion
- Requires authentication
- Body:
  ```json
  {
    "battleId": "battle-id",
    "opinion": "Your opinion text (max 280 chars)",
    "side": "A" or "B",
    "username": "your_username"
  }
  ```

## Real-Time Updates

The app uses Firebase real-time listeners to automatically update:

1. **Battle vote counts** - When users vote, all connected clients see the updated percentages
2. **Opinions list** - New opinions appear instantly for all users
3. **Time remaining** - Battle timer updates automatically

Real-time subscriptions are managed in:
- `src/components/SuperBattle.tsx` - Main battle UI with live updates
- `src/lib/database.ts` - Helper functions for subscribing to data changes

## Features Implemented

✅ Real-time voting with vote count updates
✅ Opinion submission with live feed
✅ One vote per user per battle (enforced)
✅ Battle creation API
✅ Vote verification (check if user already voted)
✅ Real-time listeners for battles and opinions
✅ Automatic percentage calculation
✅ Time remaining countdown

## Testing

1. Open the app at https://mini.superuserz.com
2. Connect with Farcaster account
3. Vote on a side
4. Submit an opinion
5. Open the app in another tab/device to see real-time updates

## Deployment

The Firebase integration works seamlessly with Vercel:

1. All environment variables are prefixed with `NEXT_PUBLIC_` (client-side access)
2. Firebase SDK is initialized on the client side
3. No server-side secrets needed (public Firebase config is safe)
4. Deploy with: `vercel --prod`

## Troubleshooting

**"No active battle found"**
- Run `npm run seed-battle` to create an initial battle

**Real-time updates not working**
- Check Firebase console for active connections
- Verify DATABASE_URL is correct in .env
- Check browser console for Firebase errors

**Vote not registering**
- Ensure user is authenticated (Farcaster context available)
- Check if user already voted (409 error expected)
- Verify Firebase rules allow writes

**Opinions not appearing**
- Check Firebase console > Realtime Database > opinions/{battleId}
- Verify opinion length is ≤ 280 characters
- Ensure battleId exists in battles collection

## Next Steps

Future enhancements:
- [ ] Add battle history/archive
- [ ] Implement opinion upvoting
- [ ] Add user reputation/weight calculation
- [ ] Create battle end detection
- [ ] Add winner announcement
- [ ] Implement NFT minting for winners
- [ ] Add notifications for battle updates
