"use client";
import React, { useState } from "react";
import { CarbonProject, IntegrityScore } from "@/types";
import { generatePDFReport } from "@/lib/pdfExport";

interface ExportButtonProps {
  project: CarbonProject;
  score: IntegrityScore | null;
  onExport?: () => void;
}

type ButtonState = "idle" | "loading" | "done" | "error";

export default function ExportButton({
  project,
  score,
  onExport,
}: ExportButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (state !== "idle" || !score) return;

    setState("loading");

    // Run PDF generation immediately — no fake delay
    try {
      generatePDFReport(project, score);
      setState("done");
      onExport?.();
    } catch (err) {
      console.error("PDF export failed:", err);
      setState("error");
    }

    setTimeout(() => {
      setState("idle");
    }, 2000);
  };

  const canClick = !!score && state === "idle";

  const getLabel = () => {
    switch (state) {
      case "error":
        return "Export failed — try again";
      case "done":
        return null; // shows checkmark
      case "loading":
        return null; // shows spinner
      default:
        return "Export Report";
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!score || state === "loading"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "100px",
        background:
          state === "error"
            ? "var(--accent-warn)"
            : !score
              ? "var(--text-muted)"
              : isHovered && canClick
                ? "var(--accent-primary)"
                : "#1A1D23",
        border: "none",
        color: "#FFFFFF",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 500,
        cursor: canClick ? "pointer" : "not-allowed",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        transition: "background 200ms ease",
      }}
    >
      {/* Idle / Error text */}
      {(state === "idle" || state === "error") && (
        <span style={{ color: "#FFFFFF" }}>{getLabel()}</span>
      )}

      {/* Loading spinner */}
      {state === "loading" && (
        <div
          style={{
            width: "20px",
            height: "20px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      )}

      {/* Done checkmark */}
      {state === "done" && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            animation: "scaleIn 200ms ease-out",
          }}
        >
          <path
            d="M5 10L9 14L15 6"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
