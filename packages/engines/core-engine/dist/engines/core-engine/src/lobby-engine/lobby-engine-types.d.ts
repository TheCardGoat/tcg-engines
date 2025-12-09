import type { Store } from "@tanstack/store";
import type { EventBus } from "./event-bus";
import type { SideEffectsAdapter, TransportMessage } from "./side-effects-adapter";
export type * from "./event-bus";
export type LobbyEngine<State = unknown, Context extends {
    id: string;
    presence: unknown;
} = {
    id: string;
    presence: unknown;
}, BroadcastMessage extends TransportMessage<State, Context> = TransportMessage<State, Context>, ReceiveMessage extends TransportMessage<State, Context> = TransportMessage<State, Context>> = {
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
    setupSideEffectsAdapter: (adapter: SideEffectsAdapter<State, Context>) => void;
    getAdapter: () => SideEffectsAdapter<State, Context>;
    sendMessage: (message: BroadcastMessage, targets?: string[]) => void;
    onMessageReceived: (message: ReceiveMessage, clientId?: string) => void;
    toJSON: () => CombinedLobbyState<State, Context>;
    dispose: () => void;
};
export type LobbyPlayer<T = unknown> = {
    id: string;
    data: T;
    isReady: boolean;
    joinedAt: number;
};
export type LobbyState<T = unknown> = {
    id: string;
    players: LobbyPlayer<T>[];
    createdAt: number;
    updatedAt: number;
    maxPlayers: number;
    minPlayers: number;
    joinInProgress: number;
};
export type EventType = "sealed" | "draft";
export type PairingType = "swiss";
export type StatusType = "players_joining" | "players_accepting" | "creating_event" | "failed" | "created";
export type LobbyContext<T = unknown> = {
    status: StatusType;
    presences: Record<string, unknown>;
    players: Record<string, T>;
    joinsInProgress: number;
    minPlayers: number;
    maxPlayers: number;
    playersAccepted: Record<string, boolean>;
    emptyTicks: number;
    maxDurationTicks: number;
    acceptDeadlineEndTick: number;
    createdAt: number;
    updatedAt: number;
    id: string;
    matchId: string;
    type?: string;
};
export type CombinedLobbyState<T = unknown, C = unknown> = {
    state: T;
    context: LobbyContext<C>;
};
export type Plugin<T = unknown, C = unknown> = {
    name: string;
    onPlayerJoin?: (playerId: string, playerData: C) => void;
    onPlayerLeave?: (playerId: string) => void;
    onPlayerReady?: (playerId: string) => void;
    onTickUpdate?: () => void;
    onStatusChange?: (oldStatus: string, newStatus: string, state: CombinedLobbyState<T, C>) => void;
    [key: string]: unknown;
};
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
//# sourceMappingURL=lobby-engine-types.d.ts.map