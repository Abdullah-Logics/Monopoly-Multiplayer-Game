import { useState, useEffect } from 'react';
import { Player, GameProperty } from '../../types';

interface TradeModalProps {
  isOpen: boolean;
  currentPlayer: Player;
  players: Player[];
  properties: Record<number, GameProperty>;
  onExecuteTrade: (
    partnerId: number,
    offerMoney: number,
    receiveMoney: number,
    offerProps: number[],
    receiveProps: number[]
  ) => void;
  onClose: () => void;
}

export default function TradeModal({
  isOpen,
  currentPlayer,
  players,
  properties,
  onExecuteTrade,
  onClose,
}: TradeModalProps) {
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [offerMoney, setOfferMoney] = useState(0);
  const [receiveMoney, setReceiveMoney] = useState(0);
  const [offerProps, setOfferProps] = useState<number[]>([]);
  const [receiveProps, setReceiveProps] = useState<number[]>([]);

  const otherPlayers = players.filter((p) => p.id !== currentPlayer.id && !p.bankrupt);
  const partner = partnerId !== null ? players[partnerId] : null;

  useEffect(() => {
    if (isOpen && otherPlayers.length > 0 && partnerId === null) {
      setPartnerId(otherPlayers[0].id);
    }
  }, [isOpen, otherPlayers, partnerId]);

  useEffect(() => {
    setReceiveProps([]);
  }, [partnerId]);

  if (!isOpen) return null;

  const toggleOfferProp = (propId: number) => {
    setOfferProps((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const toggleReceiveProp = (propId: number) => {
    setReceiveProps((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const handleExecute = () => {
    if (partnerId === null) return;
    onExecuteTrade(partnerId, offerMoney, receiveMoney, offerProps, receiveProps);
    setOfferMoney(0);
    setReceiveMoney(0);
    setOfferProps([]);
    setReceiveProps([]);
  };

  return (
    <div className="modal active" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 750 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">🤝 Trade Properties</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Offer Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3
              className="font-bold text-lg mb-3"
              style={{ color: currentPlayer.color }}
            >
              {currentPlayer.token} {currentPlayer.name} Offers:
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold">💵 Money:</label>
                <input
                  type="number"
                  value={offerMoney}
                  onChange={(e) => setOfferMoney(Math.min(currentPlayer.money, parseInt(e.target.value) || 0))}
                  min={0}
                  max={currentPlayer.money}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">🏠 Properties:</label>
                <div className="space-y-1 max-h-40 overflow-y-auto mt-2">
                  {currentPlayer.properties.length > 0 ? (
                    currentPlayer.properties.map((pId) => {
                      const p = properties[pId];
                      return (
                        <label
                          key={pId}
                          className="flex items-center gap-2 text-sm p-2 bg-white rounded hover:bg-blue-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={offerProps.includes(pId)}
                            onChange={() => toggleOfferProp(pId)}
                            className="w-4 h-4"
                          />
                          <span
                            className="w-4 h-4 rounded"
                            style={{ background: p.color }}
                          />
                          {p.name}
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-sm">No properties owned</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Receive Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-lg mb-3">🤝 Trade With:</h3>
            <select
              value={partnerId ?? ''}
              onChange={(e) => setPartnerId(parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 rounded-lg mb-3 focus:border-blue-500 outline-none"
            >
              {otherPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.token} {p.name} (${p.money.toLocaleString()})
                </option>
              ))}
            </select>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold">💵 Receive Money:</label>
                <input
                  type="number"
                  value={receiveMoney}
                  onChange={(e) => setReceiveMoney(Math.min(partner?.money || 0, parseInt(e.target.value) || 0))}
                  min={0}
                  max={partner?.money || 0}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">🏠 Receive Properties:</label>
                <div className="space-y-1 max-h-40 overflow-y-auto mt-2">
                  {partner && partner.properties.length > 0 ? (
                    partner.properties.map((pId) => {
                      const p = properties[pId];
                      return (
                        <label
                          key={pId}
                          className="flex items-center gap-2 text-sm p-2 bg-white rounded hover:bg-blue-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={receiveProps.includes(pId)}
                            onChange={() => toggleReceiveProp(pId)}
                            className="w-4 h-4"
                          />
                          <span
                            className="w-4 h-4 rounded"
                            style={{ background: p.color }}
                          />
                          {p.name}
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-sm">No properties owned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleExecute}
            className="flex-1 py-4 btn-success text-white rounded-xl font-bold hover:scale-105 transition"
          >
            ✅ Confirm Trade
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 btn-danger text-white rounded-xl font-bold hover:scale-105 transition"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
