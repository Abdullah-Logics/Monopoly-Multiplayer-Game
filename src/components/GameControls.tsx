import { getDiceFace } from '../gameData';

interface GameControlsProps {
  dice: [number, number];
  speedDieValue: string;
  isRolling: boolean;
  showSpeedDie: boolean;
  canRoll: boolean;
  showEndTurn: boolean;
  onRollDice: () => void;
  onEndTurn: () => void;
  onOpenTrade: () => void;
}

export default function GameControls({
  dice,
  speedDieValue,
  isRolling,
  showSpeedDie,
  canRoll,
  showEndTurn,
  onRollDice,
  onEndTurn,
  onOpenTrade,
}: GameControlsProps) {
  return (
    <div className="flex items-center gap-6 glass-panel rounded-2xl p-5">
      <div className="dice-container">
        <div
          className={`dice ${isRolling ? 'rolling' : ''}`}
          onClick={canRoll ? onRollDice : undefined}
        >
          {dice[0] > 0 ? getDiceFace(dice[0]) : '?'}
        </div>
        <div
          className={`dice ${isRolling ? 'rolling' : ''}`}
          onClick={canRoll ? onRollDice : undefined}
        >
          {dice[1] > 0 ? getDiceFace(dice[1]) : '?'}
        </div>
        {showSpeedDie && (
          <div
            className={`dice ${isRolling ? 'rolling' : ''}`}
            style={{
              width: 55,
              height: 55,
              fontSize: 22,
              background: 'linear-gradient(145deg, #fff9c4, #fff176)',
            }}
          >
            {speedDieValue || '⚡'}
          </div>
        )}
      </div>

      {!showEndTurn && (
        <button
          onClick={onRollDice}
          disabled={!canRoll}
          className="px-8 py-4 btn-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎲 ROLL DICE
        </button>
      )}

      {showEndTurn && (
        <button
          onClick={onEndTurn}
          className="px-8 py-4 btn-danger text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform"
        >
          ➡️ END TURN
        </button>
      )}

      <button
        onClick={onOpenTrade}
        className="px-8 py-4 btn-success text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform"
      >
        🤝 TRADE
      </button>
    </div>
  );
}
