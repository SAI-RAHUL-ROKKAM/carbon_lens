'use client';
import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Search any project',
    description:
      'Query the Verra VCS Registry in real-time. Find any carbon credit project by name, company, or country.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="22" cy="22" r="14" stroke="var(--accent-primary)" strokeWidth="2" />
        <path d="M32 32L42 42" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Satellite verification',
    description:
      'Compare satellite imagery across years. See deforestation, land-use changes, and project boundary violations.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="6" width="36" height="36" rx="4" stroke="var(--accent-data)" strokeWidth="2" />
        <path d="M6 24h36M24 6v36" stroke="var(--accent-data)" strokeWidth="1" opacity="0.5" />
        <circle cx="24" cy="24" r="8" stroke="var(--accent-data)" strokeWidth="2" />
        <circle cx="24" cy="24" r="2" fill="var(--accent-data)" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'AI integrity score',
    description:
      'Google Gemini analyzes additionality, permanence, leakage risk, and community impact to generate a trust score.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M12 36V28M20 36V20M28 36V24M36 36V16" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 28L20 20L28 24L36 16" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
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

  return (
    <section
      ref={sectionRef}
      className="noomo-section"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-void)',
        minHeight: '100vh',
        padding: '60px 80px',
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={columnsRef}
        style={{
          display: 'flex',
          gap: '64px',
          maxWidth: '1100px',
          padding: '0 60px',
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="how-column"
            style={{
              flex: 1,
              position: 'relative',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: `opacity 600ms ease-out ${index * 150}ms, transform 600ms ease-out ${index * 150}ms`,
            }}
          >
            {/* Ghost Number */}
            <div
              className="ghost-number"
              style={{
                position: 'absolute',
                top: '-40px',
                left: '-10px',
                fontFamily: 'var(--font-display)',
                fontSize: '180px',
                fontWeight: 700,
                color: 'rgba(0, 192, 127, 0.06)',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 0,
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(1.5)',
                transition: `opacity 600ms ease-out ${index * 150}ms, transform 600ms ease-out ${index * 150}ms`,
              }}
            >
              {step.number}
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ marginBottom: '24px' }}>{step.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
