import { Player, GameProperty } from '../../types';
import { adjustColor } from '../../gameData';

interface PropertyModalProps {
  isOpen: boolean;
  property: GameProperty | null;
  player: Player;
  noAuction: boolean;
  onBuy: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export default function PropertyModal({
  isOpen,
  property,
  player,
  noAuction,
  onBuy,
  onDecline,
  onClose,
}: PropertyModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div
            className="w-full h-10 rounded-t-xl mb-4"
            style={{
              background: `linear-gradient(145deg, ${property.color}, ${adjustColor(property.color || '#ffffff', -30)})`,
            }}
          />
          <h2 className="text-2xl font-bold mb-2">{property.name}</h2>
          <p className="text-4xl font-black text-green-600 mb-4">${property.price}</p>

          {property.rent && (
            <div className="bg-gray-100 rounded-xl p-4 mb-4 text-sm">
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>💵 Rent:</div>
                <div className="font-bold">${property.rent[0]}</div>
                <div>🏠 1 House:</div>
                <div className="font-bold">${property.rent[1]}</div>
                <div>🏠🏠 2 Houses:</div>
                <div className="font-bold">${property.rent[2]}</div>
                <div>🏠🏠🏠 3 Houses:</div>
                <div className="font-bold">${property.rent[3]}</div>
                <div>🏠🏠🏠🏠 4 Houses:</div>
                <div className="font-bold">${property.rent[4]}</div>
                <div>🏨 Hotel:</div>
                <div className="font-bold">${property.rent[5]}</div>
              </div>
              <div className="mt-3 pt-3 border-t">
                🔨 House Cost: <span className="font-bold">${property.houseCost}</span>
              </div>
            </div>
          )}

          <p className="mb-4 text-lg">
            Your balance:{' '}
            <span className="font-bold text-green-600">${player.money.toLocaleString()}</span>
          </p>

          <div className="flex gap-3">
            {player.money >= (property.price || 0) && (
              <button
                onClick={onBuy}
                className="flex-1 py-4 btn-success text-white rounded-xl font-bold hover:scale-105 transition"
              >
                ✅ Buy for ${property.price}
              </button>
            )}
            <button
              onClick={onDecline}
              className="flex-1 py-4 btn-danger text-white rounded-xl font-bold hover:scale-105 transition"
            >
              {noAuction ? '❌ Pass' : '🔨 Auction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
