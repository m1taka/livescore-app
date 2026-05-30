import { Standing } from '@/types/sports';
import Image from 'next/image';

interface StandingsTableProps {
  standings: Standing[];
  onTeamClick?: (teamName: string, teamBadge?: string, leagueId?: string) => void;
}

export default function StandingsTable({ standings, onTeamClick }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center border border-gray-700">
        <h3 className="text-lg font-medium text-white">No standings available</h3>
        <p className="mt-2 text-sm text-gray-400">
          Standings data is not available for this league
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">
          {standings[0]?.strLeague} - Standings
        </h2>
        <p className="text-sm text-gray-400 mt-1">Season {standings[0]?.strSeason}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Pos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Team
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                P
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                W
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                D
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                L
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                GF
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                GA
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                GD
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {standings.map((team, index) => (
              <tr
                key={team.idStanding}
                className={`hover:bg-gray-700 transition-colors ${
                  index < 4
                    ? 'bg-blue-900/20' // Champions League
                    : index < 6
                    ? 'bg-green-900/20' // Europa League
                    : index >= standings.length - 3
                    ? 'bg-red-900/20' // Relegation
                    : ''
                }`}
              >
                <td className="px-4 py-3 text-sm font-bold text-white">
                  {team.intRank}
                </td>
                <td className="px-4 py-3">
                  <div
                    className="flex items-center space-x-3 cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTeamClick?.(team.strTeam, team.strTeamBadge, team.idLeague);
                    }}
                  >
                    {team.strTeamBadge && (
                      <div className="relative w-6 h-6 flex-shrink-0">
                        <Image
                          src={team.strTeamBadge}
                          alt={team.strTeam}
                          width={24}
                          height={24}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-white">
                      {team.strTeam}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-300">
                  {team.intPlayed}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-300">
                  {team.intWin}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-300">
                  {team.intDraw}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-300">
                  {team.intLoss}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-300">
                  {team.intGoalsFor}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-300">
                  {team.intGoalsAgainst}
                </td>
                <td className="px-4 py-3 text-center text-sm font-medium text-white">
                  {team.intGoalDifference}
                </td>
                <td className="px-4 py-3 text-center text-sm font-bold text-white">
                  {team.intPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-900/40 border border-blue-700 rounded"></div>
            <span className="text-gray-400">Champions League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-900/40 border border-green-700 rounded"></div>
            <span className="text-gray-400">Europa League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-900/40 border border-red-700 rounded"></div>
            <span className="text-gray-400">Relegation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
