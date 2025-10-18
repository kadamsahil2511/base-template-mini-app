"use client";

import { useState } from "react";

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (battleData: {
    question: string;
    sideALabel: string;
    sideAEmoji: string;
    sideBLabel: string;
    sideBEmoji: string;
    duration: number;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateBattleModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateBattleModalProps) {
  const [question, setQuestion] = useState("");
  const [sideALabel, setSideALabel] = useState("");
  const [sideAEmoji, setSideAEmoji] = useState("🔥");
  const [sideBLabel, setSideBLabel] = useState("");
  const [sideBEmoji, setSideBEmoji] = useState("🧠");
  const [duration, setDuration] = useState(24);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !sideALabel.trim() || !sideBLabel.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    await onSubmit({
      question: question.trim(),
      sideALabel: sideALabel.trim(),
      sideAEmoji,
      sideBLabel: sideBLabel.trim(),
      sideBEmoji,
      duration,
    });

    // Reset form
    setQuestion("");
    setSideALabel("");
    setSideAEmoji("🔥");
    setSideBLabel("");
    setSideBEmoji("🧠");
    setDuration(24);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border p-4 flex justify-between items-center sticky top-0 bg-card">
          <h2 className="font-bold text-xl text-foreground">Create New Battle</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Question */}
          <div>
            <label className="block font-bold text-sm text-foreground mb-2">
              Battle Question *
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Is buying NFTs in 2025 still worth it?"
              className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-none"
              maxLength={200}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {question.length}/200 characters
            </p>
          </div>

          {/* Side A */}
          <div className="border border-border rounded-lg p-4 bg-background">
            <h3 className="font-bold text-sm text-foreground mb-3">Side A</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-foreground mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  value={sideAEmoji}
                  onChange={(e) => setSideAEmoji(e.target.value.slice(0, 2))}
                  className="w-20 bg-card border border-border rounded-lg p-2 text-center text-xl"
                  maxLength={2}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm text-foreground mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={sideALabel}
                  onChange={(e) => setSideALabel(e.target.value)}
                  placeholder="e.g., Yes, Worth It"
                  className="w-full bg-card border border-border rounded-lg p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={30}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Side B */}
          <div className="border border-border rounded-lg p-4 bg-background">
            <h3 className="font-bold text-sm text-foreground mb-3">Side B</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-foreground mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  value={sideBEmoji}
                  onChange={(e) => setSideBEmoji(e.target.value.slice(0, 2))}
                  className="w-20 bg-card border border-border rounded-lg p-2 text-center text-xl"
                  maxLength={2}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm text-foreground mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={sideBLabel}
                  onChange={(e) => setSideBLabel(e.target.value)}
                  placeholder="e.g., Not Worth It"
                  className="w-full bg-card border border-border rounded-lg p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={30}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block font-bold text-sm text-foreground mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isSubmitting}
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>3 days</option>
              <option value={168}>1 week</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-muted border border-border rounded-lg py-3 text-center hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <span className="font-bold text-sm text-foreground">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !question.trim() || !sideALabel.trim() || !sideBLabel.trim()}
              className="flex-1 bg-black rounded-lg py-3 text-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-bold text-sm text-white">
                {isSubmitting ? "Creating..." : "Create Battle"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
