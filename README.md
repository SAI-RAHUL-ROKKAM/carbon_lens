# CarbonLens

CarbonLens is an immersive web experience for exploring carbon credit projects, understanding their credibility, and spotting potential red flags. The app combines storytelling, interactive visualization, and AI-powered risk analysis to make complex climate-finance data easier to interpret.

## What it does

- Visualizes carbon projects on an interactive globe
- Enables project search via the Verra VCS Registry and instant project detail views
- Highlights suspicious or high-risk projects through a leaderboard
- Presents AI-estimated integrity scoring and red-flag indicators (powered by Google Gemini)
- Offers a cinematic, polished experience for exploring environmental data

## Tech stack

- Next.js 16
- React 19
- TypeScript
- GSAP for motion and transitions
- Three.js for the 3D globe
- Custom UI and animation system

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_key_here
   ```
   Without this key, the AI scoring endpoint will return a 503 error with estimated defaults.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser.

## Project structure

- app/ — app router pages and API routes
- components/ — reusable UI and section components
- data/ — leaderboard and project metadata
- lib/ — scoring, search, and export utilities
- hooks/ — custom React hooks
- types/ — shared TypeScript types

## Important notes

- **AI Scores are estimates**: Gemini returns scores based on project metadata only, not verified data. All scores are labeled "AI Estimate" in the UI.
- **Rate limiting**: The `/api/score` endpoint is rate-limited to 10 requests per minute per IP.
- **Satellite imagery**: Uses Esri Wayback tiles centered on country coordinates (not project boundaries). Coverage is limited to ~25 countries.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
