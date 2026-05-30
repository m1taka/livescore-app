# Live Score App

A modern, real-time sports score tracking application built with Next.js 15, React, TypeScript, and Tailwind CSS. Features live scores, match schedules, and league standings for multiple sports.

## Features

- **Live Scores**: Real-time match scores and updates
- **Multiple Sports**: Football (Soccer), Basketball, Tennis, Baseball, Hockey, and American Football
- **Match Views**:
  - Upcoming matches for the next 7-15 days
  - Recent results from the last 7 days
- **League Standings**: View league tables for popular competitions
  - Premier League, La Liga, Bundesliga, Serie A, Ligue 1
  - NBA, NFL, and more
- **Auto-refresh**: Data automatically updates every 60 seconds
- **Dark Theme**: Modern, eye-friendly dark UI
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: TheSportsDB API (https://www.thesportsdb.com/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed

### Installation

1. Navigate to the project directory:
```bash
cd livescore-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
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

### Current API: TheSportsDB

This app currently uses **TheSportsDB API**, a free public sports API.

**Features:**
- Free tier available (no API key required)
- 30+ sports supported
- Match data, team info, league standings
- 30 requests per minute limit

**API Base URL:**
```
https://www.thesportsdb.com/api/v1/json/3
```

### Alternative: API-Football

For more comprehensive football data, consider **API-Football** (https://www.api-football.com/):

**Features:**
- More detailed live scores and statistics
- Real-time updates
- Comprehensive player and team data
- Better coverage of leagues worldwide

**To Switch to API-Football:**

1. Get an API key from https://www.api-football.com/
2. Update `lib/api.ts` with the new API base URL and endpoints
3. Add your API key to environment variables:

```env
NEXT_PUBLIC_FOOTBALL_API_KEY=your_api_key_here
```

4. Modify API calls to include authentication headers:

```typescript
const response = await fetch(url, {
  headers: {
    'x-rapidapi-key': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY,
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
});
```

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
3. Deploy with one click
4. If using API-Football, add your API key in Vercel environment variables

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

- Sports data provided by [TheSportsDB](https://www.thesportsdb.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This app uses a free public API. For production use with high traffic, consider upgrading to a paid tier or using API-Football for more comprehensive data.
