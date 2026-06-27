'use client';
import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { leaderboardProjects } from '@/data/leaderboard';
import { CarbonProject, SearchResult, LeaderboardProject } from '@/types';
import LeaderboardCard from '@/components/ui/LeaderboardCard';
import SearchBar from '@/components/ui/SearchBar';
import { getCountryCoordinates } from '@/lib/scoreUtils';

gsap.registerPlugin(ScrollTrigger);

const GlobeCanvas = dynamic(
  () => import('@/components/globe/GlobeCanvas'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="skeleton-pulse" style={{ width: 300, height: 300, borderRadius: '50%' }} />
      </div>
    ),
  }
);

const stats = [
  { value: '2,847', label: 'TOTAL PROJECTS MONITORED', color: 'var(--accent-primary)' },
  { value: '1.2B', label: 'CREDITS ISSUED (TONNES CO₂)', color: 'var(--accent-primary)' },
  { value: '312', label: 'FLAGGED HIGH RISK', color: 'var(--accent-warn)' },
  { value: '61/100', label: 'AVERAGE INTEGRITY SCORE', color: 'var(--accent-primary)' },
];

interface GlobeDashboardProps {
  onSelectProject: (project: CarbonProject) => void;
  dimmed?: boolean;
}

export default function GlobeDashboard({
  onSelectProject,
  dimmed = false,
}: GlobeDashboardProps) {
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lng: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  const handleSearchSelect = useCallback(
    (result: SearchResult) => {
      const coords =
        result.coordinates || getCountryCoordinates(result.country);
      setTargetCoords(coords);
      setTimeout(() => {
        onSelectProject({
          id: result.id,
          name: result.name,
          country: result.country,
          projectType: result.projectType,
          methodology: result.methodology,
          creditsIssued: result.creditsIssued,
          proponent: result.proponent,
          coordinates: coords,
        });
      }, 1200);
    },
    [onSelectProject]
  );

  const handleLeaderboardClick = useCallback(
    (project: LeaderboardProject) => {
      const coords =
        project.coordinates || getCountryCoordinates(project.country);
      setTargetCoords(coords);
      setTimeout(() => {
        onSelectProject(project);
      }, 1200);
    },
    [onSelectProject]
  );

  // GSAP entrance animations for stats and leaderboard
  useEffect(() => {
    if (!sectionRef.current) return;

    const scroller = sectionRef.current.closest('.scroll-wrapper') as HTMLElement | null;

    const ctx = gsap.context(() => {
      // Stats panel: stagger in from right
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems && statItems.length > 0) {
        gsap.set(statItems, { opacity: 0, x: 40 });
        gsap.to(statItems, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            ...(scroller ? { scroller } : {}),
          },
        });
      }

      // Leaderboard panel: stagger in from left
      const leaderboardItems = leaderboardRef.current?.querySelectorAll('.leaderboard-item');
      if (leaderboardItems && leaderboardItems.length > 0) {
        gsap.set(leaderboardItems, { opacity: 0, x: -30 });
        gsap.to(leaderboardItems, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            ...(scroller ? { scroller } : {}),
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="gsap-section noomo-section"
      style={{
        display: 'flex',
        height: '100vh',
        opacity: dimmed ? 0.2 : 1,
        transition: 'opacity 300ms var(--ease-primary)',
        position: 'relative',
        background: 'var(--bg-void)',
      }}
    >
      {/* LEFT: Leaderboard */}
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 16px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          MOST SUSPICIOUS PROJECTS
        </div>
        <div ref={leaderboardRef} style={{ flex: 1, overflowY: 'auto' }}>
          {leaderboardProjects.map((project) => (
            <div key={project.id} className="leaderboard-item">
              <LeaderboardCard
                project={project}
                onClick={handleLeaderboardClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: Globe + Search */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            zIndex: 10,
          }}
        >
          <SearchBar onSelectProject={handleSearchSelect} />
        </div>

        {/* Globe */}
        <div
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Suspense
            fallback={
              <div className="skeleton-pulse" style={{ width: 300, height: 300, borderRadius: '50%' }} />
            }
          >
            <GlobeCanvas targetCoords={targetCoords} />
          </Suspense>
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          40 active projects monitored · Verra VCS Registry
        </div>
      </div>

      {/* RIGHT: Stats */}
      <div
        ref={statsRef}
        style={{
          width: '280px',
          flexShrink: 0,
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0',
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="stat-item"
            style={{
              padding: '28px 24px',
              borderBottom:
                index < stats.length - 1
                  ? '1px solid var(--border-subtle)'
                  : 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                color: stat.color,
                marginBottom: '6px',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
