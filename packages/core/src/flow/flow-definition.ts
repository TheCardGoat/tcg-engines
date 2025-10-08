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
   * Programmatically end the current segment/step
   *
   * User requirement: "We should be able to end the segment programmatically"
   *
   * When called, the current segment will end and transition to the next segment.
   * If no next segment is defined, the phase ends.
   */
  endSegment: () => void;

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
   * Get the current segment name
   *
   * @returns Current segment name, or undefined if no segment is active
   */
  getCurrentSegment: () => string | undefined;

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
 * Task 9.13: SegmentDefinition - Steps/Segments within phases
 *
 * User requirement: "For steps, it's a bit different... combat has different steps"
 *
 * Segments (or steps) are sub-divisions within a phase.
 * Example: Combat phase has declare, target, damage steps.
 * Once all steps are over, the phase ends.
 */
export type SegmentDefinition<TState> = {
  /**
   * Order/sequence number for this segment
   *
   * Used for default sequential progression.
   * Lower numbers execute first.
   */
  order: number;

  /**
   * Next segment name
   *
   * When this segment ends, transition to the named segment.
   * If undefined, the phase ends.
   */
  next?: string;

  /**
   * Task 9.5: Lifecycle hook called when segment begins
   */
  onBegin?: LifecycleHook<TState>;

  /**
   * Task 9.5: Lifecycle hook called when segment ends
   */
  onEnd?: LifecycleHook<TState>;

  /**
   * Task 9.7: Automatic end condition
   *
   * When returns true, segment automatically ends and transitions to next.
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
   * Task 9.13: Optional segments/steps within this phase
   *
   * If defined, phase will progress through segments before ending.
   * Segments execute in order, then phase ends.
   */
  segments?: Record<string, SegmentDefinition<TState>>;
};

/**
 * Task 9.2: TurnDefinition - Defines turn structure
 *
 * User requirement: "When a turn ends, the next player starts their turn"
 *
 * A turn is owned by a single player and consists of phases.
 * When turn ends, next player starts their turn.
 */
export type TurnDefinition<TState> = {
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
 * Task 9.1, 9.2: FlowDefinition - Complete flow orchestration
 *
 * User requirements:
 * - "The GameEngine should pass a consistent API to all moves and flow hooks"
 * - "We should have defaults, but we should also be able to customize them"
 * - "The flow mechanism needs to be aware that the way we break down a turn may differ"
 *
 * Defines the complete game flow structure:
 * - Turn definition (phases)
 * - Phase definitions (segments)
 * - Segment definitions (atomic steps)
 *
 * Hierarchy: Turn → Phases → Segments
 *
 * Default behaviors:
 * - Turns: Next player starts their turn
 * - Phases: Progress sequentially by order
 * - Segments: Progress sequentially by order
 *
 * All behaviors can be customized via:
 * - onBegin/onEnd hooks
 * - endIf conditions
 * - Programmatic control (endPhase/endSegment/endTurn)
 */
export type FlowDefinition<TState> = {
  /**
   * Turn definition
   *
   * Defines the structure of a single turn.
   * When turn ends, next player starts their turn (default behavior).
   */
  turn: TurnDefinition<TState>;

  /**
   * Initial phase name (optional)
   *
   * If specified, turn begins at this phase.
   * If not specified, uses first phase by order.
   */
  initialPhase?: string;

  /**
   * Initial segment name (optional)
   *
   * If specified and current phase has segments, begins at this segment.
   * If not specified, uses first segment by order.
   */
  initialSegment?: string;
};
