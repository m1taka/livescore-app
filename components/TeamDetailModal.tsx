'use client';

import { Match, Standing } from '@/types/sports';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { sportsApi } from '@/lib/api';
import Loading from './Loading';

interface TeamDetailModalProps {
  teamName: string;
  teamBadge?: string;
  leagueId?: string;
  onClose: () => void;
}

interface TeamInfo {
  idTeam: string;
  strTeam: string;
  strAlternate?: string;
  strLeague: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strTeamBadge?: string;
  strTeamBanner?: string;
  strDescriptionEN?: string;
  intFormedYear?: string;
}

export default function TeamDetailModal({ teamName, teamBadge, leagueId, onClose }: TeamDetailModalProps) {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [nextFixtures, setNextFixtures] = useState<Match[]>([]);
  const [lastResults, setLastResults] = useState<Match[]>([]);
  const [teamStanding, setTeamStanding] = useState<Standing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        // Search for team
        const team = await sportsApi.searchTeam(teamName);

        if (team) {
          setTeamInfo(team);

          // Fetch fixtures and results
          const [next, last] = await Promise.all([
            sportsApi.getNextTeamFixtures(team.idTeam),
            sportsApi.getLastTeamResults(team.idTeam)
          ]);

          setNextFixtures(next);
          setLastResults(last);

          // Fetch team standing if league ID is provided
          if (leagueId) {
            const standings = await sportsApi.getStandings(leagueId);
            const standing = standings.find(s => s.strTeam === teamName);
            if (standing) {
              setTeamStanding(standing);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamName, leagueId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <Loading />
        </div>
      </div>
    );
  }

  if (!teamInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4 text-center" onClick={(e) => e.stopPropagation()}>
          <p className="text-white">Team information not available</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  const formatMatchResult = (match: Match, teamName: string) => {
    const isHome = match.strHomeTeam === teamName;
    const opponent = isHome ? match.strAwayTeam : match.strHomeTeam;
    const teamScore = isHome ? match.intHomeScore : match.intAwayScore;
    const opponentScore = isHome ? match.intAwayScore : match.intHomeScore;

    let result = '';
    if (teamScore !== null && opponentScore !== null) {
      if (teamScore > opponentScore) result = 'W';
      else if (teamScore < opponentScore) result = 'L';
      else result = 'D';
    }

    return { opponent, teamScore, opponentScore, result, isHome };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-5xl w-full mx-4 my-8 border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            {(teamBadge || teamInfo.strTeamBadge) && (
              <Image
                src={teamBadge || teamInfo.strTeamBadge || ''}
                alt={teamName}
                width={80}
                height={80}
                className="object-contain"
                unoptimized
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-white">{teamInfo.strTeam}</h2>
              {teamInfo.strAlternate && (
                <p className="text-gray-400 mt-1">{teamInfo.strAlternate}</p>
              )}
              <p className="text-gray-400">{teamInfo.strLeague}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Team Banner */}
        {teamInfo.strTeamBanner && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <Image
              src={teamInfo.strTeamBanner}
              alt={teamInfo.strTeam}
              width={900}
              height={300}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        )}

        {/* League Standing */}
        {teamStanding && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Current Standing</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{teamStanding.intRank}</div>
                <div className="text-sm text-gray-400 mt-1">Position</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{teamStanding.intPoints}</div>
                <div className="text-sm text-gray-400 mt-1">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {teamStanding.intWin}-{teamStanding.intDraw}-{teamStanding.intLoss}
                </div>
                <div className="text-sm text-gray-400 mt-1">W-D-L</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{teamStanding.intGoalDifference}</div>
                <div className="text-sm text-gray-400 mt-1">Goal Diff</div>
              </div>
            </div>
            {teamStanding.strForm && (
              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">Recent Form</div>
                <div className="flex gap-1">
                  {teamStanding.strForm.split('').map((result, idx) => (
                    <span
                      key={idx}
                      className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm ${
                        result === 'W'
                          ? 'bg-green-600 text-white'
                          : result === 'D'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Recent Results */}
          <div className="bg-gray-750 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Results</h3>
            {lastResults.length > 0 ? (
              <div className="space-y-3">
                {lastResults.map((match) => {
                  const { opponent, teamScore, opponentScore, result, isHome } = formatMatchResult(match, teamName);
                  return (
                    <div key={match.idEvent} className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="text-sm text-gray-400">{match.strLeague}</div>
                          <div className="text-white font-medium mt-1">
                            {isHome ? 'vs' : '@'} {opponent}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{match.dateEvent}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {teamScore} - {opponentScore}
                          </div>
                          {result && (
                            <span
                              className={`text-xs px-2 py-1 rounded font-bold ${
                                result === 'W'
                                  ? 'bg-green-600 text-white'
                                  : result === 'D'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}
                            >
                              {result}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No recent results available</p>
            )}
          </div>

          {/* Upcoming Fixtures */}
          <div className="bg-gray-750 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Fixtures</h3>
            {nextFixtures.length > 0 ? (
              <div className="space-y-3">
                {nextFixtures.map((match) => {
                  const isHome = match.strHomeTeam === teamName;
                  const opponent = isHome ? match.strAwayTeam : match.strHomeTeam;
                  return (
                    <div key={match.idEvent} className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="text-sm text-gray-400">{match.strLeague}</div>
                          <div className="text-white font-medium mt-1">
                            {isHome ? 'vs' : '@'} {opponent}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {match.dateEvent} {match.strTime}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-xs px-2 py-1 rounded bg-blue-600 text-white font-bold">
                            {isHome ? 'HOME' : 'AWAY'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No upcoming fixtures available</p>
            )}
          </div>
        </div>

        {/* Stadium Info */}
        {teamInfo.strStadium && (
          <div className="bg-gray-750 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Stadium</h3>
            {teamInfo.strStadiumThumb && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <Image
                  src={teamInfo.strStadiumThumb}
                  alt={teamInfo.strStadium}
                  width={600}
                  height={300}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Name</div>
                <div className="text-white font-medium">{teamInfo.strStadium}</div>
              </div>
              {teamInfo.strStadiumLocation && (
                <div>
                  <div className="text-gray-400">Location</div>
                  <div className="text-white font-medium">{teamInfo.strStadiumLocation}</div>
                </div>
              )}
              {teamInfo.intStadiumCapacity && (
                <div>
                  <div className="text-gray-400">Capacity</div>
                  <div className="text-white font-medium">
                    {parseInt(teamInfo.intStadiumCapacity).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamInfo.strDescriptionEN && (
            <div className="bg-gray-750 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">About</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {teamInfo.strDescriptionEN.substring(0, 300)}...
              </p>
            </div>
          )}

          <div className="bg-gray-750 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Club Info</h3>
            <div className="space-y-2 text-sm">
              {teamInfo.intFormedYear && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Founded</span>
                  <span className="text-white font-medium">{teamInfo.intFormedYear}</span>
                </div>
              )}
              {teamInfo.strWebsite && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Website</span>
                  <a
                    href={`https://${teamInfo.strWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Visit
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
