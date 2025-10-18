import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "~/lib/auth";

export const dynamic = "force-dynamic";

// Mock battle data - in production, this would come from a database
const mockBattle = {
  id: "1",
  creator: "creator",
  creatorFid: 12345,
  question: "Is buying NFTs in 2025 still worth it?",
  votingEndsAt: new Date(Date.now() + 5 * 60 * 60 * 1000 + 32 * 60 * 1000).toISOString(),
  sideA: {
    emoji: "🔥",
    label: "Side A",
    votes: 60,
  },
  sideB: {
    emoji: "🧠",
    label: "Side B",
    votes: 40,
  },
  status: "active", // active, ended
};

export async function GET() {
  try {
    // Return the mock battle for now
    return NextResponse.json(mockBattle);
  } catch (error) {
    console.error("Error fetching battle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch battle" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const fid = await verifyAuth(req);
    if (!fid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { question, sideALabel, sideAEmoji, sideBLabel, sideBEmoji, duration } = body;

    // Validate input
    if (!question || !sideALabel || !sideBLabel) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, save to database
    const newBattle = {
      id: Date.now().toString(),
      creator: `user${fid}`,
      creatorFid: fid,
      question,
      votingEndsAt: new Date(Date.now() + (duration || 24) * 60 * 60 * 1000).toISOString(),
      sideA: {
        emoji: sideAEmoji || "🔥",
        label: sideALabel,
        votes: 0,
      },
      sideB: {
        emoji: sideBEmoji || "🧠",
        label: sideBLabel,
        votes: 0,
      },
      status: "active",
    };

    return NextResponse.json({
      success: true,
      battle: newBattle,
    });
  } catch (error) {
    console.error("Error creating battle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create battle" },
      { status: 500 }
    );
  }
}
