# Carbon Credit Integrity Monitor — Antigravity Master Prompt
> Paste each Phase prompt into Antigravity one at a time. Wait for completion before moving to the next phase.

---

## PHASE 1 — Project Setup & Visual Foundation

```
Build a desktop-only single-page web application called "CarbonLens" using Next.js 14 with App Router and Tailwind CSS.

DESIGN SYSTEM — implement these exact values as CSS variables:

Colors:
  --bg-void: #080B0F (near-black base, entire page background)
  --bg-surface: #0F1419 (card and panel backgrounds)
  --bg-elevated: #161D26 (hover states, elevated elements)
  --accent-primary: #00E5A0 (bright mint-green — the signature color for scores, active states)
  --accent-warn: #FF6B35 (orange — red flags and warnings)
  --accent-data: #4D9EFF (electric blue — satellite data, stats)
  --text-primary: #F0F4F8
  --text-secondary: #8896A5
  --text-muted: #4A5568
  --border-subtle: rgba(255,255,255,0.06)

Typography:
  Display headings: "Space Grotesk" (Google Font) — weights 500, 700
  Body/UI text: "Inter" (Google Font) — weights 400, 500
  Data/mono values: "JetBrains Mono" (Google Font) — weight 400

Import all three from Google Fonts in the layout file.

Global rules:
  - Background: var(--bg-void) on html and body
  - No scrollbar visible (overflow hidden on html, custom scrollbar hidden)
  - Desktop only — set min-width: 1280px on body, no responsive breakpoints needed
  - Smooth scroll behavior
  - All transitions use: cubic-bezier(0.4, 0, 0.2, 1)

Create the base layout shell with a single full-viewport container. 
No content yet — just the design system, fonts, and global CSS.
Confirm with a screenshot of the dark blank page.
```

---

## PHASE 2 — Section 1: Hero Quote Slide

```
Add the first full-viewport section to CarbonLens. This is the opening hero — the user sees this first.

CONTENT:
  Large display quote centered on screen:
  "The voluntary carbon market is a $2 billion industry built largely on trust.
  We built it on evidence."
  — CarbonLens

Below the quote, a single CTA button: "Explore Projects →"

LAYOUT:
  - Full viewport height (100vh)
  - Quote text: Space Grotesk, 52px, weight 700, color #F0F4F8, max-width 800px, centered
  - The word "evidence" should be colored var(--accent-primary) — #00E5A0
  - Attribution line: Inter, 14px, color var(--text-muted), margin-top 24px
  - CTA button: outlined style, border 1px solid var(--accent-primary), color var(--accent-primary),
    padding 14px 36px, border-radius 2px, Space Grotesk 500, letter-spacing 0.08em, uppercase
  - On hover: button background fills to var(--accent-primary), text turns #080B0F, transition 0.2s

TRANSITION ON CTA CLICK:
  When "Explore Projects →" is clicked, the entire hero section performs this exit:
  - The quote text fades out and slides UP by 20px over 400ms
  - Simultaneously, a thin horizontal line (1px, accent-primary color) sweeps LEFT TO RIGHT across 
    the full width of the screen over 300ms (like a scanner line)
  - After the sweep completes, the next section (the Globe Dashboard) fades in from opacity 0 to 1 
    over 500ms
  Implement this using CSS keyframes + JS classList toggling. No external animation libraries.

BACKGROUND:
  Subtle animated gradient — two radial gradients, one top-left (accent-primary at 3% opacity),
  one bottom-right (accent-data at 3% opacity), both slowly drifting using a CSS keyframe animation
  with a 20s infinite loop. This creates a barely-visible breathing effect on the dark background.
```

---

## PHASE 3 — Section 2: Globe Dashboard (Main Hero)

```
Add the second full-viewport section to CarbonLens. This is the main dashboard — it appears after 
the hero transition.

This section has THREE columns in a fixed layout:

LEFT COLUMN (280px wide, fixed):
  A "Leaderboard" panel titled "MOST SUSPICIOUS PROJECTS"
  Show 5 placeholder project cards, each with:
  - Project name (Space Grotesk, 14px, weight 600)
  - Country + project type (Inter, 12px, text-secondary)
  - An integrity score badge on the right — colored based on score:
    * Score 0-39: var(--accent-warn) background
    * Score 40-69: #F5A623 background (amber)
    * Score 70-100: var(--accent-primary) background
    * Text: always #080B0F, font JetBrains Mono, 13px
  Panel background: var(--bg-surface), border-right: 1px solid var(--border-subtle)
  Cards hover: background shifts to var(--bg-elevated), transition 0.15s
  Panel title: Inter, 10px, weight 500, letter-spacing 0.12em, color var(--text-muted), uppercase

CENTER COLUMN (flex-grow, remaining width):
  A 3D interactive globe using Three.js.
  - Import Three.js from CDN in a script tag inside the component
  - Globe: a sphere geometry, radius 200, with a dark ocean texture (#0F1419 base color)
  - Land masses: render as slightly lighter (#161D26) using a basic sphere with wireframe overlay
    at 8% opacity (var(--accent-data) color)
  - Scattered dots on the globe surface: 40 random dots representing carbon projects
    * Each dot: a small sphere, radius 3, color var(--accent-primary)
    * On hover over a dot: it pulses (scale 1 → 1.5 → 1, 400ms) and shows a tooltip with a 
      placeholder project name
  - Globe auto-rotates slowly on Y axis (0.001 radians per frame)
  - User can click and drag to rotate the globe manually (OrbitControls or manual mouse events)
  - Globe is centered in this column, vertically centered
  - Canvas background: transparent (globe floats on --bg-void)

  Below the globe, in small Inter 11px text-muted: "40 active projects monitored · Verra VCS Registry"

RIGHT COLUMN (280px wide, fixed):
  A "Live Stats" panel with 4 stat blocks stacked vertically:
  1. Total Projects Monitored: 2,847
  2. Credits Issued (tonnes CO₂): 1.2B
  3. Flagged High Risk: 312
  4. Average Integrity Score: 61/100

  Each stat block:
  - Value: Space Grotesk, 32px, weight 700, color var(--accent-primary) for positive stats,
    var(--accent-warn) for "Flagged High Risk"
  - Label: Inter, 11px, letter-spacing 0.1em, uppercase, color var(--text-muted)
  - Separated by a 1px border-subtle divider
  Panel background: var(--bg-surface), border-left: 1px solid var(--border-subtle)

FLOATING SEARCH BAR (overlaid on the globe section):
  Position: absolute, top 32px, horizontally centered on the center column
  Width: 480px
  Input field: 
  - Background: rgba(15, 20, 25, 0.85), backdrop-filter: blur(12px)
  - Border: 1px solid var(--border-subtle)
  - On focus: border color transitions to var(--accent-primary), 0.2s
  - Placeholder: "Search project name or company..." in text-muted color
  - Font: Inter, 14px
  - Padding: 14px 20px 14px 44px (room for search icon on left)
  - Border-radius: 4px
  - A search icon (SVG magnifier) sits inside on the left, color text-muted
  Search results dropdown (appears below input when typing):
  - Same glass background style
  - Each result row: project name (text-primary, 13px) + country tag (text-muted, 11px) + score badge
  - On click: triggers the Project Detail expansion (Phase 5)
  - On hover: background var(--bg-elevated)
```

---

## PHASE 4 — Search Functionality (Verra API Integration)

```
Wire up the search bar in CarbonLens to real data.

DATA SOURCE: Verra VCS Registry public search endpoint.
  Use this URL pattern for search: https://registry.verra.org/app/search/vcs/projects
  This returns JSON with project records. Parse the response and display in the dropdown.

SEARCH LOGIC:
  - Trigger search on input after 300ms debounce (don't fire on every keystroke)
  - Search both: project name AND company/proponent name
  - Show max 6 results in the dropdown
  - Each result displays: project name, country, project type, credits issued, and integrity score 
    (placeholder 0 for now — Phase 5 fills this in with AI)
  - If no results: show "No projects found — try a different name or country"
  - Loading state: show a subtle pulsing animation on the search icon while fetching

ERROR HANDLING:
  - If the API fails: show "Registry temporarily unavailable" in the dropdown
  - Never show a blank dropdown — always show a state

KEYBOARD NAVIGATION:
  - Arrow keys navigate the dropdown results
  - Enter selects the highlighted result
  - Escape closes the dropdown

TRANSITION ON RESULT CLICK:
  When a user clicks a result, the dropdown closes with a fade-out (150ms),
  then the globe smoothly rotates to center on that project's country coordinates over 1200ms
  using a smooth easing function (ease-in-out cubic). 
  After rotation completes, trigger the Project Detail expansion (Phase 5).
```

---

## PHASE 5 — Project Detail View (In-Place Card Expansion)

```
Add the project detail experience to CarbonLens. This is triggered when a user clicks any 
project from the search dropdown or from the leaderboard.

THE EXPANSION EFFECT:
  - The entire globe dashboard section does NOT navigate away
  - Instead: the globe + leaderboard + stats all fade to 20% opacity over 300ms
  - A detail panel expands from the center of the screen, growing from a small card size (400x200px) 
    to full viewport coverage over 400ms using CSS transform: scale() and opacity
  - Use cubic-bezier(0.4, 0, 0.2, 1) easing
  - A close button (×) appears top-right of the panel
  - Clicking × reverses the animation: panel contracts back to center, globe fades back to full opacity

DETAIL PANEL LAYOUT (full screen overlay, background var(--bg-surface)):
  The panel has a LEFT HALF and RIGHT HALF split:

  LEFT HALF — Satellite Evidence Panel:
    Title: "SATELLITE EVIDENCE" in 10px uppercase Inter, text-muted
    
    The Comparison Slider:
    - Show a map/satellite image of the project's geographic coordinates
    - Use Google Maps Static API with satellite type for the images
    - Two images: labeled "2019" and "2024"
    - A vertical slider handle divides the two images
    - LEFT of handle: 2019 image; RIGHT of handle: 2024 image
    - The boundary is a RAZOR-SHARP pixel-perfect clipping mask — no crossfade, no blur
    - The split line: 2px solid white, with a circular drag handle (32px diameter, white, with 
      left-right arrows SVG icon inside)
    - Drag easing: when user releases the handle, add a tiny deceleration (momentum effect) 
      using velocity tracking on mousemove, decaying over 200ms
    - Below the slider: show coordinates, country, and area in hectares in JetBrains Mono 12px

  RIGHT HALF — Three stacked panels:

    PANEL A — AI Integrity Score (top third):
      Title: "INTEGRITY ANALYSIS" in 10px uppercase
      Four score rows, appearing with staggered fade-in animation:
        Row 1: Additionality — score bar + number (delay: 0ms)
        Row 2: Permanence Risk — score bar + number (delay: 50ms)  
        Row 3: Leakage Risk — score bar + number (delay: 100ms)
        Row 4: Community Impact — score bar + number (delay: 150ms)
      Each row:
        - Label: Inter 12px text-secondary
        - Score bar: full width, height 4px, background border-subtle
          Filled portion animates from 0% to actual score width using ease-out over 600ms
          Color: accent-primary if score > 60, amber #F5A623 if 40-60, accent-warn if < 40
        - Score number: JetBrains Mono 13px, right-aligned, same color as bar
      Overall score: large donut chart in center (using pure CSS/SVG, no chart library)
        - Circumference animates filling from 0 to score value over 800ms ease-out
        - Score number inside: Space Grotesk 36px weight 700

    PANEL B — Red Flag Alerts (middle third):
      Title: "RED FLAGS DETECTED" in 10px uppercase, color accent-warn
      Alert cards cascade in with a slide-from-bottom + fade, 80ms between each card,
      starting 200ms after Panel A begins loading
      Each alert card:
        - Left: a flag icon (SVG) that does a ONE-TIME scale pulse (100% → 110% → 100%, 300ms) 
          exactly as it enters the screen
        - Alert text: Inter 13px text-primary
        - Severity tag: "HIGH" / "MEDIUM" in 10px JetBrains Mono with matching color background
      Slide-in speed: 250ms (faster than the score stagger to convey urgency)

    PANEL C — Export Report (bottom strip):
      A single "Export Report" button — full width, outlined in accent-primary
      ON CLICK interaction:
        Step 1: Button text "Export Report" fades out (150ms)
        Step 2: A spinning circle loader appears inside the button (CSS animation, no library)
        Step 3: After 1.5s, loader morphs into a checkmark SVG (scale from 0 to 1, 200ms)
        Step 4: A notification bar slides in from the bottom of the screen:
          "Report downloaded successfully" — Inter 13px, background var(--bg-elevated), 
          padding 12px 24px, border-top 1px solid var(--border-subtle)
          Auto-dismisses after 3s with a fade-out
      The actual download: generate a simple text-based PDF summary using jsPDF (import from CDN)
```

---

## PHASE 6 — Gemini AI Scoring Integration

```
Integrate Google Gemini API into CarbonLens to generate real integrity scores for carbon projects.

SETUP:
  Create a Next.js API route at /api/score (server-side, so the API key is never exposed in 
  the browser).
  API key: read from environment variable GEMINI_API_KEY
  Model: gemini-1.5-flash (fast, cost-efficient for this use case)

WHAT THE API ROUTE DOES:
  Receives: project name, project type, country, methodology name, credits issued count
  Builds a prompt and sends it to Gemini
  Returns: a JSON object with scores and analysis

EXACT PROMPT TO SEND TO GEMINI:
---
You are an expert carbon credit auditor. Analyze this carbon offset project and return ONLY a 
valid JSON object with no additional text, markdown, or explanation.

Project details:
Name: {projectName}
Type: {projectType}  
Country: {country}
Methodology: {methodology}
Credits Issued: {creditsIssued} tonnes CO₂

Return this exact JSON structure:
{
  "overallScore": <integer 0-100>,
  "additionality": <integer 0-100>,
  "permanence": <integer 0-100>,
  "leakage": <integer 0-100>,
  "communityImpact": <integer 0-100>,
  "redFlags": [
    {"text": "<flag description>", "severity": "HIGH" | "MEDIUM"},
    ...max 3 flags
  ],
  "summary": "<2-sentence plain English summary of main concerns>"
}

Base your scores on known patterns: high credit volumes relative to project size suggest 
over-crediting, REDD+ projects in countries with weak governance score lower on permanence, 
renewable energy projects in markets with growing grids score lower on additionality.
---

INTEGRATION IN THE FRONTEND:
  - Call /api/score when the Project Detail panel opens (Phase 5)
  - While waiting: show skeleton loading states for all score bars (pulsing grey bars)
  - When response arrives: animate the scores filling in (as described in Phase 5)
  - If API fails: show "AI analysis unavailable — showing registry data only" in a subtle banner
  - Cache results in React state so re-opening the same project doesn't re-call the API

ERROR HANDLING:
  - Parse Gemini's JSON response safely — wrap in try/catch
  - Validate all fields exist before rendering
  - Fallback to neutral scores (50) if parsing fails
```

---

## PHASE 7 — Remaining Sections & Scroll Experience

```
Add the remaining sections to CarbonLens below the Globe Dashboard. These sections are reached 
by scrolling down after exploring the globe.

SCROLL BEHAVIOR:
  Use CSS scroll-snap with scroll-snap-type: y mandatory on the main container
  Each section: scroll-snap-align: start, height: 100vh
  This creates a clean snap-to-section scroll without heavy scroll-jacking libraries
  Transition feel: inspired by brewdistrict24.com — sections feel like they "arrive" with weight

SECTION 3 — How It Works:
  Three columns, each explaining one step of CarbonLens:
  Step 1: "Search any project" — icon + 2-line description
  Step 2: "Satellite verification" — icon + 2-line description  
  Step 3: "AI integrity score" — icon + 2-line description
  
  Animation: as this section scrolls into view (IntersectionObserver), each column slides up 
  from 30px below with a fade-in. Stagger: 120ms between columns.
  
  Visual: each step has a large background number (01, 02, 03) in Space Grotesk 180px weight 700, 
  color: rgba(0, 229, 160, 0.04) — barely visible, purely decorative
  This is the "one aesthetic risk" — oversized ghost numbers as structural background elements

SECTION 4 — Case Study: The Kariba Scandal:
  Full-width section with a two-column layout:
  Left: Text content
    - Eyebrow: "CASE STUDY" in 10px uppercase accent-warn
    - Headline: "How CarbonLens would have caught the Kariba fraud" in Space Grotesk 40px
    - 3 bullet points explaining what went wrong (Kariba REDD+, Zimbabwe, South Pole)
    - A "View Kariba Project →" link that opens the project detail panel (Phase 5) for Kariba
  Right: A static preview of the Kariba project's satellite slider and score breakdown
    (use placeholder/screenshot style — static image of what the analysis would show)
  
  Background: slightly lighter than void — var(--bg-surface)
  Left border: 3px solid var(--accent-warn)

SECTION 5 — Footer:
  Minimal, single row:
  Left: "CarbonLens" wordmark in Space Grotesk 18px weight 700, accent-primary
  Center: "Data from Verra VCS Registry · Satellite via Google Earth · AI by Gemini"
    Inter 12px text-muted
  Right: "Built by Rahul · Brainovision Internship 2025"
    Inter 12px text-muted
  Top border: 1px solid var(--border-subtle)
  Height: 64px

FINAL POLISH — apply to the entire app:
  1. All interactive elements (buttons, cards, links) have cursor: pointer
  2. Focus states: outline 2px solid var(--accent-primary), offset 2px — for accessibility
  3. Text selection color: accent-primary background, dark text
  4. Page title in browser tab: "CarbonLens — Carbon Credit Integrity Monitor"
  5. Favicon: a simple green circle SVG (generate inline in the HTML head)
```

---

## PHASE 8 — Final Review & Demo Polish

```
Do a complete review pass on CarbonLens and fix any issues. Then apply these final demo-specific 
polish items:

1. DEMO DATA: Pre-populate the leaderboard with these 5 real suspicious projects 
   (use real Verra project names, assign fabricated but plausible integrity scores):
   - Kariba REDD+, Zimbabwe — score 23
   - Alto Mayo REDD+, Peru — score 31  
   - Rimba Raya Biodiversity, Indonesia — score 44
   - Cordillera Azul, Peru — score 38
   - Chyulu Hills REDD+, Kenya — score 52

2. LOADING SEQUENCE: When the app first loads, show a brief 1.5s intro sequence:
   - Black screen
   - The text "CarbonLens" types itself out character by character (JetBrains Mono, 24px, 
     accent-primary) in 800ms
   - Then fades out, revealing the Hero Quote section

3. GLOBE DOTS: Update the 40 random dots to be clustered in realistic regions — 
   higher density in: Brazil, Central Africa, Southeast Asia, Central America 
   (these are where most forest carbon projects exist)

4. PERFORMANCE: 
   - Lazy load the Three.js globe (dynamic import)
   - Lazy load the satellite images in the slider
   - Add loading="lazy" to any img tags

5. Take a final screenshot and confirm:
   - Hero quote section renders correctly
   - Globe section with search bar, leaderboard, stats all visible
   - Search dropdown works
   - Project detail expansion animation works
   - Score panels animate in correctly
   - Red flag alerts pulse correctly
   - PDF export button interaction works
   - All 5 sections scroll-snap correctly
   - No console errors
```

---

## ENVIRONMENT VARIABLES NEEDED

Create a `.env.local` file with:
```
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key_here
```

For the Google Maps Static API (satellite images), enable it in Google Cloud Console under 
your Gemini Pro account — it has a free tier sufficient for demo purposes.

---

## QUICK REFERENCE — Design Tokens

| Token | Value | Used For |
|---|---|---|
| `--bg-void` | `#080B0F` | Page background |
| `--bg-surface` | `#0F1419` | Cards, panels |
| `--bg-elevated` | `#161D26` | Hover states |
| `--accent-primary` | `#00E5A0` | Scores, CTAs, brand |
| `--accent-warn` | `#FF6B35` | Red flags, alerts |
| `--accent-data` | `#4D9EFF` | Stats, satellite data |
| `--text-primary` | `#F0F4F8` | Body text |
| `--text-secondary` | `#8896A5` | Supporting text |
| `--text-muted` | `#4A5568` | Labels, metadata |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Dividers, borders |

---

*CarbonLens — Built with Google Antigravity · Internship Project 2025*
