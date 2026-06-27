"use client";
import React, { useRef, useEffect, useState } from "react";

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [btn1Hover, setBtn1Hover] = useState(false);
  const [btn2Hover, setBtn2Hover] = useState(false);
  const [btn3Hover, setBtn3Hover] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className="noomo-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAFA",
        minHeight: "100vh",
        padding: "60px 80px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
        }}
      >
        {/* TOP LABEL */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "44px",
          }}
        >
          BUILT BY
        </div>

        {/* MAIN CARD */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EBEBEB",
            borderRadius: "12px",
            padding: "44px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "36px",
              alignItems: "flex-start",
            }}
          >
            {/* LEFT — Avatar */}
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00E5A0, #4D9EFF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "38px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                  }}
                >
                  R
                </span>
              </div>

              {/* Name */}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0A0A0A",
                  marginTop: "14px",
                  textAlign: "center",
                }}
              >
                Rahul
              </div>

              {/* Role */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "#777",
                  textAlign: "center",
                }}
              >
                AI/ML Developer
              </div>

              {/* Internship pill */}
              <div
                style={{
                  marginTop: "10px",
                  background: "rgba(0,229,160,0.08)",
                  border: "1px solid rgba(0,229,160,0.25)",
                  borderRadius: "100px",
                  padding: "4px 12px",
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "#00E5A0",
                  whiteSpace: "nowrap",
                }}
              >
                Brainovision · 2025
              </div>
            </div>

            {/* RIGHT — Details */}
            <div style={{ flex: 1 }}>
              {/* Bio */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Built CarbonLens to bring transparency to one of climate
                change&apos;s most overlooked problems — combining satellite
                data, the Verra VCS Registry, and Google Gemini AI to create
                accountability infrastructure that anyone can use, for free.
              </p>

              {/* Tech tags */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                {["Next.js 14", "Google Gemini", "Esri Satellite"].map(
                  (tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "#F0F0F0",
                        borderRadius: "100px",
                        padding: "4px 12px",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "#777",
                      }}
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "#EBEBEB",
                  marginTop: "24px",
                }}
              />

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  marginTop: "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "26px",
                      fontWeight: 700,
                      color: "#00E5A0",
                    }}
                  >
                    8
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      color: "#999",
                    }}
                  >
                    Sections built
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "26px",
                      fontWeight: 700,
                      color: "#00E5A0",
                    }}
                  >
                    2,847
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      color: "#999",
                    }}
                  >
                    Projects monitored
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BELOW CARD */}
        <div
          style={{
            marginTop: "32px",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "#AAA",
            fontStyle: "italic",
          }}
        >
          Made with curiosity, caffeine, and a lot of AI.
        </div>

        {/* Pill buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "14px",
          }}
        >
          <a
            href="https://github.com/SAI-RAHUL-ROKKAM/carbon_lens"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setBtn1Hover(true)}
            onMouseLeave={() => setBtn1Hover(false)}
            style={{
              border: `1px solid ${btn1Hover ? "#00E5A0" : "#E0E0E0"}`,
              color: btn1Hover ? "#00E5A0" : "#999",
              borderRadius: "100px",
              padding: "8px 20px",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              textDecoration: "none",
              transition: "all 200ms ease",
            }}
          >
            View on GitHub
          </a>
          <a
            href="#"
            onMouseEnter={() => setBtn2Hover(true)}
            onMouseLeave={() => setBtn2Hover(false)}
            style={{
              border: `1px solid ${btn2Hover ? "#00E5A0" : "#E0E0E0"}`,
              color: btn2Hover ? "#00E5A0" : "#999",
              borderRadius: "100px",
              padding: "8px 20px",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              textDecoration: "none",
              transition: "all 200ms ease",
            }}
          >
            Brainovision
          </a>
          <a
            href="https://www.linkedin.com/in/sai-rahul-rokkam-77b727387/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setBtn3Hover(true)}
            onMouseLeave={() => setBtn3Hover(false)}
            style={{
              border: `1px solid ${btn3Hover ? "#0077B5" : "#E0E0E0"}`,
              color: btn3Hover ? "#0077B5" : "#999",
              borderRadius: "100px",
              padding: "8px 20px",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              textDecoration: "none",
              transition: "all 200ms ease",
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
