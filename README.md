# CarbonLens

CarbonLens is an immersive web experience for exploring carbon credit projects, understanding their credibility, and spotting potential red flags. The app combines storytelling, interactive visualization, and risk analysis to make complex climate-finance data easier to interpret.

## What it does

- Visualizes carbon projects on an interactive globe
- Enables project search and instant project detail views
- Highlights suspicious or high-risk projects through a leaderboard
- Presents integrity scoring and red-flag indicators
- Offers a cinematic, polished experience for exploring environmental data

## Tech stack

- Next.js
- React
- TypeScript
- GSAP for motion and transitions
- Custom UI and animation system
- Python-based supporting workflows for scoring and search

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser.

## Project structure

- app/ — app router pages and API routes
- components/ — reusable UI and section components
- data/ — leaderboard and project metadata
- lib/ — scoring, search, and export utilities
- types/ — shared TypeScript types

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
