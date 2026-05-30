// API-Football v3 Integration
// Documentation: https://www.api-football.com/documentation-v3

import { cache } from './cache';

const API_BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY || '';

// Helper to make API requests with authentication
const apiRequest = async (endpoint: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'x-apisports-key': API_KEY,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response; // API-Football wraps responses in a "response" field
};

// Helper to format date as YYYY-MM-DD (local timezone)
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface APIFootballFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface APIFootballStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  update: string;
}

export interface APIFootballTeam {
  team: {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number;
    national: boolean;
    logo: string;
  };
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

// League IDs for API-Football
export const LEAGUE_IDS = {
  'Premier League': 39,
  'La Liga': 140,
  'Bundesliga': 78,
  'Serie A': 135,
  'Ligue 1': 61,
  'Champions League': 2,
  'Europa League': 3,
  'Conference League': 848,
  'Efbet League': 172, // Bulgarian First League
};

export const apiFootball = {
  // Get fixtures by date
  getFixturesByDate: async (date: string, leagueId?: number): Promise<APIFootballFixture[]> => {
    try {
      const cacheKey = `api_football_fixtures_${date}_${leagueId || 'all'}`;

      // Check cache first
      const cached = cache.get<APIFootballFixture[]>(cacheKey);
      if (cached) {
        return cached;
      }

      let endpoint = `/fixtures?date=${date}`;
      if (leagueId) {
        endpoint += `&league=${leagueId}`;
      }

      const fixtures = await apiRequest(endpoint);

      // Cache for 5 minutes
      cache.set(cacheKey, fixtures, 5 * 60 * 1000);

      return fixtures;
    } catch (error) {
      console.error('Error fetching fixtures by date:', error);
      return [];
    }
  },

  // Get fixtures for a date range
  getFixturesDateRange: async (fromDate: string, toDate: string, leagueId?: number): Promise<APIFootballFixture[]> => {
    try {
      const cacheKey = `api_football_fixtures_range_${fromDate}_${toDate}_${leagueId || 'all'}`;

      // Check cache first
      const cached = cache.get<APIFootballFixture[]>(cacheKey);
      if (cached) {
        return cached;
      }

      let endpoint = `/fixtures?from=${fromDate}&to=${toDate}`;
      if (leagueId) {
        endpoint += `&league=${leagueId}`;
      }

      const fixtures = await apiRequest(endpoint);

      // Cache for 5 minutes
      cache.set(cacheKey, fixtures, 5 * 60 * 1000);

      return fixtures;
    } catch (error) {
      console.error('Error fetching fixtures by date range:', error);
      return [];
    }
  },

  // Get upcoming fixtures (next 7 days)
  getUpcomingFixtures: async (): Promise<APIFootballFixture[]> => {
    try {
      const today = new Date();
      const inSevenDays = new Date(today);
      inSevenDays.setDate(today.getDate() + 7);

      return await apiFootball.getFixturesDateRange(
        formatDate(today),
        formatDate(inSevenDays)
      );
    } catch (error) {
      console.error('Error fetching upcoming fixtures:', error);
      return [];
    }
  },

  // Get recent fixtures (past 3 days)
  getRecentFixtures: async (): Promise<APIFootballFixture[]> => {
    try {
      const today = new Date();
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(today.getDate() - 3);

      return await apiFootball.getFixturesDateRange(
        formatDate(threeDaysAgo),
        formatDate(today)
      );
    } catch (error) {
      console.error('Error fetching recent fixtures:', error);
      return [];
    }
  },

  // Get live fixtures
  getLiveFixtures: async (leagueId?: number): Promise<APIFootballFixture[]> => {
    try {
      let endpoint = '/fixtures?live=all';
      if (leagueId) {
        endpoint = `/fixtures?live=${leagueId}`;
      }

      const fixtures = await apiRequest(endpoint);
      return fixtures;
    } catch (error) {
      console.error('Error fetching live fixtures:', error);
      return [];
    }
  },

  // Get fixture by ID (with detailed stats)
  getFixtureById: async (fixtureId: number): Promise<APIFootballFixture | null> => {
    try {
      const cacheKey = `api_football_fixture_${fixtureId}`;

      // Check cache first
      const cached = cache.get<APIFootballFixture>(cacheKey);
      if (cached) {
        return cached;
      }

      const fixtures = await apiRequest(`/fixtures?id=${fixtureId}`);
      const fixture = fixtures && fixtures.length > 0 ? fixtures[0] : null;

      // Cache for 5 minutes
      if (fixture) {
        cache.set(cacheKey, fixture, 5 * 60 * 1000);
      }

      return fixture;
    } catch (error) {
      console.error('Error fetching fixture by ID:', error);
      return null;
    }
  },

  // Get standings for a league
  getStandings: async (leagueId: number, season: number): Promise<APIFootballStanding[]> => {
    try {
      const cacheKey = `api_football_standings_${leagueId}_${season}`;

      // Check cache first
      const cached = cache.get<APIFootballStanding[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const standings = await apiRequest(`/standings?league=${leagueId}&season=${season}`);

      // Extract the standings array from nested structure
      const standingsData = standings && standings.length > 0 && standings[0].league.standings
        ? standings[0].league.standings[0]
        : [];

      // Cache for 1 hour (standings don't change frequently)
      cache.set(cacheKey, standingsData, 60 * 60 * 1000);

      return standingsData;
    } catch (error) {
      console.error('Error fetching standings:', error);
      return [];
    }
  },

  // Get team information
  getTeam: async (teamId: number): Promise<APIFootballTeam | null> => {
    try {
      const cacheKey = `api_football_team_${teamId}`;

      // Check cache first
      const cached = cache.get<APIFootballTeam>(cacheKey);
      if (cached) {
        return cached;
      }

      const teams = await apiRequest(`/teams?id=${teamId}`);
      const team = teams && teams.length > 0 ? teams[0] : null;

      // Cache for 24 hours (team info rarely changes)
      if (team) {
        cache.set(cacheKey, team, 24 * 60 * 60 * 1000);
      }

      return team;
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  },

  // Get team fixtures (next and last)
  getTeamFixtures: async (teamId: number, last: number = 5): Promise<APIFootballFixture[]> => {
    try {
      const endpoint = `/fixtures?team=${teamId}&last=${last}`;
      const fixtures = await apiRequest(endpoint);
      return fixtures;
    } catch (error) {
      console.error('Error fetching team fixtures:', error);
      return [];
    }
  },

  // Search teams by name
  searchTeam: async (teamName: string): Promise<APIFootballTeam[]> => {
    try {
      const endpoint = `/teams?search=${encodeURIComponent(teamName)}`;
      const teams = await apiRequest(endpoint);
      return teams;
    } catch (error) {
      console.error('Error searching team:', error);
      return [];
    }
  },
};
