import type { CombinedLobbyState } from "./shared-types";

// Public message types for the lobby API
export type LobbyMessageType =
  | "join"
  | "leave"
  | "ready"
  | "create"
  | "status"
  | "player_joined"
  | "player_left"
  | "player_ready"
  | "created"
  | "failed"
  | "force_sync";

export interface LobbyMessage {
  type: LobbyMessageType;
  payload: unknown;
}

export interface LobbyJoinMessage extends LobbyMessage {
  type: "join";
  payload: {
    playerId: string;
    playerData?: unknown;
  };
}

export interface LobbyLeaveMessage extends LobbyMessage {
  type: "leave";
  payload: {
    playerId: string;
  };
}

export interface LobbyReadyMessage extends LobbyMessage {
  type: "ready";
  payload: {
    playerId: string;
    isReady: boolean;
  };
}

export interface LobbyCreateMessage extends LobbyMessage {
  type: "create";
  payload: {
    lobbyId: string;
  };
}

export interface LobbyStatusMessage extends LobbyMessage {
  type: "status";
  payload: {
    status: string;
    lobbyId: string;
  };
}

export interface LobbyPlayerJoinedMessage extends LobbyMessage {
  type: "player_joined";
  payload: {
    playerId: string;
    playerData?: unknown;
  };
}

export interface LobbyPlayerLeftMessage extends LobbyMessage {
  type: "player_left";
  payload: {
    playerId: string;
  };
}

export interface LobbyPlayerReadyMessage extends LobbyMessage {
  type: "player_ready";
  payload: {
    playerId: string;
    isReady: boolean;
  };
}

export interface LobbyCreatedMessage extends LobbyMessage {
  type: "created";
  payload: {
    lobbyId: string;
    matchId: string;
  };
}

export interface LobbyFailedMessage extends LobbyMessage {
  type: "failed";
  payload: {
    lobbyId: string;
    error: string;
  };
}

export interface LobbyForceSyncMessage extends LobbyMessage {
  type: "force_sync";
  payload: {
    state: unknown;
  };
}

export type LobbyMessageHandler = (message: LobbyMessage) => void;

// Internal message types for the lobby engine
export type ServerMessages<T, C> =
  | MessageRejectedOutMessage
  | PlayerJoinedOutMessage<C>
  | PlayerLeftOutMessage
  | UpdateStateOutMessage<T, C>
  | PlayerAcceptedOutMessage
  | PlayerRejectedOutMessage;

export enum ServerMessageType {
  PLAYER_JOINED = 1000,
  PLAYER_LEFT = 1001,
  PLAYER_ACCEPTED = 1004,
  PLAYER_REJECTED = 1005,
  UPDATE_STATE = 1099,
  MESSAGE_REJECTED = 10100,
}

// Messages sent from the client to the server
export type ClientMessages<_T, _C> =
  | {
      type: ClientMessageType.LOBBY_TIMED_OUT;
      payload: {
        reason: string;
      };
    }
  | AcceptRejectLobbyInMessage
  | {
      type: ClientMessageType.FORCE_SYNC;
      payload: {
        playerId?: string;
      };
    };

export enum ClientMessageType {
  ACCEPT_LOBBY = 1,
  REJECT_LOBBY = 2,
  LOBBY_TIMED_OUT = 3,
  FORCE_SYNC = 99,
}

export type PlayerJoinedOutMessage<C = unknown> = {
  type: ServerMessageType.PLAYER_JOINED;
  payload: {
    playerId: string;
    playerData?: C;
  };
};
export type PlayerLeftOutMessage = {
  type: ServerMessageType.PLAYER_LEFT;
  payload: {
    playerId: string;
  };
};
export type UpdateStateOutMessage<T = unknown, C = unknown> = {
  type: ServerMessageType.UPDATE_STATE;
  payload: CombinedLobbyState<T, C>;
};
export type MessageRejectedOutMessage = {
  type: ServerMessageType.MESSAGE_REJECTED;
  payload: {
    reason: string;
    message: unknown;
  };
};

export type PlayerAcceptedOutMessage = {
  type: ServerMessageType.PLAYER_ACCEPTED;
  payload: {
    playerId: string;
  };
};

export type PlayerRejectedOutMessage = {
  type: ServerMessageType.PLAYER_REJECTED;
  payload: {
    playerId: string;
  };
};

export type AcceptRejectLobbyInMessage = {
  type: ClientMessageType.ACCEPT_LOBBY | ClientMessageType.REJECT_LOBBY;
  payload: {
    playerId?: string;
  };
};
