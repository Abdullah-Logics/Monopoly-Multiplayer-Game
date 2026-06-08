import { Player, GameProperty } from '../types';
import { adjustColor } from '../gameData';

interface PlayerPanelProps {
  players: Player[];
  currentPlayer: number;
  properties: Record<number, GameProperty>;
}

export default function PlayerPanel({ players, currentPlayer, properties }: PlayerPanelProps) {
  return (
    <div className="w-64 space-y-3">
      {players.map((player, idx) => {
        const isActive = idx === currentPlayer && !player.bankrupt;
        const propertyValue = player.properties.reduce((sum, pId) => {
          const p = properties[pId];
          return sum + (p.price || 0) + (p.houses * (p.houseCost || 0));
        }, 0);

        return (
          <div
            key={player.id}
            className={`player-card rounded-xl p-4 ${player.bankrupt ? 'bankrupt' : ''} ${isActive ? 'active' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${player.color}33 0%, ${player.color}11 100%)`,
              border: `2px solid ${player.color}44`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="text-3xl p-2 rounded-full"
                style={{
                  background: `linear-gradient(145deg, ${player.color}, ${adjustColor(player.color, -30)})`,
                  boxShadow: `0 4px 15px ${player.color}66`,
                }}
              >
                {player.token}
              </div>
              <div>
                <div className="font-bold text-white text-lg">{player.name}</div>
                <div className="text-xs text-gray-300">
                  {player.inJail ? '🔒 In Jail' : `📍 Position ${player.position}`}
                </div>
              </div>
            </div>
            <div className="text-2xl font-black text-green-400 drop-shadow-lg">
              ${player.money.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              🏠 {player.properties.length} properties | 💰 ${propertyValue.toLocaleString()}
            </div>
            {player.getOutOfJailCards > 0 && (
              <div className="text-xs text-yellow-400 mt-1">
                🎫 Get Out of Jail x{player.getOutOfJailCards}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
