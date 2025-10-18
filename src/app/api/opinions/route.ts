import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "~/lib/auth";
import { submitOpinion, getOpinions } from "~/lib/database";

export const dynamic = "force-dynamic";

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

    // Fetch opinions from Firebase
    const allOpinions = await getOpinions(battleId);
    const battleOpinions = allOpinions.slice(0, limit);

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
    const { battleId, opinion, side, username } = body;

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

    const opinionId = await submitOpinion({
      battleId,
      fid,
      username: username || `user${fid}`,
      opinion,
      side,
      weight,
    });

    return NextResponse.json({
      success: true,
      opinionId,
    });
  } catch (error) {
    console.error("Error submitting opinion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit opinion" },
      { status: 500 }
    );
  }
}
