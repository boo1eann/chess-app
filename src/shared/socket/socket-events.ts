export type Color = "white" | "black";

export interface PlayerInfo {
  userId: string;
  username: string;
}

export interface MoveInput {
  from: string;
  to: string;
  promotion?: "q" | "r" | "b" | "n";
}

export type GameStatus =
  | "in_progress"
  | "checkmate"
  | "stalemate"
  | "draw"
  | "resigned";

export type GameResult = "1-0" | "0-1" | "1/2-1/2";

export type GameEndReason =
  | "checkmate"
  | "stalemate"
  | "insufficient_material"
  | "threefold_repetition"
  | "fifty_move_rule"
  | "white_resigned"
  | "black_resigned"
  | "white_disconnected"
  | "black_disconnected";

export interface GameSnapshot {
  id: string;
  white: PlayerInfo;
  black: PlayerInfo;
  fen: string;
  pgn: string;
  moves: string[];
  turn: Color;
  status: GameStatus;
  result?: GameResult;
  endReason?: GameEndReason;
  startedAt: string;
  endedAt?: string;
}

export type Ack<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export interface ClientToServerEvents {
  "matchmaking:join": (
    callback: (ack: Ack<{ status: "queued" }>) => void,
  ) => void;
  "matchmaking:cancel": (callback: (ack: Ack<null>) => void) => void;
  "game:join": (
    payload: { gameId: string },
    callback: (ack: Ack<{ snapshot: GameSnapshot }>) => void,
  ) => void;
  "game:move": (
    payload: {
      gameId: string;
      move: MoveInput;
      clientMoveId?: string;
    },
    callback: (ack: Ack<{ snapshot: GameSnapshot }>) => void,
  ) => void;
  "game:resign": (
    payload: { gameId: string },
    callback: (ack: Ack<null>) => void,
  ) => void;
}

export interface ServerToClientEvents {
  "match:found": (payload: {
    gameId: string;
    color: Color;
    opponent: PlayerInfo;
  }) => void;
  "game:moveMade": (payload: { snapshot: GameSnapshot }) => void;
  "game:ended": (payload: {
    gameId: string;
    result: GameResult;
    reason: GameEndReason;
  }) => void;
  error: (payload: { code: string; message: string }) => void;
}
