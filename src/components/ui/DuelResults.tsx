interface DuelResultsProps {
  winnerSide: string;
  topOpinions: Array<{
    rank: number;
    username: string;
    snippet: string;
  }>;
  onMintNFT: () => void;
  onStartNewDuel: () => void;
  onViewPastDebates: () => void;
}

export function DuelResults({ 
  winnerSide, 
  topOpinions,
  onMintNFT,
  onStartNewDuel,
  onViewPastDebates
}: DuelResultsProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Results Card */}
      <div className="bg-[#333333] border border-[#8a63d2] rounded-xl p-[21px] flex flex-col gap-2.5">
        {/* Title */}
        <div className="text-center">
          <h2 className="font-bold text-[22.4px] text-[#00ffc2]">
            Duel Results!
          </h2>
        </div>

        {/* Winner Badge */}
        <div className="bg-[#00ffc2] rounded-[20px] px-[15px] py-2 text-center">
          <span className="font-bold text-base text-[#1a1a1a]">
            {winnerSide} Wins!
          </span>
        </div>

        {/* Top Opinions Title */}
        <div className="pt-6 text-center">
          <h3 className="font-bold text-[18.7px] text-white">
            Top Opinions
          </h3>
        </div>

        {/* Top Opinions List */}
        <div className="flex flex-col gap-2 pt-2 pb-5">
          {topOpinions.map((opinion) => (
            <div 
              key={opinion.rank}
              className="bg-[rgba(255,255,255,0.1)] rounded-lg p-2.5 flex gap-2.5 items-center"
            >
              <span className="font-bold text-[14.4px] text-[#00ffc2]">
                {opinion.rank}.
              </span>
              <span className="font-bold text-[14.4px] text-white">
                @{opinion.username}:
              </span>
              <span className="font-normal text-[14.4px] text-white">
                {opinion.snippet}
              </span>
            </div>
          ))}
        </div>

        {/* Mint Button */}
        <button 
          onClick={onMintNFT}
          className="bg-white rounded-lg px-5 py-3 text-center hover:bg-gray-100 transition-colors"
        >
          <span className="font-bold text-[15.4px] text-black">
            Mint Winner NFT
          </span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border pt-4 flex flex-col gap-2.5 pb-5">
        <button 
          onClick={onStartNewDuel}
          className="bg-[#333333] rounded-lg p-3 text-center hover:bg-[#444444] transition-colors"
        >
          <span className="font-bold text-[14.7px] text-white">
            Start a New Duel
          </span>
        </button>
        
        <button 
          onClick={onViewPastDebates}
          className="text-center hover:opacity-70 transition-opacity"
        >
          <span className="font-bold text-[14.4px] text-foreground">
            View Past Debates
          </span>
        </button>
      </div>
    </div>
  );
}
