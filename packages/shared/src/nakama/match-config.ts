import type { Match } from "../lorcana-engine";
import type { MatchMove } from "../simulator";
import type * as nkruntime from "./nakama-runtime";

export type RetryableRequest = {
  id: string;
  url: string;
  body: string;
  retryCount: number;
  nextRetry: number;
};

export type RetryQueue = Array<RetryableRequest>;

type PlayerId = string;
type ClerkId = string;
type TurnCount = string;
type MoveCount = string;
type GameId = string;
type GameMoves = Record<string, MatchMove[]>;

export type NakamaMatchState = {
  winner?: string;
  mode?: "best-of-one" | "best-of-two" | "best-of-three";
  // Client handles default value as it's more flexible.
  chat: "free_text" | "preset" | "disabled";
  rematch?: {
    requested?: string;
    accepted?: string;
    rematchId?: string;
  };
};

type ThinkingTime = Record<
  PlayerId,
  Record<
    GameId,
    {
      total: number;
      turns: Record<
        TurnCount,
        {
          total: number;
          moves: Record<MoveCount, number>;
        }
      >;
    }
  >
>;

export type TimeStats = {
  timeBank: number;
  bankedTime: number;
  violations: number;
};

export type UITimers = {
  // nakamaUserId: string;
  clerkId: string;
  idleTimeLeft?: number;
  droppedTimeLeft?: number;
  error?: string;
};

export interface PlayerState {
  presence: nkruntime.Presence;
  clerkId: string;
  isReady?: boolean;
  // isSpectator: boolean;
  deckId?: number;
  deckVersionId?: number;
  instantId?: string;
  baseListHash?: string;
  cardsHash?: string;
}

export enum NakamaGameStates {
  WaitingForPlayers = 0,
  WaitingForPlayersReady = 1,
  InProgress = 2,
}

export type NakamaGameState = {
  gameId: string;
  gameState?: Match<unknown, unknown, unknown>;
  moves: GameMoves;
  thinkingTime: ThinkingTime;
  timeStats: {
    [userId: string]: TimeStats;
  };
  logs: unknown[];
  winner?: string;
  createdAt: number;
};

// nkruntime.MatchState is adding `any` to state keys, we should remove this
export interface NakamaState extends nkruntime.MatchState {
  state: NakamaGameStates;
  players: { [nakamaUserId: string]: PlayerState };
  // Number of users currently in the process of connecting to the match.
  joinsInProgress: number;
  // Ticks until the next game starts, if applicable.
  nextGameRemainingTicks: number;
  // Ticks until they must submit the first move, this can be used to prevent people from quitting between games.
  deadlineRemainingTicks: number;
  // Ticks where no players are connected.
  emptyTicks: number;

  currentGameId: string;
  games: Record<GameId, NakamaGameState>;
  match: NakamaMatchState;

  undoMoveGameState?: string;
  undoTurnGameState?: string;

  // Map of Nakama User Id and Clerk Id
  idsMap: {
    [nakamaId: string]: ClerkId;
  };

  droppedPlayers: {
    [clerkId: string]: {
      dropped: boolean;
      time: number;
      clerkId: string;
    };
  };

  httpRetryQueue: RetryQueue;
}
