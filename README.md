# Live Score App

A modern, real-time sports score tracking application built with Next.js 15, React, TypeScript, and Tailwind CSS. Features live scores, match schedules, and league standings for football.

## Features

- **Live Scores**: Real-time match scores and updates
- **Match Views**:
  - Upcoming matches for the next 7 days
  - Recent results from the last 3 days
- **League Standings**: View league tables for popular competitions
  - Premier League, La Liga, Bundesliga, Serie A, Ligue 1
  - Champions League, Europa League, Conference League
  - Bulgarian Efbet League
- **Team Details**: Click any team to see full statistics, fixtures, and standings
- **Match Details**: Click matches to see comprehensive match information
- **Smart Caching**: Reduces API calls with 5-minute local caching
- **Auto-refresh**: Data automatically updates every 5 minutes
- **Dark Theme**: Modern, eye-friendly dark UI
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: API-Football v3 (https://www.api-football.com/) - Free tier available

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- API-Football API key (free tier available)

### Installation

1. Navigate to the project directory:
```bash
cd livescore-app
```

2. Install dependencies:
```bash
npm install
```

3. **Get your API-Football API Key** (FREE):
   - Go to https://dashboard.api-football.com/register
   - Sign up for a free account (no credit card required)
   - Copy your API key from the dashboard
   - Free tier includes: 100 requests/day with all endpoints

4. **Set up environment variables**:
   - Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   - Edit `.env.local` and add your API key:
   ```
   NEXT_PUBLIC_API_FOOTBALL_KEY=your_api_key_here
   ```

5. Run the development server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
livescore-app/
├── app/
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── MatchCard.tsx      # Match display card
│   ├── SportSelector.tsx  # Sport selection buttons
│   ├── StandingsTable.tsx # League standings table
│   └── Loading.tsx        # Loading spinner
├── lib/
│   └── api.ts            # API integration layer
├── types/
│   └── sports.ts         # TypeScript interfaces
└── README.md
```

## API Information

This app uses **API-Football v3** for comprehensive football data.

**Features:**
- Real-time live scores
- 15-second update frequency for live matches
- Comprehensive statistics and detailed match information
- Team lineups, events, and player statistics
- 100 requests/day on free tier
- All major leagues and tournaments including Champions League

**API Base URL:**
```
https://v3.football.api-sports.io
```

**Authentication:**
Uses `x-apisports-key` header with your API key

**Supported Leagues:**
- English Premier League (ID: 39)
- Spanish La Liga (ID: 140)
- German Bundesliga (ID: 78)
- Italian Serie A (ID: 135)
- French Ligue 1 (ID: 61)
- UEFA Champions League (ID: 2)
- UEFA Europa League (ID: 3)
- UEFA Conference League (ID: 848)
- Bulgarian First League (ID: 172)

## Usage

### Viewing Matches

1. Select "Matches" tab
2. Choose a sport from the sport selector
3. Toggle between "Upcoming Matches" and "Recent Results"
4. View match details including team names, scores, dates, and leagues

### Viewing Standings

1. Select "Standings" tab
2. Choose a league from the available options
3. View complete league table with positions, points, and statistics

### Manual Refresh

Click "Refresh Now" to manually update data at any time.

## Customization

### Adding More Leagues

Edit `app/page.tsx` and add league IDs to the `POPULAR_LEAGUES` object:

```typescript
const POPULAR_LEAGUES = {
  'Your League': 'league_id',
};
```

Find league IDs at: https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?s=Soccer

### Changing Auto-Refresh Rate

Modify the interval in `app/page.tsx` (currently 60000ms = 60 seconds):

```typescript
const interval = setInterval(() => {
  // ...
}, 60000); // Change this value
```

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variable:
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_FOOTBALL_KEY` = your API key
4. Deploy with one click

**Important**: Make sure to add your API-Football key to Vercel's environment variables before deploying!

## Future Enhancements

- [ ] User favorites and team tracking
- [ ] Live match commentary
- [ ] Push notifications
- [ ] Match statistics and player info
- [ ] Historical data and trends
- [ ] Multi-language support

## License

Open source for educational and personal use.

## Acknowledgments

- Sports data provided by [API-Football](https://www.api-football.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This app uses API-Football's free tier (100 requests/day). For production use with high traffic or more than 100 requests per day, consider upgrading to a paid plan at https://www.api-football.com/pricing
