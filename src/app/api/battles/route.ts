import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "~/lib/auth";
import { getActiveBattles, createBattle, getBattle } from "~/lib/database";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const battleId = searchParams.get("battleId");
    const all = searchParams.get("all");
    
    if (battleId) {
      const battle = await getBattle(battleId);
      if (!battle) {
        return NextResponse.json(
          { success: false, error: "Battle not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(battle);
    }
    
    // Return all active battles if requested
    if (all === "true") {
      const battles = await getActiveBattles();
      return NextResponse.json(battles);
    }
    
    // Return the first active battle
    const battles = await getActiveBattles();
    const activeBattle = battles.length > 0 ? battles[0] : null;
    
    return NextResponse.json(activeBattle);
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
    const { question, sideALabel, sideAEmoji, sideBLabel, sideBEmoji, duration, username } = body;

    // Validate input
    if (!question || !sideALabel || !sideBLabel) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create battle in Firebase
    const battleId = await createBattle({
      creator: username || `user${fid}`,
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
    });

    return NextResponse.json({
      success: true,
      battleId,
    });
  } catch (error) {
    console.error("Error creating battle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create battle" },
      { status: 500 }
    );
  }
}
