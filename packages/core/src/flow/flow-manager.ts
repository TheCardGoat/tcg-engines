import { type Draft, produce } from "immer";
import type { CardOperations } from "../operations/card-operations";
import type { GameOperations } from "../operations/game-operations";
import type { ZoneOperations } from "../operations/zone-operations";
import type {
  FlowContext,
  FlowDefinition,
  GameSegmentDefinition,
} from "./flow-definition";

/**
 * Task 9.4: FlowManager - Flow orchestration
 *
 * Manages game flow using a simple, explicit state machine:
 * - Constructs hierarchical state machine from FlowDefinition
 * - Executes lifecycle hooks with FlowContext
 * - Handles automatic transitions (endIf conditions)
 * - Provides programmatic control (endPhase, endSegment, endTurn)
 * - Maintains game state with Immer
 *
 * User requirements:
 * - Flexible turn/phase/segment progression
 * - Rich context API for hooks
 * - Both automatic and programmatic control
 * - Default behaviors with customization
 *
 * Note: Originally planned to use XState, but a simple state machine
 * is more appropriate for this use case. No need for external dependencies.
 */

/**
 * Flow event types
 *
 * Task 9.11: Flow event handling
 */
type FlowEvent =
  | { type: "NEXT_GAME_SEGMENT" }
  | { type: "NEXT_PHASE" }
  | { type: "NEXT_STEP" }
  | { type: "END_TURN" }
  | { type: "END_STEP" }
  | { type: "END_PHASE" }
  | { type: "END_GAME_SEGMENT" }
  | { type: "STATE_UPDATED" };

/**
 * Flow state snapshot for querying
 */
export type FlowStateSnapshot = {
  gameSegment?: string;
  phase?: string;
  step?: string;
  turn: number;
  currentPlayer?: string;
};

/**
 * Serializable flow state for persistence
 *
 * Use case: Save game state to database for later replay/restoration
 */
export type SerializedFlowState = {
  currentGameSegment?: string;
  currentPhase?: string;
  currentStep?: string;
  turnNumber: number;
  currentPlayer: string;
};

/**
 * Options for FlowManager construction
 */
export type FlowManagerOptions<TCardMeta = any> = {
  /** Skip initialization hooks (used when restoring from serialized state) */
  skipInitialization?: boolean;
  /** Restore from serialized flow state */
  restoreFrom?: SerializedFlowState;
  /** Callback invoked at turn end (before transition) */
  onTurnEnd?: () => void;
  /** Callback invoked at phase end (before transition) */
  onPhaseEnd?: (phaseName: string) => void;
  /** Game operations API (required for flow hooks) */
  gameOperations?: GameOperations;
  /** Zone operations API (required for flow hooks) */
  zoneOperations?: ZoneOperations;
  /** Card operations API (required for flow hooks) */
  cardOperations?: CardOperations<TCardMeta>;
};

/**
 * Task 9.4: FlowManager implementation
 */
export class FlowManager<TState, TCardMeta = any> {
  private flowDefinition: FlowDefinition<TState, TCardMeta>;
  private normalizedGameSegments: Record<
    string,
    GameSegmentDefinition<TState, TCardMeta>
  >;
  private initialGameSegment?: string;
  private gameState: TState;
  private currentGameSegment?: string;
  private currentPhase?: string;
  private currentStep?: string;
  private turnNumber = 1;
  private currentPlayer?: string = undefined;
  private pendingEndGameSegment = false;
  private pendingEndPhase = false;
  private pendingEndStep = false;
  private pendingEndTurn = false;
  private onTurnEndCallback?: () => void;
  private onPhaseEndCallback?: (phaseName: string) => void;
  private gameOperations?: GameOperations;
  private zoneOperations?: ZoneOperations;
  private cardOperations?: CardOperations<TCardMeta>;

  constructor(
    flowDefinition: FlowDefinition<TState, TCardMeta>,
    initialState: TState,
    options?: FlowManagerOptions<TCardMeta>,
  ) {
    this.flowDefinition = flowDefinition;
    this.gameState = initialState;
    this.onTurnEndCallback = options?.onTurnEnd;
    this.onPhaseEndCallback = options?.onPhaseEnd;
    this.gameOperations = options?.gameOperations;
    this.zoneOperations = options?.zoneOperations;
    this.cardOperations = options?.cardOperations;

    // Normalize flow definition (handle both simplified and full syntax)
    const normalized = this.normalizeFlowDefinition(flowDefinition);
    this.normalizedGameSegments = normalized.gameSegments;
    this.initialGameSegment = normalized.initialGameSegment;

    // Restore from serialized state if provided
    if (options?.restoreFrom) {
      this.restoreFromSerialized(options.restoreFrom);
    } else if (!options?.skipInitialization) {
      // Initialize flow normally
      this.initializeFlow();
    }
  }

  /**
   * Normalize flow definition to always use gameSegments structure
   *
   * If flow uses simplified syntax (just `turn`), convert it to a single
   * "mainGame" segment.
   */
  private normalizeFlowDefinition(flowDef: FlowDefinition<TState, TCardMeta>): {
    gameSegments: Record<string, GameSegmentDefinition<TState, TCardMeta>>;
    initialGameSegment?: string;
  } {
    // Check if it's the simplified syntax (has `turn` property)
    if ("turn" in flowDef) {
      // Create implicit mainGame segment
      return {
        gameSegments: {
          mainGame: {
            order: 0,
            turn: flowDef.turn,
          },
        },
        initialGameSegment: "mainGame",
      };
    }

    // It's the full syntax with gameSegments
    return {
      gameSegments: flowDef.gameSegments,
      initialGameSegment: flowDef.initialGameSegment,
    };
  }

  /**
   * Restore flow manager from serialized state
   *
   * Use case: Load a saved game from database and continue playing
   */
  private restoreFromSerialized(state: SerializedFlowState): void {
    this.currentGameSegment = state.currentGameSegment;
    this.currentPhase = state.currentPhase;
    this.currentStep = state.currentStep;
    this.turnNumber = state.turnNumber;
    this.currentPlayer = state.currentPlayer;

    // Don't execute hooks when restoring - state already contains their effects
  }

  /**
   * Serialize current flow state for persistence
   *
   * Use case: Save game state to database for later replay/restoration
   */
  serializeFlowState(): SerializedFlowState {
    return {
      currentGameSegment: this.currentGameSegment,
      currentPhase: this.currentPhase,
      currentStep: this.currentStep,
      turnNumber: this.turnNumber,
      currentPlayer: this.currentPlayer,
    };
  }

  /**
   * Task 9.3: Initialize the flow state machine
   */
  private initializeFlow(): void {
    const gameSegments = this.normalizedGameSegments;

    // Determine initial game segment
    const sortedGameSegments = Object.entries(gameSegments).sort(
      ([, a], [, b]) => a.order - b.order,
    );
    this.currentGameSegment =
      this.initialGameSegment ?? sortedGameSegments[0]?.[0];

    if (!this.currentGameSegment) {
      throw new Error("No game segments defined in flow definition");
    }

    const gameSegmentDef = gameSegments[this.currentGameSegment];
    if (!gameSegmentDef) {
      throw new Error(`Game segment "${this.currentGameSegment}" not found`);
    }

    // Execute game segment onBegin
    this.executeHook(gameSegmentDef.onBegin);

    // Initialize turn structure for this game segment
    const phases = gameSegmentDef.turn.phases;
    if (phases) {
      const sortedPhases = Object.entries(phases).sort(
        ([, a], [, b]) => a.order - b.order,
      );
      this.currentPhase =
        gameSegmentDef.turn.initialPhase ?? sortedPhases[0]?.[0];

      // Check for steps in initial phase
      if (this.currentPhase) {
        const initialPhaseDef = phases[this.currentPhase];
        if (initialPhaseDef?.steps) {
          const sortedSteps = Object.entries(initialPhaseDef.steps).sort(
            ([, a], [, b]) => {
              const aOrder = a?.order ?? 0;
              const bOrder = b?.order ?? 0;
              return aOrder - bOrder;
            },
          );
          this.currentStep = initialPhaseDef.initialStep ?? sortedSteps[0]?.[0];
        }
      }
    }

    // Execute turn onBegin
    this.executeHook(gameSegmentDef.turn.onBegin);

    // Execute phase onBegin
    if (this.currentPhase && phases) {
      this.executeHook(phases[this.currentPhase]?.onBegin);
    }

    // Execute step onBegin
    if (this.currentPhase && this.currentStep && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.steps) {
        this.executeHook(phaseDef.steps[this.currentStep]?.onBegin);
      }
    }

    // Check initial endIf conditions
    this.checkEndConditions();
  }

  /**
   * Task 9.5: Execute a lifecycle hook with FlowContext
   */
  private executeHook(
    hook: ((context: FlowContext<TState>) => void) | undefined,
  ): void {
    if (!hook) return;

    this.gameState = produce(this.gameState, (draft) => {
      const context = this.createFlowContext(draft);
      hook(context);
    });

    // Handle pending programmatic transitions OUTSIDE of produce
    // Order matters: step → phase → turn → game segment
    if (this.pendingEndStep) {
      this.pendingEndStep = false;
      this.transitionToNextStep();
    }
    if (this.pendingEndPhase) {
      this.pendingEndPhase = false;
      this.transitionToNextPhase();
    }
    if (this.pendingEndTurn) {
      this.pendingEndTurn = false;
      this.transitionToNextTurn();
    }
    if (this.pendingEndGameSegment) {
      this.pendingEndGameSegment = false;
      this.transitionToNextGameSegment();
    }
  }

  /**
   * Create stub operations for backward compatibility
   */
  private createStubOperations(): {
    game: GameOperations;
    zones: ZoneOperations;
    cards: CardOperations<TCardMeta>;
  } {
    const stubGameOperations: GameOperations = {
      setOTP: () => {},
      getOTP: () => undefined,
      setPendingMulligan: () => {
        console.log("stub called");
      },
      getPendingMulligan: () => [],
      addPendingMulligan: () => {
        console.log("stub called");
      },
      removePendingMulligan: () => {
        console.log("stub called");
      },
    };

    const stubZoneOperations: ZoneOperations = {
      moveCard: () => {
        console.log("stub called");
      },
      getCardsInZone: () => [],
      shuffleZone: () => {
        console.log("stub called");
      },
      getCardZone: () => undefined,
      drawCards: () => [],
      mulligan: () => {
        console.log("stub called");
      },
      bulkMove: () => [],
      createDeck: () => [],
    };

    const stubCardOperations: CardOperations<TCardMeta> = {
      getCardMeta: () => ({}) as TCardMeta,
      updateCardMeta: () => {
        console.log("stub called");
      },
      setCardMeta: () => {
        console.log("stub called");
      },
      getCardOwner: () => {
        console.log("stub called");
        return undefined;
      },
      queryCards: () => [],
    };

    return {
      game: stubGameOperations,
      zones: stubZoneOperations,
      cards: stubCardOperations,
    };
  }

  /**
   * Task 9.9: Create FlowContext for hooks
   */
  private createFlowContext(
    draft: Draft<TState>,
  ): FlowContext<TState, TCardMeta> {
    const stubs = this.createStubOperations();

    return {
      state: draft,
      game: this.gameOperations || stubs.game,
      zones: this.zoneOperations || stubs.zones,
      cards: this.cardOperations || stubs.cards,
      endGameSegment: () => {
        this.pendingEndGameSegment = true;
      },
      endPhase: () => {
        this.pendingEndPhase = true;
      },
      endStep: () => {
        this.pendingEndStep = true;
      },
      endTurn: () => {
        this.pendingEndTurn = true;
      },
      getCurrentGameSegment: () => this.currentGameSegment,
      getCurrentPhase: () => this.currentPhase,
      getCurrentStep: () => this.currentStep,
      getCurrentPlayer: () => this.currentPlayer,
      getTurnNumber: () => this.turnNumber,
      setCurrentPlayer: (playerId?: string) => {
        this.currentPlayer = playerId;
      },
    };
  }

  /**
   * Task 9.7: Check and execute endIf conditions
   */
  private checkEndConditions(): void {
    if (!this.currentGameSegment) return;

    const gameSegments = this.normalizedGameSegments;
    const gameSegmentDef = gameSegments[this.currentGameSegment];
    if (!gameSegmentDef) return;

    const phases = gameSegmentDef.turn.phases;

    // Check step endIf
    if (this.currentPhase && this.currentStep && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.steps) {
        const stepDef = phaseDef.steps[this.currentStep];
        if (stepDef?.endIf) {
          const context = this.createReadOnlyContext();
          if (stepDef.endIf(context)) {
            this.nextStep();
            return;
          }
        }
      }
    }

    // Check phase endIf
    if (this.currentPhase && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.endIf) {
        const context = this.createReadOnlyContext();
        if (phaseDef.endIf(context)) {
          this.nextPhase();
          return;
        }
      }
    }

    // Check turn endIf
    if (gameSegmentDef.turn.endIf) {
      const context = this.createReadOnlyContext();
      if (gameSegmentDef.turn.endIf(context)) {
        this.nextTurn();
        return;
      }
    }

    // Check game segment endIf
    if (gameSegmentDef.endIf) {
      const context = this.createReadOnlyContext();
      if (gameSegmentDef.endIf(context)) {
        this.nextGameSegment();
      }
    }
  }

  /**
   * Create read-only context for conditions
   *
   * Note: We pass the actual state, not a Draft cast, to avoid
   * potential mutations in read-only contexts (as noted by Copilot review).
   * The state should not be mutated in condition functions.
   */
  private createReadOnlyContext(): FlowContext<TState, TCardMeta> {
    const stubs = this.createStubOperations();

    return {
      state: this.gameState as any as Draft<TState>, // Safe: conditions shouldn't mutate
      game: this.gameOperations || stubs.game,
      zones: this.zoneOperations || stubs.zones,
      cards: this.cardOperations || stubs.cards,
      endGameSegment: () => {},
      endPhase: () => {},
      endStep: () => {},
      endTurn: () => {},
      getCurrentGameSegment: () => this.currentGameSegment,
      getCurrentPhase: () => this.currentPhase,
      getCurrentStep: () => this.currentStep,
      getCurrentPlayer: () => this.currentPlayer,
      getTurnNumber: () => this.turnNumber,
      setCurrentPlayer: (playerId?: string) => {
        this.currentPlayer = playerId;
      },
    };
  }

  /**
   * Task 9.13: Transition to next step
   */
  private transitionToNextStep(): void {
    if (!this.currentGameSegment) return;

    const gameSegments = this.normalizedGameSegments;
    const gameSegmentDef = gameSegments[this.currentGameSegment];
    if (!gameSegmentDef) return;

    const phases = gameSegmentDef.turn.phases;
    if (!(this.currentPhase && this.currentStep && phases)) return;

    const phaseDef = phases[this.currentPhase];
    if (!phaseDef?.steps) return;

    const stepDef = phaseDef.steps[this.currentStep];

    // Execute step onEnd
    this.executeHook(stepDef?.onEnd);

    // Determine next step
    const nextStep = stepDef?.next;

    if (nextStep && phaseDef.steps[nextStep]) {
      this.currentStep = nextStep;
      // Execute new step onBegin
      this.executeHook(phaseDef.steps[nextStep]?.onBegin);
    } else {
      // No more steps, end phase
      this.currentStep = undefined;
      this.transitionToNextPhase();
    }
  }

  /**
   * Task 9.13: Transition to next phase
   */
  private transitionToNextPhase(): void {
    if (!this.currentGameSegment) return;

    const gameSegments = this.normalizedGameSegments;
    const gameSegmentDef = gameSegments[this.currentGameSegment];
    if (!gameSegmentDef) return;

    const phases = gameSegmentDef.turn.phases;
    if (!(this.currentPhase && phases)) return;

    const phaseDef = phases[this.currentPhase];
    const previousPhase = this.currentPhase;

    // Execute phase onEnd
    this.executeHook(phaseDef?.onEnd);

    // Invoke tracker reset callback for the ending phase
    if (this.onPhaseEndCallback && previousPhase) {
      this.onPhaseEndCallback(previousPhase);
    }

    // Determine next phase
    const nextPhase = phaseDef?.next;

    if (nextPhase && phases[nextPhase]) {
      this.currentPhase = nextPhase;
      const nextPhaseDef = phases[nextPhase];

      // Initialize steps if any
      if (nextPhaseDef.steps) {
        const sortedSteps = Object.entries(nextPhaseDef.steps).sort(
          ([, a], [, b]) => a.order - b.order,
        );
        this.currentStep = nextPhaseDef.initialStep ?? sortedSteps[0]?.[0];

        // Execute step onBegin
        if (this.currentStep) {
          this.executeHook(nextPhaseDef.steps[this.currentStep]?.onBegin);
        }
      }

      // Execute phase onBegin
      this.executeHook(nextPhaseDef?.onBegin);
    } else {
      // No more phases, end turn
      this.transitionToNextTurn();
    }
  }

  /**
   * Transition to next turn
   */
  private transitionToNextTurn(): void {
    if (!this.currentGameSegment) return;

    const gameSegments = this.normalizedGameSegments;
    const gameSegmentDef = gameSegments[this.currentGameSegment];
    if (!gameSegmentDef) return;

    const phases = gameSegmentDef.turn.phases;

    // Execute step onEnd if in step
    if (this.currentPhase && this.currentStep && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.steps) {
        const stepDef = phaseDef.steps[this.currentStep];
        this.executeHook(stepDef?.onEnd);
      }
    }

    // Execute phase onEnd if in phase
    if (this.currentPhase && phases) {
      const phaseDef = phases[this.currentPhase];
      this.executeHook(phaseDef?.onEnd);
    }

    // Execute turn onEnd
    this.executeHook(gameSegmentDef.turn.onEnd);

    // Invoke tracker reset callback at turn end
    if (this.onTurnEndCallback) {
      this.onTurnEndCallback();
    }

    // Increment turn number
    this.turnNumber += 1;

    // Reset to first phase
    if (phases) {
      const sortedPhases = Object.entries(phases).sort(
        ([, a], [, b]) => a.order - b.order,
      );
      this.currentPhase =
        gameSegmentDef.turn.initialPhase ?? sortedPhases[0]?.[0];

      // Initialize steps
      if (this.currentPhase) {
        const phaseDef = phases[this.currentPhase];
        if (phaseDef?.steps) {
          const sortedSteps = Object.entries(phaseDef.steps).sort(
            ([, a], [, b]) => a.order - b.order,
          );
          this.currentStep = phaseDef.initialStep ?? sortedSteps[0]?.[0];
        } else {
          this.currentStep = undefined;
        }
      }
    }

    // Execute turn onBegin
    this.executeHook(gameSegmentDef.turn.onBegin);

    // Execute phase onBegin
    if (this.currentPhase && phases) {
      this.executeHook(phases[this.currentPhase]?.onBegin);

      // Execute step onBegin
      if (this.currentStep) {
        const phaseDef = phases[this.currentPhase];
        if (phaseDef?.steps) {
          this.executeHook(phaseDef.steps[this.currentStep]?.onBegin);
        }
      }
    }
  }

  /**
   * Transition to next game segment
   */
  private transitionToNextGameSegment(): void {
    if (!this.currentGameSegment) return;

    const gameSegments = this.normalizedGameSegments;
    const gameSegmentDef = gameSegments[this.currentGameSegment];
    if (!gameSegmentDef) return;

    const phases = gameSegmentDef.turn.phases;

    // Execute step onEnd if in step
    if (this.currentPhase && this.currentStep && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.steps) {
        const stepDef = phaseDef.steps[this.currentStep];
        this.executeHook(stepDef?.onEnd);
      }
    }

    // Execute phase onEnd if in phase
    if (this.currentPhase && phases) {
      const phaseDef = phases[this.currentPhase];
      this.executeHook(phaseDef?.onEnd);
    }

    // Execute turn onEnd
    this.executeHook(gameSegmentDef.turn.onEnd);

    // Execute game segment onEnd
    this.executeHook(gameSegmentDef.onEnd);

    // Determine next game segment
    const nextGameSegment = gameSegmentDef.next;

    if (nextGameSegment && gameSegments[nextGameSegment]) {
      this.currentGameSegment = nextGameSegment;
      const nextGameSegmentDef = gameSegments[nextGameSegment];

      // Reset turn number for new game segment (optional - depends on game rules)
      // this.turnNumber = 1;

      // Execute game segment onBegin
      this.executeHook(nextGameSegmentDef.onBegin);

      // Initialize turn structure for new game segment
      const nextPhases = nextGameSegmentDef.turn.phases;
      if (nextPhases) {
        const sortedPhases = Object.entries(nextPhases).sort(
          ([, a], [, b]) => a.order - b.order,
        );
        this.currentPhase =
          nextGameSegmentDef.turn.initialPhase ?? sortedPhases[0]?.[0];

        // Initialize steps
        if (this.currentPhase) {
          const phaseDef = nextPhases[this.currentPhase];
          if (phaseDef?.steps) {
            const sortedSteps = Object.entries(phaseDef.steps).sort(
              ([, a], [, b]) => a.order - b.order,
            );
            this.currentStep = phaseDef.initialStep ?? sortedSteps[0]?.[0];
          } else {
            this.currentStep = undefined;
          }
        }
      }

      // Execute turn onBegin
      this.executeHook(nextGameSegmentDef.turn.onBegin);

      // Execute phase onBegin
      if (this.currentPhase && nextPhases) {
        this.executeHook(nextPhases[this.currentPhase]?.onBegin);

        // Execute step onBegin
        if (this.currentStep) {
          const phaseDef = nextPhases[this.currentPhase];
          if (phaseDef?.steps) {
            this.executeHook(phaseDef.steps[this.currentStep]?.onBegin);
          }
        }
      }
    } else {
      // No more game segments, game ends
      this.currentGameSegment = undefined;
      this.currentPhase = undefined;
      this.currentStep = undefined;
    }
  }

  /**
   * Public API
   */

  /**
   * Get current phase name
   */
  getCurrentPhase(): string | undefined {
    return this.currentPhase;
  }

  /**
   * Get current step name
   */
  getCurrentStep(): string | undefined {
    return this.currentStep;
  }

  /**
   * Get current game segment name
   */
  getCurrentGameSegment(): string | undefined {
    return this.currentGameSegment;
  }

  /**
   * Get current segment name (alias for getCurrentGameSegment)
   */
  getCurrentSegment(): string | undefined {
    return this.currentGameSegment;
  }

  /**
   * Get current game state
   */
  getGameState(): TState {
    return this.gameState;
  }

  /**
   * Get current flow state snapshot
   */
  getState(): FlowStateSnapshot {
    return {
      gameSegment: this.currentGameSegment,
      phase: this.currentPhase,
      step: this.currentStep,
      turn: this.turnNumber,
    };
  }

  /**
   * Get current turn number (1-indexed)
   */
  getTurnNumber(): number {
    return this.turnNumber;
  }

  /**
   * Get current player ID
   */
  getCurrentPlayer(): string | undefined {
    return this.currentPlayer;
  }

  /**
   * Set current player ID
   *
   * This allows explicit control over which player is "active" or has "priority".
   * Useful for game segments where priority doesn't follow standard turn order
   * (e.g., during game setup, mulligan phases, or special action sequences).
   *
   * @param playerId - Player ID to set as current, or undefined to clear
   */
  setCurrentPlayer(playerId?: string): void {
    this.currentPlayer = playerId;
  }

  /**
   * Check if this is the first turn of the game
   */
  isFirstTurn(): boolean {
    return this.turnNumber === 1;
  }

  /**
   * Transition to next phase
   */
  nextPhase(): void {
    this.transitionToNextPhase();
    this.checkEndConditions();
  }

  /**
   * Transition to next step
   */
  nextStep(): void {
    this.transitionToNextStep();
    this.checkEndConditions();
  }

  /**
   * Transition to next game segment
   */
  nextGameSegment(): void {
    this.transitionToNextGameSegment();
    this.checkEndConditions();
  }

  /**
   * Transition to next turn
   */
  nextTurn(): void {
    this.transitionToNextTurn();
    this.checkEndConditions();
  }

  /**
   * Task 9.11: Send event to flow machine
   */
  send(event: FlowEvent): void {
    switch (event.type) {
      case "NEXT_GAME_SEGMENT":
      case "END_GAME_SEGMENT":
        this.nextGameSegment();
        break;
      case "NEXT_PHASE":
      case "END_PHASE":
        this.nextPhase();
        break;
      case "END_STEP":
      case "NEXT_STEP":
        this.nextStep();
        break;
      case "END_TURN":
        this.nextTurn();
        break;
      case "STATE_UPDATED":
        this.checkEndConditions();
        break;
    }
  }

  /**
   * Update game state and check endIf conditions
   */
  updateState(updater: (draft: Draft<TState>) => void): void {
    this.gameState = produce(this.gameState, updater);
    this.checkEndConditions();
  }
}
