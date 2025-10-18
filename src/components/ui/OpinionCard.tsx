interface OpinionCardProps {
  username: string;
  opinion: string;
  tags: string[];
  weight: string;
  avatarColor?: string;
}

export function OpinionCard({ 
  username, 
  opinion, 
  tags, 
  weight,
  avatarColor = "#dddddd" 
}: OpinionCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2.5">
      {/* User info */}
      <div className="flex gap-2 items-center">
        <div 
          className="w-[37px] h-[37px] rounded-[18.5px] border border-border"
          style={{ backgroundColor: avatarColor }}
        />
        <div className="font-bold text-base text-foreground">
          @{username}
        </div>
      </div>

      {/* Opinion text */}
      <div className="font-normal text-[15.2px] leading-[21.28px] text-[#333333]">
        {opinion}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, i) => (
            <div 
              key={i}
              className="bg-[#f0f0f0] border border-[#dddddd] rounded-[20px] px-[11px] py-[7px]"
            >
              <span className="font-normal text-xs text-[#555555]">
                {tag}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Weight */}
      <div className="pt-1.5 text-right">
        <div className="font-bold text-[12.8px] text-foreground">
          {weight}
        </div>
      </div>
    </div>
  );
}
