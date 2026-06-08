import { useRef, useEffect, useState } from 'react';
import { GameProperty, Player } from '../types';
import { adjustColor, getShortName } from '../gameData';

interface BoardProps {
  properties: Record<number, GameProperty>;
  players: Player[];
  freeParking: number;
  onPropertyClick: (propId: number) => void;
}

export default function Board({ properties, players, freeParking, onPropertyClick }: BoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 55, z: -45 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      setRotation((prev) => ({
        z: prev.z + deltaX * 0.5,
        x: Math.max(20, Math.min(80, prev.x - deltaY * 0.3)),
      }));

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.rotation-btn')) return;
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const rotateBoard = (deltaZ: number, deltaX: number) => {
    setRotation((prev) => ({
      z: prev.z + deltaZ,
      x: Math.max(20, Math.min(80, prev.x + deltaX)),
    }));
  };

  const resetRotation = () => {
    setRotation({ x: 55, z: -45 });
  };

  const cellSize = { corner: 85, side: 47 };
  const boardSize = 600;

  const getCellPosition = (idx: number) => {
    let left = 0,
      top = 0,
      width = 0,
      height = 0;

    if (idx === 0) {
      left = boardSize - cellSize.corner;
      top = boardSize - cellSize.corner;
      width = height = cellSize.corner;
    } else if (idx === 10) {
      left = 0;
      top = boardSize - cellSize.corner;
      width = height = cellSize.corner;
    } else if (idx === 20) {
      left = 0;
      top = 0;
      width = height = cellSize.corner;
    } else if (idx === 30) {
      left = boardSize - cellSize.corner;
      top = 0;
      width = height = cellSize.corner;
    } else if (idx > 0 && idx < 10) {
      left = boardSize - cellSize.corner - idx * cellSize.side;
      top = boardSize - cellSize.corner;
      width = cellSize.side;
      height = cellSize.corner;
    } else if (idx > 10 && idx < 20) {
      left = 0;
      top = boardSize - cellSize.corner - (idx - 10) * cellSize.side;
      width = cellSize.corner;
      height = cellSize.side;
    } else if (idx > 20 && idx < 30) {
      left = cellSize.corner + (idx - 21) * cellSize.side;
      top = 0;
      width = cellSize.side;
      height = cellSize.corner;
    } else if (idx > 30) {
      left = boardSize - cellSize.corner;
      top = cellSize.corner + (idx - 31) * cellSize.side;
      width = cellSize.corner;
      height = cellSize.side;
    }

    return { left, top, width, height };
  };

  const getPlayersAtPosition = (position: number) => {
    return players.filter((p) => p.position === position && !p.bankrupt);
  };

  return (
    <div
      ref={containerRef}
      className="board-container mb-4"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        ref={boardRef}
        className="board-3d relative"
        style={{
          width: 600,
          height: 600,
          transform: `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
        }}
      >
        <div className="board-surface" />

        {/* Center Logo */}
        <div className="center-logo">
          <div className="monopoly-text">MONOPOLY</div>
          <div className="text-lg text-white/80 mt-2 font-semibold">
            🅿️ Free Parking: ${freeParking}
          </div>
        </div>

        {/* Property Cells */}
        {Object.values(properties).map((prop) => {
          const pos = getCellPosition(prop.id);
          const isCorner = [0, 10, 20, 30].includes(prop.id);
          const owner = prop.owner !== null ? players[prop.owner] : null;
          const playersHere = getPlayersAtPosition(prop.id);

          return (
            <div
              key={prop.id}
              className={`property-cell ${isCorner ? 'corner-cell' : ''} ${prop.mortgaged ? 'property-mortgaged' : ''}`}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
                boxShadow: owner
                  ? `inset 0 0 0 4px ${owner.color}, 2px 2px 5px rgba(0,0,0,0.3)`
                  : undefined,
              }}
              onClick={() => onPropertyClick(prop.id)}
            >
              {/* Color bar for properties */}
              {prop.type === 'property' && prop.color && (
                <div className="color-bar" style={{ backgroundColor: prop.color }} />
              )}

              {/* Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center p-1">
                {prop.icon && <span className="text-lg">{prop.icon}</span>}
                <span className="leading-tight text-[6px] font-semibold">
                  {getShortName(prop.name, prop.type)}
                </span>
              </div>

              {/* Price */}
              {prop.price && (
                <div className="text-center font-bold text-[7px] pb-1">${prop.price}</div>
              )}

              {/* Houses */}
              {prop.type === 'property' && prop.houses > 0 && (
                <div className="houses-container flex justify-center absolute bottom-1 left-0 right-0">
                  {prop.houses === 5 ? (
                    <div className="hotel" />
                  ) : (
                    Array.from({ length: prop.houses }).map((_, i) => (
                      <div key={i} className="house" />
                    ))
                  )}
                </div>
              )}

              {/* Player Tokens */}
              {playersHere.map((player, idx) => (
                <div
                  key={player.id}
                  className="player-token"
                  style={{
                    background: `linear-gradient(145deg, ${player.color}, ${adjustColor(player.color, -40)})`,
                    left: 8 + (idx % 3) * 18,
                    top: 20 + Math.floor(idx / 3) * 18,
                  }}
                >
                  {player.token}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Rotation Controls */}
      <div className="rotation-controls">
        <button className="rotation-btn" onClick={() => rotateBoard(-15, 0)} title="Rotate Left">
          ↺
        </button>
        <button className="rotation-btn" onClick={() => rotateBoard(0, -15)} title="Tilt Up">
          ↑
        </button>
        <button className="rotation-btn" onClick={() => rotateBoard(0, 15)} title="Tilt Down">
          ↓
        </button>
        <button className="rotation-btn" onClick={() => rotateBoard(15, 0)} title="Rotate Right">
          ↻
        </button>
        <button className="rotation-btn" onClick={resetRotation} title="Reset">
          ⟳
        </button>
      </div>
    </div>
  );
}
