# Farcaster Mini App Deployment Guide

## Prerequisites

1. **Farcaster Account** - You need a Farcaster account to sign the manifest
2. **Production Domain** - A deployed domain (e.g., mini.superuserz.com)
3. **Custody Address Seed Phrase** - Your Farcaster custody account seed phrase

## Step 1: Deploy to Production

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Configure environment variables:
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   NEXT_PUBLIC_APP_NAME=Super Battle
   NEXT_PUBLIC_APP_DESCRIPTION=Choose your side in daily opinion battles
   ```
5. Deploy!

### Option B: Deploy to Other Platforms

- **Netlify**: Similar to Vercel
- **Railway**: Docker-based deployment
- **AWS/GCP**: More complex but flexible

## Step 2: Sign Your Manifest

Once deployed, you need to sign your manifest:

1. Go to https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter your **production domain** (e.g., mini.superuserz.com)
3. Fill in the app details:
   - **Name**: Super Battle
   - **Icon URL**: `https://your-domain.com/logo.png`
   - **Home URL**: `https://your-domain.com`
   - **Splash Image URL**: `https://your-domain.com/logo.png`
   - **Splash Background Color**: `#0f172a`
   - **Description**: Choose your side in daily opinion battles. Vote, share, and see what others think!
   
4. Sign with your custody seed phrase
5. Copy the signed manifest JSON

## Step 3: Update Manifest File

1. Open `public/.well-known/farcaster.json`
2. Replace the placeholder values with your signed manifest:

```json
{
  "accountAssociation": {
    "header": "YOUR_SIGNED_HEADER_HERE",
    "payload": "YOUR_SIGNED_PAYLOAD_HERE",
    "signature": "YOUR_SIGNED_SIGNATURE_HERE"
  },
  "miniapp": {
    "version": "1",
    "name": "Super Battle",
    "iconUrl": "https://your-domain.com/logo.png",
    "homeUrl": "https://your-domain.com",
    "imageUrl": "https://your-domain.com/og-image.png",
    "buttonTitle": "Start Battle",
    "splashImageUrl": "https://your-domain.com/logo.png",
    "splashBackgroundColor": "#0f172a",
    "description": "Choose your side in daily opinion battles. Vote, share, and see what others think!",
    "webhookUrl": "https://your-domain.com/api/webhook"
  }
}
```

3. Commit and push the changes
4. Redeploy your app

## Step 4: Verify Manifest

Check if your manifest is accessible:

```bash
curl https://your-domain.com/.well-known/farcaster.json
```

You should see your signed manifest JSON.

## Step 5: Test in Farcaster

### Preview Tool

1. Go to https://farcaster.xyz/~/developers/mini-apps/preview
2. Enter your URL: `https://your-domain.com`
3. Click Preview
4. Test your app!

### Live Testing

1. Share your URL in a Farcaster cast
2. The rich card should appear with your configured image and button
3. Click the button to open your mini app
4. Test all features

## Step 6: Register for Discovery

1. Go to https://farcaster.xyz/~/developers/mini-apps/manifest
2. Make sure your app is "registered" (green checkmark)
3. Wait for indexing (can take 24 hours)
4. Your app will appear in Farcaster search!

## Common Issues

### Issue: Manifest Not Found (404)

**Solution**: Make sure `public/.well-known/farcaster.json` exists and is deployed

### Issue: Invalid Signature

**Solution**: 
- Domain in manifest must exactly match your deployed domain
- Re-sign the manifest if you changed domains
- Don't include `https://` or trailing slashes in domain

### Issue: Infinite Loading Screen

**Solution**: Make sure `sdk.actions.ready()` is called in your app

### Issue: Images Not Loading

**Solution**: 
- Images must return correct content-type headers
- Use PNG format for best compatibility
- Images must be publicly accessible (no auth required)

## Vercel Configuration

### vercel.json (Optional)

If using hosted manifest, add redirects:

```json
{
  "redirects": [
    {
      "source": "/.well-known/farcaster.json",
      "destination": "https://api.farcaster.xyz/miniapps/hosted-manifest/YOUR_MANIFEST_ID",
      "permanent": false
    }
  ]
}
```

### Environment Variables

Make sure all environment variables are set in Vercel dashboard:

- `NEXT_PUBLIC_APP_URL`: Your production URL
- `NEXT_PUBLIC_APP_NAME`: "Super Battle"
- Any other custom env vars

## Testing Checklist

- [ ] App loads without errors
- [ ] SDK ready call executes
- [ ] User authentication works
- [ ] Voting system functions
- [ ] Opinion submission works
- [ ] Manifest is accessible
- [ ] Rich cards show in casts
- [ ] App opens from Farcaster
- [ ] Mobile and desktop work
- [ ] Dark/light modes function

## Going Live

Once everything works:

1. ✅ Manifest signed and deployed
2. ✅ App tested in Farcaster clients
3. ✅ All features working
4. ✅ Images and assets optimized
5. ✅ Analytics configured (if desired)
6. ✅ Share your app on Farcaster!

## Support

Need help?
- Check [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz)
- Ask in [Devs: Mini Apps](https://farcaster.xyz/~/group/X2P7HNc4PHTriCssYHNcmQ) group
- Tag @pirosb3, @linda, or @deodad on Farcaster

## Next Steps

- Add database for persistence
- Implement real voting mechanism
- Add notifications for battle results
- Create leaderboards
- Add NFT minting for winners
- Integrate with other Farcaster features

Good luck with your launch! 🚀
