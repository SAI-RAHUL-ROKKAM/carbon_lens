'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CarbonProject } from '@/types';
import { leaderboardProjects } from '@/data/leaderboard';
import LoadingIntro from '@/components/LoadingIntro';
import HeroQuote from '@/components/sections/HeroQuote';
import GlobeDashboard from '@/components/sections/GlobeDashboard';
import HowItWorks from '@/components/sections/HowItWorks';
import AboutMission from '@/components/sections/AboutMission';
import CaseStudy from '@/components/sections/CaseStudy';
import TeamSection from '@/components/sections/TeamSection';
import Footer from '@/components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

const ProjectDetail = dynamic(
  () => import('@/components/project-detail/ProjectDetail'),
  { ssr: false }
);

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showHero, setShowHero] = useState(true);
  const [selectedProject, setSelectedProject] = useState<CarbonProject | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // ── Noomo-style hero exit with clip-path overlay transition ──
  const isTransitioning = useRef(false);
  const handleExplore = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const overlay = overlayRef.current;
    const overlayText = overlayTextRef.current;
    if (!overlay || !overlayText) {
      setShowHero(false);
      return;
    }

    const tl = gsap.timeline();

    // 1. Reveal overlay from bottom to top (curtain up)
    tl.to(overlay, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 0.6,
      ease: 'power4.inOut',
    });

    // 2. Show transition text briefly
    tl.to(overlayText, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.1');

    // 3. Hold for a beat
    tl.to({}, { duration: 0.4 });

    // 4. Switch state (hero -> globe)
    tl.call(() => setShowHero(false));

    // 5. Small delay for DOM update
    tl.to({}, { duration: 0.1 });

    // 6. Fade out text
    tl.to(overlayText, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    });

    // 7. Clip overlay away (curtain down - reveal new content)
    tl.to(overlay, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: 0.6,
      ease: 'power4.inOut',
    });

    // 8. Reset overlay clip for future use
    tl.set(overlay, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
    });

    tl.call(() => { isTransitioning.current = false; });
  }, []);

  // ── Scroll down on hero triggers the transition ──
  useEffect(() => {
    if (!showHero || showIntro) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        handleExplore();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [showHero, showIntro, handleExplore]);

  // ── Scroll up at top of globe → return to hero ──
  const handleReturnToHero = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const overlay = overlayRef.current;
    const overlayText = overlayTextRef.current;
    if (!overlay || !overlayText) {
      setShowHero(true);
      isTransitioning.current = false;
      return;
    }

    const tl = gsap.timeline();

    // 1. Curtain up
    tl.to(overlay, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 0.6,
      ease: 'power4.inOut',
    });

    // 2. Flash transition text
    tl.to(overlayText, { opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.1');

    // 3. Hold
    tl.to({}, { duration: 0.3 });

    // 4. Switch back to hero
    tl.call(() => setShowHero(true));

    // 5. Small delay for DOM
    tl.to({}, { duration: 0.1 });

    // 6. Fade out text
    tl.to(overlayText, { opacity: 0, duration: 0.2, ease: 'power2.in' });

    // 7. Curtain down — reveal hero
    tl.to(overlay, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: 0.6,
      ease: 'power4.inOut',
    });

    // 8. Reset
    tl.set(overlay, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
    });

    tl.call(() => { isTransitioning.current = false; });
  }, []);

  const handleSelectProject = useCallback((project: CarbonProject) => {
    setSelectedProject(project);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false);
    setTimeout(() => setSelectedProject(null), 400);
  }, []);

  const handleViewKariba = useCallback(() => {
    const kariba = leaderboardProjects.find((p) => p.id === 'vcs-902');
    if (kariba) {
      setSelectedProject(kariba);
      setDetailOpen(true);
    }
  }, []);

  // ── GSAP Smooth Scroll + Parallax Camera System ──
  useEffect(() => {
    if (showIntro || showHero) return;

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    // Measure the scrollable height
    const getScrollHeight = () => content.scrollHeight - window.innerHeight;

    // Smooth scroll state
    let currentScroll = 0;
    let targetScroll = 0;
    let rafId: number;
    const LERP = 0.08; // smoothness factor (lower = smoother/slower)

    // Handle wheel events for smooth scroll
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Scroll up at very top → return to hero
      if (e.deltaY < 0 && targetScroll <= 0) {
        handleReturnToHero();
        return;
      }

      targetScroll += e.deltaY;
      targetScroll = Math.max(0, Math.min(targetScroll, getScrollHeight()));
    };

    // Animation loop — interpolate toward target
    const update = () => {
      currentScroll += (targetScroll - currentScroll) * LERP;

      // Tiny threshold to avoid infinite micro-updates
      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
      }

      // Apply transform (GPU-accelerated)
      content.style.transform = `translate3d(0, ${-currentScroll}px, 0)`;

      // Update ScrollTrigger proxy
      ScrollTrigger.update();

      rafId = requestAnimationFrame(update);
    };

    // Set up ScrollTrigger with a proxy scroller
    ScrollTrigger.scrollerProxy(wrapper, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          targetScroll = value;
          currentScroll = value;
        }
        return currentScroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: 'transform',
    });

    wrapper.addEventListener('wheel', onWheel, { passive: false });
    rafId = requestAnimationFrame(update);

    // ── Section reveal animations with 3D camera feel ──
    const sections = content.querySelectorAll('.noomo-section');
    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        if (index === 0) {
          // First section (Globe) — no entrance animation, it's already visible
          gsap.set(section, { opacity: 1, y: 0 });
          return;
        }

        // Set initial state: pushed back in Z-space and faded
        gsap.set(section, {
          opacity: 0,
          y: 60,
          rotateX: 3,
          transformOrigin: 'center top',
          transformPerspective: 1200,
        });

        // Scroll-triggered 3D camera reveal
        gsap.to(section, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            scroller: wrapper,
            start: 'top 90%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        });

        // Parallax effect on section children with .parallax-slow class
        const slowElements = section.querySelectorAll('.parallax-slow');
        slowElements.forEach((el) => {
          gsap.to(el, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              scroller: wrapper,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        });
      });

      // Staggered reveals for child elements
      const staggerGroups = content.querySelectorAll('[data-stagger-parent]');
      staggerGroups.forEach((parent) => {
        const children = parent.querySelectorAll('[data-stagger-child]');
        if (children.length === 0) return;

        gsap.set(children, { opacity: 0, y: 40 });
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: parent,
            scroller: wrapper,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    });

    // Refresh after DOM settles
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);

    // Handle resize
    const onResize = () => {
      targetScroll = Math.min(targetScroll, getScrollHeight());
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(refreshTimer);
      cancelAnimationFrame(rafId);
      wrapper.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [showIntro, showHero]);

  return (
    <>
      {showIntro && <LoadingIntro onComplete={handleIntroComplete} />}

      {/* Noomo transition overlay */}
      <div ref={overlayRef} className="transition-overlay">
        <div ref={overlayTextRef} className="transition-text">
          CarbonLens
        </div>
      </div>

      {/* Main scroll wrapper */}
      <div
        ref={wrapperRef}
        className="scroll-wrapper"
        style={{
          opacity: showIntro ? 0 : 1,
          transition: 'opacity 500ms var(--ease-primary)',
        }}
      >
        <div ref={contentRef} className="scroll-content">
          {/* Section 1: Hero */}
          {showHero && (
            <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
              <HeroQuote onExplore={handleExplore} />
            </div>
          )}

          {/* Section 2: Globe Dashboard */}
          <div className="noomo-section" style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <GlobeDashboard
              onSelectProject={handleSelectProject}
              dimmed={detailOpen}
            />
          </div>

          {/* Section 3: About Mission */}
          <div className="noomo-section" style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <AboutMission />
          </div>

          {/* Section 4: How It Works */}
          <div className="noomo-section" style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <HowItWorks />
          </div>

          {/* Section 5: Case Study */}
          <div className="noomo-section" style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <CaseStudy onViewKariba={handleViewKariba} />
          </div>

          {/* Section 6: Team */}
          <div className="noomo-section" style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <TeamSection />
          </div>

          {/* Section 7: Footer */}
          <div className="noomo-section" style={{ overflow: 'hidden' }}>
            <Footer />
          </div>
        </div>
      </div>

      {/* Project Detail Overlay */}
      <ProjectDetail
        project={selectedProject}
        isOpen={detailOpen}
        onClose={handleCloseDetail}
      />
    </>
  );
}
