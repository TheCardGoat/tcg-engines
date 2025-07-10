import type { Operation } from "rfc6902";
import type { ActionShape } from "~/game-engine/core-engine/engine/types";
import type {
  ChatMessage,
  CoreEngineState,
  FilteredMetadata,
  LogEntry,
  SyncInfo,
} from "~/game-engine/core-engine/game-configuration";

export type CallbackFn = (arg: {
  state: CoreEngineState;
  matchID: string;
  action?: ActionShape.Any;
}) => void;

/**
 * Data types that are shared across `TransportData` and `IntermediateTransportData`.
 */
type CommonTransportData =
  | {
      type: "sync";
      args: [string, SyncInfo];
    }
  | {
      type: "matchData";
      args: [string, FilteredMetadata];
    }
  | {
      type: "chat";
      args: [string, ChatMessage];
    };

/**
 * Final shape of data sent by the transport API
 * to be received by clients/client transports.
 */
export type TransportData =
  | {
      type: "update";
      args: [string, CoreEngineState, LogEntry[]];
    }
  | {
      type: "patch";
      args: [string, number, number, Operation[], LogEntry[]];
    }
  | CommonTransportData;

/**
 * Data type sent by a master to its transport API. The transport then transforms
 * this into `TransportData` for each individual player it forwards it to.
 */
export type IntermediateTransportData =
  | {
      type: "update";
      args: [string, CoreEngineState];
    }
  | {
      type: "patch";
      args: [string, number, CoreEngineState, CoreEngineState];
    }
  | CommonTransportData;

/** API used by a master to emit data to any connected clients/client transports. */
export interface TransportAPI {
  send: (
    playerData: { playerID: PlayerID } & IntermediateTransportData,
  ) => void;
  sendAll: (payload: IntermediateTransportData) => void;
}

type PlayerID = string;

export type PlayerMetadata = {
  id: number;
  name?: string;
  credentials?: string;
  data?: unknown;
  isConnected?: boolean;
};

export interface MatchData {
  gameName: string;
  players: { [id: number]: PlayerMetadata };
  setupData?: unknown;
  gameOver?: unknown;
  nextMatchID?: string;
  unlisted?: boolean;
  createdAt: number;
  updatedAt: number;
}
