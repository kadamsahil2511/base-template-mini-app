"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { sdk } from "@farcaster/miniapp-sdk";
import { OpinionCard } from "~/components/ui/OpinionCard";
import { DuelResults } from "~/components/ui/DuelResults";
import { CreateBattleModal } from "~/components/ui/CreateBattleModal";
import { subscribeToBattle, subscribeToOpinions, type Battle as DBBattle, type Opinion as DBOpinion } from "~/lib/database";

interface Battle {
  id: string;
  creator: string;
  creatorFid: number;
  question: string;
  votingEndsIn: string;
  votingEndsAt: string;
  sideA: {
    emoji: string;
    label: string;
    percentage: number;
    votes: number;
  };
  sideB: {
    emoji: string;
    label: string;
    percentage: number;
    votes: number;
  };
}

interface Opinion {
  id: string;
  username: string;
  opinion: string;
  tags?: string[];
  weight: string;
  avatarColor?: string;
  fid: number;
}

function calculateTimeRemaining(votingEndsAt: string): string {
  const now = new Date().getTime();
  const end = new Date(votingEndsAt).getTime();
  const diff = end - now;
  
  if (diff <= 0) return "Ended";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

function formatBattle(dbBattle: DBBattle): Battle {
  const totalVotes = dbBattle.sideA.votes + dbBattle.sideB.votes;
  const sideAPercentage = totalVotes > 0 ? Math.round((dbBattle.sideA.votes / totalVotes) * 100) : 50;
  const sideBPercentage = totalVotes > 0 ? 100 - sideAPercentage : 50;
  
  return {
    id: dbBattle.id,
    creator: dbBattle.creator,
    creatorFid: dbBattle.creatorFid,
    question: dbBattle.question,
    votingEndsIn: calculateTimeRemaining(dbBattle.votingEndsAt),
    votingEndsAt: dbBattle.votingEndsAt,
    sideA: {
      ...dbBattle.sideA,
      percentage: sideAPercentage,
    },
    sideB: {
      ...dbBattle.sideB,
      percentage: sideBPercentage,
    },
  };
}

function formatOpinion(dbOpinion: DBOpinion): Opinion {
  return {
    id: dbOpinion.id,
    username: dbOpinion.username,
    opinion: dbOpinion.opinion,
    tags: [],
    weight: `${dbOpinion.weight.toFixed(1)} ETH weight`,
    avatarColor: "#dddddd",
    fid: dbOpinion.fid,
  };
}

export default function SuperBattle() {
  const [opinion, setOpinion] = useState("");
  const [selectedSide, setSelectedSide] = useState<"A" | "B" | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<{ fid: number; username?: string; displayName?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingBattle, setCreatingBattle] = useState(false);

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

  // Load battle data and subscribe to real-time updates
  useEffect(() => {
    const loadBattle = async () => {
      try {
        const response = await fetch("/api/battles");
        const data = await response.json();
        
        if (data && data.id) {
          setBattle(formatBattle(data));
          setLoading(false);
          
          // Subscribe to real-time battle updates
          const unsubscribeBattle = subscribeToBattle(data.id, (updatedBattle) => {
            setBattle(formatBattle(updatedBattle));
          });
          
          // Subscribe to real-time opinions
          const unsubscribeOpinions = subscribeToOpinions(data.id, (updatedOpinions) => {
            setOpinions(updatedOpinions.slice(0, 10).map(formatOpinion));
          });
          
          // Check if user has already voted
          if (user && isAuthenticated) {
            const voteResponse = await fetch(`/api/votes?battleId=${data.id}&fid=${user.fid}`);
            const voteData = await voteResponse.json();
            if (voteData.success && voteData.vote) {
              setHasVoted(true);
              setSelectedSide(voteData.vote.side);
            }
          }
          
          return () => {
            unsubscribeBattle();
            unsubscribeOpinions();
          };
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load battle:", error);
        setLoading(false);
      }
    };

    loadBattle();
  }, [user, isAuthenticated]);

  const handleSubmitOpinion = async () => {
    if (!opinion.trim() || !selectedSide || !battle || !isAuthenticated || !user) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/opinions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.fid}`,
        },
        body: JSON.stringify({
          battleId: battle.id,
          opinion: opinion.trim(),
          side: selectedSide,
          username: user.username || user.displayName || `user${user.fid}`,
        }),
      });

      if (response.ok) {
        setOpinion("");
        // Opinions will be updated via real-time subscription
      } else {
        const error = await response.json();
        alert(`Failed to submit opinion: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting opinion:", error);
      alert("Failed to submit opinion");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (side: "A" | "B") => {
    if (!battle || !isAuthenticated || !user || hasVoted) {
      if (hasVoted) {
        alert("You have already voted on this battle");
      }
      return;
    }

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.fid}`,
        },
        body: JSON.stringify({
          battleId: battle.id,
          side,
        }),
      });

      if (response.ok) {
        setSelectedSide(side);
        setHasVoted(true);
        // Battle votes will be updated via real-time subscription
      } else {
        const error = await response.json();
        alert(`Failed to vote: ${error.error}`);
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    }
  };

  const handleCreateBattle = async (battleData: {
    question: string;
    sideALabel: string;
    sideAEmoji: string;
    sideBLabel: string;
    sideBEmoji: string;
    duration: number;
  }) => {
    if (!isAuthenticated || !user) {
      alert("You must be authenticated to create a battle");
      return;
    }

    setCreatingBattle(true);
    try {
      const response = await fetch("/api/battles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.fid}`,
        },
        body: JSON.stringify({
          ...battleData,
          username: user.username || user.displayName || `user${user.fid}`,
        }),
      });

      if (response.ok) {
        await response.json();
        setShowCreateModal(false);
        alert("Battle created successfully! Reloading...");
        // Reload the page to show the new battle
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to create battle: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating battle:", error);
      alert("Failed to create battle");
    } finally {
      setCreatingBattle(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-foreground">Loading battle...</div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-foreground">No active battle found</div>
      </div>
    );
  }

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
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center gap-2">
                <Image 
                  src={`https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/${encodeURIComponent(`https://warpcast.com/avatar/${user.fid}`)}`}
                  alt={`@${user.username || user.displayName}`}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border border-border object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <p className="text-xs text-center text-muted-foreground">
                  Connected as @{user.username || user.displayName || `FID: ${user.fid}`}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-xs text-primary hover:underline font-medium"
              >
                + Create New Battle
              </button>
            </div>
          )}
        </div>

        {/* Battle Card */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          {/* Creator */}
          <div className="flex gap-2 items-center mb-4">
            <Image 
              src={`https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/${encodeURIComponent(`https://warpcast.com/avatar/${battle.creatorFid}`)}`}
              alt={`@${battle.creator}`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-border object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }}
            />
            <div className="w-8 h-8 rounded-full bg-[#cccccc] border border-border" style={{ display: 'none' }} />
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
            disabled={hasVoted || !isAuthenticated}
            className={`flex-1 rounded-l-xl px-3 py-3.5 flex flex-col gap-1.5 items-center border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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
            disabled={hasVoted || !isAuthenticated}
            className={`flex-1 rounded-r-xl px-3 py-3.5 flex flex-col gap-1.5 items-center border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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

        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-center">
            <p className="text-sm text-yellow-800">
              Connect with Farcaster to vote and share opinions
            </p>
          </div>
        )}

        {/* Opinion Input */}
        <div className="flex flex-col gap-2.5 mb-8">
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value.slice(0, 280))}
            placeholder="Write your opinion (max 280 chars)"
            className="bg-card border border-border rounded-lg p-3.5 min-h-[80px] font-normal text-[14.4px] text-foreground placeholder:text-[#999999] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            maxLength={280}
            disabled={!isAuthenticated}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {opinion.length}/280
            </span>
            <button
              onClick={handleSubmitOpinion}
              disabled={!opinion.trim() || !selectedSide || !isAuthenticated || submitting}
              className="bg-black rounded-lg py-3 px-6 text-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-bold text-[15.8px] text-white">
                {submitting ? "Submitting..." : "Submit Opinion"}
              </span>
            </button>
          </div>
        </div>

        {/* Top Opinions Section */}
        <div className="flex flex-col gap-2.5 mb-10">
          <div className="border-b border-border pb-1.5">
            <h2 className="font-bold text-[19.2px] text-[#1a1a1a]">
              Top Opinions
            </h2>
          </div>

          {opinions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No opinions yet. Be the first to share yours!
            </div>
          ) : (
            opinions.map((op) => (
              <OpinionCard
                key={op.id}
                username={op.username}
                opinion={op.opinion}
                tags={op.tags || []}
                weight={op.weight}
                avatarColor={op.avatarColor}
                fid={op.fid}
              />
            ))
          )}
        </div>

        {/* Results Section (conditionally shown) */}
        {showResults && (
          <DuelResults
            winnerSide={battle.sideA.votes > battle.sideB.votes ? battle.sideA.label : battle.sideB.label}
            topOpinions={opinions.slice(0, 3).map((op, i) => ({
              rank: i + 1,
              username: op.username,
              snippet: op.opinion.slice(0, 50) + (op.opinion.length > 50 ? "..." : ""),
            }))}
            onMintNFT={() => console.log("Mint NFT")}
            onStartNewDuel={() => setShowCreateModal(true)}
            onViewPastDebates={() => console.log("View past debates")}
          />
        )}

        {/* Create Battle Modal */}
        <CreateBattleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBattle}
          isSubmitting={creatingBattle}
        />

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
