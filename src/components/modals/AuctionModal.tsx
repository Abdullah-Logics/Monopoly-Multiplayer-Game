import { useState } from 'react';
import { Player, GameProperty, AuctionData } from '../../types';

interface AuctionModalProps {
  isOpen: boolean;
  auctionData: AuctionData | null;
  property: GameProperty | null;
  players: Player[];
  onPlaceBid: (amount: number) => void;
  onPass: () => void;
}

export default function AuctionModal({
  isOpen,
  auctionData,
  property,
  players,
  onPlaceBid,
  onPass,
}: AuctionModalProps) {
  const [bidAmount, setBidAmount] = useState(10);

  if (!isOpen || !auctionData || !property) return null;

  const currentBidderIdx = auctionData.activePlayers[auctionData.currentIdx];
  const currentPlayer = players[currentBidderIdx];
  const currentBidder =
    auctionData.currentBidder !== null ? players[auctionData.currentBidder] : null;

  const handleBid = () => {
    if (bidAmount > auctionData.currentBid && bidAmount <= currentPlayer.money) {
      onPlaceBid(bidAmount);
      setBidAmount(bidAmount + 10);
    }
  };

  return (
    <div className="modal active">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-center">🔨 Auction: {property.name}</h2>
        <div className="text-center mb-4 p-4 bg-gray-100 rounded-xl">
          <p className="text-lg">
            Current Bid:{' '}
            <span className="text-3xl font-black text-green-600">${auctionData.currentBid}</span>
          </p>
          {currentBidder ? (
            <p className="text-gray-600">By: {currentBidder.name}</p>
          ) : (
            <p className="text-gray-400">No bids yet</p>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-4 border-2 border-blue-200">
          <p className="font-bold text-xl mb-2" style={{ color: currentPlayer.color }}>
            {currentPlayer.token} {currentPlayer.name}'s Turn to Bid
          </p>
          <p className="text-gray-600">
            Your balance:{' '}
            <span className="font-bold text-green-600">${currentPlayer.money.toLocaleString()}</span>
          </p>

          <div className="flex gap-2 mt-4">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(parseInt(e.target.value) || auctionData.currentBid + 1)}
              min={auctionData.currentBid + 1}
              max={currentPlayer.money}
              className="flex-1 px-4 py-3 border-2 rounded-xl text-lg font-bold focus:border-blue-500 outline-none"
            />
            <button
              onClick={handleBid}
              disabled={bidAmount <= auctionData.currentBid || bidAmount > currentPlayer.money}
              className="px-6 py-3 btn-success text-white rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
            >
              💰 Bid
            </button>
            <button
              onClick={onPass}
              className="px-6 py-3 btn-danger text-white rounded-xl font-bold hover:scale-105 transition"
            >
              ❌ Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
