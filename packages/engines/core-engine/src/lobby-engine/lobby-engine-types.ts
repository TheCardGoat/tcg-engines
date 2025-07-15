import type { Store } from "@tanstack/store";
// Import types from their respective modules to avoid circular dependencies
import type { EventBus, EventHandler, LobbyEvent } from "./event-bus";
import type {
  CombinedLobbyState,
  EventType,
  LobbyContext,
  LobbyPlayer,
  LobbyState,
  PairingType,
  Plugin,
  StatusType,
} from "./shared-types";
import type {
  SideEffectsAdapter,
  TransportMessage,
} from "./side-effects-adapter";

export type LobbyEngine<
  State = unknown,
  Context extends { id: string; presence: unknown } = {
    id: string;
    presence: unknown;
  },
  BroadcastMessage extends TransportMessage<State, Context> = TransportMessage<
    State,
    Context
  >,
  ReceiveMessage extends TransportMessage<State, Context> = TransportMessage<
    State,
    Context
  >,
> = {
  store: Store<CombinedLobbyState<State, Context>>;
  eventBus: EventBus<State, Context>;
  leaveLobby: (playerId: string) => boolean;
  acceptLobby: (playerId: string) => boolean;
  rejectLobby: (playerId: string) => boolean;
  getState: () => State;
  getContext: () => LobbyContext<Context>;
  getCombinedState: () => CombinedLobbyState<State, Context>;
  isLobbyFull: () => boolean;
  isLobbyEmpty: () => boolean;
  isLobbyReady: () => boolean;
  isLobbyTimedOut: () => boolean;
  getPlayer: (id: string) => Context | undefined;
  isLobbyLocked: () => boolean;
  _createMatch: () => boolean;
  _matchCreated: (id: string) => boolean;
  _matchFailed: (error: string) => void;
  _replaceState: (newState: CombinedLobbyState<State, Context>) => void;
  tick: () => void;
  setPlayerReady: (playerId: string, isReady: boolean) => boolean;
  joinLobby: (playerId: string, playerData: unknown) => boolean;
  joinLobbyAttempt: (playerId: string, playerData?: unknown) => boolean;
  getPlayersIds: () => string[];
  forceSync: (ids?: string[]) => void;
  setupSideEffectsAdapter: (
    adapter: SideEffectsAdapter<State, Context>,
  ) => void;
  getAdapter: () => SideEffectsAdapter<State, Context>;
  sendMessage: (message: BroadcastMessage, targets?: string[]) => void;
  onMessageReceived: (message: ReceiveMessage, clientId?: string) => void;
  toJSON: () => CombinedLobbyState<State, Context>;
  dispose: () => void;
};

// Re-export shared types for backward compatibility
export type {
  CombinedLobbyState,
  EventType,
  LobbyContext,
  LobbyPlayer,
  LobbyState,
  PairingType,
  Plugin,
  StatusType,
} from "./shared-types";

export interface LobbyOptions<T, C> {
  id?: string;
  type?: string;
  maxPlayers?: number;
  minPlayers?: number;
  sideEffectsAdapter?: SideEffectsAdapter<T, C>;
  plugins?: Plugin<T, C>[];
  initialState: T;
  players?: C[];
}
