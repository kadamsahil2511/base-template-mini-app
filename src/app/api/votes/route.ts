import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "~/lib/auth";
import { submitVote, getUserVote } from "~/lib/database";

export const dynamic = "force-dynamic";

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

    // Submit vote to Firebase
    await submitVote({
      battleId,
      side,
      fid,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      vote: { battleId, side, fid },
    });
  } catch (error) {
    console.error("Error recording vote:", error);
    
    if (error instanceof Error && error.message.includes("already voted")) {
      return NextResponse.json(
        { success: false, error: "You have already voted on this battle" },
        { status: 409 }
      );
    }
    
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

    const fid = parseInt(fidParam);
    const userVote = await getUserVote(battleId, fid);

    return NextResponse.json({
      success: true,
      vote: userVote ? { side: userVote } : null,
    });
  } catch (error) {
    console.error("Error fetching vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vote" },
      { status: 500 }
    );
  }
}
