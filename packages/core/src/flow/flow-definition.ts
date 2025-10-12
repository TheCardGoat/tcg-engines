import type { Draft } from "immer";

/**
 * Task 9.9: FlowContext - Rich context API for flow hooks
 *
 * User requirement: "Flow (and moves) should receive a richer context"
 *
 * Provides access to:
 * - State (as Immer draft for mutations)
 * - Flow control methods (endPhase, endSegment, endTurn)
 * - Current flow information (phase, segment, turn, player)
 *
 * This replaces the simple (state: TState) => void pattern with a richer API
 * that allows programmatic control of flow progression.
 */
export type FlowContext<TState> = {
  /** Immer draft of game state - can be mutated */
  state: Draft<TState>;

  /**
   * Programmatically end the current phase
   *
   * User requirement: "We should be able to end the phase programmatically"
   *
   * When called, the current phase will end and transition to the next phase.
   * If no next phase is defined, the turn ends.
   */
  endPhase: () => void;

  /**
   * Programmatically end the current step
   *
   * User requirement: "We should be able to end the step programmatically"
   *
   * When called, the current step will end and transition to the next step.
   * If no next step is defined, the phase ends.
   */
  endStep: () => void;

  /**
   * Programmatically end the current game segment
   *
   * User requirement: "We should be able to end the game segment programmatically"
   *
   * When called, the current game segment will end and transition to the next segment.
   * Game segments are high-level divisions (e.g., sideboarding, draft, main game).
   */
  endGameSegment: () => void;

  /**
   * Programmatically end the current turn
   *
   * User requirement: "We should be able to end the turn programmatically"
   *
   * When called, the current turn will end and the next player's turn will begin
   * (or game ends if this was the last turn).
   */
  endTurn: () => void;

  /**
   * Get the current phase name
   *
   * @returns Current phase name, or undefined if no phase is active
   */
  getCurrentPhase: () => string | undefined;

  /**
   * Get the current step name
   *
   * @returns Current step name, or undefined if no step is active
   */
  getCurrentStep: () => string | undefined;

  /**
   * Get the current game segment name
   *
   * @returns Current game segment name, or undefined if no game segment is active
   */
  getCurrentGameSegment: () => string | undefined;

  /**
   * Get the current player ID
   *
   * @returns Current player's ID
   */
  getCurrentPlayer: () => string;

  /**
   * Get the current turn number
   *
   * @returns Current turn number (1-indexed)
   */
  getTurnNumber: () => number;
};

/**
 * Task 9.2: Lifecycle hook type
 *
 * All lifecycle hooks receive FlowContext instead of just state.
 * This allows hooks to:
 * - Mutate state
 * - Control flow progression
 * - Access flow information
 */
export type LifecycleHook<TState> = (context: FlowContext<TState>) => void;

/**
 * Task 9.7: End condition type
 *
 * Automatically triggers transition when condition returns true.
 * Checked after every state change.
 */
export type EndCondition<TState> = (context: FlowContext<TState>) => boolean;

/**
 * Task 9.13: StepDefinition - Steps within phases
 *
 * User requirement: "For steps, it's a bit different... combat has different steps"
 *
 * Steps are sub-divisions within a phase.
 * Example: Combat phase has declare, target, damage steps.
 * Once all steps are over, the phase ends.
 */
export type StepDefinition<TState> = {
  /**
   * Order/sequence number for this step
   *
   * Used for default sequential progression.
   * Lower numbers execute first.
   */
  order: number;

  /**
   * Next step name
   *
   * When this step ends, transition to the named step.
   * If undefined, the phase ends.
   */
  next?: string;

  /**
   * Task 9.5: Lifecycle hook called when step begins
   */
  onBegin?: LifecycleHook<TState>;

  /**
   * Task 9.5: Lifecycle hook called when step ends
   */
  onEnd?: LifecycleHook<TState>;

  /**
   * Task 9.7: Automatic end condition
   *
   * When returns true, step automatically ends and transitions to next.
   */
  endIf?: EndCondition<TState>;
};

/**
 * Task 9.13: PhaseDefinition - Phases within a turn
 *
 * User requirement: "phases, when the current phase ends, the next phase from
 * the same player will start"
 *
 * Example: Disney Lorcana turn has ready, draw, main, end phases.
 * Phases progress sequentially for the same player.
 */
export type PhaseDefinition<TState> = {
  /**
   * Initial step name (optional)
   *
   * If specified and current phase has steps, begins at this step.
   * If not specified, uses first step by order.
   */
  initialStep?: string;

  /**
   * Order/sequence number for this phase
   *
   * Used for default sequential progression.
   * Lower numbers execute first.
   */
  order: number;

  /**
   * Next phase name
   *
   * When this phase ends, transition to the named phase.
   * If undefined, the turn ends.
   */
  next?: string;

  /**
   * Task 9.5: Lifecycle hook called when phase begins
   */
  onBegin?: LifecycleHook<TState>;

  /**
   * Task 9.5: Lifecycle hook called when phase ends
   */
  onEnd?: LifecycleHook<TState>;

  /**
   * Task 9.7: Automatic end condition
   *
   * When returns true, phase automatically ends and transitions to next.
   */
  endIf?: EndCondition<TState>;

  /**
   * Task 9.13: Optional steps within this phase
   *
   * If defined, phase will progress through steps before ending.
   * Steps execute in order, then phase ends.
   */
  steps?: Record<string, StepDefinition<TState>>;
};

/**
 * Task 9.2: TurnDefinition - Defines turn structure within a game segment
 *
 * User requirement: "When a turn ends, the next player starts their turn"
 *
 * A turn is owned by a single player and consists of phases.
 * When turn ends, next player starts their turn.
 */
export type TurnDefinition<TState> = {
  /**
   * Initial phase name (optional)
   *
   * If specified, turn begins at this phase.
   * If not specified, uses first phase by order.
   */
  initialPhase?: string;
  /**
   * Task 9.5: Lifecycle hook called when turn begins
   *
   * Typically used to:
   * - Switch to next player
   * - Reset turn-based state
   * - Draw cards, ready resources, etc.
   */
  onBegin?: LifecycleHook<TState>;

  /**
   * Task 9.5: Lifecycle hook called when turn ends
   *
   * Typically used to:
   * - Clean up turn state
   * - Trigger end-of-turn effects
   */
  onEnd?: LifecycleHook<TState>;

  /**
   * Task 9.7: Automatic end condition
   *
   * When returns true, turn automatically ends and next player's turn begins.
   */
  endIf?: EndCondition<TState>;

  /**
   * Task 9.3: Phases within this turn
   *
   * User requirement: "phases need to be a bit more structured"
   *
   * Phases progress sequentially for the same player.
   * Example: ready → draw → main → end
   */
  phases?: Record<string, PhaseDefinition<TState>>;
};

/**
 * GameSegmentDefinition - High-level game segments
 *
 * User requirement: "Segments should be higher than Turns. Segments are used to
 * segment a game, for example Sideboarding segment, preparing the game segment,
 * draft segment, etc..."
 *
 * Game segments are the highest level of game flow organization.
 * Each segment can have completely different turn structures.
 *
 * Examples:
 * - Setup/Preparation segment: Initial game setup before main game
 * - Draft segment: Card drafting with unique turn structure
 * - Sideboarding segment: Between-game card swapping
 * - Main game segment: Primary gameplay
 * - Overtime segment: Extra turns or special win conditions
 */
export type GameSegmentDefinition<TState> = {
  /**
   * Order/sequence number for this game segment
   *
   * Used for default sequential progression.
   * Lower numbers execute first.
   */
  order: number;

  /**
   * Next game segment name
   *
   * When this game segment ends, transition to the named segment.
   * If undefined, the game ends.
   */
  next?: string;

  /**
   * Lifecycle hook called when game segment begins
   */
  onBegin?: LifecycleHook<TState>;

  /**
   * Lifecycle hook called when game segment ends
   */
  onEnd?: LifecycleHook<TState>;

  /**
   * Automatic end condition
   *
   * When returns true, game segment automatically ends and transitions to next.
   */
  endIf?: EndCondition<TState>;

  /**
   * Turn structure for this game segment
   *
   * Each game segment defines its own turn structure.
   * This allows different segments (draft vs. main game) to have
   * completely different turn mechanics.
   */
  turn: TurnDefinition<TState>;
};

/**
 * Task 9.1, 9.2: FlowDefinition - Complete flow orchestration
 *
 * User requirements:
 * - "The GameEngine should pass a consistent API to all moves and flow hooks"
 * - "We should have defaults, but we should also be able to customize them"
 * - "The flow mechanism needs to be aware that the way we break down a turn may differ"
 * - "Segments should be higher than Turns"
 *
 * Defines the complete game flow structure:
 * - Game segment definitions (high-level game phases)
 * - Turn definitions (within segments)
 * - Phase definitions (within turns)
 * - Step definitions (within phases)
 *
 * Hierarchy: GameSegments → Turns → Phases → Steps
 *
 * Default behaviors:
 * - Game Segments: Progress sequentially by order
 * - Turns: Next player starts their turn
 * - Phases: Progress sequentially by order
 * - Steps: Progress sequentially by order
 *
 * All behaviors can be customized via:
 * - onBegin/onEnd hooks
 * - endIf conditions
 * - Programmatic control (endGameSegment/endTurn/endPhase/endStep)
 */
export type FlowDefinition<TState> = {
  /**
   * Game segments
   *
   * High-level divisions of the game (e.g., setup, draft, main game, sideboarding).
   * Each segment can have its own turn structure.
   *
   * For simple games with only one segment, define a single "mainGame" segment.
   */
  gameSegments: Record<string, GameSegmentDefinition<TState>>;

  /**
   * Initial game segment name (optional)
   *
   * If specified, game begins at this segment.
   * If not specified, uses first segment by order.
   */
  initialGameSegment?: string;
};
