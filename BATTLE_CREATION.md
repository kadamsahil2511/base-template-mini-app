# Battle Creation Guide

## Creating New Battles

You can now create custom battles directly from the Super Battle app!

## How to Create a Battle

### Option 1: From the Header
1. Make sure you're **authenticated** (connected with Farcaster)
2. Click the **"+ Create New Battle"** button below your username in the header

### Option 2: From Results View
1. Click "Show Results Demo" to see the results view
2. Click the **"Start a New Duel"** button

## Battle Creation Form

The modal includes these fields:

### Required Fields

**Battle Question** (Required)
- The main question users will vote on
- Maximum 200 characters
- Example: "Is buying NFTs in 2025 still worth it?"

**Side A**
- Emoji: Choose an emoji (max 2 characters, default 🔥)
- Label: Name for this side (max 30 characters, required)
- Example: "🔥 Yes, Worth It"

**Side B**
- Emoji: Choose an emoji (max 2 characters, default 🧠)
- Label: Name for this side (max 30 characters, required)
- Example: "🧠 Not Worth It"

**Duration**
- How long voting will be open
- Options:
  - 1 hour
  - 6 hours
  - 12 hours
  - 24 hours (default)
  - 48 hours
  - 3 days
  - 1 week

## Battle Creation Process

1. **Fill out the form**
   - Enter your battle question
   - Choose emojis and labels for both sides
   - Select a duration

2. **Click "Create Battle"**
   - Button is disabled until all required fields are filled
   - Shows "Creating..." while processing

3. **Battle is Created**
   - Success message appears
   - Page reloads to show your new battle
   - Battle is stored in Firebase RTDB
   - All users can now vote and share opinions!

## Authentication Required

You must be authenticated with Farcaster to create battles:
- Your FID (Farcaster ID) is used for authentication
- Your username is set as the battle creator
- This prevents spam and ensures accountability

## Technical Details

### API Endpoint
`POST /api/battles`

### Request Body
```json
{
  "question": "Your battle question?",
  "sideALabel": "Label for side A",
  "sideAEmoji": "🔥",
  "sideBLabel": "Label for side B",
  "sideBEmoji": "🧠",
  "duration": 24,
  "username": "your_username"
}
```

### Response
```json
{
  "success": true,
  "battleId": "firebase-generated-id"
}
```

### Database Structure
New battles are stored in Firebase RTDB:
```
battles/
  └── {battleId}/
      ├── id: string
      ├── creator: string (username)
      ├── creatorFid: number
      ├── question: string
      ├── votingEndsAt: ISO timestamp
      ├── sideA: { emoji, label, votes: 0 }
      ├── sideB: { emoji, label, votes: 0 }
      ├── status: "active"
      └── createdAt: ISO timestamp
```

## Features

✅ **Custom Questions** - Ask anything you want
✅ **Custom Sides** - Define your own options with emojis
✅ **Flexible Duration** - 1 hour to 1 week
✅ **Form Validation** - Required fields and character limits
✅ **Real-time Updates** - New battle appears instantly
✅ **Creator Attribution** - Shows who created the battle
✅ **Profile Pictures** - Creator's avatar from Farcaster

## Example Battles

### Tech Debate
- Question: "Will AI replace developers by 2030?"
- Side A: 🤖 Yes, inevitable
- Side B: 👨‍💻 No, we're safe
- Duration: 24 hours

### Crypto Opinion
- Question: "Is DeFi safer than traditional banks?"
- Side A: 🔐 More secure
- Side B: 🏦 Less secure
- Duration: 1 week

### Fun Poll
- Question: "What's better for coding?"
- Side A: ☕ Coffee
- Side B: 🍵 Tea
- Duration: 6 hours

## Tips for Good Battles

1. **Clear Questions** - Make it easy to understand
2. **Balanced Sides** - Give both sides equal weight
3. **Relevant Emojis** - Choose emojis that represent each side
4. **Appropriate Duration** - More complex topics need more time
5. **Neutral Wording** - Don't bias the question

## Limitations

- ❌ Can't edit battles after creation (by design)
- ❌ Can't delete battles (all battles are permanent)
- ❌ One active battle shown at a time (newest first)
- ⚠️ Must be authenticated to create
- ⚠️ Page reloads after creation (for now)

## Future Enhancements

Coming soon:
- [ ] Edit battles (within first 5 minutes)
- [ ] Battle categories/tags
- [ ] Multiple active battles (browse/filter)
- [ ] Battle templates
- [ ] Scheduled battles (start at specific time)
- [ ] Battle analytics (engagement metrics)
- [ ] Share battle link directly
- [ ] Battle moderation tools

## Troubleshooting

**"You must be authenticated to create a battle"**
- Make sure you're connected with Farcaster
- Check that your avatar appears in the header

**Button is disabled**
- Fill in all required fields (question, both labels)
- Check character limits (red text appears if exceeded)

**Battle creation fails**
- Check your internet connection
- Make sure Firebase is accessible
- Try again in a few seconds

**Page doesn't reload**
- Manually refresh the page
- Your battle should appear at the top

## Testing

Test battle creation locally:
```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Connect with Farcaster
# Click "+ Create New Battle"
# Fill out form and submit
```

---

**Note**: Battle creation is permanent! Think before you create. All battles are stored in Firebase and visible to all users.
