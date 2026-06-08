// Game Data Constants

export interface PropertyData {
  id: number;
  name: string;
  type: 'corner' | 'property' | 'railroad' | 'utility' | 'tax' | 'chance' | 'chest';
  icon?: string;
  color: string;
  price?: number;
  rent?: number[];
  houseCost?: number;
  group?: string;
  amount?: number;
}

export const PROPERTIES: PropertyData[] = [
  { id: 0, name: "GO", type: "corner", icon: "🏁", color: "#fff" },
  { id: 1, name: "Mediterranean Avenue", type: "property", color: "#8B4513", price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, group: "brown" },
  { id: 2, name: "Community Chest", type: "chest", icon: "💰", color: "#fff" },
  { id: 3, name: "Baltic Avenue", type: "property", color: "#8B4513", price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, group: "brown" },
  { id: 4, name: "Income Tax", type: "tax", icon: "💸", color: "#fff", amount: 200 },
  { id: 5, name: "Reading Railroad", type: "railroad", icon: "🚂", color: "#000", price: 200, group: "railroad" },
  { id: 6, name: "Oriental Avenue", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, group: "lightblue" },
  { id: 7, name: "Chance", type: "chance", icon: "❓", color: "#fff" },
  { id: 8, name: "Vermont Avenue", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, group: "lightblue" },
  { id: 9, name: "Connecticut Avenue", type: "property", color: "#87CEEB", price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, group: "lightblue" },
  { id: 10, name: "JAIL", type: "corner", icon: "🔒", color: "#fff" },
  { id: 11, name: "St. Charles Place", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, group: "pink" },
  { id: 12, name: "Electric Company", type: "utility", icon: "💡", color: "#FFD700", price: 150, group: "utility" },
  { id: 13, name: "States Avenue", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, group: "pink" },
  { id: 14, name: "Virginia Avenue", type: "property", color: "#FF69B4", price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100, group: "pink" },
  { id: 15, name: "Pennsylvania Railroad", type: "railroad", icon: "🚂", color: "#000", price: 200, group: "railroad" },
  { id: 16, name: "St. James Place", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, group: "orange" },
  { id: 17, name: "Community Chest", type: "chest", icon: "💰", color: "#fff" },
  { id: 18, name: "Tennessee Avenue", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, group: "orange" },
  { id: 19, name: "New York Avenue", type: "property", color: "#FFA500", price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, group: "orange" },
  { id: 20, name: "FREE PARKING", type: "corner", icon: "🅿️", color: "#fff" },
  { id: 21, name: "Kentucky Avenue", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, group: "red" },
  { id: 22, name: "Chance", type: "chance", icon: "❓", color: "#fff" },
  { id: 23, name: "Indiana Avenue", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, group: "red" },
  { id: 24, name: "Illinois Avenue", type: "property", color: "#FF0000", price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, group: "red" },
  { id: 25, name: "B&O Railroad", type: "railroad", icon: "🚂", color: "#000", price: 200, group: "railroad" },
  { id: 26, name: "Atlantic Avenue", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, group: "yellow" },
  { id: 27, name: "Ventnor Avenue", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, group: "yellow" },
  { id: 28, name: "Water Works", type: "utility", icon: "💧", color: "#87CEEB", price: 150, group: "utility" },
  { id: 29, name: "Marvin Gardens", type: "property", color: "#FFFF00", price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, group: "yellow" },
  { id: 30, name: "GO TO JAIL", type: "corner", icon: "👮", color: "#fff" },
  { id: 31, name: "Pacific Avenue", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, group: "green" },
  { id: 32, name: "North Carolina Avenue", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, group: "green" },
  { id: 33, name: "Community Chest", type: "chest", icon: "💰", color: "#fff" },
  { id: 34, name: "Pennsylvania Avenue", type: "property", color: "#228B22", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, group: "green" },
  { id: 35, name: "Short Line", type: "railroad", icon: "🚂", color: "#000", price: 200, group: "railroad" },
  { id: 36, name: "Chance", type: "chance", icon: "❓", color: "#fff" },
  { id: 37, name: "Park Place", type: "property", color: "#0000CD", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, group: "darkblue" },
  { id: 38, name: "Luxury Tax", type: "tax", icon: "💎", color: "#fff", amount: 100 },
  { id: 39, name: "Boardwalk", type: "property", color: "#0000CD", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, group: "darkblue" }
];

export interface CardData {
  text: string;
  action: string;
  value?: number;
  position?: number;
}

export const CHANCE_CARDS: CardData[] = [
  { text: "Advance to GO! Collect $200.", action: "moveToGo" },
  { text: "Advance to Illinois Avenue.", action: "moveTo", position: 24 },
  { text: "Advance to St. Charles Place.", action: "moveTo", position: 11 },
  { text: "Bank pays you dividend of $50.", action: "collect", value: 50 },
  { text: "Get Out of Jail Free card!", action: "jailCard" },
  { text: "Go back 3 spaces.", action: "moveBack", value: 3 },
  { text: "Go directly to Jail!", action: "goToJail" },
  { text: "Make repairs: $25 per house, $100 per hotel.", action: "repairs", value: 25 },
  { text: "Pay poor tax of $15.", action: "pay", value: 15 },
  { text: "Advance to Reading Railroad.", action: "moveTo", position: 5 },
  { text: "Advance to Boardwalk!", action: "moveTo", position: 39 },
  { text: "You are elected chairman. Pay each player $50.", action: "payEach", value: 50 },
  { text: "Your building loan matures. Collect $150.", action: "collect", value: 150 },
  { text: "You won a crossword competition! Collect $100.", action: "collect", value: 100 }
];

export const CHEST_CARDS: CardData[] = [
  { text: "Advance to GO! Collect $200.", action: "moveToGo" },
  { text: "Bank error in your favor. Collect $200.", action: "collect", value: 200 },
  { text: "Doctor's fee. Pay $50.", action: "pay", value: 50 },
  { text: "From sale of stock you get $50.", action: "collect", value: 50 },
  { text: "Get Out of Jail Free card!", action: "jailCard" },
  { text: "Go directly to Jail!", action: "goToJail" },
  { text: "Grand Opera Night. Collect $50 from every player.", action: "collectFromAll", value: 50 },
  { text: "Holiday Fund matures. Collect $100.", action: "collect", value: 100 },
  { text: "Income tax refund. Collect $20.", action: "collect", value: 20 },
  { text: "It's your birthday! Collect $10 from each player.", action: "collectFromAll", value: 10 },
  { text: "Life insurance matures. Collect $100.", action: "collect", value: 100 },
  { text: "Hospital fees. Pay $100.", action: "pay", value: 100 },
  { text: "School fees. Pay $50.", action: "pay", value: 50 },
  { text: "Receive $25 consultancy fee.", action: "collect", value: 25 },
  { text: "You inherit $100.", action: "collect", value: 100 },
  { text: "You won second prize in beauty contest! Collect $10.", action: "collect", value: 10 }
];

export const PLAYER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e63', '#00bcd4'];
export const PLAYER_TOKENS = ['🚗', '🎩', '👞', '🐕', '🚢', '🎸', '🏠', '💎'];

export function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export function getDiceFace(num: number): string {
  const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  return faces[num] || String(num);
}

export function getShortName(name: string, type: string): string {
  if (type === 'corner') return name;
  const words = name.split(' ');
  return words.length > 1 ? words[0] : name;
}
