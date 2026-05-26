import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, ShieldAlert, Cpu, Trophy, Radio, MessageSquare, 
  Settings, Zap, History, BarChart2, CornerDownRight, ChevronDown, 
  ChevronUp, RotateCcw, AlertTriangle, ShieldCheck, Play, ArrowRight,
  UserCheck, Swords
} from 'lucide-react';
import { Player, GridCoord, Barricade, LogEntry, GameMode, Emote } from '../types';

interface BoardHUDProps {
  onBackToMenu: () => void;
  gameMode: GameMode;
  onUpdateCredits: (amount: number) => void;
  myId?: string;
  myName?: string;
  myAvatar?: string;
  matchId?: string | null;
  playerIndex?: number | null;
}

const EMOTE_WHEEL_ITEMS: Emote[] = [
  { text: "GL HF!", icon: "🤝" },
  { text: "CALCULATED CORRIDOR.", icon: "🧠" },
  { text: "NICE MOVE!", icon: "⚡" },
  { text: "BLOCKED BY SECURE PROTOCOL.", icon: "🔒" },
  { text: "PREDICTIVE PATH ACTIVE.", icon: "👁️" },
  { text: "SYNC CRITICAL ERROR...", icon: "🤯" }
];

export default function BoardHUD({ 
  onBackToMenu, 
  gameMode, 
  onUpdateCredits,
  myId,
  myName,
  myAvatar,
  matchId,
  playerIndex
}: BoardHUDProps) {
  // 1. Core State
  const [turn, setTurn] = useState<0 | 1>(0); // 0 = Player 1, 1 = Player 2
  const [p1Pos, setP1Pos] = useState<GridCoord>([4, 0]); // P1 Start: E1
  const [p2Pos, setP2Pos] = useState<GridCoord>([4, 8]); // P2 Start: E9
  const [walls, setWalls] = useState<Barricade[]>([]);
  
  // Game state parameters
  const [isGameOver, setIsGameOver] = useState(false);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [p1Budget, setP1Budget] = useState(10);
  const [p2Budget, setP2Budget] = useState(10);
  const [isP1EmoteOpen, setIsP1EmoteOpen] = useState(false);
  const [p1EmoteText, setP1EmoteText] = useState<string | null>(null);
  const [p2EmoteText, setP2EmoteText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'log' | 'intel'>('log');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Turn configuration flow variables
  const [actionType, setActionType] = useState<'move' | 'barricade'>('move');
  const [selectedWallOrientation, setSelectedWallOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Custom interactive confirmation toggled states
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [opponentAvatar, setOpponentAvatar] = useState<string | null>(null);
  const [matchStatus, setMatchStatus] = useState<'waiting' | 'active' | 'finished'>('active');
  const [confirmActions, setConfirmActions] = useState<boolean>(false); // FALSE: Instant clicks. TRUE: Requires clicking CONFIRM Action.
  const [previewPos, setPreviewPos] = useState<GridCoord | null>(null);
  const [previewWall, setPreviewWall] = useState<{ rx: number; cx: number; orientation: 'horizontal' | 'vertical' } | null>(null);

  // Drag-and-drop state variables for tactile physical pickup and placing
  const [isDraggingWall, setIsDraggingWall] = useState(false);
  const [draggedWallOrientation, setDraggedWallOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  // Logs and timers
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'l1', timestamp: '13:04:55', turnNumber: 0, player: 'SYSTEM', action: 'INIT SYNC HANDSHAKE... SECURE GATE ESTABLISHED', type: 'system' },
    { id: 'l2', timestamp: '13:04:58', turnNumber: 0, player: 'SYSTEM', action: 'BATTLEPROTOCOL STABLE: MATCH LIVE', type: 'system' }
  ]);
  const [matchSeconds, setMatchSeconds] = useState(0); 
  const [p1TimeLeft, setP1TimeLeft] = useState(120); 
  const [p2TimeLeft, setP2TimeLeft] = useState(120); 
  
  // Per-turn countdown clock (45s)
  const [turnTimeLeft, setTurnTimeLeft] = useState(45);

  // 1b. Live Online Match synchronizer effect (Poll status if Ranked lobby is active)
  useEffect(() => {
    if (gameMode !== 'ranked' || !matchId) return;

    let active = true;
    const pollStatus = async () => {
      try {
        const resp = await fetch(`/api/matchmaking/status?matchId=${matchId}`);
        if (!resp.ok) return;
        const data = await resp.json();
        if (active) {
          setTurn(data.turn);
          setP1Pos(data.p1Pos);
          setP2Pos(data.p2Pos);
          setWalls(data.walls);
          setP1Budget(data.p1Budget);
          setP2Budget(data.p2Budget);
          setLogs(data.logs);
          setWinnerIdx(data.winnerIdx);
          setIsGameOver(data.status === 'finished');
          setMatchStatus(data.status);
          setMatchSeconds(data.matchSeconds);
          setTurnTimeLeft(data.turnTimeLeft);
          setP1TimeLeft(data.p1TimeLeft);
          setP2TimeLeft(data.p2TimeLeft);
          setP1EmoteText(data.p1EmoteText);
          setP2EmoteText(data.p2EmoteText);

          // Dynamically capture opponent profile details
          if (playerIndex === 0) {
            // I am player 1 (host), my opponent is player 2
            if (data.p2Name) setOpponentName(data.p2Name);
            if (data.p2Avatar) setOpponentAvatar(data.p2Avatar);
          } else {
            // I am player 2, my opponent is player 1
            if (data.p1Name) setOpponentName(data.p1Name);
            if (data.p1Avatar) setOpponentAvatar(data.p1Avatar);
          }
        }
      } catch (e) {
        console.error("Multiplayer link error", e);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 900);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [gameMode, matchId]);

  // 2. Timers Effect (runs local turn clock decrementing only in offline play)
  useEffect(() => {
    if (isGameOver || isAiProcessing || gameMode === 'ranked') return;
    const interval = setInterval(() => {
      setMatchSeconds((prev) => prev + 1);
      
      // Local Turn time ticker decrement
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          setTimeout(() => handleTurnTimeout(), 0);
          return 45;
        }
        return prev - 1;
      });

      if (turn === 0) {
        setP1TimeLeft((prev) => (prev > 0 ? prev - 1 : 120));
      } else {
        setP2TimeLeft((prev) => (prev > 0 ? prev - 1 : 120));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, isGameOver, isAiProcessing, gameMode]);

  // 2b. Drag and drop physical wall gesture listener
  useEffect(() => {
    if (!isDraggingWall) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPosition({ x: e.clientX, y: e.clientY });

      // Dynamic snap logic for desktop & mobile touch dragging
      const zones = document.querySelectorAll('.intersection-zone');
      let closestZone: HTMLElement | null = null;
      let minDistance = 45; // snapping tolerance radius in pixels

      zones.forEach((node) => {
        const zone = node as HTMLElement;
        const rect = zone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance) {
          minDistance = dist;
          closestZone = zone;
        }
      });

      if (closestZone) {
        const zoneEl = closestZone as HTMLElement;
        const rx = parseInt(zoneEl.dataset.rx ?? '0', 10);
        const cx = parseInt(zoneEl.dataset.cx ?? '0', 10);
        
        // Check local validity
        const isValid = isValidBarricadePlacement(rx, cx, draggedWallOrientation);
        if (isValid) {
          setPreviewWall({ rx, cx, orientation: draggedWallOrientation });
        } else {
          setPreviewWall(null);
        }
      } else {
        setPreviewWall(null);
      }
    };

    const handlePointerUp = async () => {
      if (previewWall) {
        const isValid = isValidBarricadePlacement(previewWall.rx, previewWall.cx, previewWall.orientation);
        if (isValid) {
          await executeBarricadeAction(previewWall.rx, previewWall.cx, previewWall.orientation);
        } else {
          setValidationError("CRITICAL: PLACEMENT LOCKED. FULL CELL INTERCLUSION IS FORBIDDEN");
        }
      }
      setIsDraggingWall(false);
      setDragPosition(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingWall, previewWall, draggedWallOrientation]);

  // Local timeout forced action auto-routed selector
  const handleTurnTimeout = () => {
    if (isGameOver || isAiProcessing) return;
    if (gameMode === 'ranked') return;

    const validMoves = getValidMoveCells(turn);
    const currentTimestamp = getSystemTimestamp();
    const activePlayerName = turn === 0 ? (gameMode === 'samedevice' ? 'PILOT_ONE' : 'CYBER_WOLF') : (gameMode === 'samedevice' ? 'PILOT_TWO' : 'NEURAL_LINK');

    if (validMoves.length > 0) {
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      const originalLabel = getLabelCoord(turn === 0 ? p1Pos[0] : p2Pos[0], turn === 0 ? p1Pos[1] : p2Pos[1]);
      const targetLabel = getLabelCoord(randomMove[0], randomMove[1]);
      const logMsg = `[TIMEOUT] ${originalLabel} -> AUTO -> ${targetLabel}`;

      if (turn === 0) {
        setP1Pos(randomMove);
      } else {
        setP2Pos(randomMove);
      }

      setLogs((prev) => [
        {
          id: `timeout-${Date.now()}`,
          timestamp: currentTimestamp,
          turnNumber: logs.length + 1,
          player: 'SYSTEM',
          action: logMsg,
          type: 'move'
        },
        ...prev
      ]);

      const targetRow = turn === 0 ? 8 : 0;
      if (randomMove[1] === targetRow) {
        setWinnerIdx(turn);
        setIsGameOver(true);
        onUpdateCredits(turn === 0 ? 500 : 100);
        return;
      }
    } else {
      setLogs((prev) => [
        {
          id: `timeout-${Date.now()}`,
          timestamp: currentTimestamp,
          turnNumber: logs.length + 1,
          player: 'SYSTEM',
          action: `${activePlayerName} COMMS TIMEOUT: TURN COMPELLED TO PASS`,
          type: 'system'
        },
        ...prev
      ]);
    }

    shiftTurn();
  };

  // Format Elapsed Timer
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert column/row coordinates into esports style coordinates (e.g. E2, C4)
  const getLabelCoord = (col: number, row: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    return `${letters[col]}${row + 1}`;
  };

  const getSystemTimestamp = () => {
    const date = new Date();
    return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;
  };

  // 3. Grid Path Math and Validation Helpers
  const areAdjacent = (p1: GridCoord, p2: GridCoord) => {
    const dx = Math.abs(p1[0] - p2[0]);
    const dy = Math.abs(p1[1] - p2[1]);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  // Checks if there's a wall blocking transition from one cell to an adjacent cell
  const isWallBlocking = (from: GridCoord, to: GridCoord, activeWalls: Barricade[] = walls) => {
    const [c1, r1] = from;
    const [c2, r2] = to;

    // Must be adjacent to have a wall blocking them
    if (!areAdjacent(from, to)) return false;

    // Vertical transition (same column, rows differ)
    if (c1 === c2) {
      const minRow = Math.min(r1, r2); // rx corresponding to intersection index
      // Transition is blocked if a horizontal wall exists at (minRow, c1) or (minRow, c1-1)
      return activeWalls.some(
        (w) => w.orientation === 'horizontal' && w.rx === minRow && (w.cx === c1 || w.cx === c1 - 1)
      );
    }

    // Horizontal transition (same row, columns differ)
    if (r1 === r2) {
      const minCol = Math.min(c1, c2); // cx corresponding to intersection index
      // Transition is blocked if a vertical wall exists at (r1, minCol) or (r1-1, minCol)
      return activeWalls.some(
        (w) => w.orientation === 'vertical' && w.cx === minCol && (w.rx === r1 || w.rx === r1 - 1)
      );
    }

    return false;
  };

  // Generates valid neighbor moves for a coordinate on the 9x9 grid
  const getNeighbors = (pos: GridCoord, activeWalls: Barricade[] = walls): GridCoord[] => {
    const [c, r] = pos;
    const targets: GridCoord[] = [
      [c, r - 1], // Up
      [c, r + 1], // Down
      [c - 1, r], // Left
      [c + 1, r], // Right
    ];

    // Filter inside boundaries and not blocked by walls
    return targets.filter(([nc, nr]) => {
      // Bounds check
      if (nc < 0 || nc > 8 || nr < 0 || nr > 8) return false;
      // Wall blockage check
      return !isWallBlocking(pos, [nc, nr], activeWalls);
    });
  };

  // Find valid move coordinates targetable from current position, including jumps over opponent
  const getValidMoveCells = (activePlayerIdx: number): GridCoord[] => {
    const curPos = activePlayerIdx === 0 ? p1Pos : p2Pos;
    const oppPos = activePlayerIdx === 0 ? p2Pos : p1Pos;
    
    let options: GridCoord[] = [];
    const directNeighbors = getNeighbors(curPos);

    for (const n of directNeighbors) {
      // If opponent is sitting in this adjacent space, Quoridor rules authorize jumps!
      if (n[0] === oppPos[0] && n[1] === oppPos[1]) {
        // Find jump destination (extend transition in the same straight direction)
        const dx = n[0] - curPos[0];
        const dy = n[1] - curPos[1];
        const jumpDest: GridCoord = [n[0] + dx, n[1] + dy];

        // Ensure inside bounds and not blocked by a wall behind opponent
        const isJumpDestValid = 
          jumpDest[0] >= 0 && jumpDest[0] <= 8 && 
          jumpDest[1] >= 0 && jumpDest[1] <= 8 && 
          !isWallBlocking(oppPos, jumpDest);

        if (isJumpDestValid) {
          options.push(jumpDest);
        } else {
          // If a wall blocks the jump, we can land on either side of the opponent (diagonal landing spots)
          const diagonals: GridCoord[] = dx !== 0 
            ? [[n[0], n[1] - 1], [n[0], n[1] + 1]] 
            : [[n[0] - 1, n[1]], [n[0] + 1, n[1]]];

          for (const d of diagonals) {
            if (
              d[0] >= 0 && d[0] <= 8 && d[1] >= 0 && d[1] <= 8 &&
              !isWallBlocking(oppPos, d) && 
              // Bounds bounds
              (Math.abs(d[0] - curPos[0]) <= 2 && Math.abs(d[1] - curPos[1]) <= 2)
            ) {
              options.push(d);
            }
          }
        }
      } else {
        options.push(n);
      }
    }

    return options;
  };

  // BFS search to verify whether a player has an open pathway to their goal row
  const isGoalReachable = (playerIdx: number, startPos: GridCoord, activeWalls: Barricade[]): boolean => {
    const targetRow = playerIdx === 0 ? 8 : 0; // Row index to reach
    const queue: GridCoord[] = [startPos];
    const visited = new Set<string>();
    visited.add(`${startPos[0]},${startPos[1]}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current[1] === targetRow) {
        return true; // Pathway reaches goal!
      }

      const neighbors = getNeighbors(current, activeWalls);
      for (const n of neighbors) {
        const key = `${n[0]},${n[1]}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push(n);
        }
      }
    }

    return false; // No way to reach goal!
  };

  // Check if a barricade intercepts existing pathways without locking players up
  const isValidBarricadePlacement = (rx: number, cx: number, orientation: 'horizontal' | 'vertical'): boolean => {
    // 1. Boundary integrity
    if (rx < 0 || rx > 7 || cx < 0 || cx > 7) return false;

    // 2. Exact overlaps check (cannot overlap on the same cell intersection)
    const exactOverlap = walls.find((w) => w.rx === rx && w.cx === cx);
    if (exactOverlap) return false;

    // 3. Segment intersection crossing check
    if (orientation === 'horizontal') {
      // Cannot overlap with existing horizontal wall crossing col cx+1 or cx-1
      const isTooClose = walls.some(
        (w) => w.orientation === 'horizontal' && w.rx === rx && Math.abs(w.cx - cx) <= 1
      );
      if (isTooClose) return false;

      // Cannot cross perpendicular vertical wall at the same center
      const isVerticalIntersection = walls.some(
        (w) => w.orientation === 'vertical' && w.rx === rx && w.cx === cx
      );
      if (isVerticalIntersection) return false;
    } else {
      // Cannot overlap with existing vertical wall crossing row rx+1 or rx-1
      const isTooClose = walls.some(
        (w) => w.orientation === 'vertical' && w.cx === cx && Math.abs(w.rx - rx) <= 1
      );
      if (isTooClose) return false;

      // Cannot cross perpendicular horizontal wall at exact center
      const isHorizontalIntersection = walls.some(
        (w) => w.orientation === 'horizontal' && w.rx === rx && w.cx === cx
      );
      if (isHorizontalIntersection) return false;
    }

    // 4. Critical Pathway Locking check (neither player can be trapped)
    // Create copy with hypothetical barricade
    const tempBarricade: Barricade = {
      id: 'temp',
      rx,
      cx,
      orientation,
      ownerId: turn === 0 ? 'p1' : 'p2'
    };
    const hypWalls = [...walls, tempBarricade];

    const p1Reachable = isGoalReachable(0, p1Pos, hypWalls);
    const p2Reachable = isGoalReachable(1, p2Pos, hypWalls);

    return p1Reachable && p2Reachable;
  };

  // 4. Action Execution Engines
  const executeMoveAction = async (col: number, row: number) => {
    setValidationError(null);
    const currentTimestamp = getSystemTimestamp();
    const originalLabel = getLabelCoord(turn === 0 ? p1Pos[0] : p2Pos[0], turn === 0 ? p1Pos[1] : p2Pos[1]);
    const targetLabel = getLabelCoord(col, row);
    const logMsg = `${originalLabel} -> MOVE -> ${targetLabel}`;

    if (gameMode === 'ranked' && matchId) {
      try {
        const resp = await fetch('/api/matchmaking/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchId,
            playerId: myId,
            actionType: 'move',
            col,
            row
          })
        });
        if (!resp.ok) {
          const data = await resp.json();
          setValidationError(data.error || "Action injection rejected");
          setPreviewPos(null);
          return;
        }
        const updatedMatch = await resp.json();
        setTurn(updatedMatch.turn);
        setP1Pos(updatedMatch.p1Pos);
        setP2Pos(updatedMatch.p2Pos);
        setWalls(updatedMatch.walls);
        setLogs(updatedMatch.logs);
        setValidationError(null);
      } catch (e) {
        setValidationError("COMLINK ERROR: ACTION INJECTION LOST");
      }
      setPreviewPos(null);
      return;
    }

    // Local standard logic
    if (turn === 0) {
      setP1Pos([col, row]);
    } else {
      setP2Pos([col, row]);
    }

    const entryId = `entry-${Date.now()}`;
    setLogs((prev) => [
      {
        id: entryId,
        timestamp: currentTimestamp,
        turnNumber: logs.length,
        player: turn === 0 ? (gameMode === 'samedevice' ? 'PILOT_ONE' : 'CYBER_WOLF') : (gameMode === 'samedevice' ? 'PILOT_TWO' : 'NEURAL_LINK'),
        action: logMsg,
        type: 'move'
      },
      ...prev
    ]);

    const targetRow = turn === 0 ? 8 : 0;
    if (row === targetRow) {
      setWinnerIdx(turn);
      setIsGameOver(true);
      onUpdateCredits(turn === 0 ? 500 : 100);
      return;
    }

    setPreviewPos(null);
    shiftTurn();
  };

  const executeBarricadeAction = async (rx: number, cx: number, orientation: 'horizontal' | 'vertical') => {
    setValidationError(null);
    const currentTimestamp = getSystemTimestamp();
    const colLabel1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][cx];
    const colLabel2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][cx + 1];
    const startCell = `${colLabel1}${rx + 1}`;
    const endCell = `${colLabel2}${rx + 2}`;
    const logMsg = `BARRIER PLACED @ ${startCell}-${endCell} (${orientation.toUpperCase()})`;

    if (gameMode === 'ranked' && matchId) {
      try {
        const resp = await fetch('/api/matchmaking/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchId,
            playerId: myId,
            actionType: 'barricade',
            rx,
            cx,
            orientation
          })
        });
        if (!resp.ok) {
          const data = await resp.json();
          setValidationError(data.error || "Action injection rejected");
          setPreviewWall(null);
          return;
        }
        const updatedMatch = await resp.json();
        setTurn(updatedMatch.turn);
        setP1Pos(updatedMatch.p1Pos);
        setP2Pos(updatedMatch.p2Pos);
        setWalls(updatedMatch.walls);
        setLogs(updatedMatch.logs);
        setValidationError(null);
      } catch (e) {
        setValidationError("COMLINK ERROR: ACTION INJECTION LOST");
      }
      setPreviewWall(null);
      return;
    }

    // Local standard logic
    const newWall: Barricade = {
      id: `wall-${Date.now()}`,
      rx,
      cx,
      orientation,
      ownerId: turn === 0 ? 'p1' : 'p2'
    };

    setWalls((prev) => [...prev, newWall]);

    if (turn === 0) {
      setP1Budget((prev) => prev - 1);
    } else {
      setP2Budget((prev) => prev - 1);
    }

    const entryId = `entry-${Date.now()}`;
    setLogs((prev) => [
      {
        id: entryId,
        timestamp: currentTimestamp,
        turnNumber: logs.length,
        player: turn === 0 ? (gameMode === 'samedevice' ? 'PILOT_ONE' : 'CYBER_WOLF') : (gameMode === 'samedevice' ? 'PILOT_TWO' : 'NEURAL_LINK'),
        action: logMsg,
        type: 'barricade'
      },
      ...prev
    ]);

    setPreviewWall(null);
    shiftTurn();
  };

  // 4b. Selection interactive routing
  const handleCellClick = async (col: number, row: number) => {
    if (isGameOver || isAiProcessing) return;

    if (gameMode === 'ranked') {
      if (turn !== playerIndex) {
        setValidationError("SECURITY BREACH: WAIT FOR PEER COMLINK RESPONSE");
        return;
      }
    }

    if (actionType !== 'move') return;

    const validMoves = getValidMoveCells(turn);
    const isTargetValid = validMoves.some(([vc, vr]) => vc === col && vr === row);

    if (isTargetValid) {
      if (confirmActions) {
        // Mode Confirmation activated: toggle or preview lock
        if (previewPos && previewPos[0] === col && previewPos[1] === row) {
          // Double click on same spot executes it!
          await executeMoveAction(col, row);
        } else {
          setPreviewPos([col, row]);
          setPreviewWall(null);
          setValidationError(null);
        }
      } else {
        // Fast instant placement
        await executeMoveAction(col, row);
      }
    } else {
      setValidationError("BATTLE HUD WARNING: SELECTED COORDINATE IS OUT OF PATH STEPS");
    }
  };

  const startWallDrag = (e: any, orientation: 'horizontal' | 'vertical') => {
    const currentBudget = turn === 0 ? p1Budget : p2Budget;
    if (currentBudget <= 0) {
      setValidationError("BARRICADE ARMORY EXHAUSTED: DEFENSE MATRIX EMPTY");
      return;
    }

    if (gameMode === 'ranked' && turn !== playerIndex) {
      setValidationError("COMLINK SECURED: AWAITING PEER TELEMETRY INPUT");
      return;
    }

    if (isGameOver || isAiProcessing) return;

    setIsDraggingWall(true);
    setDraggedWallOrientation(orientation);
    setSelectedWallOrientation(orientation);
    setActionType('barricade');
    setDragPosition({ x: e.clientX, y: e.clientY });
    setValidationError(null);
    e.preventDefault();
  };

  const handleIntersectionClick = async (rx: number, cx: number) => {
    if (isGameOver || isAiProcessing) return;

    if (gameMode === 'ranked') {
      if (turn !== playerIndex) {
        setValidationError("SECURITY BREACH: WAIT FOR PEER COMLINK RESPONSE");
        return;
      }
    }

    if (actionType !== 'barricade') return;

    const budget = turn === 0 ? p1Budget : p2Budget;
    if (budget <= 0) {
      setValidationError("BATTLE HUD WARNING: BARRICADE PROTOCOL EMPTY");
      return;
    }

    const isValid = isValidBarricadePlacement(rx, cx, selectedWallOrientation);
    if (isValid) {
      if (confirmActions) {
        if (previewWall && previewWall.rx === rx && previewWall.cx === cx && previewWall.orientation === selectedWallOrientation) {
          // Double click same spot executes it!
          await executeBarricadeAction(rx, cx, selectedWallOrientation);
        } else {
          setPreviewWall({ rx, cx, orientation: selectedWallOrientation });
          setPreviewPos(null);
          setValidationError(null);
        }
      } else {
        // Fast instant placement
        await executeBarricadeAction(rx, cx, selectedWallOrientation);
      }
    } else {
      setValidationError("CRITICAL: PLACEMENT LOCKED. FULL CELL INTERCLUSION IS FORBIDDEN");
    }
  };

  // Confirm buttons and controls triggers
  const handleConfirmTurn = async () => {
    if (previewPos) {
      await executeMoveAction(previewPos[0], previewPos[1]);
    } else if (previewWall) {
      await executeBarricadeAction(previewWall.rx, previewWall.cx, previewWall.orientation);
    } else {
      setValidationError("Select a coordinate / barricade first.");
    }
  };

  const handleCancelAction = () => {
    setPreviewPos(null);
    setPreviewWall(null);
    setValidationError(null);
  };

  const shiftTurn = () => {
    const nextTurn = turn === 0 ? 1 : 0;
    setTurn(nextTurn);
    setValidationError(null);
    setTurnTimeLeft(45); // Reset Turn Timer to 45s

    // AI execution fallback if match mode includes computer bot
    if (nextTurn === 1 && gameMode !== 'samedevice' && gameMode !== 'ranked') {
      triggerAIResponse();
    }
  };

  // 5. Automated AI engine for Bot responses
  const triggerAIResponse = () => {
    setIsAiProcessing(true);
    setValidationError(null);

    setTimeout(() => {
      // Simulated AI turn
      const currentTimestamp = getSystemTimestamp();
      let aiPlacedWall = false;

      // Smart decision: 25% chance to place blocking wall if P1 is close to baseline, 75% to just walk towards row 0
      const distanceToGoal = 8 - p1Pos[1];
      if (distanceToGoal <= 4 && p2Budget > 0 && Math.random() > 0.45) {
        // Find a random valid wall placement blocking P1's immediate surrounding pathways
        const possibleCols = [p1Pos[0] - 1, p1Pos[0], p1Pos[0] + 1];
        const possibleRows = [p1Pos[1], p1Pos[1] - 1];

        for (const r of possibleRows) {
          for (const c of possibleCols) {
            const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            if (isValidBarricadePlacement(r, c, orientation)) {
              const newWall: Barricade = {
                id: `wall-${Date.now()}`,
                rx: r,
                cx: c,
                orientation,
                ownerId: 'p2'
              };

              setWalls((prev) => [...prev, newWall]);
              setP2Budget((prev) => prev - 1);
              
              const colLabel1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][c];
              const colLabel2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][c + 1];
              const logMsg = `BARRIER PLACED @ ${colLabel1}${r + 1}-${colLabel2}${r + 2}`;

              setLogs((prev) => [
                {
                  id: `entry-${Date.now()}`,
                  timestamp: currentTimestamp,
                  turnNumber: logs.length + 1,
                  player: 'NEURAL_LINK',
                  action: logMsg,
                  type: 'barricade'
                },
                ...prev
              ]);
              aiPlacedWall = true;
              break;
            }
          }
          if (aiPlacedWall) break;
        }
      }

      // If AI didn't place wall, walk standard shortest route
      if (!aiPlacedWall) {
        const validMoves = getValidMoveCells(1);
        if (validMoves.length > 0) {
          // Sort moves by whoever gets the closest row to 0
          validMoves.sort((a, b) => a[1] - b[1]); 
          const bestMove = validMoves[0]; // Choose closest move to row index 0

          const originalLabel = getLabelCoord(p2Pos[0], p2Pos[1]);
          const targetLabel = getLabelCoord(bestMove[0], bestMove[1]);
          const logMsg = `${originalLabel} -> MOVE -> ${targetLabel}`;

          setP2Pos(bestMove);

          setLogs((prev) => [
            {
              id: `entry-${Date.now()}`,
              timestamp: currentTimestamp,
              turnNumber: logs.length + 1,
              player: 'NEURAL_LINK',
              action: logMsg,
              type: 'move'
            },
            ...prev
          ]);

          // Check Win Condition
          if (bestMove[1] === 0) {
            setWinnerIdx(1);
            setIsGameOver(true);
            return;
          }
        }
      }

      // Reset AI processing variables
      setIsAiProcessing(false);
      setTurn(0);
      setTurnTimeLeft(45); // Reset clock for P1
    }, 1500);
  };

  const surrenderGame = async () => {
    if (gameMode === 'ranked' && matchId) {
      try {
        const resp = await fetch('/api/matchmaking/surrender', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, playerId: myId })
        });
        if (resp.ok) {
          const data = await resp.json();
          // Let the poller sync terminal state
        }
      } catch (e) {
        setValidationError("COMLINK ERROR: SURRENDER TRANSMISSION FAILED");
      }
      return;
    }

    setWinnerIdx(1);
    setIsGameOver(true);
  };

  const triggerEmote = async (emote: Emote) => {
    const emoteText = emote.icon + " " + emote.text;

    if (gameMode === 'ranked' && matchId) {
      try {
        await fetch('/api/matchmaking/emote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, playerId: myId, emoteText })
        });
      } catch (e) {
        console.error("Emote transmit fail", e);
      }
      setIsP1EmoteOpen(false);
      return;
    }

    setP1EmoteText(emoteText);
    setIsP1EmoteOpen(false);
    setTimeout(() => {
      setP1EmoteText(null);
    }, 2500);

    // AI retaliates emotes
    if (gameMode !== 'samedevice') {
      setTimeout(() => {
        setP2EmoteText("🤖 BEEP BOOP. INEVITABLE PROTOCOL DETECTED.");
        setTimeout(() => {
          setP2EmoteText(null);
        }, 2200);
      }, 1000);
    }
  };

  const resetBoardHUDState = async () => {
    if (gameMode === 'ranked' && matchId) {
      try {
        const resp = await fetch('/api/matchmaking/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId })
        });
        if (resp.ok) {
          const data = await resp.json();
          // Let the poller do initial sync setup
        }
      } catch (e) {
        setValidationError("COMLINK ERROR: MATRIX REBOOT REFUSED");
      }
      return;
    }

    setP1Pos([4, 0]);
    setP2Pos([4, 8]);
    setWalls([]);
    setP1Budget(10);
    setP2Budget(10);
    setMatchSeconds(0);
    setValidationError(null);
    setIsGameOver(false);
    setWinnerIdx(null);
    setTurn(0);
    setTurnTimeLeft(45);
    setLogs([{ id: 'reset', timestamp: getSystemTimestamp(), turnNumber: 0, player: 'SYSTEM', action: 'PROTOCOL COMPILER RESET. BOARD CLEARED', type: 'system' }]);
  };

  // Compute Username and Avatar visuals dynamically
  const p1NameDisp = gameMode === 'ranked' 
    ? (playerIndex === 0 ? `${myName || 'CYBER_WOLF'} (YOU)` : (opponentName || "HOST_PILOT")) 
    : (gameMode === 'samedevice' ? 'PILOT_ONE' : (myName || 'CYBER_WOLF'));
  const p2NameDisp = gameMode === 'ranked' 
    ? (playerIndex === 1 ? `${myName || 'NEURAL_LINK'} (YOU)` : (opponentName || "PEER_JOINER")) 
    : (gameMode === 'samedevice' ? 'PILOT_TWO' : 'NEURAL_LINK');
  const p1AvatarDisp = gameMode === 'ranked' 
    ? (playerIndex === 0 ? myAvatar : (opponentAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuACU5pKM_viRUu-bSZUWCzI1mIVqgLOf1x3LfozBgwljiXD5L1xF8L1Q_UZCAxn8ULBzCUJlLbTdCunIRXgW7nxae2YHHrdtwFJO52obwA7cjbT1dz_OuSIjVf-h7IVYXWaaAzT1ZzRtbr6zPrPZz-e6YhXBGZikfhmjeKGOnbpwW6OuKyGePHBxvuHkYi1zu-8gmp7LP_CH7sNF-Tv7zZdaFQSqLIFCearKC4KmEsLKfOv23VOJmqUO88xRaZ_sqwBwzLvDb8c5jY")) 
    : myAvatar;
  const p2AvatarDisp = gameMode === 'ranked' 
    ? (playerIndex === 1 ? myAvatar : (opponentAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAyuc38B-TTDy9gVXjymqW7XCfYAQOIGW3T-F_OS4qIXihG75CPT9KRk5L4XXDQZ6dZ4P2EUSVlWGMPQoV3lph_rEHh7N3bx8ENuTPioNoDIMgYq5LU6BD0JA2vkIWUXk-MNpAg7cd46YiCR8BUvm80ZtjXuxMKhRv7-6uFaPfbhZTysklx3egqp3xFyx3zIy1OvB37HxmxtEyL4NUowytP-tuWxs_t61knJcK_Ij-KJwgwutwHpvnv4muHXGE0nwhoayXcsLRngAQ")) 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuAyuc38B-TTDy9gVXjymqW7XCfYAQOIGW3T-F_OS4qIXihG75CPT9KRk5L4XXDQZ6dZ4P2EUSVlWGMPQoV3lph_rEHh7N3bx8ENuTPioNoDIMgYq5LU6BD0JA2vkIWUXk-MNpAg7cd46YiCR8BUvm80ZtjXuxMKhRv7-6uFaPfbhZTysklx3egqp3xFyx3zIy1OvB37HxmxtEyL4NUowytP-tuWxs_t61knJcK_Ij-KJwgwutwHpvnv4muHXGE0nwhoayXcsLRngAQ";

  return (
    <div className="relative w-full text-on-surface font-sans p-2 md:p-6 min-h-screen flex flex-col justify-between overflow-hidden select-none">
      
      {/* Scanning laser HUD glow overlays */}
      <div className="fixed top-0 left-0 w-full h-[4px] bg-primary/20 z-10 animate-[scanline_6s_linear_infinite] pointer-events-none" />

      {/* 1. TOP STATS HUD RAIL */}
      <header className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-stretch md:items-start gap-4 z-40 relative">
        
        {/* P1 COMMAND CHASSIS (CYAN) */}
        <div className="bg-[#131313]/80 backdrop-blur-md flex items-center p-3 gap-4 border-l-4 border-l-[#00f2ff] border border-white/5 rounded relative flex-1 shadow-[0_0_15px_rgba(0,242,255,0.05)]">
          <div className="relative">
            <img 
              alt="Cyber Wolf Pilot"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded object-cover border border-[#00f2ff]/30 bg-[#201f1f]"
              src={p1AvatarDisp}
            />
            <div className="absolute -bottom-1 -right-1 bg-[#00f2ff] text-[#002022] font-mono text-[9px] px-1 rounded font-bold uppercase leading-none py-0.5">LVL 42</div>
            
            {/* P1 Speech Emote Bubbles */}
            <AnimatePresence>
              {p1EmoteText && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-0 bottom-14 bg-[#050505] border-2 border-primary-container px-3 py-2 rounded text-xs font-bold text-primary-container min-w-[200px] shadow-[0_0_15px_rgba(0,242,255,0.4)] z-[999]"
                >
                  <p>{p1EmoteText}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-sora font-extrabold text-[#74f5ff] tracking-wide text-sm md:text-base leading-none truncate">{p1NameDisp}</span>
              <span className="font-mono text-[10px] text-primary/40 font-bold hidden sm:inline">MASTER III</span>
            </div>
            
            {/* Display used wall segments */}
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-3.5 rounded-sm transition-all
                    ${idx < p1Budget 
                      ? 'bg-primary-container shadow-[0_0_5px_#00f2ff]'
                      : 'bg-white/5 border border-white/5'
                    }
                  `} 
                />
              ))}
              <span className="font-mono text-[10px] text-primary-container font-extrabold ml-1 leading-none self-center">{p1Budget} BARRICADES</span>
            </div>
          </div>

          {/* Player Timer Remaining */}
          <div className="text-right pr-1">
            <div className="font-mono text-[#00f2ff] font-extrabold text-base md:text-lg leading-none">{formatTime(p1TimeLeft)}</div>
            <div className="font-mono text-[8px] tracking-widest text-[#00f2ff]/30 uppercase font-bold mt-1">TIME LEFT</div>
          </div>
        </div>

        {/* METADATA TURN PROMPT CONTAINER */}
        <div className="flex flex-col items-center justify-center z-20 text-center px-4 self-center md:self-stretch">
          <div className="bg-primary/5 px-4 py-1 border-x border-primary/20 backdrop-blur-sm rounded-full inline-flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-primary-container animate-pulse" />
            <span className="font-mono text-[10px] text-primary tracking-widest uppercase font-extrabold">
              {isAiProcessing ? "NEURAL ENGINE DEPLOYING" : `TURN: ${turn === 0 ? "CYBER_WOLF" : "NEURAL_LINK"}`}
            </span>
          </div>
          <div className="mt-1 flex flex-col items-center leading-none">
            <div className="font-sora font-extrabold text-white text-xl md:text-2xl mt-1 tracking-wide">{formatTime(matchSeconds)}</div>
            <div className="font-mono text-[8px] text-primary/30 uppercase mt-1 tracking-widest">Match Duration</div>
          </div>
        </div>

        {/* P2 OPPONENT CHASSIS (PURPLE) */}
        <div className="bg-[#131313]/80 backdrop-blur-md flex items-center p-3 gap-4 border-r-4 border-r-secondary-container border border-white/5 rounded relative flex-1 text-right shadow-[0_0_15px_rgba(182,0,248,0.05)]">
          <div className="text-left pl-1">
            <div className="font-mono text-secondary-container font-extrabold text-base md:text-lg leading-none">{formatTime(p2TimeLeft)}</div>
            <div className="font-mono text-[8px] tracking-widest text-secondary-container/30 uppercase font-bold mt-1">TIME LEFT</div>
          </div>

          <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
            <div className="flex items-center justify-end gap-2">
              <span className="font-mono text-[10px] text-secondary/40 font-bold hidden sm:inline">DIAMOND I</span>
              <span className="font-sora font-extrabold text-[#ebb2ff] tracking-wide text-sm md:text-base leading-none truncate">{p2NameDisp}</span>
            </div>
            
            {/* Display used wall segments */}
            <div className="flex gap-1 mt-1.5 justify-end flex-wrap">
              <span className="font-mono text-[10px] text-secondary-container font-extrabold mr-1 leading-none self-center">{p2Budget} BARRICADES</span>
              {Array.from({ length: 10 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-3.5 rounded-sm transition-all
                    ${idx < p2Budget 
                      ? 'bg-secondary-container shadow-[0_0_5px_#bc13fe]'
                      : 'bg-white/5 border border-white/5'
                    }
                  `} 
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <img 
              alt="Neural Link Pilot"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded object-cover border border-secondary-container/30 bg-[#201f1f] grayscale scale-95"
              src={p2AvatarDisp}
            />
            <div className="absolute -bottom-1 -left-1 bg-secondary-container text-white font-mono text-[9px] px-1 rounded font-bold uppercase leading-none py-0.5 mt-1">LVL 38</div>

            {/* P2 Speech Emote Bubbles */}
            <AnimatePresence>
              {p2EmoteText && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-0 bottom-14 bg-[#050505] border-2 border-[#bc13fe] px-3 py-2 rounded text-xs font-bold text-secondary-container min-w-[200px] shadow-[0_0_15px_rgba(188,19,254,0.4)] z-[999] text-left"
                >
                  <p>{p2EmoteText}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </header>

      {/* 2. MAIN BATTLE COCKPIT SECTION */}
      <main className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center max-w-[1400px] mx-auto gap-8 my-6 relative z-10">
        
        {/* LEFT COMPACT RAIL DISPLAY: TACTICAL ENGINE LOG (ONLY ON DESKTOP) */}
        <aside className="hidden lg:flex w-64 self-stretch bg-[#131313]/60 backdrop-blur-md border border-white/5 rounded-md p-4 flex-col justify-between relative shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-[#00f2ff] w-3.5 h-3.5" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-[#00f2ff] w-3.5 h-3.5" />
          <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[#00f2ff] w-3.5 h-3.5" />
          <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-[#00f2ff] w-3.5 h-3.5" />

          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="font-mono text-xs font-extrabold tracking-[0.2em] text-[#00f2ff] border-b border-white/15 pb-2.5 mb-4 uppercase">
              Tactical Logs
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-2 rounded border border-transparent flex flex-col gap-0.5 font-mono text-[11px] leading-tight
                    ${log.type === 'system' ? 'bg-[#00f2ff]/5 text-primary border-primary-container/10' : ''}
                    ${log.type === 'move' ? 'bg-white/[0.02] text-white border-white/[0.02]' : ''}
                    ${log.type === 'barricade' ? 'bg-[#bc13fe]/5 text-secondary border-secondary-container/10' : ''}
                  `}
                >
                  <div className="flex justify-between text-[9px] opacity-40 font-semibold mb-0.5">
                    <span className="font-bold">{log.player}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="tracking-wide">{log.action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 mt-4 pt-2 flex justify-between items-center font-mono text-[10px] text-on-surface-variant/40 font-bold">
            <span>SYNC: STABLE</span>
            <span>LATENCY: 12MS</span>
          </div>
        </aside>

        {/* CENTER ELEMENT: THE 9x9 BATTLEFIELD CHASSIS */}
        <section className="flex flex-col items-center select-none relative max-w-full">
          
          {/* Coordinates Header col columns A-I labels */}
          <div className="w-[300px] sm:w-[480px] lg:w-[500px] flex justify-between px-4 font-mono text-xs font-bold text-primary/45 uppercase tracking-widest text-center h-6 mb-2">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((char) => (
              <span key={char} className="w-[11.1%] text-center">{char}</span>
            ))}
          </div>

          {/* Coordinates vertical row labels left & 9x9 viewport box */}
          <div className="flex items-center relative">
            <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between py-4 font-mono text-xs font-bold text-primary/45">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <span key={num} className="h-[11.1%] flex items-center">{num}</span>
              ))}
            </div>

            {/* Grid Box body */}
            <div 
              id="game-grid-container"
              className="relative w-[300px] sm:w-[480px] lg:w-[500px] aspect-square bg-[#0c0c0c]/85 border-2 border-primary/20 rounded p-2.5 shadow-[0_0_35px_rgba(0,186,206,0.08)] grid grid-cols-9 grid-rows-9 gap-1.5 overflow-visible"
            >
              {gameMode === 'ranked' && matchStatus === 'waiting' && (
                <div className="absolute inset-0 bg-[#090909]/95 backdrop-blur-md z-[55] flex flex-col items-center justify-center p-6 text-center rounded border border-white/5 select-none">
                  {/* Glowing calibration element */}
                  <div className="w-14 h-14 rounded-full border border-[#00f2ff]/30 flex items-center justify-center mb-4">
                    <Radio className="w-7 h-7 text-[#00f2ff] animate-pulse" />
                  </div>
                  <h3 className="font-mono text-xs font-black tracking-widest text-[#00f2ff] uppercase animate-pulse">Lobby Initialized</h3>
                  <p className="font-mono text-[10px] text-on-surface-variant max-w-[340px] mt-2 leading-relaxed">
                    PORT SECURED. WAITING FOR CONTENDING PEER TO CONNECT...
                  </p>
                  
                  {/* Share invite copy */}
                  <div className="mt-5 w-full max-w-[280px] bg-white/[0.03] border border-white/15 p-2 rounded flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] text-[#ebb2ff] truncate uppercase tracking-widest font-extrabold pr-2">
                      LINK LOCKED // READY
                    </span>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}?matchId=${matchId}`;
                        navigator.clipboard.writeText(link);
                        setValidationError("COMLINK SECURED! INVITE LINK COPIED TO CLIPBOARD.");
                        setTimeout(() => setValidationError(null), 3000);
                      }}
                      className="px-3 py-1 bg-[#00f2ff] text-[#002022] font-mono font-bold text-[9px] uppercase hover:bg-[#00e1ec] rounded transition-all shrink-0 cursor-pointer shadow-[0_0_10px_rgba(0,242,255,0.4)]"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic generated cells */}
              {Array.from({ length: 81 }).map((_, i) => {
                const col = i % 9;
                const row = Math.floor(i / 9);

                const isP1Here = p1Pos[0] === col && p1Pos[1] === row;
                const isP2Here = p2Pos[0] === col && p2Pos[1] === row;
                
                const validMoves = getValidMoveCells(turn);
                const isStepValid = actionType === 'move' && validMoves.some(([vc, vr]) => vc === col && vr === row);
                const isPreviewStep = previewPos && previewPos[0] === col && previewPos[1] === row;

                return (
                  <div
                    key={i}
                    onClick={() => handleCellClick(col, row)}
                    className={`aspect-square border border-white/5 rounded-sm relative flex items-center justify-center transition-all duration-300 cursor-pointer group/cell
                      ${isStepValid ? 'bg-primary-container/[0.04] border-primary-container/20 hover:bg-primary-container/10' : ''}
                      ${isPreviewStep ? 'border-primary-container bg-primary-container/25 animate-pulse shadow-[0_0_8px_#00f2ff]' : 'hover:bg-white/[0.03]'}
                    `}
                  >
                    {/* Glowing highlight loop under active validation slots */}
                    {isStepValid && (
                      <div className="absolute w-2 h-2 rounded-full bg-[#00f2ff] opacity-40 group-hover/cell:opacity-100 animate-ping" />
                    )}

                    {/* Render active player 1 token */}
                    {isP1Here && (
                      <motion.div 
                        layoutId="p1-token"
                        className="absolute inset-[10%] rounded bg-[#00f2ff] shadow-[0_0_20px_#00f2ff] flex items-center justify-center z-20"
                      >
                        <Navigation className="w-5 h-5 text-[#002022] font-extrabold fill-current" />
                      </motion.div>
                    )}

                    {/* Render active player 2 token */}
                    {isP2Here && (
                      <motion.div 
                        layoutId="p2-token"
                        className="absolute inset-[10%] rounded bg-[#bc13fe] shadow-[0_0_20px_#bc13fe] flex items-center justify-center z-20"
                      >
                        <Cpu className="w-5 h-5 text-white animate-pulse" />
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* PERSISTENT WALLS LAYER COCKPIT */}
              {walls.map((wall) => {
                // Determine wall placement inside the grid layout box absolute positions.
                // Each intersection grid node (rx, cx) lies exactly between row index rx and rx+1, col cx and cx+1.
                // In a 9x9 grid, there are gaps. We can locate the positions using percentages.
                const cellPercent = 100 / 9;
                const left = cellPercent * (wall.cx + 1);
                const top = cellPercent * (wall.rx + 1);

                return (
                  <div
                    key={wall.id}
                    className={`absolute rounded-full pointer-events-none z-30 transition-all
                      ${wall.orientation === 'horizontal' 
                        ? 'h-1.5 w-[20%] -translate-y-1/2' 
                        : 'w-1.5 h-[20%] -translate-x-1/2'
                      }
                      ${wall.ownerId === 'p1' 
                        ? 'bg-primary-container shadow-[0_0_10px_#00f2ff]' 
                        : 'bg-secondary-container shadow-[0_0_10px_#bc13fe]'
                      }
                    `}
                    style={{
                      left: `calc(${left}% - 1px)`,
                      top: `calc(${top}% - 1px)`
                    }}
                  />
                );
              })}

              {/* WALL PREVIEW OVERLAY (PENDING CONFIRM) */}
              {previewWall && (() => {
                const cellPercent = 100 / 9;
                const left = cellPercent * (previewWall.cx + 1);
                const top = cellPercent * (previewWall.rx + 1);

                return (
                  <div
                    className={`absolute rounded-full pointer-events-none z-35 animate-[pulse_1s_infinite]
                      ${previewWall.orientation === 'horizontal' 
                        ? 'h-2 w-[21%] -translate-y-1/2 bg-yellow-400 shadow-[0_0_12px_#fbbf24]' 
                        : 'w-2 h-[21%] -translate-x-1/2 bg-yellow-400 shadow-[0_0_12px_#fbbf24]'
                      }
                    `}
                    style={{
                      left: `calc(${left}% - 1px)`,
                      top: `calc(${top}% - 1px)`
                    }}
                  />
                );
              })()}

              {/* CLICKABLE INTERSECTION DOTS AND PREVIEWS */}
              {actionType === 'barricade' && (
                <div className="absolute inset-0 pointer-events-auto z-40">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const cx = i % 8;
                    const rx = Math.floor(i / 8);
                    
                    const cellPercent = 100 / 9;
                    const left = cellPercent * (cx + 1);
                    const top = cellPercent * (rx + 1);
                    
                    const activeOrientation = isDraggingWall ? draggedWallOrientation : selectedWallOrientation;
                    const isValid = isValidBarricadePlacement(rx, cx, activeOrientation);
                    
                    return (
                      <div
                        key={`inter-${rx}-${cx}`}
                        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-crosshair z-50 intersection-zone"
                        data-rx={rx}
                        data-cx={cx}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`
                        }}
                        onMouseEnter={() => {
                          if (isGameOver || isAiProcessing) return;
                          if (gameMode === 'ranked' && turn !== playerIndex) return;
                          if (isValid) {
                            setPreviewWall({ rx, cx, orientation: activeOrientation });
                          }
                        }}
                        onMouseLeave={() => {
                          setPreviewWall(null);
                        }}
                        onClick={() => handleIntersectionClick(rx, cx)}
                      >
                        {/* Calibration node indicator dot */}
                        <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 flex items-center justify-center
                          ${isValid 
                            ? 'bg-yellow-500/35 border-yellow-500/60 hover:scale-135 hover:bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                            : 'bg-red-500/10 border-red-500/20 cursor-not-allowed opacity-30 w-1.5 h-1.5'
                          }
                        `}>
                          {isValid && <div className="w-1 h-1 rounded-full bg-yellow-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </section>

        {/* RIGHT COMPACT CONTROLS RAIL: QUICK EMOTES & ACTION WHEEL (ONLY DESKTOP) */}
        <aside className="hidden lg:flex w-64 self-stretch bg-[#131313]/60 backdrop-blur-md border border-white/5 rounded-md p-4 flex-col justify-between relative shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-secondary w-3.5 h-3.5" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-secondary w-3.5 h-3.5" />
          <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-secondary w-3.5 h-3.5" />
          <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-secondary w-3.5 h-3.5" />

          {/* Controls list */}
          <div className="flex-grow flex flex-col justify-between h-full">
            <div>
              <h3 className="font-mono text-xs font-extrabold tracking-[0.2em] text-[#bc13fe] border-b border-white/15 pb-2.5 mb-4 uppercase">
                Match Controls
              </h3>

              <div className="space-y-3">
                {/* Emote wheel trigger popup */}
                <div className="relative">
                  <button 
                    onClick={() => setIsP1EmoteOpen(!isP1EmoteOpen)}
                    className="w-full bg-[#1c1b1b]/50 hover:bg-[#201f1f] border border-white/5 py-2.5 px-3 rounded flex items-center gap-3 transition-colors text-left"
                  >
                    <MessageSquare className="w-4 h-4 text-on-surface-variant group-hover:text-primary" />
                    <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-on-surface-variant">Emote Matrix</span>
                  </button>

                  <AnimatePresence>
                    {isP1EmoteOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute left-0 right-0 top-11 bg-[#131313] border-l-4 border-l-secondary border border-white/10 p-2 rounded shadow-2xl z-50 space-y-1 max-h-[220px] overflow-y-auto"
                      >
                        <p className="font-mono text-[8px] opacity-40 font-bold uppercase tracking-widest px-2 py-1 mb-1">SELECT CHAT EMOTE</p>
                        {EMOTE_WHEEL_ITEMS.map((item) => (
                          <button
                            key={item.text}
                            onClick={() => triggerEmote(item)}
                            className="w-full text-left font-mono text-[10px] uppercase tracking-wide py-1.5 px-2 hover:bg-secondary/15 hover:text-white transition-colors rounded text-on-surface-variant"
                          >
                            <span className="mr-2">{item.icon}</span>
                            {item.text}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div 
                  onClick={() => {
                    handleCancelAction();
                    setConfirmActions(!confirmActions);
                  }}
                  className={`w-full border py-2.5 px-3 rounded flex items-center justify-between transition-all text-left cursor-pointer
                    ${confirmActions 
                      ? 'bg-secondary/15 border-secondary text-white shadow-[0_0_10px_rgba(182,0,248,0.2)]' 
                      : 'bg-[#1c1b1b]/50 border-white/5 text-on-surface-variant hover:bg-[#201f1f]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4 text-secondary-container" />
                    <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-on-surface-variant">Action Confirms</span>
                  </div>
                  <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${confirmActions ? 'bg-[#bc13fe]' : 'bg-gray-700'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${confirmActions ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => {
                    setWalls([]);
                    setP1Pos([4,0]);
                    setP2Pos([4,8]);
                    setP1Budget(10);
                    setP2Budget(10);
                    setLogs([{ id: 'reset', timestamp: getSystemTimestamp(), turnNumber: 0, player: 'SYSTEM', action: 'PROTOCOL COMPILER RESET. BOARD CLEARED', type: 'system' }]);
                  }}
                  className="w-full bg-[#1c1b1b]/50 hover:bg-[#201f1f] border border-white/5 py-2.5 px-3 rounded flex items-center gap-3 transition-colors text-left cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-on-surface-variant" />
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-on-surface-variant">Reset Matrix Board</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={surrenderGame}
                className="w-full border border-red-500/25 hover:border-red-500 hover:bg-red-500/10 py-3.5 rounded transition-all flex flex-col items-center justify-center gap-1 group"
              >
                <span className="font-mono font-bold text-red-500 tracking-widest text-[11px] uppercase">Surrender Match</span>
                <span className="font-mono text-[8px] opacity-40 uppercase">Instant Command Terminate</span>
              </button>
            </div>
          </div>
        </aside>

      </main>

      {/* 3. MOBILE ADAPTIVE FOOTER DRAWER: LOG PANEL / INTEL (ONLY FOR SMALLER SCREENS) */}
      <div className="lg:hidden w-full max-w-[500px] mx-auto mb-4 relative z-40">
        <button 
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="w-full bg-[#131313]/90 border border-white/15 p-3 rounded-lg flex justify-between items-center text-xs font-mono tracking-wider text-[#00f2ff]"
        >
          <span className="flex items-center gap-2">
            <History className="w-4 h-4" />
            VIEW TACTICAL COMMUNICATIONS
          </span>
          {isMobileDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {isMobileDrawerOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#131313] border-x border-b border-white/10 p-4 rounded-b-lg space-y-3 max-h-[180px] overflow-y-auto"
            >
              {logs.map((log) => (
                <div key={log.id} className="text-[11px] font-mono leading-relaxed border-b border-white/5 pb-2 last:border-b-0">
                  <div className="flex justify-between text-[9px] opacity-40 font-bold mb-0.5">
                    <span>{log.player}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-white/80">{log.action}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BATTLE HUD COMMAND ERROR OVERLAY NOTIFICATIONS */}
      {validationError && (
        <div className="w-full max-w-[540px] mx-auto mb-4 bg-yellow-950/40 border border-yellow-500/30 p-2.5 rounded text-center z-40 relative">
          <p className="font-mono text-[10px] text-yellow-400 tracking-wider font-extrabold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
            {validationError}
          </p>
        </div>
      )}

      {/* 4. ACTIONS CONTROLS HUD CONSOLE FOOTER */}
      <footer className="w-full max-w-[840px] mx-auto z-40 relative mb-10">
        
        <div className="bg-[#131313]/90 backdrop-blur-xl p-3 rounded-full border border-white/10 flex flex-wrap md:flex-nowrap items-center justify-between px-6 gap-4">
          
          {/* Custom actions choice buttons */}
          <div className="flex gap-4">
            
            <button 
              id="action-move-piece"
              onClick={() => {
                setActionType('move');
                setPreviewWall(null);
                setValidationError(null);
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all duration-300
                ${actionType === 'move' 
                  ? 'border-[#00f2ff] bg-primary-container/10 text-primary-container shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                  : 'border-white/5 bg-[#1c1b1b]/50 text-on-surface-variant'
                }
              `}>
                <Navigation className="w-5 h-5 fill-current" />
              </div>
              <span className={`font-mono text-[9px] font-bold tracking-wider uppercase
                ${actionType === 'move' ? 'text-primary-container' : 'text-on-surface-variant/70'}
              `}>Move Piece</span>
            </button>

            <button 
              id="action-place-barricade"
              onClick={() => {
                setActionType('barricade');
                setPreviewPos(null);
                setValidationError(null);
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all duration-300
                ${actionType === 'barricade' 
                  ? 'border-[#bc13fe] bg-[#bc13fe]/10 text-secondary shadow-[0_0_10px_rgba(188,19,254,0.3)]'
                  : 'border-white/5 bg-[#1c1b1b]/50 text-on-surface-variant'
                }
              `}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className={`font-mono text-[9px] font-bold tracking-wider uppercase
                ${actionType === 'barricade' ? 'text-secondary' : 'text-on-surface-variant/70'}
              `}>Barricades</span>
            </button>

          </div>

          {/* Tactile physical stockpile and orientations (always visible during runtime) */}
          {!isGameOver && (
            <div className="flex flex-wrap items-center gap-3 bg-[#0a0a0a] p-2 border border-white/5 rounded-lg z-50">
              <div className="flex flex-col text-left pr-1 hidden sm:flex">
                <span className="font-mono text-[8px] text-[#ebb2ff] tracking-widest uppercase font-extrabold leading-none mb-0.5">BARRICADE MATRIX</span>
                <span className="font-mono text-[9px] text-gray-400 font-semibold leading-none">Grab as stockpile cores or Click:</span>
              </div>

              <div className="flex gap-2.5 items-center">
                {/* Horizontal draggable block */}
                <button
                  id="drag-barricade-horiz"
                  onPointerDown={(e) => startWallDrag(e, 'horizontal')}
                  onClick={() => {
                    setSelectedWallOrientation('horizontal');
                    setActionType('barricade');
                    setPreviewWall(null);
                    setValidationError(null);
                  }}
                  className={`relative h-6 w-16 bg-gradient-to-r from-[#bc13fe] to-[#4c0566] border rounded shadow-[0_0_10px_rgba(188,19,254,0.3)] flex items-center justify-center cursor-grab hover:scale-105 active:cursor-grabbing transition-all select-none
                    ${actionType === 'barricade' && selectedWallOrientation === 'horizontal' ? 'border-[#fbbf24] shadow-[0_0_12px_#fbbf24]' : 'border-[#bc13fe]/30'}
                  `}
                  title="Drag and Drop or Click to place Horizontal Barricade"
                >
                  <div className="flex gap-1 justify-center animate-[pulse_2s_infinite]">
                    <span className="w-1 h-1 bg-[#ebb2ff]/75 rounded-full" />
                    <span className="w-1 h-1 bg-[#ebb2ff]/75 rounded-full" />
                    <span className="w-1 h-1 bg-[#ebb2ff]/75 rounded-full" />
                  </div>
                  <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 font-mono text-[7px] text-gray-400 uppercase tracking-widest font-extrabold">HORIZ</span>
                </button>

                {/* Vertical draggable block */}
                <button
                  id="drag-barricade-vert"
                  onPointerDown={(e) => startWallDrag(e, 'vertical')}
                  onClick={() => {
                    setSelectedWallOrientation('vertical');
                    setActionType('barricade');
                    setPreviewWall(null);
                    setValidationError(null);
                  }}
                  className={`relative w-6 h-10 bg-gradient-to-b from-[#bc13fe] to-[#4c0566] border rounded shadow-[0_0_10px_rgba(188,19,254,0.3)] flex flex-col items-center justify-center cursor-grab hover:scale-105 active:cursor-grabbing transition-all select-none
                    ${actionType === 'barricade' && selectedWallOrientation === 'vertical' ? 'border-[#fbbf24] shadow-[0_0_12px_#fbbf24]' : 'border-[#bc13fe]/30'}
                  `}
                  title="Drag and Drop or Click to place Vertical Barricade"
                >
                  <div className="flex flex-col gap-1 justify-center animate-[pulse_2s_infinite]">
                    <span className="w-1 h-1 bg-[#ebb2ff]/75 rounded-full" />
                    <span className="w-1 h-1 bg-[#ebb2ff]/75 rounded-full" />
                  </div>
                  <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 font-mono text-[7px] text-gray-400 uppercase tracking-widest font-extrabold h-auto">VERT</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick inline emotes menu on mobile */}
          <div className="flex lg:hidden items-center">
            <button 
              onClick={() => triggerEmote({ text: "NICE PROTOCOL!", icon: "👍" })}
              className="px-2.5 py-1.5 bg-[#1c1b1b]/50 border border-white/5 rounded font-mono text-[9px] uppercase tracking-wider font-extrabold text-on-surface-variant"
            >
              💬 Emote
            </button>
          </div>

          {/* Action confirmation/instruction panel */}
          {(previewPos || previewWall) ? (
            <div className="flex-1 max-w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-[#bc13fe]/10 border border-[#bc13fe]/30 rounded-lg z-25">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-[#ebb2ff] tracking-widest uppercase font-extrabold mb-0.5">TRANSMISSION PENDING</span>
                <p className="font-mono text-xs text-white">Grid target targeted cleanly. Finalize commands?</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCancelAction}
                  className="px-3 py-1.5 bg-[#1a1919] hover:bg-gray-800 border border-white/5 text-gray-300 font-mono text-[10px] uppercase font-bold rounded cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTurn}
                  className="px-4 py-1.5 bg-[#bc13fe] hover:bg-[#c802ff] text-white font-mono text-[10px] uppercase font-black rounded shadow-[0_0_12px_rgba(188,19,254,0.5)] transition-all cursor-pointer"
                >
                  COMMIT TURN
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 max-w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-lg z-20">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-[#00f2ff] tracking-widest uppercase font-extrabold mb-0.5">Tactical Command Protocol</span>
                <p className="font-mono text-xs text-on-surface-variant leading-relaxed animate-none">
                  {gameMode === 'ranked' && turn !== playerIndex ? (
                    <span className="text-[#ebb2ff] tracking-widest font-extrabold uppercase animate-pulse block">AWAITING OPPONENT PILOT INPUT COMMS...</span>
                  ) : (
                    <span>
                      {confirmActions 
                        ? 'SELECT TARGET CELLS OR GRID INTERSECTS TO STAGE STATIONS.' 
                        : 'CLICK ENCRYPTED CELL MATRIX TO EXECUTE MANEUVERS INSTANTLY.'
                      }
                    </span>
                  )}
                </p>
              </div>
              
              <button
                onClick={surrenderGame}
                className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/20 text-[10px] uppercase font-mono tracking-widest font-bold rounded select-none transition-colors cursor-pointer"
              >
                Surrender Match
              </button>
            </div>
          )}

        </div>

      </footer>

      {/* Decorative hud micro indicator copy */}
      <div className="absolute bottom-3 right-6 pointer-events-none opacity-25 select-none font-mono text-[9px] text-on-surface-variant text-right tracking-wider">
        STRAT9_PROTOCOL_CHASSIS_HUD_v4.2.0<br />
        ENCRYPTED_SIGNAL_STRENGTH_98% // SECTOR G
      </div>

      {/* MATCH OVER POPUP GRAPHICS (VICTORY / DEFEAT CINEMATIC) */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center z-[9999] px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-[#131313] border-t-4 border-t-primary border border-white/10 p-8 rounded-lg max-w-lg w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-primary/40 font-bold uppercase">
                BATTLE_END
              </div>
              
              <Swords className="w-14 h-14 text-secondary-container mx-auto mb-6 drop-shadow-[0_0_10px_rgba(182,0,248,0.5)] animate-bounce" />
              
              <h2 className="text-3xl md:text-5xl font-sora font-extrabold tracking-tight text-white uppercase leading-none">
                {winnerIdx === 0 ? "VICTORY COMMAND" : "MATRIX COMBAT LOSS"}
              </h2>
              
              <p className="mt-3 font-mono text-xs text-primary-container tracking-widest font-extrabold uppercase">
                {winnerIdx === 0 ? "Player Cyber_Wolf Dominated the Grid" : "Neural_Link Overpassed baseline Defense"}
              </p>

              <div className="bg-[#0e0e0e] border border-white/5 p-4 rounded mt-6 space-y-2 text-left">
                <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
                  <span>Match Mode</span>
                  <span className="text-white uppercase font-bold">{gameMode}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
                  <span>Total Time Elapsed</span>
                  <span className="text-white font-bold">{formatTime(matchSeconds)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
                  <span>Barricades Remaining</span>
                  <span className="text-[#00f2ff] font-bold">{p1Budget} units</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-sm font-mono font-bold">
                  <span className="text-primary">Credits Reward Transferred</span>
                  <span className="text-yellow-400 font-extrabold">+{winnerIdx === 0 ? "500 CR" : "100 CR"}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  id="victory-btn-restart"
                  onClick={() => {
                    setP1Pos([4, 0]);
                    setP2Pos([4, 8]);
                    setWalls([]);
                    setP1Budget(10);
                    setP2Budget(10);
                    setMatchSeconds(0);
                    setIsGameOver(false);
                    setWinnerIdx(null);
                    setTurn(0);
                    setLogs([{ id: 'init', timestamp: getSystemTimestamp(), turnNumber: 0, player: 'SYSTEM', action: 'BATTLEFIELD INITIALIZED. PROTOCOL LIVE', type: 'system' }]);
                  }}
                  className="flex-1 py-3 bg-[#b600f8] hover:bg-[#c802ff] text-white font-mono text-xs font-bold tracking-widest uppercase rounded shadow-[0_0_15px_rgba(182,0,248,0.4)]"
                >
                  Restart Battle
                </button>
                <button 
                  id="victory-btn-menu"
                  onClick={onBackToMenu}
                  className="flex-1 py-3 bg-transparent border border-white/20 text-[#ebb2ff] hover:border-primary font-mono text-xs font-bold tracking-widest uppercase rounded"
                >
                  Back to Terminal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL DRAG FLOATING PREVIEW */}
      {isDraggingWall && dragPosition && (
        <div 
          className={`fixed rounded-full pointer-events-none z-[99999] opacity-85 shadow-[0_0_20px_#fbbf24] bg-[#fbbf24] border-2 border-yellow-300
            ${draggedWallOrientation === 'horizontal' 
              ? 'h-3 w-20 -translate-y-1/2 -translate-x-1/2' 
              : 'w-3 h-20 -translate-x-1/2 -translate-y-1/2'
            }
          `}
          style={{
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
          }}
        />
      )}

    </div>
  );
}
