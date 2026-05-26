import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface LogEntry {
  id: string;
  timestamp: string;
  turnNumber: number;
  player: string;
  action: string;
  type: 'move' | 'barricade' | 'system';
}

interface Wall {
  id: string;
  rx: number;
  cx: number;
  orientation: 'horizontal' | 'vertical';
  ownerId: string;
}

interface MatchState {
  id: string;
  status: 'waiting' | 'active' | 'finished';
  p1Id: string;
  p1Name: string;
  p1Avatar: string;
  p2Id: string | null;
  p2Name: string | null;
  p2Avatar: string | null;
  p1Pos: [number, number];
  p2Pos: [number, number];
  walls: Wall[];
  turn: 0 | 1;
  turnTimeLeft: number;
  winnerIdx: number | null;
  p1Budget: number;
  p2Budget: number;
  logs: LogEntry[];
  matchSeconds: number;
  p1EmoteText: string | null;
  p2EmoteText: string | null;
  p1TimeLeft: number;
  p2TimeLeft: number;
  updatedAt: number;
}

// In-memory matches store
const matches: Record<string, MatchState> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to format system timestamp (UTC)
  const getSystemTimestamp = () => {
    const date = new Date();
    return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;
  };

  // Validation Helpers for Wall Placement on the Server
  const areAdjacent = (p1: [number, number], p2: [number, number]) => {
    const dx = Math.abs(p1[0] - p2[0]);
    const dy = Math.abs(p1[1] - p2[1]);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  const isWallBlocking = (from: [number, number], to: [number, number], activeWalls: Wall[]) => {
    const [c1, r1] = from;
    const [c2, r2] = to;

    if (!areAdjacent(from, to)) return false;

    // Vertical transition (same column, rows differ)
    if (c1 === c2) {
      const minRow = Math.min(r1, r2);
      return activeWalls.some(
        (w) => w.orientation === 'horizontal' && w.rx === minRow && (w.cx === c1 || w.cx === c1 - 1)
      );
    }

    // Horizontal transition (same row, columns differ)
    if (r1 === r2) {
      const minCol = Math.min(c1, c2);
      return activeWalls.some(
        (w) => w.orientation === 'vertical' && w.cx === minCol && (w.rx === r1 || w.rx === r1 - 1)
      );
    }

    return false;
  };

  const getNeighbors = (pos: [number, number], activeWalls: Wall[]): [number, number][] => {
    const [c, r] = pos;
    const targets: [number, number][] = [
      [c, r - 1], // Up
      [c, r + 1], // Down
      [c - 1, r], // Left
      [c + 1, r], // Right
    ];

    return targets.filter(([nc, nr]) => {
      if (nc < 0 || nc > 8 || nr < 0 || nr > 8) return false;
      return !isWallBlocking(pos, [nc, nr], activeWalls);
    });
  };

  const isGoalReachable = (playerIdx: number, startPos: [number, number], activeWalls: Wall[]): boolean => {
    const targetRow = playerIdx === 0 ? 8 : 0;
    const queue: [number, number][] = [startPos];
    const visited = new Set<string>();
    visited.add(`${startPos[0]},${startPos[1]}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current[1] === targetRow) {
        return true;
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

    return false;
  };

  const isValidBarricadePlacement = (rx: number, cx: number, orientation: 'horizontal' | 'vertical', walls: Wall[], p1Pos: [number, number], p2Pos: [number, number]): boolean => {
    if (rx < 0 || rx > 7 || cx < 0 || cx > 7) return false;

    // Exact overlap
    const exactOverlap = walls.find((w) => w.rx === rx && w.cx === cx);
    if (exactOverlap) return false;

    if (orientation === 'horizontal') {
      const isTooClose = walls.some(
        (w) => w.orientation === 'horizontal' && w.rx === rx && Math.abs(w.cx - cx) <= 1
      );
      if (isTooClose) return false;

      const isVerticalIntersection = walls.some(
        (w) => w.orientation === 'vertical' && w.rx === rx && w.cx === cx
      );
      if (isVerticalIntersection) return false;
    } else {
      const isTooClose = walls.some(
        (w) => w.orientation === 'vertical' && w.cx === cx && Math.abs(w.rx - rx) <= 1
      );
      if (isTooClose) return false;

      const isHorizontalIntersection = walls.some(
        (w) => w.orientation === 'horizontal' && w.rx === rx && w.cx === cx
      );
      if (isHorizontalIntersection) return false;
    }

    // Path check (prevent blocking players)
    const tempWall: Wall = {
      id: 'temp',
      rx,
      cx,
      orientation,
      ownerId: 'temp_owner'
    };
    const hypWalls = [...walls, tempWall];

    return isGoalReachable(0, p1Pos, hypWalls) && isGoalReachable(1, p2Pos, hypWalls);
  };

  // 1. Lobby and Matchmaking Endpoints
  app.post("/api/matchmaking/search", (req, res) => {
    const { playerId, playerName, avatar, targetMatchId } = req.body;
    
    if (!playerId || !playerName) {
      res.status(400).json({ error: "Missing identity credentials" });
      return;
    }

    const currentTimestamp = getSystemTimestamp();

    // If a targetMatchId is specified, join that exact lobby
    if (targetMatchId) {
      const match = matches[targetMatchId];
      if (match) {
        if (match.p1Id === playerId) {
          // Rejoining as player 1
          res.json({
            matchId: match.id,
            playerIndex: 0,
            match,
          });
          return;
        }

        if (match.p2Id === playerId) {
          // Rejoining as player 2
          res.json({
            matchId: match.id,
            playerIndex: 1,
            match,
          });
          return;
        }

        if (match.status === 'waiting') {
          // Attach as player 2
          match.p2Id = playerId;
          match.p2Name = playerName;
          match.p2Avatar = avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuACU5pKM_viRUu-bSZUWCzI1mIVqgLOf1x3LfozBgwljiXD5L1xF8L1Q_UZCAxn8ULBzCUJlLbTdCunIRXgW7nxae2YHHrdtwFJO52obwA7cjbT1dz_OuSIjVf-h7IVYXWaaAzT1ZzRtbr6zPrPZz-e6YhXBGZikfhmjeKGOnbpwW6OuKyGePHBxvuHkYi1zu-8gmp7LP_CH7sNF-Tv7zZdaFQSqLIFCearKC4KmEsLKfOv23VOJmqUO88xRaZ_sqwBwzLvDb8c5jY";
          match.status = 'active';
          match.turnTimeLeft = 45; // Starts fresh
          match.updatedAt = Date.now();

          match.logs.unshift({
            id: `sys-${Date.now()}`,
            timestamp: currentTimestamp,
            turnNumber: match.logs.length,
            player: 'SYSTEM',
            action: `AUTHENTICATED OPPONENT: ${playerName} SECURED THE GRAPHPORT VIA PRIMARY COMMS COMLINK`,
            type: 'system'
          });

          res.json({
            matchId: match.id,
            playerIndex: 1,
            match,
          });
          return;
        } else {
          res.status(400).json({ error: "Lobby operations already fully engaged" });
          return;
        }
      } else {
        res.status(404).json({ error: "Cyber lobby matrix signal lost" });
        return;
      }
    }

    // Try to find an existing match looking for a second player
    const pendingMatch = Object.values(matches).find(
      (m) => m.status === 'waiting' && m.p1Id !== playerId
    );

    if (pendingMatch) {
      // Connect to pending match
      pendingMatch.p2Id = playerId;
      pendingMatch.p2Name = playerName;
      pendingMatch.p2Avatar = avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuACU5pKM_viRUu-bSZUWCzI1mIVqgLOf1x3LfozBgwljiXD5L1xF8L1Q_UZCAxn8ULBzCUJlLbTdCunIRXgW7nxae2YHHrdtwFJO52obwA7cjbT1dz_OuSIjVf-h7IVYXWaaAzT1ZzRtbr6zPrPZz-e6YhXBGZikfhmjeKGOnbpwW6OuKyGePHBxvuHkYi1zu-8gmp7LP_CH7sNF-Tv7zZdaFQSqLIFCearKC4KmEsLKfOv23VOJmqUO88xRaZ_sqwBwzLvDb8c5jY";
      pendingMatch.status = 'active';
      pendingMatch.turnTimeLeft = 45; // Turn starts fresh
      pendingMatch.updatedAt = Date.now();
      
      pendingMatch.logs.unshift({
        id: `sys-${Date.now()}`,
        timestamp: getSystemTimestamp(),
        turnNumber: pendingMatch.logs.length,
        player: 'SYSTEM',
        action: `AUTHENTICATED OPPONENT: ${playerName} SECURED THE GRAPHPORT`,
        type: 'system'
      });

      res.json({
        matchId: pendingMatch.id,
        playerIndex: 1, // You are Player 2
        match: pendingMatch,
      });
      return;
    }

    // Create a new match lobby
    const matchId = `match-${Math.random().toString(36).substr(2, 9)}`;
    const newMatch: MatchState = {
      id: matchId,
      status: 'waiting',
      p1Id: playerId,
      p1Name: playerName,
      p1Avatar: avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBHM8Y5UNAdVqBvdQIFSEEg2onSwepqLTFLU1N1WOG6M8U6k8enTNjqqocUPmdF2WuXgwbt2fCr_Dv74XjWMcq2t8zXpnaa1EtbqOs7YV970zFcF5S7rJR80Vht4V0UXV94Im2U93B8H3OCBxMIw4Qzbh5E4vAvm9XakJS7A8y5V6-OJyOWjphYvx0n8-0OgEiVKbETwHBSF28aVAsWQBZAto9J9yzrtoTaF6TzBsdBevfOnhdj-c2FRs7oamdSc8prUClk8riUBxY",
      p2Id: null,
      p2Name: null,
      p2Avatar: null,
      p1Pos: [4, 0], // Baseline (row index 0)
      p2Pos: [4, 8], // Opponent baseline (row index 8)
      walls: [],
      turn: 0,
      turnTimeLeft: 45,
      winnerIdx: null,
      p1Budget: 10,
      p2Budget: 10,
      logs: [
        {
          id: `sys-init-${Date.now()}`,
          timestamp: getSystemTimestamp(),
          turnNumber: 0,
          player: 'SYSTEM',
          action: `HOSTING LOBBY ${matchId.toUpperCase()}: WAITING FOR PEERS...`,
          type: 'system'
        }
      ],
      matchSeconds: 0,
      p1EmoteText: null,
      p2EmoteText: null,
      p1TimeLeft: 120,
      p2TimeLeft: 120,
      updatedAt: Date.now(),
    };

    matches[matchId] = newMatch;

    res.json({
      matchId,
      playerIndex: 0, // You are Player 1 (Host)
      match: newMatch,
    });
  });

  // Get status of a match lobby
  app.get("/api/matchmaking/status", (req, res) => {
    const { matchId } = req.query;
    if (!matchId || typeof matchId !== 'string') {
      res.status(400).json({ error: "Missing matchId parameter" });
      return;
    }

    const match = matches[matchId];
    if (!match) {
      res.status(404).json({ error: "Game matrix not found" });
      return;
    }

    res.json(match);
  });

  // POST player action (move or barricade placement)
  app.post("/api/matchmaking/action", (req, res) => {
    const { matchId, playerId, actionType, col, row, rx, cx, orientation } = req.body;
    
    const match = matches[matchId];
    if (!match) {
      res.status(404).json({ error: "Game matrix not found" });
      return;
    }

    if (match.status !== 'active') {
      res.status(400).json({ error: "Match operations not engaged" });
      return;
    }

    // Verify correct player turn
    const activePlayerId = match.turn === 0 ? match.p1Id : match.p2Id;
    if (activePlayerId !== playerId) {
      res.status(403).json({ error: "Operations breach: Command bypass out of turn alignment" });
      return;
    }

    const currentTimestamp = getSystemTimestamp();
    const playerName = match.turn === 0 ? match.p1Name : match.p2Name;

    if (actionType === 'move') {
      if (typeof col !== 'number' || typeof row !== 'number') {
        res.status(400).json({ error: "Coordinates invalid" });
        return;
      }

      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      const originalLabel = `${letters[match.turn === 0 ? match.p1Pos[0] : match.p2Pos[0]]}${(match.turn === 0 ? match.p1Pos[1] : match.p2Pos[1]) + 1}`;
      const targetLabel = `${letters[col]}${row + 1}`;
      const logMsg = `${originalLabel} -> MOVE -> ${targetLabel}`;

      if (match.turn === 0) {
        match.p1Pos = [col, row];
      } else {
        match.p2Pos = [col, row];
      }

      match.logs.unshift({
        id: `action-${Date.now()}`,
        timestamp: currentTimestamp,
        turnNumber: match.logs.length,
        player: playerName || 'UNKNOWN',
        action: logMsg,
        type: 'move',
      });

      // Win check
      const goalRow = match.turn === 0 ? 8 : 0;
      if (row === goalRow) {
        match.winnerIdx = match.turn;
        match.status = 'finished';
        match.logs.unshift({
          id: `win-${Date.now()}`,
          timestamp: currentTimestamp,
          turnNumber: match.logs.length,
          player: 'SYSTEM',
          action: `GRID DOMINATED: PLAYER ${playerName?.toUpperCase()} DELIVERED OUTCOME`,
          type: 'system',
        });
      } else {
        // Shift turn
        match.turn = match.turn === 0 ? 1 : 0;
        match.turnTimeLeft = 45;
      }
    } else if (actionType === 'barricade') {
      if (typeof rx !== 'number' || typeof cx !== 'number' || !orientation) {
        res.status(400).json({ error: "Barricade coordinate orientation parameters missing" });
        return;
      }

      // Perform validation check
      const isValid = isValidBarricadePlacement(rx, cx, orientation, match.walls, match.p1Pos, match.p2Pos);
      if (!isValid) {
        res.status(400).json({ error: "CRITICAL: PLACEMENT LOCKED. FULL CELL INTERCLUSION IS FORBIDDEN" });
        return;
      }

      const colLabel1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][cx];
      const colLabel2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][cx + 1];
      const startCell = `${colLabel1}${rx + 1}`;
      const endCell = `${colLabel2}${rx + 2}`;
      const logMsg = `BARRIER PLACED @ ${startCell}-${endCell} (${orientation.toUpperCase()})`;

      const newWall: Wall = {
        id: `wall-${Date.now()}`,
        rx,
        cx,
        orientation,
        ownerId: match.turn === 0 ? 'p1' : 'p2',
      };

      match.walls.push(newWall);

      if (match.turn === 0) {
        match.p1Budget -= 1;
      } else {
        match.p2Budget -= 1;
      }

      match.logs.unshift({
        id: `action-${Date.now()}`,
        timestamp: currentTimestamp,
        turnNumber: match.logs.length,
        player: playerName || 'UNKNOWN',
        action: logMsg,
        type: 'barricade',
      });

      // Shift turn
      match.turn = match.turn === 0 ? 1 : 0;
      match.turnTimeLeft = 45;
    }

    match.updatedAt = Date.now();
    res.json(match);
  });

  // POST Chat Emote
  app.post("/api/matchmaking/emote", (req, res) => {
    const { matchId, playerId, emoteText } = req.body;
    
    const match = matches[matchId];
    if (!match) {
      res.status(404).json({ error: "Game matrix not found" });
      return;
    }

    if (playerId === match.p1Id) {
      match.p1EmoteText = emoteText;
      setTimeout(() => { if (matches[matchId]) matches[matchId].p1EmoteText = null; }, 2500);
    } else if (playerId === match.p2Id) {
      match.p2EmoteText = emoteText;
      setTimeout(() => { if (matches[matchId]) matches[matchId].p2EmoteText = null; }, 2500);
    }

    match.updatedAt = Date.now();
    res.json(match);
  });

  // POST Surrender match
  app.post("/api/matchmaking/surrender", (req, res) => {
    const { matchId, playerId } = req.body;
    const match = matches[matchId];
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    const currentTimestamp = getSystemTimestamp();
    const isP1 = playerId === match.p1Id;
    match.winnerIdx = isP1 ? 1 : 0;
    match.status = 'finished';
    
    match.logs.unshift({
      id: `sys-surr-${Date.now()}`,
      timestamp: currentTimestamp,
      turnNumber: match.logs.length,
      player: 'SYSTEM',
      action: `TACTICAL COMPLIANCE: ${isP1 ? match.p1Name : match.p2Name} DETECTED SURRENDER CAPITULATION`,
      type: 'system'
    });

    match.updatedAt = Date.now();
    res.json(match);
  });

  // POST Reset Match
  app.post("/api/matchmaking/reset", (req, res) => {
    const { matchId } = req.body;
    const match = matches[matchId];
    if (match) {
      match.p1Pos = [4, 0];
      match.p2Pos = [4, 8];
      match.walls = [];
      match.p1Budget = 10;
      match.p2Budget = 10;
      match.turn = 0;
      match.status = 'active';
      match.winnerIdx = null;
      match.matchSeconds = 0;
      match.turnTimeLeft = 45;
      match.p1TimeLeft = 120;
      match.p2TimeLeft = 120;
      match.logs = [
        {
          id: `sys-reset-${Date.now()}`,
          timestamp: getSystemTimestamp(),
          turnNumber: 0,
          player: 'SYSTEM',
          action: 'PROTOCOL RECONFIGURED: MATRIX FLUSH COMPLETED. RESET LIVE.',
          type: 'system'
        }
      ];
      match.updatedAt = Date.now();
      res.json(match);
    } else {
      res.status(404).json({ error: "Match not found" });
    }
  });

  // Core background server ticker loop (tracks match elapsed seconds and turn clocks)
  setInterval(() => {
    const now = Date.now();
    for (const matchId in matches) {
      const match = matches[matchId];
      if (match.status === 'active') {
        match.matchSeconds += 1;
        match.turnTimeLeft -= 1;

        if (match.turn === 0) {
          match.p1TimeLeft = Math.max(0, match.p1TimeLeft - 1);
        } else {
          match.p2TimeLeft = Math.max(0, match.p2TimeLeft - 1);
        }

        // Automatic Timeout Handover if remaining timer hits 0
        if (match.turnTimeLeft <= 0) {
          const originalTurn = match.turn;
          const originalPlayerName = originalTurn === 0 ? match.p1Name : match.p2Name;
          
          // Switch Turn Auto-Pass
          match.turn = match.turn === 0 ? 1 : 0;
          match.turnTimeLeft = 45;
          match.logs.unshift({
            id: `sys-timeout-${Date.now()}`,
            timestamp: getSystemTimestamp(),
            turnNumber: match.logs.length,
            player: 'SYSTEM',
            action: `SECURITY BREACH / OUT OF SPEED: ${originalPlayerName} TIMEOUT REACHED. TRANSMISSION AUTO-HANDED OVER.`,
            type: 'system'
          });
        }
      }
    }
  }, 1000);

  // Serve static UI assets and index file
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK PROTOCOL ACTIVE] Strat9 running on http://localhost:${PORT}`);
  });
}

startServer();
