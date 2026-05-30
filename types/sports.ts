export interface Match {
  idEvent: string;
  idLeague?: string;
  strEvent: string;
  strLeague: string;
  strSport: string;
  dateEvent: string;
  strTime?: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  intRound?: string;
  intSpectators?: string;
  strStatus?: string;
  strThumb?: string;
  strVideo?: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strVenue?: string;
  strCountry?: string;
  strCity?: string;
  strPoster?: string;
  strSquare?: string;
  strFanart?: string;
  strBanner?: string;
  strDescription?: string;
  intHomeShots?: string;
  intAwayShots?: string;
  strHomeGoalDetails?: string;
  strAwayGoalDetails?: string;
  strHomeRedCards?: string;
  strAwayRedCards?: string;
  strHomeYellowCards?: string;
  strAwayYellowCards?: string;
  strHomeLineupGoalkeeper?: string;
  strAwayLineupGoalkeeper?: string;
  strHomeLineupDefense?: string;
  strAwayLineupDefense?: string;
  strHomeLineupMidfield?: string;
  strAwayLineupMidfield?: string;
  strHomeLineupForward?: string;
  strAwayLineupForward?: string;
  strHomeLineupSubstitutes?: string;
  strAwayLineupSubstitutes?: string;
  strHomeFormation?: string;
  strAwayFormation?: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
}

export interface Sport {
  idSport: string;
  strSport: string;
  strFormat: string;
  strSportThumb?: string;
}

export interface Standing {
  idStanding: string;
  intRank: string;
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strForm?: string;
  strDescription?: string;
  intPlayed: string;
  intWin: string;
  intDraw: string;
  intLoss: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intGoalDifference: string;
  intPoints: string;
}

export interface ApiResponse<T> {
  events?: T[];
  leagues?: T[];
  sports?: T[];
  table?: T[];
}
