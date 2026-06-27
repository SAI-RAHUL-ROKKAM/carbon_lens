"use client";
import React, { useState } from "react";

interface HeroQuoteProps {
  onExplore: () => void;
}

export default function HeroQuote({ onExplore }: HeroQuoteProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const handleClick = () => {
    setIsExiting(true);
    onExplore();
  };

  return (
    <section
      className={`snap-section hero-bg ${isExiting ? "hero-exit" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1000px",
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "72px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          The voluntary carbon market is a $2 billion industry built on trust.
        </h1>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "72px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            margin: "8px 0 0 0",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          We built it on{" "}
          <span
            style={{
              color: "var(--accent-primary)",
              textDecoration: "underline",
              textDecorationColor: "rgba(0, 192, 127, 0.3)",
              textUnderlineOffset: "8px",
              textDecorationThickness: "3px",
            }}
          >
            evidence
          </span>
          .
        </h2>

        {/* Attribution */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginTop: "32px",
          }}
        >
          — CARBONLENS
        </p>

        {/* CTA Button – dark pill */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            marginTop: "48px",
            padding: "16px 40px",
            border: "none",
            borderRadius: "100px",
            background: btnHover ? "var(--accent-primary)" : "#1A1D23",
            color: "#FFFFFF",
            fontFamily: "var(--font-display)",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.3s var(--ease-primary)",
          }}
        >
          Explore Projects →
        </button>
      </div>

      {/* Scroll indicator removed per UX request */}
    </section>
  );
}
