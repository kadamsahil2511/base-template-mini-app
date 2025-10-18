# Manifest Setup Guide

Your manifest is now accessible at: **https://mini.superuserz.com/.well-known/farcaster.json**

## Step 1: Verify Manifest is Accessible

Test if your manifest is working:

```bash
curl https://mini.superuserz.com/.well-known/farcaster.json
```

You should see a JSON response with your app configuration.

## Step 2: Sign Your Manifest

To create the account association (required for Farcaster), follow these steps:

### Option A: Use Farcaster's Manifest Tool (Recommended)

1. **Go to the Farcaster Manifest Tool**
   - Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
   - Make sure you're logged in to Farcaster/Warpcast

2. **Enter Your Domain**
   - Domain: `mini.superuserz.com`
   - **Important**: Do NOT include `https://` or `www.`
   - Just the domain name: `mini.superuserz.com`

3. **Review Your App Details**
   - The tool will fetch your manifest and show you the current configuration
   - Verify all the details are correct:
     - Name: Super Battle
     - Icon URL: https://mini.superuserz.com/logo.png
     - Home URL: https://mini.superuserz.com
     - Splash Image: https://mini.superuserz.com/logo.png

4. **Sign the Manifest**
   - The tool will ask for your Farcaster custody account seed phrase
   - ⚠️ **WARNING**: Your seed phrase is only used to sign the manifest, then discarded
   - Enter your seed phrase
   - Click "Sign Manifest"

5. **Copy the Signed Data**
   - The tool will generate three values:
     - `header` (base64 encoded)
     - `payload` (base64 encoded)
     - `signature` (base64 encoded)
   - Copy all three values

### Option B: Set Environment Variables on Vercel

Instead of modifying the code, you can set these as environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these three variables:
   ```
   ACCOUNT_ASSOCIATION_HEADER=<your_header_value>
   ACCOUNT_ASSOCIATION_PAYLOAD=<your_payload_value>
   ACCOUNT_ASSOCIATION_SIGNATURE=<your_signature_value>
   ```
4. Redeploy your application

## Step 3: Verify the Signed Manifest

After setting the environment variables and redeploying, test again:

```bash
curl https://mini.superuserz.com/.well-known/farcaster.json
```

You should now see the signed account association with real values instead of placeholders:

```json
{
  "accountAssociation": {
    "header": "eyJma...",  // Real base64 value
    "payload": "eyJkb...", // Real base64 value
    "signature": "MHg..." // Real base64 value
  },
  "frame": {
    "version": "1",
    "name": "Super Battle",
    ...
  }
}
```

## Step 4: Register Your App

1. Go back to https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter your domain: `mini.superuserz.com`
3. You should see a green checkmark ✅ indicating your manifest is valid
4. Your app is now registered!

## Important Notes

### Domain Matching
- The domain in your manifest signature MUST exactly match where it's hosted
- `mini.superuserz.com` ✅ Correct
- `https://mini.superuserz.com` ❌ Wrong (no protocol)
- `www.mini.superuserz.com` ❌ Wrong (different subdomain)

### Seed Phrase Security
- Your seed phrase is ONLY used to sign the manifest
- It proves you own the Farcaster account
- The Farcaster tool does NOT store your seed phrase
- It's safe to use, but still be careful

### Required Images
Before your app works fully, make sure these images exist:
- `/public/logo.png` - App icon (200x200px)
- `/public/og-image.png` - Social sharing image (3:2 aspect ratio)
- `/public/splash.png` - Optional splash screen image

## Troubleshooting

### "Cannot fetch manifest"
- Make sure your Vercel deployment is complete
- Check that the URL returns 200 OK: `curl -I https://mini.superuserz.com/.well-known/farcaster.json`

### "Invalid signature"
- Domain mismatch - ensure the domain you signed matches exactly
- Re-sign the manifest using the Farcaster tool

### "Placeholder values still showing"
- Environment variables not set on Vercel
- Redeploy after setting environment variables
- Check Vercel logs for errors

## Next Steps

Once your manifest is signed and working:

1. ✅ Test your app in Farcaster Preview Tool
   - https://farcaster.xyz/~/developers/mini-apps/preview
   - Enter: `https://mini.superuserz.com`

2. ✅ Share your app on Farcaster
   - Create a cast with your URL
   - It should show a rich card with your image and button

3. ✅ Register for discovery
   - Apps with valid manifests are automatically indexed
   - They'll appear in Farcaster search after ~24 hours
   - Need active users to stay in search results

## Support

Need help?
- Check the error in Vercel logs
- Test manifest: https://farcaster.xyz/~/developers/mini-apps/manifest
- Ask in Farcaster Devs group: https://farcaster.xyz/~/group/X2P7HNc4PHTriCssYHNcmQ

Good luck! 🚀
