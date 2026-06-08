import { Player, GameProperty } from '../types';
import { adjustColor } from '../gameData';

interface InfoPanelProps {
  currentPlayer: Player;
  selectedProperty: GameProperty | null;
  logs: string[];
  players: Player[];
  onUseJailCard: () => void;
  onPayJailFine: () => void;
  onBuyHouse: (propId: number) => void;
  onSellHouse: (propId: number) => void;
  onMortgage: (propId: number) => void;
  onUnmortgage: (propId: number) => void;
  canBuyHouse: (propId: number) => boolean;
}

export default function InfoPanel({
  currentPlayer,
  selectedProperty,
  logs,
  players,
  onUseJailCard,
  onPayJailFine,
  onBuyHouse,
  onSellHouse,
  onMortgage,
  onUnmortgage,
  canBuyHouse,
}: InfoPanelProps) {
  const owner =
    selectedProperty?.owner !== null && selectedProperty?.owner !== undefined
      ? players[selectedProperty.owner]
      : null;
  const isOwner = selectedProperty?.owner === currentPlayer.id;

  return (
    <div className="w-80 space-y-4">
      {/* Current Player Info */}
      <div className="glass-panel rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="text-5xl p-3 rounded-2xl"
            style={{
              background: `linear-gradient(145deg, ${currentPlayer.color}, ${adjustColor(currentPlayer.color, -30)})`,
              boxShadow: `0 8px 25px ${currentPlayer.color}66`,
            }}
          >
            {currentPlayer.token}
          </div>
          <div>
            <div className="text-2xl font-bold">{currentPlayer.name}'s Turn</div>
            <div className="text-green-400 text-xl font-bold">
              ${currentPlayer.money.toLocaleString()}
            </div>
          </div>
        </div>

        {currentPlayer.inJail && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-3">
            <div className="font-bold text-red-400">
              🔒 In Jail (Turn {currentPlayer.jailTurns}/3)
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {currentPlayer.getOutOfJailCards > 0 && (
                <button
                  onClick={onUseJailCard}
                  className="px-4 py-2 bg-yellow-500 rounded-lg text-sm font-bold hover:bg-yellow-400"
                >
                  🎫 Use Card
                </button>
              )}
              <button
                onClick={onPayJailFine}
                className="px-4 py-2 bg-green-500 rounded-lg text-sm font-bold hover:bg-green-400"
              >
                💵 Pay $50
              </button>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-300">
          🏠 Properties: {currentPlayer.properties.length}
        </div>
      </div>

      {/* Property Info */}
      <div className="glass-panel rounded-2xl p-5 text-white">
        <h3 className="font-bold text-lg mb-2">📍 Property Info</h3>
        {selectedProperty ? (
          <div>
            <div
              className="w-full h-6 rounded-t-lg"
              style={{
                background: `linear-gradient(145deg, ${selectedProperty.color || '#ccc'}, ${adjustColor(selectedProperty.color || '#cccccc', -30)})`,
              }}
            />
            <h3 className="font-bold text-xl mt-3">
              {selectedProperty.icon || ''} {selectedProperty.name}
            </h3>

            {selectedProperty.price && (
              <p className="text-green-400 text-lg font-bold">${selectedProperty.price}</p>
            )}

            {owner ? (
              <p className="text-sm flex items-center gap-2 mt-1">
                Owner:{' '}
                <span className="font-bold" style={{ color: owner.color }}>
                  {owner.token} {owner.name}
                </span>
              </p>
            ) : selectedProperty.price ? (
              <p className="text-yellow-400 text-sm mt-1">🏷️ Available for purchase</p>
            ) : null}

            {selectedProperty.rent && (
              <div className="text-xs mt-3 bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="grid grid-cols-2 gap-1">
                  <div>💵 Rent:</div>
                  <div className="font-bold">${selectedProperty.rent[0]}</div>
                  <div>🏠 1 House:</div>
                  <div className="font-bold">${selectedProperty.rent[1]}</div>
                  <div>🏠🏠 2 Houses:</div>
                  <div className="font-bold">${selectedProperty.rent[2]}</div>
                  <div>🏠🏠🏠 3 Houses:</div>
                  <div className="font-bold">${selectedProperty.rent[3]}</div>
                  <div>🏠🏠🏠🏠 4 Houses:</div>
                  <div className="font-bold">${selectedProperty.rent[4]}</div>
                  <div>🏨 Hotel:</div>
                  <div className="font-bold">${selectedProperty.rent[5]}</div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10">
                  🔨 House: ${selectedProperty.houseCost}
                </div>
              </div>
            )}

            {selectedProperty.type === 'property' && (
              <p className="mt-2 text-sm">
                Buildings:{' '}
                {selectedProperty.houses === 5
                  ? '🏨 Hotel'
                  : selectedProperty.houses > 0
                    ? '🏠'.repeat(selectedProperty.houses)
                    : 'None'}
              </p>
            )}

            {selectedProperty.mortgaged && (
              <p className="text-red-400 font-bold mt-2 bg-red-500/20 p-2 rounded">
                📜 MORTGAGED
              </p>
            )}

            {/* Actions for owner */}
            {isOwner && selectedProperty.type === 'property' && (
              <div className="mt-4 space-y-2">
                {canBuyHouse(selectedProperty.id) && (
                  <button
                    onClick={() => onBuyHouse(selectedProperty.id)}
                    className="w-full py-2 btn-success text-white rounded-lg text-sm font-bold"
                  >
                    🏠 Buy House (${selectedProperty.houseCost})
                  </button>
                )}

                {selectedProperty.houses > 0 && (
                  <button
                    onClick={() => onSellHouse(selectedProperty.id)}
                    className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg text-sm font-bold"
                  >
                    💵 Sell House (+${Math.floor((selectedProperty.houseCost || 0) / 2)})
                  </button>
                )}

                {!selectedProperty.mortgaged && selectedProperty.houses === 0 && (
                  <button
                    onClick={() => onMortgage(selectedProperty.id)}
                    className="w-full py-2 btn-danger text-white rounded-lg text-sm font-bold"
                  >
                    📜 Mortgage (+${Math.floor((selectedProperty.price || 0) / 2)})
                  </button>
                )}

                {selectedProperty.mortgaged && (
                  <button
                    onClick={() => onUnmortgage(selectedProperty.id)}
                    className="w-full py-2 btn-primary text-white rounded-lg text-sm font-bold"
                  >
                    ✅ Unmortgage (${Math.floor((selectedProperty.price || 0) / 2)})
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-300 text-sm">Click on a property to view details</p>
        )}
      </div>

      {/* Game Log */}
      <div className="glass-panel rounded-2xl p-5 text-white h-52 overflow-y-auto">
        <h3 className="font-bold text-lg mb-2">📜 Game Log</h3>
        <div className="text-sm space-y-1">
          {logs.map((log, idx) => (
            <div key={idx} className="text-gray-300 border-b border-white/10 py-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
