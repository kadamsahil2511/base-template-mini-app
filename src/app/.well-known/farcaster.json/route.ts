import { NextResponse } from 'next/server';
import { getFarcasterMetadata } from '../../../lib/utils';

export async function GET() {
  try {
    const config = await getFarcasterMetadata();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Return a basic manifest structure even if env vars are missing
    return NextResponse.json({
      accountAssociation: {
        header: "eyJmaWQiOjEzOTEzMjUsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhkMzk5RUQwRWZDNDIxMzJlMkYyMGYzZkEwNDY1NWQyM2Y4ZjI0NTJkIn0",
        payload: "eyJkb21haW4iOiJtaW5pLnN1cGVydXNlcnouY29tIn0",
        signature: "MHhkNzRmNTViMjRkYjVkZDc1MmZkYjI1NDA0NDBlYmUzYzllM2U0NGNlMzU1NjJlYjJlZTkxYWYzOWM0NWU0OTdiMjRiNDBiNzk1YTM5NmZhYmRkYTRhOGY1MGY1YzQ3N2FlZDc2MDQwM2QwYTE5ZGFmOWY5MzRkZTU2NTc0Y2I5OTFj"
      },
      frame: {
        version: "1",
        name: "Super Battle",
        iconUrl: "https://mini.superuserz.com/logo.png",
        homeUrl: "https://mini.superuserz.com",
        imageUrl: "https://mini.superuserz.com/og-image.png",
        buttonTitle: "Start Battle",
        splashImageUrl: "https://mini.superuserz.com/logo.png",
        splashBackgroundColor: "#0f172a",
        description: "Choose your side in daily opinion battles. Vote, share, and see what others think!",
        webhookUrl: "https://mini.superuserz.com/api/webhook"
      }
    });
  }
}
