import { Player, GameProperty } from '../../types';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Player | null;
  properties: Record<number, GameProperty>;
}

export default function GameOverModal({ isOpen, winner, properties }: GameOverModalProps) {
  if (!isOpen || !winner) return null;

  const totalWealth =
    winner.money +
    winner.properties.reduce((sum, pId) => {
      const p = properties[pId];
      return sum + (p.price || 0) + (p.houses || 0) * (p.houseCost || 0);
    }, 0);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="modal active">
      <div className="modal-content text-center" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-5xl font-black mb-6">🏆 GAME OVER 🏆</h1>
        <div className="text-8xl mb-6">{winner.token}</div>
        <h2 className="text-4xl font-black" style={{ color: winner.color }}>
          {winner.name} WINS!
        </h2>
        <div className="mt-6 p-6 bg-gray-100 rounded-2xl inline-block">
          <p className="text-2xl font-bold text-green-600">
            💰 Total Wealth: ${totalWealth.toLocaleString()}
          </p>
          <p className="text-gray-600 mt-2">🏠 Properties Owned: {winner.properties.length}</p>
        </div>
        <button
          onClick={handleRestart}
          className="mt-8 px-10 py-5 btn-success text-white rounded-2xl font-bold text-xl hover:scale-105 transition"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
