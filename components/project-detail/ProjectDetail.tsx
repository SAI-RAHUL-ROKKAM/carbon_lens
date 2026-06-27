"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { CarbonProject, IntegrityScore } from "@/types";
import SatelliteSlider from "./SatelliteSlider";
import ScorePanel from "./ScorePanel";
import RedFlags from "./RedFlags";
import ExportButton from "./ExportButton";
import Notification from "@/components/ui/Notification";

interface ProjectDetailProps {
  project: CarbonProject | null;
  isOpen: boolean;
  onClose: () => void;
}

// Module-level cache persists across mounts
const scoreCache = new Map<string, IntegrityScore>();

export default function ProjectDetail({
  project,
  isOpen,
  onClose,
}: ProjectDetailProps) {
  const [score, setScore] = useState<IntegrityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const fetchScore = useCallback(async (proj: CarbonProject) => {
    // Check cache first
    const cached = scoreCache.get(proj.id);
    if (cached) {
      setScore(cached);
      return;
    }

    setIsLoading(true);
    setScore(null);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: proj.name,
          projectType: proj.projectType,
          country: proj.country,
          methodology: proj.methodology,
          creditsIssued: proj.creditsIssued,
        }),
      });

      const data: IntegrityScore = await res.json();
      scoreCache.set(proj.id, data);
      setScore(data);
    } catch (err) {
      console.error("Failed to fetch score:", err);
      // Fallback score
      const fallback: IntegrityScore = {
        overallScore: 50,
        additionality: 50,
        permanence: 50,
        leakage: 50,
        communityImpact: 50,
        redFlags: [],
        summary: "Analysis unavailable — showing default scores.",
      };
      setScore(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && project) {
      setIsClosing(false);
      fetchScore(project);
    }
  }, [isOpen, project, fetchScore]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setScore(null);
      onClose();
    }, 350);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;
  if (!project) return null;

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "var(--bg-surface)",
          animation: isClosing
            ? "panelContract 350ms cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : "panelExpand 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {project.name}
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
              }}
            >
              {project.projectType}
              {project.methodology ? ` · ${project.methodology}` : ""}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              fontFamily: "var(--font-body)",
              fontSize: "24px",
              color: "var(--text-muted)",
              borderRadius: "4px",
              transition: "color 200ms ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* LEFT HALF — Satellite */}
          <div
            style={{
              flex: 1,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "auto",
            }}
          >
            <SatelliteSlider
              coordinates={project.coordinates}
              country={project.country}
            />
          </div>

          {/* RIGHT HALF — Analysis panels */}
          <div
            className="right-panel"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderLeft: "1px solid var(--border-subtle)",
              boxSizing: "border-box",
            }}
          >
            {/* Scrollable content area */}
            <div
              className="right-panel"
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "24px 32px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Score Panel */}
              <div style={{ flex: "0 0 auto" }}>
                <ScorePanel score={score} isLoading={isLoading} />
              </div>

              {/* Red Flags */}
              <div style={{ flex: "0 0 auto" }}>
                <RedFlags
                  flags={score?.redFlags ?? []}
                  isLoading={isLoading}
                />
              </div>

              {/* Summary */}
              {score?.summary && !isLoading && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.5",
                    padding: "12px",
                    background: "var(--bg-elevated)",
                    borderRadius: "4px",
                    borderLeft: "2px solid var(--accent-data)",
                  }}
                >
                  {score.summary}
                </div>
              )}
            </div>

            {/* Export Button — fixed at bottom */}
            <div
              style={{
                flexShrink: 0,
                padding: "16px 32px 24px",
                borderTop: "1px solid #EBEBEB",
              }}
            >
              <ExportButton
                project={project}
                score={score}
                onExport={() => setShowNotification(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <Notification
        message="Report exported successfully"
        show={showNotification}
        onDismiss={() => setShowNotification(false)}
      />
    </>
  );
}
