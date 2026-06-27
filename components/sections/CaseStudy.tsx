"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";

interface CaseStudyProps {
  onViewKariba: () => void;
}

// Esri Wayback tile URLs — real historical snapshots from official config
// Release 25944 = 2019-01-31, Release 12428 = 2024-06-06
const WAYBACK_2019 = 25944;
const WAYBACK_2024 = 12428;

function getEsriTile(lat: number, lng: number, release: number): string {
  const zoom = 8;
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
  return `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/${release}/${zoom}/${y}/${x}`;
}

// Kariba REDD+ coordinates
const KARIBA_LAT = -16.5;
const KARIBA_LNG = 28.5;

export default function CaseStudy({ onViewKariba }: CaseStudyProps) {
  const [btnHover, setBtnHover] = useState(false);

  // --- Slider state ---
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  // Image loading/error
  const [img2019Error, setImg2019Error] = useState(false);
  const [img2024Error, setImg2024Error] = useState(false);

  const image2019Url = getEsriTile(KARIBA_LAT, KARIBA_LNG, WAYBACK_2019);
  const image2024Url = getEsriTile(KARIBA_LAT, KARIBA_LNG, WAYBACK_2024);

  // --- DRAG HANDLERS (window-level for reliability) ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <section
      className="noomo-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-surface)",
        minHeight: "100vh",
        padding: "60px 80px",
        boxSizing: "border-box",
        marginTop: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          width: "100%",
          padding: "0 60px",
          gap: "80px",
          alignItems: "center",
        }}
      >
        {/* Left: Text Content */}
        <div
          style={{
            flex: 1,
            borderLeft: "3px solid var(--accent-warn)",
            paddingLeft: "32px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-warn)",
            }}
          >
            CASE STUDY
          </span>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "40px",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.15,
              marginTop: "16px",
              marginBottom: "32px",
            }}
          >
            How CarbonLens would have caught the Kariba fraud
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span
                style={{
                  color: "var(--accent-warn)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              >
                01
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                <strong style={{ color: "var(--text-primary)" }}>
                  Over-crediting at scale:
                </strong>{" "}
                Kariba issued 33.5M credits — satellite analysis showed actual
                forest cover change was a fraction of claimed baseline
                deforestation.
              </p>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span
                style={{
                  color: "var(--accent-warn)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              >
                02
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                <strong style={{ color: "var(--text-primary)" }}>
                  Inflated baselines:
                </strong>{" "}
                The project predicted 5× higher deforestation than actually
                occurred, using a manipulated reference region approved by South
                Pole.
              </p>
            </li>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span
                style={{
                  color: "var(--accent-warn)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              >
                03
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                <strong style={{ color: "var(--text-primary)" }}>
                  Governance failures:
                </strong>{" "}
                Despite multiple red flags, Verra continued issuing credits until
                a Guardian investigation exposed the scheme in 2023.
              </p>
            </li>
          </ul>

          {/* CTA */}
          <button
            onClick={onViewKariba}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              marginTop: "36px",
              padding: "14px 32px",
              border: "none",
              borderRadius: "100px",
              background: btnHover ? "var(--accent-warn)" : "#1A1D23",
              color: btnHover ? "#FFFFFF" : "var(--accent-warn)",
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s var(--ease-primary)",
            }}
          >
            View Kariba Project →
          </button>
        </div>

        {/* Right: Live Satellite Preview with working drag slider */}
        <div
          style={{
            flex: 1,
            background: "var(--bg-void)",
            borderRadius: "8px",
            padding: "24px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {/* Satellite slider */}
          <div
            ref={sliderRef}
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: "ew-resize",
              userSelect: "none",
              WebkitUserSelect: "none",
              width: "100%",
              aspectRatio: "16/10",
              borderRadius: "6px",
              marginBottom: "20px",
              background: "#111",
            }}
          >
            {/* 2024 image — right side */}
            {!img2024Error ? (
              <img
                src={image2024Url}
                alt="Kariba 2024 satellite"
                onError={() => setImg2024Error(true)}
                draggable={false}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  clipPath: `inset(0 0 0 ${position}%)`,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#1a1a1a",
                  clipPath: `inset(0 0 0 ${position}%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}
                >
                  Imagery unavailable
                </span>
              </div>
            )}

            {/* 2019 image — left side */}
            {!img2019Error ? (
              <img
                src={image2019Url}
                alt="Kariba 2019 satellite"
                onError={() => setImg2019Error(true)}
                draggable={false}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  clipPath: `inset(0 ${100 - position}% 0 0)`,
                  userSelect: "none",
                  pointerEvents: "none",
                  zIndex: 2,

                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#1a1a1a",
                  clipPath: `inset(0 ${100 - position}% 0 0)`,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}
                >
                  Imagery unavailable
                </span>
              </div>
            )}

            {/* Year labels */}
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: 12,
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "white",
                background: "rgba(0,0,0,0.5)",
                padding: "2px 8px",
                borderRadius: "3px",
                zIndex: 4,
                pointerEvents: "none",
              }}
            >
              2019
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 8,
                right: 12,
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "white",
                background: "rgba(0,0,0,0.5)",
                padding: "2px 8px",
                borderRadius: "3px",
                zIndex: 8,
                pointerEvents: "none",
              }}
            >
              2024
            </div>

            {/* Vertical divider line */}
            <div
              style={{
                position: "absolute",
                left: `${position}%`,
                top: 0,
                height: "100%",
                width: "2px",
                backgroundColor: "white",
                transform: "translateX(-50%)",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />

            {/* Drag handle circle */}
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: "absolute",
                left: `${position}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "ew-resize",
                zIndex: 20,
                boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
                userSelect: "none",
                fontSize: "14px",
                color: "#333",
                fontWeight: 600,
              }}
            >
              ‹›
            </div>
          </div>

          {/* Score preview */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "3px solid var(--accent-warn)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--accent-warn)",
              }}
            >
              23
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Kariba REDD+
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                Zimbabwe · 33.5M credits issued
              </div>
            </div>
          </div>

          {/* Mini score bars */}
          {[
            { label: "Additionality", score: 18 },
            { label: "Permanence", score: 22 },
            { label: "Leakage", score: 31 },
            { label: "Community Impact", score: 25 },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: "8px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                <span>{item.label}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--accent-warn)",
                  }}
                >
                  {item.score}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "3px",
                  background: "var(--border-subtle)",
                  borderRadius: "2px",
                }}
              >
                <div
                  style={{
                    width: `${item.score}%`,
                    height: "100%",
                    background: "var(--accent-warn)",
                    borderRadius: "2px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
