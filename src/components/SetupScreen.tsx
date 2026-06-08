import { PLAYER_COLORS, PLAYER_TOKENS, adjustColor } from '../gameData';

interface SetupScreenProps {
  playerCount: number;
  setPlayerCount: (count: number) => void;
  playerNames: string[];
  setPlayerNames: (names: string[]) => void;
  rules: {
    freeParking: boolean;
    doubleGo: boolean;
    noAuction: boolean;
    speedDie: boolean;
  };
  setRules: (rules: any) => void;
  startingMoney: number;
  setStartingMoney: (money: number) => void;
  onStartGame: () => void;
}

export default function SetupScreen({
  playerCount,
  setPlayerCount,
  playerNames,
  setPlayerNames,
  rules,
  setRules,
  startingMoney,
  setStartingMoney,
  onStartGame,
}: SetupScreenProps) {
  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    setPlayerCount(count);
    const newNames = [...playerNames];
    while (newNames.length < count) {
      newNames.push(`Player ${newNames.length + 1}`);
    }
    setPlayerNames(newNames.slice(0, count));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 p-4">
      <div className="setup-card rounded-3xl p-10 max-w-2xl w-full text-white">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-2 glow-text">🎲 MONOPOLY 🎲</h1>
          <p className="text-gray-300 text-lg">The Ultimate 3D Property Trading Experience</p>
        </div>

        <div className="mb-8">
          <label className="block mb-3 font-semibold text-lg">Number of Players</label>
          <input
            type="range"
            min="2"
            max="8"
            value={playerCount}
            onChange={handlePlayerCountChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="text-3xl font-bold text-center mt-2 text-yellow-400">
            {playerCount} Players
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {Array.from({ length: playerCount }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/30 transition"
            >
              <span className="text-3xl">{PLAYER_TOKENS[i]}</span>
              <input
                type="text"
                placeholder={`Player ${i + 1}`}
                value={playerNames[i] || ''}
                onChange={(e) => handleNameChange(i, e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-yellow-400 outline-none"
              />
              <div
                className="w-8 h-8 rounded-full shadow-lg"
                style={{
                  background: `linear-gradient(145deg, ${PLAYER_COLORS[i]}, ${adjustColor(PLAYER_COLORS[i], -30)})`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-xl flex items-center gap-2">🎮 Custom Rules</h3>
          <div className="grid grid-cols-1 gap-4 bg-white/5 p-5 rounded-2xl">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={rules.freeParking}
                onChange={(e) => setRules({ ...rules, freeParking: e.target.checked })}
                className="w-6 h-6 accent-yellow-400 rounded"
              />
              <span>💰 Free Parking collects fines & taxes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={rules.doubleGo}
                onChange={(e) => setRules({ ...rules, doubleGo: e.target.checked })}
                className="w-6 h-6 accent-yellow-400 rounded"
              />
              <span>🎯 Double money for landing exactly on GO</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={rules.noAuction}
                onChange={(e) => setRules({ ...rules, noAuction: e.target.checked })}
                className="w-6 h-6 accent-yellow-400 rounded"
              />
              <span>🚫 No auctions - properties stay unsold</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition">
              <input
                type="checkbox"
                checked={rules.speedDie}
                onChange={(e) => setRules({ ...rules, speedDie: e.target.checked })}
                className="w-6 h-6 accent-yellow-400 rounded"
              />
              <span>⚡ Speed Die (extra die with special actions)</span>
            </label>
            <div className="flex items-center gap-3 p-2">
              <span>💵 Starting Money: $</span>
              <input
                type="number"
                value={startingMoney}
                onChange={(e) => setStartingMoney(parseInt(e.target.value) || 1500)}
                min="500"
                max="5000"
                step="100"
                className="w-28 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-yellow-400 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onStartGame}
          className="w-full py-5 btn-success rounded-2xl font-bold text-2xl hover:scale-105 transition-transform shadow-2xl text-white"
        >
          🚀 START GAME
        </button>
      </div>
    </div>
  );
}
