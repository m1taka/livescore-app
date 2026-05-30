'use client';

import { Match } from '@/types/sports';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { sportsApi } from '@/lib/api';
import Loading from './Loading';

interface MatchDetailModalProps {
  matchId: string;
  onClose: () => void;
  onTeamClick?: (teamName: string, teamBadge?: string, leagueId?: string) => void;
}

export default function MatchDetailModal({ matchId, onClose, onTeamClick }: MatchDetailModalProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setLoading(true);
      const data = await sportsApi.getEventDetails(matchId);
      setMatch(data);
      setLoading(false);
    };

    fetchMatchDetails();
  }, [matchId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <Loading />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4 text-center" onClick={(e) => e.stopPropagation()}>
          <p className="text-white">Match details not available</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  const isFinished = match.intHomeScore !== null && match.intAwayScore !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 my-8 border border-gray-700" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{match.strEvent}</h2>
            <p className="text-gray-400 mt-1">{match.strLeague}</p>
            {match.intRound && <p className="text-gray-400">Round {match.intRound}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Match Banner */}
        {match.strThumb && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <Image
              src={match.strThumb}
              alt={match.strEvent}
              width={800}
              height={400}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        )}

        {/* Score Section */}
        <div className="bg-gray-750 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Home Team */}
            <div className="text-center">
              {match.strHomeTeamBadge && (
                <div className="mb-3 flex justify-center">
                  <Image
                    src={match.strHomeTeamBadge}
                    alt={match.strHomeTeam}
                    width={80}
                    height={80}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h3
                className="text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTeamClick?.(match.strHomeTeam, match.strHomeTeamBadge, match.idLeague);
                }}
              >
                {match.strHomeTeam}
              </h3>
              {match.strHomeFormation && (
                <p className="text-sm text-gray-400 mt-1">{match.strHomeFormation}</p>
              )}
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="text-5xl font-bold text-white">
                {isFinished ? `${match.intHomeScore} - ${match.intAwayScore}` : 'VS'}
              </div>
              <p className="text-gray-400 mt-2">{match.dateEvent} {match.strTime}</p>
              {isFinished && <span className="text-sm text-gray-500">Full Time</span>}
            </div>

            {/* Away Team */}
            <div className="text-center">
              {match.strAwayTeamBadge && (
                <div className="mb-3 flex justify-center">
                  <Image
                    src={match.strAwayTeamBadge}
                    alt={match.strAwayTeam}
                    width={80}
                    height={80}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h3
                className="text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTeamClick?.(match.strAwayTeam, match.strAwayTeamBadge, match.idLeague);
                }}
              >
                {match.strAwayTeam}
              </h3>
              {match.strAwayFormation && (
                <p className="text-sm text-gray-400 mt-1">{match.strAwayFormation}</p>
              )}
            </div>
          </div>
        </div>

        {/* Match Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Venue Information */}
          {(match.strVenue || match.strCity || match.intSpectators) && (
            <div className="bg-gray-750 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Venue</h3>
              {match.strVenue && <p className="text-gray-300">{match.strVenue}</p>}
              {match.strCity && <p className="text-gray-400">{match.strCity}, {match.strCountry}</p>}
              {match.intSpectators && (
                <p className="text-gray-400 mt-2">Attendance: {parseInt(match.intSpectators).toLocaleString()}</p>
              )}
            </div>
          )}

          {/* Match Statistics */}
          {isFinished && (match.intHomeShots || match.intAwayShots) && (
            <div className="bg-gray-750 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Statistics</h3>
              <div className="space-y-2">
                {match.intHomeShots && match.intAwayShots && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{match.intHomeShots}</span>
                    <span className="text-gray-400">Shots</span>
                    <span className="text-gray-300">{match.intAwayShots}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Goals */}
        {isFinished && (match.strHomeGoalDetails || match.strAwayGoalDetails) && (
          <div className="bg-gray-750 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Goals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">{match.strHomeTeam}</h4>
                <p className="text-gray-300 text-sm whitespace-pre-line">{match.strHomeGoalDetails || 'No goals'}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">{match.strAwayTeam}</h4>
                <p className="text-gray-300 text-sm whitespace-pre-line">{match.strAwayGoalDetails || 'No goals'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {isFinished && (match.strHomeYellowCards || match.strAwayYellowCards || match.strHomeRedCards || match.strAwayRedCards) && (
          <div className="bg-gray-750 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Cards</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">{match.strHomeTeam}</h4>
                {match.strHomeYellowCards && (
                  <p className="text-yellow-400 text-sm">⚠️ Yellow: {match.strHomeYellowCards}</p>
                )}
                {match.strHomeRedCards && (
                  <p className="text-red-400 text-sm">🟥 Red: {match.strHomeRedCards}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">{match.strAwayTeam}</h4>
                {match.strAwayYellowCards && (
                  <p className="text-yellow-400 text-sm">⚠️ Yellow: {match.strAwayYellowCards}</p>
                )}
                {match.strAwayRedCards && (
                  <p className="text-red-400 text-sm">🟥 Red: {match.strAwayRedCards}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {match.strDescription && (
          <div className="bg-gray-750 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Match Description</h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">{match.strDescription}</p>
          </div>
        )}

        {/* Video */}
        {match.strVideo && (
          <div className="text-center">
            <a
              href={match.strVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Watch Highlights
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
