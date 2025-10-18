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
        header: "PLACEHOLDER_HEADER",
        payload: "PLACEHOLDER_PAYLOAD",
        signature: "PLACEHOLDER_SIGNATURE"
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
