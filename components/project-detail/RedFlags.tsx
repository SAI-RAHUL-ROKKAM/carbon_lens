"use client";
import React, { useState, useEffect } from "react";
import { RedFlag } from "@/types";

interface RedFlagsProps {
  flags: RedFlag[];
  isLoading: boolean;
}

function FlagCard({
  flag,
  index,
}: {
  flag: RedFlag;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const [pulsed, setPulsed] = useState(false);
  const delay = 200 + index * 80;

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay);
    const pulseTimer = setTimeout(() => setPulsed(true), delay + 250);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(pulseTimer);
    };
  }, [delay]);

  const severityColor =
    flag.severity === "HIGH" ? "var(--accent-warn)" : "#D97706";
  const severityBg =
    flag.severity === "HIGH"
      ? "rgba(232, 93, 48, 0.15)"
      : "rgba(217, 119, 6, 0.15)";

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        padding: "12px 16px",
        borderRadius: "4px",
        marginBottom: "8px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 250ms ease-out, transform 250ms ease-out",
      }}
    >
      {/* Warning icon */}
      <div
        style={{
          flexShrink: 0,
          marginTop: "1px",
          animation: pulsed ? undefined : "flagPulse 300ms ease-out",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1L15 14H1L8 1Z"
            stroke="var(--accent-warn)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
          <line
            x1="8"
            y1="6"
            x2="8"
            y2="9.5"
            stroke="var(--accent-warn)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.5" r="0.75" fill="var(--accent-warn)" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-primary)",
            lineHeight: "1.4",
            marginBottom: "6px",
          }}
        >
          {flag.text}
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: severityColor,
            background: severityBg,
            padding: "2px 6px",
            borderRadius: "2px",
            letterSpacing: "0.05em",
          }}
        >
          {flag.severity}
        </span>
      </div>
    </div>
  );
}

export default function RedFlags({ flags, isLoading }: RedFlagsProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          textTransform: "uppercase",
          color: "var(--accent-warn)",
          letterSpacing: "0.12em",
          marginBottom: "12px",
        }}
      >
        RED FLAGS DETECTED
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="skeleton-pulse"
              style={{
                height: "60px",
                borderRadius: "4px",
                background: "rgba(0,0,0,0.06)",
              }}
            />
          ))}
        </div>
      ) : flags.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-muted)",
            padding: "12px 0",
          }}
        >
          No red flags detected.
        </div>
      ) : (
        flags.map((flag, i) => (
          <FlagCard key={i} flag={flag} index={i} />
        ))
      )}
    </div>
  );
}
