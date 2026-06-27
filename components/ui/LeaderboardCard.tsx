"use client";
import React from "react";
import { LeaderboardProject } from "@/types";
import ScoreBadge from "./ScoreBadge";

interface LeaderboardCardProps {
  project: LeaderboardProject;
  onClick: (project: LeaderboardProject) => void;
}

export default function LeaderboardCard({ project, onClick }: LeaderboardCardProps) {
  return (
    <button
      onClick={() => onClick(project)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 16px",
        background: "transparent",
        border: "none",
        borderBottom: "1px solid var(--border-subtle)",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s var(--ease-primary)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--bg-elevated)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      <div style={{ flex: 1, minWidth: 0, marginRight: "12px" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {project.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            marginTop: "2px",
          }}
        >
          {project.country} · {project.projectType}
        </div>
      </div>
      <ScoreBadge score={project.integrityScore} />
    </button>
  );
}
