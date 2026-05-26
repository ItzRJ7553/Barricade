export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  rank: string;
  divisionNum: string;
  totalBarricades: number;
  barricadesUsed: number;
  playerTime: number; // in seconds
  color: string; // cyan or purple
  primaryHex: string;
  secondaryHex: string;
}

export type GridCoord = [number, number]; // [col, row], 0-indexed (0-8)

export interface Barricade {
  id: string;
  rx: number; // intersection index row (0 to 7)
  cx: number; // intersection index col (0 to 7)
  orientation: 'horizontal' | 'vertical';
  ownerId: string;
}

export interface LogEntry {
  id: string;
  timestamp: string; // e.g. "08:22:15"
  turnNumber: number;
  player: string;
  action: string; // e.g. "E2 -> MOVE -> E3" or "placed BARRICADE at C4-D4"
  type: 'move' | 'barricade' | 'system';
}

export interface Emote {
  text: string;
  icon: string;
}

export type GameMode = 'training' | 'ranked' | 'samedevice';
