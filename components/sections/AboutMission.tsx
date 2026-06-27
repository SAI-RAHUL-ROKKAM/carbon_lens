"use client";
import React, { useRef, useEffect, useState } from "react";

export default function AboutMission() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fadeUp = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 450ms ease-out ${delay}ms, transform 450ms ease-out ${delay}ms`,
  });

  const cardIn = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)",
    transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      className="noomo-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFFFFF",
        padding: "60px 80px",
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          width: "100%",
          gap: "0",
          alignItems: "center",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ flex: 1, paddingRight: "48px" }}>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#FF6B35",
              marginBottom: "20px",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              ...fadeUp(0),
            }}
          >
            OUR MISSION
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "46px",
              fontWeight: 700,
              color: "#0A0A0A",
              lineHeight: 1.1,
              margin: 0,
              ...fadeUp(80),
            }}
          >
            Carbon markets only work
            <br />
            if the credits are{" "}
            <span style={{ color: "#00E5A0" }}>real.</span>
          </h2>

          {/* Paragraph 1 */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "#555",
              lineHeight: 1.75,
              marginTop: "28px",
              marginBottom: 0,
              ...fadeUp(160),
            }}
          >
            The voluntary carbon market has grown into a $2 billion industry —
            but it operates largely on trust. Project developers self-report
            their numbers. Auditors are paid by the projects they audit. And the
            satellite evidence sits in public databases that nobody is paid to
            check.
          </p>

          {/* Paragraph 2 */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "#555",
              lineHeight: 1.75,
              marginTop: "16px",
              marginBottom: 0,
              ...fadeUp(240),
            }}
          >
            CarbonLens changes that. We cross-reference every registered carbon
            project against satellite imagery, run the methodology documents
            through AI analysis, and surface the gaps — publicly, for free, for
            anyone.
          </p>

          {/* Stat pills */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "36px",
              ...fadeUp(320),
            }}
          >
            {[
              { value: "2,847+", label: "Projects Monitored", color: "#00E5A0" },
              { value: "312", label: "Flagged High Risk", color: "#FF6B35" },
              { value: "Free", label: "Always & Forever", color: "#4D9EFF" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "#F8F8F8",
                  border: "1px solid #EBEBEB",
                  borderRadius: "6px",
                  padding: "14px 20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    color: "#999",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginTop: "4px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div
          style={{
            width: "1px",
            background: "#EBEBEB",
            alignSelf: "center",
            height: "60%",
            flexShrink: 0,
          }}
        />

        {/* RIGHT COLUMN */}
        <div
          style={{
            flex: 1,
            paddingLeft: "48px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* Card 1 — Satellite Evidence */}
          <Card
            icon={<SatelliteIcon />}
            title="Satellite Evidence"
            body="We verify land cover change using Esri World Imagery — the same satellite data used by climate scientists and journalists worldwide."
            style={cardIn(400)}
          />

          {/* Card 2 — AI Analysis */}
          <Card
            icon={<BrainIcon />}
            title="AI Analysis"
            body="Gemini reads every methodology document and scores additionality, permanence, leakage, and community impact — in seconds."
            style={cardIn(500)}
          />

          {/* Card 3 — Global Coverage */}
          <Card
            icon={<GlobeIcon />}
            title="Global Coverage"
            body="Every project on the Verra VCS Registry is in our system — over 2,800 projects across 80+ countries."
            style={cardIn(600)}
          />

          {/* Card 4 — Fully Open */}
          <Card
            icon={<LockOpenIcon />}
            title="Fully Open"
            body="No paywalls. No subscriptions. Carbon market accountability should be accessible to every journalist, activist, and citizen on earth."
            style={cardIn(700)}
          />
        </div>
      </div>
    </section>
  );
}

/* ── Principle Card ── */
function Card({
  icon,
  title,
  body,
  style,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  style: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FAFAFA",
        border: `1px solid ${hovered ? "rgba(0,229,160,0.4)" : "#EBEBEB"}`,
        borderRadius: "8px",
        padding: "24px",
        transition: "border-color 200ms ease, transform 200ms ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        ...style,
      }}
    >
      <div style={{ marginBottom: "14px" }}>{icon}</div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          fontWeight: 600,
          color: "#0A0A0A",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "#666",
          lineHeight: 1.65,
        }}
      >
        {body}
      </div>
    </div>
  );
}

/* ── SVG Icons (28px line art) ── */
function SatelliteIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 10.5L10.5 17.5" />
      <path d="M20 7L21 6" />
      <rect x="14" y="3" width="8" height="8" rx="1" transform="rotate(45 18 7)" />
      <path d="M6 16l-3 3a2 2 0 000 2.83l3.17 3.17a2 2 0 002.83 0l3-3" />
      <circle cx="10" cy="18" r="6" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#4D9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 26V14" />
      <path d="M10 14c-4 0-7-2.5-7-6s2.5-6 5.5-6C9 2 10 2 11 2.5" />
      <path d="M18 14c4 0 7-2.5 7-6s-2.5-6-5.5-6C19 2 18 2 17 2.5" />
      <path d="M14 2.5c-1.5 0-2.5 1-2.5 2.5s1.5 3 2.5 4c1-1 2.5-2.5 2.5-4s-1-2.5-2.5-2.5z" />
      <path d="M7 12c0 2 1 4 3 5" />
      <path d="M21 12c0 2-1 4-3 5" />
      <circle cx="9" cy="8" r="1" fill="#4D9EFF" stroke="none" />
      <circle cx="19" cy="8" r="1" fill="#4D9EFF" stroke="none" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="11" />
      <ellipse cx="14" cy="14" rx="5" ry="11" />
      <path d="M3 14h22" />
      <path d="M5.5 7.5h17" />
      <path d="M5.5 20.5h17" />
    </svg>
  );
}

function LockOpenIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#4D9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="13" width="18" height="12" rx="2" />
      <path d="M9 13V8a5 5 0 0110 0" />
      <circle cx="14" cy="20" r="2" />
      <path d="M14 22v2" />
    </svg>
  );
}
