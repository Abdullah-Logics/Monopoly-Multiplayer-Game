// Game State Types

export interface Player {
  id: number;
  name: string;
  money: number;
  position: number;
  properties: number[];
  inJail: boolean;
  jailTurns: number;
  bankrupt: boolean;
  getOutOfJailCards: number;
  color: string;
  token: string;
}

export interface GameProperty {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color: string;
  price?: number;
  rent?: number[];
  houseCost?: number;
  group?: string;
  amount?: number;
  owner: number | null;
  houses: number;
  mortgaged: boolean;
}

export interface GameRules {
  freeParking: boolean;
  doubleGo: boolean;
  noAuction: boolean;
  speedDie: boolean;
}

export interface AuctionData {
  propId: number;
  currentBid: number;
  currentBidder: number | null;
  activePlayers: number[];
  currentIdx: number;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  properties: Record<number, GameProperty>;
  freeParking: number;
  rules: GameRules;
  diceRolled: boolean;
  doublesCount: number;
  gameStarted: boolean;
  auctionData: AuctionData | null;
  logs: string[];
  dice: [number, number];
  speedDieValue: string;
}

export type ModalType = 'property' | 'trade' | 'card' | 'auction' | 'gameOver' | null;
