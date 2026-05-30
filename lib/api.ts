import { Match, League, Sport, Standing, ApiResponse } from '@/types/sports';
import { cache } from './cache';

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

// Helper function to format date as YYYY-MM-DD (local timezone)
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to add delay between API calls (to avoid rate limiting)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sportsApi = {
  // Get all available sports
  getAllSports: async (): Promise<Sport[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/all_sports.php`, { cache: 'no-store' });
      const data: ApiResponse<Sport> = await response.json();
      return data.sports || [];
    } catch (error) {
      console.error('Error fetching sports:', error);
      return [];
    }
  },

  // Get events for today and upcoming days
  getNextEvents: async (sport?: string): Promise<Match[]> => {
    try {
      const cacheKey = `next_events_${sport || 'all'}`;

      // Check cache first
      const cached = cache.get<Match[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const allMatches: Match[] = [];
      const today = new Date();

      // Fetch events for next 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = formatDate(date);

        try {
          const response = await fetch(`${API_BASE_URL}/eventsday.php?d=${dateStr}&s=${sport || 'Soccer'}`, {
            cache: 'no-store',
            mode: 'cors'
          });

          if (!response.ok) {
            console.warn(`Failed to fetch events for ${dateStr}: ${response.status}`);
            continue;
          }

          const data: ApiResponse<Match> = await response.json();

          if (data.events) {
            allMatches.push(...data.events);
          }
        } catch (err) {
          console.warn(`Error fetching events for ${dateStr}:`, err);
        }

        // Add delay between requests to avoid rate limiting
        if (i < 6) await delay(300);
      }

      // Filter by sport if specified
      const filteredMatches = sport
        ? allMatches.filter(match => match.strSport === sport)
        : allMatches;

      // Cache for 5 minutes
      cache.set(cacheKey, filteredMatches, 5 * 60 * 1000);

      return filteredMatches;
    } catch (error) {
      console.error('Error fetching next events:', error);
      return [];
    }
  },

  // Get events from past 3 days
  getLastEvents: async (sport?: string): Promise<Match[]> => {
    try {
      const cacheKey = `last_events_${sport || 'all'}`;

      // Check cache first
      const cached = cache.get<Match[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const allMatches: Match[] = [];
      const today = new Date();

      // Fetch events for past 3 days (reduced to avoid rate limiting)
      for (let i = 1; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDate(date);

        try {
          const response = await fetch(`${API_BASE_URL}/eventsday.php?d=${dateStr}&s=${sport || 'Soccer'}`, {
            cache: 'no-store',
            mode: 'cors'
          });

          if (!response.ok) {
            console.warn(`Failed to fetch events for ${dateStr}: ${response.status}`);
            continue;
          }

          const data: ApiResponse<Match> = await response.json();

          if (data.events) {
            allMatches.push(...data.events);
          }
        } catch (err) {
          console.warn(`Error fetching events for ${dateStr}:`, err);
        }

        // Add delay between requests to avoid rate limiting
        if (i < 3) await delay(300);
      }

      // Filter by sport if specified
      const filteredMatches = sport
        ? allMatches.filter(match => match.strSport === sport)
        : allMatches;

      // Cache for 5 minutes
      cache.set(cacheKey, filteredMatches, 5 * 60 * 1000);

      return filteredMatches;
    } catch (error) {
      console.error('Error fetching last events:', error);
      return [];
    }
  },

  // Get all leagues by sport
  getLeaguesBySport: async (sport: string): Promise<League[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/search_all_leagues.php?s=${encodeURIComponent(sport)}`, { cache: 'no-store' });
      const data: ApiResponse<League> = await response.json();
      return data.leagues || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      return [];
    }
  },

  // Get events by league ID for next 15 days (using eventsnext endpoint with team)
  getNextEventsByLeague: async (leagueId: string): Promise<Match[]> => {
    try {
      // Free tier limitation: eventsnextleague doesn't exist
      // Fallback to getting events by date
      const allMatches: Match[] = [];
      const today = new Date();

      for (let i = 0; i < 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = formatDate(date);

        const response = await fetch(`${API_BASE_URL}/eventsday.php?d=${dateStr}`, { cache: 'no-store' });
        const data: ApiResponse<Match> = await response.json();

        if (data.events) {
          allMatches.push(...data.events.filter(event => event.idLeague === leagueId));
        }
      }

      return allMatches;
    } catch (error) {
      console.error('Error fetching next events by league:', error);
      return [];
    }
  },

  // Get past events by league ID
  getLastEventsByLeague: async (leagueId: string): Promise<Match[]> => {
    try {
      const allMatches: Match[] = [];
      const today = new Date();

      for (let i = 1; i <= 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDate(date);

        const response = await fetch(`${API_BASE_URL}/eventsday.php?d=${dateStr}`, { cache: 'no-store' });
        const data: ApiResponse<Match> = await response.json();

        if (data.events) {
          allMatches.push(...data.events.filter(event => event.idLeague === leagueId));
        }
      }

      return allMatches;
    } catch (error) {
      console.error('Error fetching past events by league:', error);
      return [];
    }
  },

  // Search for a specific event
  searchEvent: async (eventName: string): Promise<Match[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/searchevents.php?e=${encodeURIComponent(eventName)}`, { cache: 'no-store' });
      const data: ApiResponse<Match> = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error searching event:', error);
      return [];
    }
  },

  // Get league standings/table by league ID and season
  getStandings: async (leagueId: string, season?: string): Promise<Standing[]> => {
    try {
      const seasonParam = season || '2025-2026';
      const cacheKey = `standings_${leagueId}_${seasonParam}`;

      // Check cache first
      const cached = cache.get<Standing[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${API_BASE_URL}/lookuptable.php?l=${leagueId}&s=${seasonParam}`, { cache: 'no-store' });
      const data: ApiResponse<Standing> = await response.json();
      const standings = data.table || [];

      // Cache for 5 minutes
      cache.set(cacheKey, standings, 5 * 60 * 1000);

      return standings;
    } catch (error) {
      console.error('Error fetching standings:', error);
      return [];
    }
  },

  // Get detailed event information by event ID
  getEventDetails: async (eventId: string): Promise<Match | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookupevent.php?id=${eventId}`, { cache: 'no-store' });
      const data: ApiResponse<Match> = await response.json();
      return data.events && data.events.length > 0 ? data.events[0] : null;
    } catch (error) {
      console.error('Error fetching event details:', error);
      return null;
    }
  },

  // Search for team by name
  searchTeam: async (teamName: string): Promise<any | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`, { cache: 'no-store' });
      const data = await response.json();
      return data.teams && data.teams.length > 0 ? data.teams[0] : null;
    } catch (error) {
      console.error('Error searching team:', error);
      return null;
    }
  },

  // Get next 5 fixtures for a team by team ID
  getNextTeamFixtures: async (teamId: string): Promise<Match[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/eventsnext.php?id=${teamId}`, { cache: 'no-store' });
      const data: ApiResponse<Match> = await response.json();
      return (data.events || []).slice(0, 5);
    } catch (error) {
      console.error('Error fetching next team fixtures:', error);
      return [];
    }
  },

  // Get last 5 results for a team by team ID
  getLastTeamResults: async (teamId: string): Promise<Match[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/eventslast.php?id=${teamId}`, { cache: 'no-store' });
      const data: ApiResponse<Match> = await response.json();
      return (data.events || []).slice(0, 5);
    } catch (error) {
      console.error('Error fetching last team results:', error);
      return [];
    }
  },

  // Lookup team by ID (more reliable than search)
  lookupTeam: async (teamId: string): Promise<any | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lookupteam.php?id=${teamId}`, { cache: 'no-store' });
      const data = await response.json();
      return data.teams && data.teams.length > 0 ? data.teams[0] : null;
    } catch (error) {
      console.error('Error looking up team:', error);
      return null;
    }
  }
};
