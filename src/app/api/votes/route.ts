import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "~/lib/auth";

export const dynamic = "force-dynamic";

// Mock votes storage - in production, use a database
const votes = new Map<string, { fid: number; side: "A" | "B" }>();

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
    const { battleId, side } = body;

    // Validate input
    if (!battleId || !side || !["A", "B"].includes(side)) {
      return NextResponse.json(
        { success: false, error: "Invalid vote data" },
        { status: 400 }
      );
    }

    // Store vote (one vote per user per battle)
    const voteKey = `${battleId}-${fid}`;
    votes.set(voteKey, { fid, side });

    // In production, update vote counts in database
    return NextResponse.json({
      success: true,
      vote: { battleId, side, fid },
    });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record vote" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const battleId = searchParams.get("battleId");
    const fidParam = searchParams.get("fid");

    if (!battleId || !fidParam) {
      return NextResponse.json(
        { success: false, error: "Missing battleId or fid" },
        { status: 400 }
      );
    }

    const voteKey = `${battleId}-${fidParam}`;
    const vote = votes.get(voteKey);

    return NextResponse.json({
      success: true,
      vote: vote || null,
    });
  } catch (error) {
    console.error("Error fetching vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vote" },
      { status: 500 }
    );
  }
}
