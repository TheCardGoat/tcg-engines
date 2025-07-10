/**
 * Base interface for all plugins in the engine system
 */
export interface Plugin<T> {
  /** Unique identifier for the plugin */
  name: string;

  /** Setup function called when the plugin is registered */
  setup?: (api: PluginAPI<T>) => void;

  /** Called on plugin teardown when unregistered */
  teardown?: () => void;

  /** Called after the game state initializes */
  onGameInit?: (state: T) => void;

  /** Called before processing a move/action */
  preMove?: (
    state: unknown,
    action: unknown,
    playerId: string,
  ) => boolean | undefined;

  /** Called after processing a move/action */
  postMove?: (state: unknown, action: unknown, playerId: string) => void;

  /** Called when a player joins a lobby */
  onPlayerJoin?: (
    state: unknown,
    playerId: string,
    playerData?: unknown,
  ) => void;

  /** Called when a player leaves a lobby */
  onPlayerLeave?: (state: unknown, playerId: string) => void;

  /** Called when a player's ready status changes */
  onPlayerReady?: (state: unknown, playerId: string, isReady: boolean) => void;

  /** Called when a phase of the game changes */
  onPhaseChange?: (
    state: unknown,
    prevPhase: string,
    nextPhase: string,
  ) => void;

  /** Called when a turn begins */
  onTurnBegin?: (state: unknown, playerId: string) => void;

  /** Called when a turn ends */
  onTurnEnd?: (state: unknown, playerId: string) => void;

  /** Called when a game ends */
  onGameEnd?: (state: unknown) => void;
}

/**
 * API provided to plugins for interacting with the engine
 */
export interface PluginAPI<State = unknown> {
  /** Access to engine state */
  getState: () => State;

  /** Ability to update engine state */
  setState: (updater: State | ((currentState: State) => State)) => State;

  /** Register event handlers */
  on: (eventName: string, callback: (payload?: unknown) => void) => void;

  /** Unregister event handlers */
  off: (eventName: string, callback: (payload?: unknown) => void) => void;

  /** Trigger events for other plugins */
  emit: (eventName: string, payload?: unknown) => void;

  /** Access to internal actions */
  dispatch: (action: { type: string; payload?: unknown }) => void;

  /** Get plugin by name */
  getPlugin: (name: string) => Plugin<State> | undefined;

  /** Check if a plugin exists */
  hasPlugin: (name: string) => boolean;
}

/**
 * Plugin manager configuration options
 */
export interface PluginManagerOptions<T> {
  /** Initial plugins to register */
  plugins?: Plugin<T>[];
}

/**
 * Events that can be triggered in the core engine
 */
export enum CoreEvents {
  // Lifecycle events
  INIT = "core:init",
  BEFORE_SETUP = "core:before_setup",
  AFTER_SETUP = "core:after_setup",
  BEFORE_TEARDOWN = "core:before_teardown",
  AFTER_TEARDOWN = "core:after_teardown",

  // Lobby events
  LOBBY_CREATED = "lobby:created",
  LOBBY_JOINED = "lobby:joined",
  LOBBY_LEFT = "lobby:left",
  LOBBY_PLAYER_READY = "lobby:player_ready",
  LOBBY_STATE_UPDATE = "lobby:state_update",
  LOBBY_FULL = "lobby:full",
  LOBBY_READY = "lobby:ready",
  LOBBY_TIMED_OUT = "lobby:timed_out",

  // Game events (to be expanded based on game engine needs)
  GAME_STARTED = "game:started",
  GAME_ENDED = "game:ended",
  TURN_STARTED = "game:turn_started",
  TURN_ENDED = "game:turn_ended",
  PHASE_CHANGED = "game:phase_changed",

  // Player events
  PLAYER_CHANGED = "player:changed",
  ACTIVE_PLAYERS_CHANGED = "player:active_changed",

  // Move events
  MOVE_PROCESSED = "move:processed",
}

/**
 * Standard plugin names used internally or for default plugins
 */
export enum PluginNames {
  EVENTS = "events",
  LOGGER = "logger",
  TIMER = "timer",
}
