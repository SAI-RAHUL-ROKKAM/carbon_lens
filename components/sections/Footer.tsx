"use client";
import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        height: "64px",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: "var(--bg-void)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--accent-primary)",
        }}
      >
        CarbonLens
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        Data from Verra VCS Registry · Satellite via Google Earth · AI by Gemini
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          color: "var(--text-muted)",
          textAlign: "right",
        }}
      >
        Built by Rahul · Brainovision Internship 2025
      </div>
    </footer>
  );
}
