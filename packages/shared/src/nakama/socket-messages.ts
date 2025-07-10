import type {
  NakamaGameState,
  NakamaMatchState,
  NakamaState,
  UITimers,
} from "./match-config";
import type { OpCode } from "./opcodes";

export type DropPlayerMessagePayload = {
  loserId: string;
  winnerId: string;
  reason: "timeout" | "dropped";
};

export type StateMutationPayload =
  | {
      operation: OpCode.CONCEDE_GAME;
      payload: {
        matchId: string;
        playerId: string;
        winnerId: string;
      };
    }
  | {
      operation: OpCode.REQUEST_REMATCH;
      payload: {
        requested?: string;
        accepted?: string;
      };
    }
  | { operation: OpCode.UNDO_MOVE; payload: undefined }
  | { operation: OpCode.SET_MATCH_METADATA; payload: Partial<NakamaMatchState> }
  | { operation: OpCode.UNDO_TURN; payload: undefined }
  | {
      operation: OpCode.SET_ID_MAP;
      payload: {
        clerkId: string;
      };
    }
  | {
      operation: OpCode.REQUEST_THINKING_TIME;
      payload: {
        gameId: string;
      };
    }
  | {
      operation: OpCode.REQUEST_MATCH_STATE;
      payload: {
        gameId: string;
      };
    }
  | {
      operation: OpCode.INITIALIZE_STATE;
      payload: { match: NakamaGameState["gameState"] };
    }
  | {
      operation: OpCode.REPLACE_STATE;
      payload: {
        match: NakamaGameState["gameState"];
        ignoreUndo?: boolean;
      };
      metadata?: {
        hasMadeAMove: boolean;
        hasPassedTurn: boolean;
      };
    }
  | {
      operation: OpCode.NOTIFY_MATCH_WINNER;
      payload: {
        winner: string;
        matchId: string;
        gameId: string;
      };
    }
  | {
      operation: OpCode.SYNC_GAME_STATE;
      payload: {
        matchId: string;
        gameId: string;
      };
    }
  | {
      operation: OpCode.NOTIFY_GAME_WINNER;
      payload: {
        winner: string;
        matchId: string;
        gameId: string;
      };
    }
  | {
      operation: OpCode.DROP_PLAYER;
      payload: DropPlayerMessagePayload;
    };

export type StateMutationResponses =
  | {
      operation: OpCode.UPDATE_CLIENT_GAME_STATE;
      payload: {
        gameId: string;
        isGameOver: string;
        isMatchOver: string;
        match: NakamaState["match"];
        gameState: NakamaGameState["gameState"];
        timeStats: NakamaGameState["timeStats"];
        // We don't have to always send thinking time
        thinkingTime?: NakamaGameState["thinkingTime"];
        timers: Record<string, UITimers>;
      };
    }
  | {
      operation: OpCode.UPDATE_TIMERS;
      payload: {
        timeStats: NakamaGameState["timeStats"];
        droppedPlayers: NakamaState["droppedPlayers"];
        timers: Record<string, UITimers>;
      };
    };
