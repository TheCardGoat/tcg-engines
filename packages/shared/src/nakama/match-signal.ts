import type { OpCode } from "./opcodes";

// Using a generic Record type instead of any
export type GameState = Record<string, unknown>;

export type MatchSignal =
  | {
      OpCode: "REPLACE_GAME_STATE" | OpCode.INITIALIZE_STATE;
      payload: GameState;
    }
  | {
      OpCode: "REPLACE_GAME_STATE" | OpCode.REPLACE_STATE;
      payload: GameState;
    }
  | {
      OpCode: OpCode.NOTIFY_MATCH_WINNER;
      payload: {
        winner: string;
        gameId: string;
        matchId: string;
      };
    }
  | {
      OpCode: OpCode.NOTIFY_GAME_WINNER;
      payload: {
        winner: string;
        gameId: string;
        matchId: string;
      };
    };
