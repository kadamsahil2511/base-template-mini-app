import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "~/lib/auth";

export const dynamic = "force-dynamic";

// Mock opinions storage - in production, use a database
const opinions: Array<{
  id: string;
  battleId: string;
  fid: number;
  username: string;
  opinion: string;
  side: "A" | "B";
  weight: number;
  tags: string[];
  createdAt: string;
}> = [
  {
    id: "1",
    battleId: "1",
    fid: 12345,
    username: "user123",
    opinion: "NFTs are evolving beyond just art. Utility tokens, gaming assets, and digital identity will make them crucial for web3 in 2025.",
    side: "A",
    weight: 3.2,
    tags: ["Smart", "Relatable"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    battleId: "1",
    fid: 12346,
    username: "crypto_skeptic",
    opinion: "The hype has died down. Unless there's a killer app, most NFTs will be worthless. Focus on real-world assets instead.",
    side: "B",
    weight: 1.8,
    tags: ["Risky", "YOLO"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    battleId: "1",
    fid: 12347,
    username: "digital_artist",
    opinion: "For artists, NFTs provide direct ownership and royalty streams. That value proposition isn't going anywhere.",
    side: "A",
    weight: 0.9,
    tags: ["Smart"],
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const battleId = searchParams.get("battleId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!battleId) {
      return NextResponse.json(
        { success: false, error: "Missing battleId" },
        { status: 400 }
      );
    }

    // Filter and sort opinions by weight
    const battleOpinions = opinions
      .filter(op => op.battleId === battleId)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      opinions: battleOpinions,
    });
  } catch (error) {
    console.error("Error fetching opinions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch opinions" },
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
    const { battleId, opinion, side } = body;

    // Validate input
    if (!battleId || !opinion || !side || !["A", "B"].includes(side)) {
      return NextResponse.json(
        { success: false, error: "Invalid opinion data" },
        { status: 400 }
      );
    }

    if (opinion.length > 280) {
      return NextResponse.json(
        { success: false, error: "Opinion too long (max 280 chars)" },
        { status: 400 }
      );
    }

    // In production, calculate weight based on user's holdings/reputation
    const weight = Math.random() * 5; // Mock weight

    const newOpinion = {
      id: Date.now().toString(),
      battleId,
      fid,
      username: `user${fid}`,
      opinion,
      side,
      weight,
      tags: [], // In production, use AI to generate tags
      createdAt: new Date().toISOString(),
    };

    opinions.push(newOpinion);

    return NextResponse.json({
      success: true,
      opinion: newOpinion,
    });
  } catch (error) {
    console.error("Error submitting opinion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit opinion" },
      { status: 500 }
    );
  }
}
