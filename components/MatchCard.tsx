import { Match } from '@/types/sports';
import Image from 'next/image';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  onTeamClick?: (teamName: string, teamBadge?: string, leagueId?: string) => void;
}

export default function MatchCard({ match, onClick, onTeamClick }: MatchCardProps) {
  const isFinished = match.intHomeScore !== null && match.intAwayScore !== null;
  const matchDate = new Date(match.dateEvent);
  const today = new Date();
  const isToday = matchDate.toDateString() === today.toDateString();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = () => {
    if (isFinished) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 text-gray-200">
          FT
        </span>
      );
    } else if (isToday) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-green-100">
          Today {match.strTime || ''}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-blue-100">
          Scheduled
        </span>
      );
    }
  };

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-200 p-4 border border-gray-700 cursor-pointer hover:border-blue-500"
      onClick={onClick}
    >
      {/* League and Date */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-semibold text-gray-300">
          {match.strLeague}
        </div>
        {getStatusBadge()}
      </div>

      {/* Match Details */}
      <div className="space-y-3">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 flex-1 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onTeamClick?.(match.strHomeTeam, match.strHomeTeamBadge, match.idLeague);
            }}
          >
            {match.strHomeTeamBadge && (
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={match.strHomeTeamBadge}
                  alt={match.strHomeTeam}
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <span className="font-medium text-white">{match.strHomeTeam}</span>
          </div>
          <span className="text-2xl font-bold text-white ml-2">
            {isFinished ? match.intHomeScore : '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 flex-1 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onTeamClick?.(match.strAwayTeam, match.strAwayTeamBadge, match.idLeague);
            }}
          >
            {match.strAwayTeamBadge && (
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={match.strAwayTeamBadge}
                  alt={match.strAwayTeam}
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <span className="font-medium text-white">{match.strAwayTeam}</span>
          </div>
          <span className="text-2xl font-bold text-white ml-2">
            {isFinished ? match.intAwayScore : '-'}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {formatDate(match.dateEvent)} {match.strTime && `• ${match.strTime}`}
        </div>
      </div>
    </div>
  );
}
