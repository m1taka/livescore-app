'use client';

import { useState, useEffect } from 'react';
import { Match, Standing } from '@/types/sports';
import { sportsApi } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import SportSelector from '@/components/SportSelector';
import StandingsTable from '@/components/StandingsTable';
import MatchDetailModal from '@/components/MatchDetailModal';
import TeamDetailModal from '@/components/TeamDetailModal';
import Loading from '@/components/Loading';

type ViewMode = 'matches' | 'standings';
type MatchView = 'upcoming' | 'recent';

// Popular league IDs for quick access to standings
const POPULAR_LEAGUES = {
  'Premier League': '4328',
  'La Liga': '4335',
  'Bundesliga': '4331',
  'Serie A': '4332',
  'Ligue 1': '4334',
  'Champions League': '4480',
  'Europa League': '4481',
  'Conference League': '5071',
  'Efbet League': '4626',
  'NBA': '4387',
  'NFL': '4391',
};

// Available seasons
const SEASONS = [
  '2025-2026',
  '2024-2025',
  '2023-2024',
  '2022-2023',
  '2021-2022',
  '2020-2021',
];

export default function Home() {
  const [selectedSport, setSelectedSport] = useState('Soccer');
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('matches');
  const [matchView, setMatchView] = useState<MatchView>('upcoming');
  const [selectedLeague, setSelectedLeague] = useState('4328'); // Premier League default
  const [selectedSeason, setSelectedSeason] = useState('2025-2026');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<{ name: string; badge?: string; leagueId?: string } | null>(null);

  useEffect(() => {
    if (viewMode === 'matches') {
      fetchMatches();
    } else {
      fetchStandings();
    }
    // Auto-refresh every 5 minutes (300 seconds)
    const interval = setInterval(() => {
      if (viewMode === 'matches') {
        fetchMatches();
      } else {
        fetchStandings();
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [selectedSport, matchView, viewMode, selectedLeague, selectedSeason]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = matchView === 'upcoming'
        ? await sportsApi.getNextEvents(selectedSport)
        : await sportsApi.getLastEvents(selectedSport);

      setMatches(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandings = async () => {
    setLoading(true);
    try {
      const data = await sportsApi.getStandings(selectedLeague, selectedSeason);
      setStandings(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching standings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSportChange = (sport: string) => {
    setSelectedSport(sport);
  };

  const formatLastUpdate = () => {
    return lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSportDisplayName = (sport: string) => {
    return sport === 'Soccer' ? 'Football' : sport;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">
            Live Score
          </h1>
          <p className="text-gray-300 mt-1">
            Real-time sports scores and updates
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('matches')}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                viewMode === 'matches'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              Matches
            </button>
            <button
              onClick={() => setViewMode('standings')}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                viewMode === 'standings'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              Standings
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6 border border-gray-700">
          {viewMode === 'matches' ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Select Sport
                </h2>
                <SportSelector
                  selectedSport={selectedSport}
                  onSelectSport={handleSportChange}
                />
              </div>

              {/* Match View Toggle */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-white mb-3">
                  View
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMatchView('upcoming')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      matchView === 'upcoming'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    Upcoming Matches
                  </button>
                  <button
                    onClick={() => setMatchView('recent')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      matchView === 'recent'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    Recent Results
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white mb-3">
                Select League
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(POPULAR_LEAGUES).map(([name, id]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedLeague(id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedLeague === id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Season Selector */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Select Season
                </h2>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none font-medium"
                >
                  {SEASONS.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Last Update */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Last updated: {formatLastUpdate()}
            </span>
            <button
              onClick={viewMode === 'matches' ? fetchMatches : fetchStandings}
              disabled={loading}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : viewMode === 'matches' ? (
          matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.idEvent}
                  match={match}
                  onClick={() => setSelectedMatchId(match.idEvent)}
                  onTeamClick={(name, badge, leagueId) => setSelectedTeam({ name, badge, leagueId })}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center border border-gray-700">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-white">
                No matches found
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                No {matchView === 'upcoming' ? 'upcoming' : 'recent'} matches available for {getSportDisplayName(selectedSport)} at the moment.
              </p>
            </div>
          )
        ) : (
          <StandingsTable
            standings={standings}
            onTeamClick={(name, badge, leagueId) => setSelectedTeam({ name, badge, leagueId })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-400">
            Powered by TheSportsDB API • Data refreshes every 5 minutes
          </p>
        </div>
      </footer>

      {/* Match Detail Modal */}
      {selectedMatchId && (
        <MatchDetailModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
          onTeamClick={(name, badge, leagueId) => {
            setSelectedMatchId(null);
            setSelectedTeam({ name, badge, leagueId });
          }}
        />
      )}

      {/* Team Detail Modal */}
      {selectedTeam && (
        <TeamDetailModal
          teamName={selectedTeam.name}
          teamBadge={selectedTeam.badge}
          leagueId={selectedTeam.leagueId}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}
