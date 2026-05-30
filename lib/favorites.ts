// Favorites management for teams and leagues

const FAVORITES_TEAMS_KEY = 'livescore_favorite_teams';
const FAVORITES_LEAGUES_KEY = 'livescore_favorite_leagues';

export interface FavoriteTeam {
  name: string;
  badge?: string;
  id?: string;
}

export interface FavoriteLeague {
  id: string;
  name: string;
}

export const favorites = {
  // Team favorites
  teams: {
    getAll: (): FavoriteTeam[] => {
      try {
        const data = localStorage.getItem(FAVORITES_TEAMS_KEY);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.warn('Error getting favorite teams:', error);
        return [];
      }
    },

    add: (team: FavoriteTeam): void => {
      try {
        const teams = favorites.teams.getAll();
        // Check if already exists
        if (!teams.some((t) => t.name === team.name)) {
          teams.push(team);
          localStorage.setItem(FAVORITES_TEAMS_KEY, JSON.stringify(teams));
        }
      } catch (error) {
        console.warn('Error adding favorite team:', error);
      }
    },

    remove: (teamName: string): void => {
      try {
        const teams = favorites.teams.getAll();
        const filtered = teams.filter((t) => t.name !== teamName);
        localStorage.setItem(FAVORITES_TEAMS_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.warn('Error removing favorite team:', error);
      }
    },

    toggle: (team: FavoriteTeam): boolean => {
      const isFavorite = favorites.teams.isFavorite(team.name);
      if (isFavorite) {
        favorites.teams.remove(team.name);
        return false;
      } else {
        favorites.teams.add(team);
        return true;
      }
    },

    isFavorite: (teamName: string): boolean => {
      const teams = favorites.teams.getAll();
      return teams.some((t) => t.name === teamName);
    },

    clear: (): void => {
      try {
        localStorage.removeItem(FAVORITES_TEAMS_KEY);
      } catch (error) {
        console.warn('Error clearing favorite teams:', error);
      }
    },
  },

  // League favorites
  leagues: {
    getAll: (): FavoriteLeague[] => {
      try {
        const data = localStorage.getItem(FAVORITES_LEAGUES_KEY);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.warn('Error getting favorite leagues:', error);
        return [];
      }
    },

    add: (league: FavoriteLeague): void => {
      try {
        const leagues = favorites.leagues.getAll();
        // Check if already exists
        if (!leagues.some((l) => l.id === league.id)) {
          leagues.push(league);
          localStorage.setItem(FAVORITES_LEAGUES_KEY, JSON.stringify(leagues));
        }
      } catch (error) {
        console.warn('Error adding favorite league:', error);
      }
    },

    remove: (leagueId: string): void => {
      try {
        const leagues = favorites.leagues.getAll();
        const filtered = leagues.filter((l) => l.id !== leagueId);
        localStorage.setItem(FAVORITES_LEAGUES_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.warn('Error removing favorite league:', error);
      }
    },

    toggle: (league: FavoriteLeague): boolean => {
      const isFavorite = favorites.leagues.isFavorite(league.id);
      if (isFavorite) {
        favorites.leagues.remove(league.id);
        return false;
      } else {
        favorites.leagues.add(league);
        return true;
      }
    },

    isFavorite: (leagueId: string): boolean => {
      const leagues = favorites.leagues.getAll();
      return leagues.some((l) => l.id === leagueId);
    },

    clear: (): void => {
      try {
        localStorage.removeItem(FAVORITES_LEAGUES_KEY);
      } catch (error) {
        console.warn('Error clearing favorite leagues:', error);
      }
    },
  },

  // Clear all favorites
  clearAll: (): void => {
    favorites.teams.clear();
    favorites.leagues.clear();
  },
};
