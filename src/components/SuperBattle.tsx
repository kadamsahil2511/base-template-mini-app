"use client";

import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { OpinionCard } from "~/components/ui/OpinionCard";
import { DuelResults } from "~/components/ui/DuelResults";

interface Battle {
  creator: string;
  question: string;
  votingEndsIn: string;
  sideA: {
    emoji: string;
    label: string;
    percentage: number;
  };
  sideB: {
    emoji: string;
    label: string;
    percentage: number;
  };
}

interface Opinion {
  username: string;
  opinion: string;
  tags: string[];
  weight: string;
  avatarColor?: string;
}

export default function SuperBattle() {
  const [opinion, setOpinion] = useState("");
  const [selectedSide, setSelectedSide] = useState<"A" | "B" | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<{ fid: number; username?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // Get user context from Farcaster SDK
        const context = await sdk.context;
        if (context?.user) {
          setUser(context.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to get Farcaster context:", error);
      }
    };

    authenticateUser();
  }, []);

  // Mock data - in production, this would come from an API
  const battle: Battle = {
    creator: "creator",
    question: "Is buying NFTs in 2025 still worth it?",
    votingEndsIn: "5h 32m",
    sideA: {
      emoji: "🔥",
      label: "Side A",
      percentage: 60,
    },
    sideB: {
      emoji: "🧠",
      label: "Side B",
      percentage: 40,
    },
  };

  const topOpinions: Opinion[] = [
    {
      username: "user123",
      opinion: "NFTs are evolving beyond just art. Utility tokens, gaming assets, and digital identity will make them crucial for web3 in 2025.",
      tags: ["Smart", "Relatable"],
      weight: "3.2 ETH weight",
      avatarColor: "#dddddd",
    },
    {
      username: "crypto_skeptic",
      opinion: "The hype has died down. Unless there's a killer app, most NFTs will be worthless. Focus on real-world assets instead.",
      tags: ["Risky", "YOLO"],
      weight: "1.8 ETH weight",
      avatarColor: "#dddddd",
    },
    {
      username: "digital_artist",
      opinion: "For artists, NFTs provide direct ownership and royalty streams. That value proposition isn't going anywhere.",
      tags: ["Smart"],
      weight: "0.9 ETH weight",
      avatarColor: "#dddddd",
    },
  ];

  const handleSubmitOpinion = () => {
    if (opinion.trim() && selectedSide) {
      // TODO: Submit opinion to API
      console.log("Submitting opinion:", { opinion, side: selectedSide });
      setOpinion("");
    }
  };

  const handleVote = (side: "A" | "B") => {
    setSelectedSide(side);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="border-b border-border pb-6 flex flex-col gap-1.5 mb-6">
          <h1 className="font-bold text-[28.8px] text-center text-foreground">
            Super Battle !!!
          </h1>
          <p className="font-normal text-[14.4px] text-center text-[#666666]">
            Pick a side. Cast your take. Vote with weight.
          </p>
          {isAuthenticated && user && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Connected as {user.username || `FID: ${user.fid}`}
            </p>
          )}
        </div>

        {/* Battle Card */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          {/* Creator */}
          <div className="flex gap-2 items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-[#cccccc] border border-border" />
            <span className="font-bold text-[14.4px] text-[#555555]">
              @{battle.creator}
            </span>
          </div>

          {/* Question */}
          <h2 className="font-bold text-[19.2px] leading-[26.88px] text-[#1a1a1a] mb-4">
            {battle.question}
          </h2>

          {/* Timer */}
          <div className="text-right">
            <span className="font-bold text-[13.6px] text-foreground">
              Voting ends in {battle.votingEndsIn}
            </span>
          </div>
        </div>

        {/* Voting Buttons */}
        <div className="flex gap-0 mb-6">
          <button
            onClick={() => handleVote("A")}
            className={`flex-1 rounded-l-xl px-3 py-3.5 flex flex-col gap-1.5 items-center border transition-all ${
              selectedSide === "A"
                ? "bg-black border-black text-white"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            <div className="text-[19.2px]">{battle.sideA.emoji}</div>
            <div className="font-bold text-base">{battle.sideA.label}</div>
            <div className="font-normal text-[12.8px] pt-[3px]">
              {battle.sideA.percentage}%
            </div>
          </button>

          <button
            onClick={() => handleVote("B")}
            className={`flex-1 rounded-r-xl px-3 py-3.5 flex flex-col gap-1.5 items-center border transition-all ${
              selectedSide === "B"
                ? "bg-black border-black text-white"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            <div className="text-[19.2px]">{battle.sideB.emoji}</div>
            <div className="font-bold text-base">{battle.sideB.label}</div>
            <div className="font-normal text-[12.8px] pt-[3px]">
              {battle.sideB.percentage}%
            </div>
          </button>
        </div>

        {/* Opinion Input */}
        <div className="flex flex-col gap-2.5 mb-8">
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value.slice(0, 280))}
            placeholder="Write your opinion (max 280 chars)"
            className="bg-card border border-border rounded-lg p-3.5 min-h-[80px] font-normal text-[14.4px] text-foreground placeholder:text-[#999999] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            maxLength={280}
          />
          <button
            onClick={handleSubmitOpinion}
            disabled={!opinion.trim() || !selectedSide}
            className="bg-black rounded-lg py-3 text-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-bold text-[15.8px] text-white">
              Submit Opinion
            </span>
          </button>
        </div>

        {/* Top Opinions Section */}
        <div className="flex flex-col gap-2.5 mb-10">
          <div className="border-b border-border pb-1.5">
            <h2 className="font-bold text-[19.2px] text-[#1a1a1a]">
              Top Opinions
            </h2>
          </div>

          {topOpinions.map((op, i) => (
            <OpinionCard key={i} {...op} />
          ))}
        </div>

        {/* Results Section (conditionally shown) */}
        {showResults && (
          <DuelResults
            winnerSide="Side A"
            topOpinions={[
              { rank: 1, username: "user123", snippet: "NFTs evolving beyond art." },
              { rank: 2, username: "digital_artist", snippet: "Value for artists." },
              { rank: 3, username: "investorX", snippet: "New ecosystems emerge." },
            ]}
            onMintNFT={() => console.log("Mint NFT")}
            onStartNewDuel={() => console.log("Start new duel")}
            onViewPastDebates={() => console.log("View past debates")}
          />
        )}

        {/* Toggle Results Button (for demo) */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowResults(!showResults)}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            {showResults ? "Hide" : "Show"} Results Demo
          </button>
        </div>
      </div>
    </div>
  );
}
