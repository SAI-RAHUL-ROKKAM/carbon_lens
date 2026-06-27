"use client";
import React, { useState, useEffect } from "react";
import { IntegrityScore } from "@/types";

interface ScorePanelProps {
  score: IntegrityScore | null;
  isLoading: boolean;
}

function getBarColor(value: number): string {
  if (value > 60) return "var(--accent-primary)";
  if (value >= 40) return "#F5A623";
  return "var(--accent-warn)";
}

interface ScoreRowProps {
  label: string;
  value: number;
  delay: number;
}

function ScoreRow({ label, value, delay }: ScoreRowProps) {
  const [visible, setVisible] = useState(false);
  const color = getBarColor(value);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 300ms ease-out, transform 300ms ease-out",
        marginBottom: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color,
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "var(--border-subtle)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: visible ? `${value}%` : "0%",
            background: color,
            borderRadius: "2px",
            transition: "width 600ms ease-out",
          }}
        />
      </div>
    </div>
  );
}

function DonutChart({ score }: { score: number }) {
  const [mounted, setMounted] = useState(false);
  const circumference = 283;
  const offset = circumference - (circumference * score) / 100;
  const color = getBarColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "8px",
        marginBottom: "4px",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle — light grey track */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{
            transition: "stroke-dashoffset 800ms ease-out",
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
        {/* Score text */}
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: 700,
            fill: "var(--text-primary)",
          }}
        >
          {score}
        </text>
      </svg>
    </div>
  );
}

export default function ScorePanel({ score, isLoading }: ScorePanelProps) {
  const scoreRows = [
    { label: "Additionality", key: "additionality" as const, delay: 0 },
    { label: "Permanence Risk", key: "permanence" as const, delay: 50 },
    { label: "Leakage Risk", key: "leakage" as const, delay: 100 },
    { label: "Community Impact", key: "communityImpact" as const, delay: 150 },
  ];

  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          letterSpacing: "0.12em",
          marginBottom: "16px",
        }}
      >
        INTEGRITY ANALYSIS
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div
                className="skeleton-pulse"
                style={{
                  height: "12px",
                  width: "60%",
                  marginBottom: "6px",
                  background: "rgba(0,0,0,0.06)",
                }}
              />
              <div
                className="skeleton-pulse"
                style={{
                  height: "4px",
                  width: "100%",
                  background: "rgba(0,0,0,0.06)",
                }}
              />
            </div>
          ))}
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}
          >
            <div
              className="skeleton-pulse"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.06)",
              }}
            />
          </div>
        </div>
      ) : score ? (
        <>
          {scoreRows.map((row) => (
            <ScoreRow
              key={row.key}
              label={row.label}
              value={score[row.key]}
              delay={row.delay}
            />
          ))}
          <DonutChart score={score.overallScore} />
        </>
      ) : null}
    </div>
  );
}
