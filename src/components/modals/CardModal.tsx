interface CardModalProps {
  isOpen: boolean;
  cardType: 'chance' | 'chest' | null;
  cardText: string;
  onClose: () => void;
}

export default function CardModal({
  isOpen,
  cardType,
  cardText,
  onClose,
}: CardModalProps) {
  if (!isOpen) return null;

  const bgColor =
    cardType === 'chance' ? 'from-orange-400 to-red-500' : 'from-blue-400 to-purple-500';

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-8xl mb-4">{cardType === 'chance' ? '❓' : '💰'}</div>
        <div
          className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${bgColor} text-white font-bold text-xl mb-4`}
        >
          {cardType === 'chance' ? 'CHANCE' : 'COMMUNITY CHEST'}
        </div>
        <p className="text-xl font-semibold">{cardText}</p>
        <button
          onClick={onClose}
          className="mt-6 px-10 py-4 btn-primary text-white rounded-xl font-bold hover:scale-105 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
