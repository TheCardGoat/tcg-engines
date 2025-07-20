import { batch, Store } from "@tanstack/store";
import {
  type EngineLogger,
  logger as engineLogger,
} from "~/game-engine/core-engine/utils";
import { generateUniqueId } from "../game-engine/core-engine/utils/id-utils";
import { LightweightEventBus } from "./event-bus";
import type {
  CombinedLobbyState,
  LobbyContext,
  LobbyEngine,
  LobbyOptions,
  StatusType,
} from "./lobby-engine-types";
import type {
  SideEffectsAdapter,
  TransportMessage,
} from "./side-effects-adapter";

// TODO: WE HAVE TO BUILD THIS BEFORE NAKAMA!

const maxEmptySec = 60 * 2;
const maxWaitToAccept = 60 * 10;
const maxDurationSecs = 60 * 2 * 10;

export function createLobbyEngine<
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
>(
  options: LobbyOptions<State, Context>,
): LobbyEngine<State, Context, BroadcastMessage, ReceiveMessage> {
  let logger: EngineLogger = engineLogger;
  let adapter:
    | SideEffectsAdapter<State, Context, BroadcastMessage, ReceiveMessage>
    | undefined = options?.sideEffectsAdapter;

  // Create event bus
  const eventBus = new LightweightEventBus<State, Context>();

  if (adapter) {
    setupSideEffectsAdapter(adapter);
  }

  const context: LobbyContext<Context> = {
    emptyTicks: 0,
    presences: {} as Record<string, unknown>,
    players: {} as Record<string, Context>,
    joinsInProgress: 0,
    playersAccepted: {},
    acceptDeadlineEndTick: 0,
    maxDurationTicks: 0,
    status: "players_joining" as StatusType,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    maxPlayers: options?.maxPlayers || 8,
    minPlayers: options?.minPlayers || 2,
    id: options?.id || generateUniqueId(),
    matchId: "",
    type: options?.type,
  };
  const initialState = {
    state: options.initialState,
    context: context,
  };
  if (options.players) {
    for (const player of options.players) {
      if (player.id) {
        initialState.context.players[player.id] = player;
        initialState.context.playersAccepted[player.id] = false;
      }
    }
  }
  const lobbyStore = new Store<CombinedLobbyState<State, Context>>(
    initialState,
  );

  let disposeHandler = () => {};
  function setupSideEffectsAdapter(
    newAdapter: SideEffectsAdapter<State, Context>,
  ) {
    if (newAdapter.logger) {
      logger = newAdapter.logger;
    }

    adapter = newAdapter;

    // Subscribe adapter to events if it has an event handler
    if (adapter.onLobbyEvent) {
      if (typeof disposeHandler === "function") {
        disposeHandler(); // Unsubscribe from previous adapter
      }

      if (typeof adapter.setEngine === "function") {
        adapter.setEngine(this);
      }

      disposeHandler = eventBus.on(adapter.onLobbyEvent);
    }
  }

  function tick() {
    batch(() => {
      if (isLobbyEmpty()) {
        lobbyStore.setState((combined) => {
          const emptyTicks = combined.context.emptyTicks || 0;
          return {
            ...combined,
            context: {
              ...combined.context,
              emptyTicks: emptyTicks + 1,
            },
          };
        });
      }

      if (!hasAllPlayersAccepted()) {
        lobbyStore.setState((combined) => {
          const currentDeadlineTick =
            combined.context.acceptDeadlineEndTick || 0;

          return {
            ...combined,
            context: {
              ...combined.context,
              acceptDeadlineEndTick: currentDeadlineTick + 1,
            },
          };
        });
      }

      lobbyStore.setState((combined) => ({
        ...combined,
        context: {
          ...combined.context,
          maxDurationTicks: (combined.context.maxDurationTicks || 0) + 1,
        },
      }));

      // Emit tick event
      // eventBus.emit({
      //   type: "tick",
      //   emptyTicks: lobbyStore.state.context.emptyTicks || 0,
      //   acceptDeadlineTicks:
      //     lobbyStore.state.context.acceptDeadlineEndTick || 0,
      //   maxDurationTicks: lobbyStore.state.context.maxDurationTicks || 0,
      // });

      // Check for timeout condition and emit event if needed
      if (isLobbyTimedOut()) {
        let reason: "empty" | "duration" | "accept_deadline";

        if ((lobbyStore.state.context.emptyTicks || 0) >= maxEmptySec) {
          reason = "empty";
        } else if (
          (lobbyStore.state.context.maxDurationTicks || 0) >= maxDurationSecs
        ) {
          reason = "duration";
        } else {
          reason = "accept_deadline";
        }

        eventBus.emit({ type: "lobby_timeout", reason });
      }
    });
  }

  function getPlayersIds(): string[] {
    return Object.keys(lobbyStore.state.context.players);
  }

  function isLobbyLocked(): boolean {
    const status = lobbyStore.state.context.status;
    return !(status === "players_joining" || status === "players_accepting");
  }

  function acceptLobby(playerId: string): boolean {
    if (isLobbyLocked()) {
      logger.warn(
        `[LobbyEngine] Cannot accept lobby for player ${playerId}: lobby is locked`,
      );
      return false;
    }

    logger.debug(`[LobbyEngine] Accepting lobby for player ${playerId}`);
    return setPlayerReady(playerId, true);
  }

  function rejectLobby(playerId: string): boolean {
    if (isLobbyLocked()) {
      logger.warn(
        `[LobbyEngine] Cannot reject lobby for player ${playerId}: lobby is locked`,
      );
      return false;
    }

    logger.debug(`[LobbyEngine] Rejecting lobby for player ${playerId}`);
    return setPlayerReady(playerId, false);
  }

  function setPlayerReady(nakamaOrClerkId: string, isReady: boolean): boolean {
    if (isLobbyLocked()) {
      logger.warn(
        `[LobbyEngine] Cannot set player ${nakamaOrClerkId} ready status: lobby is locked`,
      );
      return false;
    }

    const playerId = getPlayerId(nakamaOrClerkId);
    if (!playerId) {
      logger.warn(`[LobbyEngine] Player ID is not set ${nakamaOrClerkId}`);
      return false;
    }

    if (!isPlayerInLobby(playerId)) {
      logger.warn(
        `[LobbyEngine] Player ${playerId} is not in the lobby, current players: ${getPlayersIds().join(", ")}`,
      );
      return false;
    }

    if (!isPlayerInLobby(playerId)) {
      logger.warn(`[LobbyEngine] Player ${playerId} is not in the lobby`);
      return false;
    }

    // Store old status to detect changes
    const oldStatus = lobbyStore.state.context.status;
    const previousReadyStatus =
      lobbyStore.state.context.playersAccepted[playerId];

    // If the ready status hasn't changed, return early
    if (previousReadyStatus === isReady) {
      logger.debug(
        `[LobbyEngine] Player ${playerId} ready status unchanged: ${isReady}`,
      );
      return true;
    }

    lobbyStore.setState((combined) => {
      const playersAccepted = {
        ...combined.context.playersAccepted,
        [playerId]: isReady,
      };

      // Check if all players are ready for proper status update
      const allPlayersReady = Object.keys(playersAccepted).every(
        (id) => playersAccepted[id],
      );

      const currentStatus = combined.context.status;
      const shouldCreateMatch =
        allPlayersReady &&
        Object.keys(playersAccepted).length >= combined.context.minPlayers;

      if (shouldCreateMatch) {
        createMatch();
      }

      const newStatus = shouldCreateMatch
        ? "creating_event"
        : currentStatus === "players_joining" &&
            Object.keys(combined.context.presences).length >=
              combined.context.minPlayers
          ? "players_accepting"
          : currentStatus;

      return {
        ...combined,
        context: {
          ...combined.context,
          playersAccepted,
          status: newStatus,
        },
      };
    });

    // Emit events based on player's ready status change
    if (isReady) {
      eventBus.emit({ type: "player_accepted", playerId });
    } else {
      eventBus.emit({ type: "player_rejected", playerId });
      // Declining will remove the player from the lobby
      leaveLobby(playerId);
    }

    // Emit status change event if status changed
    const newStatus = lobbyStore.state.context.status;
    if (oldStatus !== newStatus) {
      eventBus.emit({
        type: "lobby_status_changed",
        oldStatus,
        newStatus,
      });
    }

    if (isLobbyReady()) {
      eventBus.emit({
        type: "lobby_ready",
        playerIds: getPlayersIds(),
      });
      createMatch();
    }

    logger.info(`[LobbyEngine] Player ${playerId} ready status: ${isReady}`);

    return true;
  }

  function joinLobby(nakamaOrClerkId: string, playerData: unknown): boolean {
    if (isLobbyLocked()) {
      logger.warn(
        `[LobbyEngine] Cannot join lobby for player ${nakamaOrClerkId}: lobby is locked`,
      );
      return false;
    }

    const playerId = getPlayerId(nakamaOrClerkId);

    if (!playerId) {
      logger.warn(`[LobbyEngine] Player ID is not set ${nakamaOrClerkId}`);
      return false;
    }

    if (isPlayerInLobby(playerId)) {
      logger.warn(`[LobbyEngine] Player ${playerId} is already in the lobby`);
      return true;
    }

    if (isLobbyFull()) {
      logger.warn(
        `[LobbyEngine] Lobby is full: ${getPlayersIds().join(", ")}.`,
      );
      return false;
    }

    logger.debug(`[LobbyEngine] Player ${playerId} joining lobby`);

    // Store old status to detect changes
    const oldStatus = lobbyStore.state.context.status;

    lobbyStore.setState((combined) => {
      const newPresences = {
        ...combined.context.presences,
        [playerId]: playerData,
      };

      const playerCount = Object.values(newPresences).filter(
        (value) => Object.keys(value || {}).length > 0,
      ).length;

      let newStatus = combined.context.status;
      if (playerCount >= combined.context.minPlayers) {
        newStatus = "players_accepting";
      } else {
        newStatus = "players_joining";
      }

      return {
        ...combined,
        context: {
          ...combined.context,
          presences: newPresences,
          joinsInProgress: Math.max(0, combined.context.joinsInProgress - 1),
          updatedAt: Date.now(),
          status: newStatus,
          acceptDeadlineEndTick: 0,
        },
      };
    });

    // Emit player joined event
    eventBus.emit({
      type: "player_joined",
      playerId,
      playerData,
    });

    // Emit status change event if status changed
    const newStatus = lobbyStore.state.context.status;
    if (oldStatus !== newStatus) {
      eventBus.emit({
        type: "lobby_status_changed",
        oldStatus,
        newStatus,
      });
    }

    logger.debug(`[LobbyEngine] Player ${playerId} joined lobby`);
    return true;
  }

  function joinLobbyAttempt(
    nakamaOrClerkId: string,
    _playerData?: unknown,
  ): boolean {
    if (isLobbyLocked()) {
      logger.warn(
        `[LobbyEngine] Cannot attempt join for player ${nakamaOrClerkId}: lobby is locked`,
      );
      return false;
    }

    const playerId = getPlayerId(nakamaOrClerkId);

    if (isLobbyFull()) {
      logger.warn("[LobbyEngine] Cannot attempt join: lobby is full");
      return false;
    }

    if (isPlayerInLobby(playerId)) {
      logger.warn(
        `[LobbyEngine] Cannot attempt join: player ${playerId} is already in the lobby`,
      );
      return false;
    }

    logger.debug(`[LobbyEngine] Player ${playerId} attempting to join lobby`);
    lobbyStore.setState((combined) => ({
      ...combined,
      context: {
        ...combined.context,
        joinsInProgress: combined.context.joinsInProgress + 1,
        updatedAt: Date.now(),
      },
    }));

    return true;
  }

  function leaveLobby(nakamaOrClerkId: string): boolean {
    if (isLobbyLocked()) {
      logger.warn(
        `[LobbyEngine] Cannot leave lobby for player ${nakamaOrClerkId}: lobby is locked`,
      );
      return false;
    }

    const playerId = getPlayerId(nakamaOrClerkId);

    if (!playerId) {
      logger.warn(`[LobbyEngine] Player ID is not set ${nakamaOrClerkId}`);
      return false;
    }

    if (!isPlayerInLobby(playerId)) {
      logger.warn(`[LobbyEngine] Player ${playerId} is not in the lobby`);
      return false;
    }

    if (
      ["creating_event", "event_created"].includes(
        lobbyStore.state.context.status,
      )
    ) {
      logger.warn(
        "[LobbyEngine] Cannot leave lobby while event is in progress",
      );
      return false;
    }

    logger.debug(`[LobbyEngine] Player ${playerId} left lobby`);

    // Store old status to detect changes
    const oldStatus = lobbyStore.state.context.status;

    lobbyStore.setState((combined) => {
      const { [playerId]: _, ...remainingPresences } =
        combined.context.presences;
      const { [playerId]: __, ...remainingPlayersAccepted } =
        combined.context.playersAccepted;

      // Determine the correct status based on remaining player count
      const playerCount = Object.keys(remainingPresences).length;
      let newStatus = combined.context.status;

      if (playerCount < combined.context.minPlayers) {
        newStatus = "players_joining";
      } else if (playerCount >= combined.context.minPlayers) {
        newStatus = "players_accepting";
      }

      return {
        ...combined,
        context: {
          ...combined.context,
          presences: remainingPresences,
          playersAccepted: remainingPlayersAccepted,
          updatedAt: Date.now(),
          status: newStatus,
        },
      };
    });

    // Emit player left event
    eventBus.emit({ type: "player_left", playerId });

    // Emit status change event if status changed
    const newStatus = lobbyStore.state.context.status;
    if (oldStatus !== newStatus) {
      eventBus.emit({
        type: "lobby_status_changed",
        oldStatus,
        newStatus,
      });
    }

    return true;
  }

  function isPlayerInLobby(playerId?: string): boolean {
    if (!playerId) {
      return false;
    }
    return !!lobbyStore.state.context.presences[playerId];
  }

  function isLobbyFull(): boolean {
    const context = lobbyStore.state.context;
    return Object.keys(context.presences).length >= context.maxPlayers;
  }

  function isLobbyEmpty(): boolean {
    return Object.keys(lobbyStore.state.context.presences).length === 0;
  }

  function hasAllPlayersAccepted(): boolean {
    const context = lobbyStore.state.context;

    return Object.keys(context.presences).every((playerId) => {
      return context.playersAccepted[playerId];
    });
  }

  function isLobbyReady(): boolean {
    const isReady = hasAllPlayersAccepted();
    const playersCount = getPlayersIds().length;
    const context = lobbyStore.state.context;

    return isReady && playersCount >= context.minPlayers;
  }

  function createMatch(): boolean {
    if (
      !(
        isLobbyReady() &&
        ["creating_event"].includes(lobbyStore.state.context.status)
      )
    ) {
      logger.warn(
        `[LobbyEngine] Cannot create lobby: not ready or already creating event - current status: ${lobbyStore.state.context.status}`,
      );
      return false;
    }

    logger.info(
      "[LobbyEngine] Creating lobby with current state",
      lobbyStore.state,
    );

    if (!adapter) {
      logger.warn("[LobbyEngine] No adapter available to create lobby");
      return false;
    }

    lobbyStore.setState((combined) => {
      return {
        ...combined,
        context: {
          ...combined.context,
          status: "creating_event",
          updatedAt: Date.now(),
          acceptDeadlineEndTick: 0,
        },
      };
    });

    // Emit event before calling adapter
    eventBus.emit({
      type: "match_creating",
      state: lobbyStore.state.state,
      context: lobbyStore.state.context as unknown as Context,
    });

    adapter.createMatch(lobbyStore.state);

    return true;
  }

  function replaceState(newState: CombinedLobbyState<State, Context>) {
    lobbyStore.setState((combined) => {
      adapter?.logger?.debug("[LobbyEngine] Replacing lobby state", {
        old: combined,
        new: newState,
      });
      return newState;
    });
  }

  function matchCreated(id: string): boolean {
    if (
      !(
        ["creating_event"].includes(lobbyStore.state.context.status) &&
        hasAllPlayersAccepted()
      )
    ) {
      logger.warn(
        "[LobbyEngine] Cannot finalize lobby: not in creating_event status or not all players accepted",
      );
      return false;
    }

    logger.info("[LobbyEngine] Lobby created successfully", lobbyStore.state);

    lobbyStore.setState((combined) => {
      return {
        ...combined,
        context: {
          ...combined.context,
          status: "created",
          matchId: id,
          updatedAt: Date.now(),
          acceptDeadlineEndTick: 0,
        },
      };
    });

    eventBus.emit({ type: "match_created", matchId: id });

    return true;
  }

  function isLobbyTimedOut(): boolean {
    return (
      lobbyStore.state.context.maxDurationTicks >= maxDurationSecs ||
      lobbyStore.state.context.emptyTicks >= maxEmptySec ||
      lobbyStore.state.context.acceptDeadlineEndTick >= maxWaitToAccept
    );
  }

  function getState() {
    return lobbyStore.state.state;
  }

  function getContext() {
    return lobbyStore.state.context;
  }

  function getPlayer(clerkOrNakamaId: string): Context | undefined {
    return Object.values(lobbyStore.state.context.players).find(
      (player) =>
        player.id === clerkOrNakamaId ||
        // @ts-expect-error - I'm tired now, I fix this later
        player?.presence?.userId === clerkOrNakamaId,
    );
  }

  function getPlayerId(clerkOrNakamaId: string): string | undefined {
    return getPlayer(clerkOrNakamaId)?.id;
  }

  function forceSync(ids?: string[]): void {
    logger.debug("[LobbyEngine] Force syncing lobby state");
    eventBus.emit({
      type: "force_sync",
      combinesState: lobbyStore.state,
      ids,
    });
  }

  function dispose() {
    logger.debug("[LobbyEngine] Disposing lobby engine");

    // Unsubscribe event handlers
    if (typeof disposeHandler === "function") {
      disposeHandler();
      disposeHandler = () => {};
    }

    // Clean up adapter references
    if (adapter) {
      try {
        // Call adapter's dispose method if it exists
        adapter.dispose();
      } catch (error) {
        logger.error("[LobbyEngine] Error disposing adapter", error);
      }

      // Clear the reference to break the cycle
      adapter = undefined;
    }

    // Clear any other references or resources
    eventBus.off(() => {}); // Simplify by just passing an empty function
  }

  return {
    leaveLobby,
    isLobbyFull,
    isLobbyEmpty,
    isLobbyReady,
    isLobbyTimedOut,
    setPlayerReady,
    acceptLobby,
    rejectLobby,
    tick,
    joinLobby,
    joinLobbyAttempt,
    getPlayer,
    getState: getState,
    getContext: getContext,
    getCombinedState: () => lobbyStore.state,
    getPlayersIds,
    setupSideEffectsAdapter,
    getAdapter: () =>
      adapter as SideEffectsAdapter<
        State,
        Context,
        TransportMessage<State, Context>,
        TransportMessage<State, Context>
      >,
    isLobbyLocked,
    forceSync,
    _createMatch: createMatch,
    _matchCreated: matchCreated,
    _replaceState: replaceState,
    _matchFailed: (error: string) => {
      logger.error("[LobbyEngine] Match creation failed", error);
      lobbyStore.setState((combined) => ({
        ...combined,
        context: {
          ...combined.context,
          status: "failed",
          updatedAt: Date.now(),
        },
      }));
      eventBus.emit({ type: "match_failed", error });
    },
    store: lobbyStore,
    eventBus,
    dispose,
    sendMessage: (message: BroadcastMessage, targets?: string[]) => {
      adapter?.broadcast(message, targets);
    },
    onMessageReceived: (message: ReceiveMessage, clientId?: string) => {
      adapter?.onMessageReceived(message, clientId);
    },
    toJSON: function getSerializableState() {
      // Create a deep copy without function references
      return JSON.parse(
        JSON.stringify({
          state: lobbyStore.state.state,
          context: lobbyStore.state.context,
        }),
      );
    },
  } satisfies LobbyEngine<State, Context, BroadcastMessage, ReceiveMessage>;
}

// Using the consolidated generateUniqueId function from id-utils.ts
