"use client";
import React from "react";
import { getScoreBg } from "@/lib/scoreUtils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export default function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  const bg = getScoreBg(score);
  const fontSize = size === "sm" ? "13px" : "15px";
  const padding = size === "sm" ? "2px 8px" : "4px 12px";

  return (
    <span
      style={{
        background: bg,
        color: "#FFFFFF",
        fontFamily: "var(--font-mono)",
        fontSize,
        fontWeight: 400,
        padding,
        borderRadius: "3px",
        display: "inline-block",
        lineHeight: 1.4,
        letterSpacing: "0.02em",
      }}
    >
      {score}
    </span>
  );
}
