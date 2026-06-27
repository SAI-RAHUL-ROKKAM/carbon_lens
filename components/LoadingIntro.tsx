"use client";
import React, { useState, useEffect } from "react";

interface LoadingIntroProps {
  onComplete: () => void;
}

export default function LoadingIntro({ onComplete }: LoadingIntroProps) {
  const [text, setText] = useState("");
  const [isFading, setIsFading] = useState(false);
  const fullText = "CarbonLens";

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(onComplete, 500);
        }, 400);
      }
    }, 80); // 800ms / 10 chars = 80ms per char

    return () => clearInterval(typeInterval);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        opacity: isFading ? 0 : 1,
        transition: "opacity 500ms var(--ease-primary)",
        pointerEvents: isFading ? "none" : "auto",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "24px",
          color: "var(--accent-primary)",
          letterSpacing: "0.05em",
        }}
      >
        {text}
        {!isFading && (
          <span
            style={{
              animation: "blink 0.7s step-end infinite",
              marginLeft: "2px",
              color: "var(--text-primary)",
            }}
          >
            |
          </span>
        )}
      </span>
    </div>
  );
}
