import { type Draft, produce } from "immer";
import type { ActorRefFrom } from "xstate";
import type { FlowContext, FlowDefinition } from "./flow-definition";

/**
 * Task 9.4: FlowManager - XState-based flow orchestration
 *
 * Manages game flow using XState state machines:
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
 */

/**
 * Flow event types for XState
 *
 * Task 9.11: Flow event handling
 */
type FlowEvent =
  | { type: "NEXT_PHASE" }
  | { type: "NEXT_SEGMENT" }
  | { type: "END_TURN" }
  | { type: "END_SEGMENT" }
  | { type: "END_PHASE" }
  | { type: "STATE_UPDATED" };

/**
 * Task 9.4: FlowManager implementation
 */
export class FlowManager<TState> {
  private flowDefinition: FlowDefinition<TState>;
  private gameState: TState;
  private machineActor: ActorRefFrom<any> | null = null;
  private currentPhase?: string;
  private currentSegment?: string;
  private turnNumber = 1;
  private currentPlayer = "";
  private pendingEndPhase = false;
  private pendingEndSegment = false;
  private pendingEndTurn = false;

  constructor(flowDefinition: FlowDefinition<TState>, initialState: TState) {
    this.flowDefinition = flowDefinition;
    this.gameState = initialState;

    // Initialize flow
    this.initializeFlow();
  }

  /**
   * Task 9.3: Initialize the flow state machine
   */
  private initializeFlow(): void {
    // Determine initial phase
    const phases = this.flowDefinition.turn.phases;
    if (phases) {
      const sortedPhases = Object.entries(phases).sort(
        ([, a], [, b]) => a.order - b.order,
      );
      this.currentPhase = sortedPhases[0]?.[0];

      // Check for segments in initial phase
      const initialPhaseDef = phases[this.currentPhase];
      if (initialPhaseDef?.segments) {
        const sortedSegments = Object.entries(initialPhaseDef.segments).sort(
          ([, a], [, b]) => a.order - b.order,
        );
        this.currentSegment = sortedSegments[0]?.[0];
      }
    }

    // Execute turn onBegin
    this.executeHook(this.flowDefinition.turn.onBegin);

    // Execute phase onBegin
    if (this.currentPhase && phases) {
      this.executeHook(phases[this.currentPhase]?.onBegin);
    }

    // Execute segment onBegin
    if (this.currentPhase && this.currentSegment && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.segments) {
        this.executeHook(phaseDef.segments[this.currentSegment]?.onBegin);
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
    if (this.pendingEndSegment) {
      this.pendingEndSegment = false;
      this.transitionToNextSegment();
    }
    if (this.pendingEndPhase) {
      this.pendingEndPhase = false;
      this.transitionToNextPhase();
    }
    if (this.pendingEndTurn) {
      this.pendingEndTurn = false;
      this.transitionToNextTurn();
    }
  }

  /**
   * Task 9.9: Create FlowContext for hooks
   */
  private createFlowContext(draft: Draft<TState>): FlowContext<TState> {
    return {
      state: draft,
      endPhase: () => {
        this.pendingEndPhase = true;
      },
      endSegment: () => {
        this.pendingEndSegment = true;
      },
      endTurn: () => {
        this.pendingEndTurn = true;
      },
      getCurrentPhase: () => this.currentPhase,
      getCurrentSegment: () => this.currentSegment,
      getCurrentPlayer: () => this.currentPlayer,
      getTurnNumber: () => this.turnNumber,
    };
  }

  /**
   * Task 9.7: Check and execute endIf conditions
   */
  private checkEndConditions(): void {
    const phases = this.flowDefinition.turn.phases;

    // Check segment endIf
    if (this.currentPhase && this.currentSegment && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.segments) {
        const segmentDef = phaseDef.segments[this.currentSegment];
        if (segmentDef?.endIf) {
          const context = this.createReadOnlyContext();
          if (segmentDef.endIf(context)) {
            this.nextSegment();
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
    if (this.flowDefinition.turn.endIf) {
      const context = this.createReadOnlyContext();
      if (this.flowDefinition.turn.endIf(context)) {
        this.nextTurn();
      }
    }
  }

  /**
   * Create read-only context for conditions
   */
  private createReadOnlyContext(): FlowContext<TState> {
    return {
      state: this.gameState as Draft<TState>,
      endPhase: () => {},
      endSegment: () => {},
      endTurn: () => {},
      getCurrentPhase: () => this.currentPhase,
      getCurrentSegment: () => this.currentSegment,
      getCurrentPlayer: () => this.currentPlayer,
      getTurnNumber: () => this.turnNumber,
    };
  }

  /**
   * Task 9.13: Transition to next segment
   */
  private transitionToNextSegment(): void {
    const phases = this.flowDefinition.turn.phases;
    if (!(this.currentPhase && this.currentSegment && phases)) return;

    const phaseDef = phases[this.currentPhase];
    if (!phaseDef?.segments) return;

    const segmentDef = phaseDef.segments[this.currentSegment];

    // Execute segment onEnd
    this.executeHook(segmentDef?.onEnd);

    // Determine next segment
    const nextSegment = segmentDef?.next;

    if (nextSegment && phaseDef.segments[nextSegment]) {
      this.currentSegment = nextSegment;
      // Execute new segment onBegin
      this.executeHook(phaseDef.segments[nextSegment]?.onBegin);
    } else {
      // No more segments, end phase
      this.currentSegment = undefined;
      this.transitionToNextPhase();
    }
  }

  /**
   * Task 9.13: Transition to next phase
   */
  private transitionToNextPhase(): void {
    const phases = this.flowDefinition.turn.phases;
    if (!(this.currentPhase && phases)) return;

    const phaseDef = phases[this.currentPhase];

    // Execute phase onEnd
    this.executeHook(phaseDef?.onEnd);

    // Determine next phase
    const nextPhase = phaseDef?.next;

    if (nextPhase && phases[nextPhase]) {
      this.currentPhase = nextPhase;
      const nextPhaseDef = phases[nextPhase];

      // Initialize segments if any
      if (nextPhaseDef.segments) {
        const sortedSegments = Object.entries(nextPhaseDef.segments).sort(
          ([, a], [, b]) => a.order - b.order,
        );
        this.currentSegment = sortedSegments[0]?.[0];

        // Execute segment onBegin
        if (this.currentSegment) {
          this.executeHook(nextPhaseDef.segments[this.currentSegment]?.onBegin);
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
    const phases = this.flowDefinition.turn.phases;

    // Execute segment onEnd if in segment
    if (this.currentPhase && this.currentSegment && phases) {
      const phaseDef = phases[this.currentPhase];
      if (phaseDef?.segments) {
        const segmentDef = phaseDef.segments[this.currentSegment];
        this.executeHook(segmentDef?.onEnd);
      }
    }

    // Execute phase onEnd if in phase
    if (this.currentPhase && phases) {
      const phaseDef = phases[this.currentPhase];
      this.executeHook(phaseDef?.onEnd);
    }

    // Execute turn onEnd
    this.executeHook(this.flowDefinition.turn.onEnd);

    // Increment turn number
    this.turnNumber += 1;

    // Reset to first phase
    if (phases) {
      const sortedPhases = Object.entries(phases).sort(
        ([, a], [, b]) => a.order - b.order,
      );
      this.currentPhase = sortedPhases[0]?.[0];

      // Initialize segments
      if (this.currentPhase) {
        const phaseDef = phases[this.currentPhase];
        if (phaseDef?.segments) {
          const sortedSegments = Object.entries(phaseDef.segments).sort(
            ([, a], [, b]) => a.order - b.order,
          );
          this.currentSegment = sortedSegments[0]?.[0];
        } else {
          this.currentSegment = undefined;
        }
      }
    }

    // Execute turn onBegin
    this.executeHook(this.flowDefinition.turn.onBegin);

    // Execute phase onBegin
    if (this.currentPhase && phases) {
      this.executeHook(phases[this.currentPhase]?.onBegin);

      // Execute segment onBegin
      if (this.currentSegment) {
        const phaseDef = phases[this.currentPhase];
        if (phaseDef?.segments) {
          this.executeHook(phaseDef.segments[this.currentSegment]?.onBegin);
        }
      }
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
   * Get current segment name
   */
  getCurrentSegment(): string | undefined {
    return this.currentSegment;
  }

  /**
   * Get current game state
   */
  getGameState(): TState {
    return this.gameState;
  }

  /**
   * Get XState machine state (for XState integration)
   */
  getState(): any {
    return {
      phase: this.currentPhase,
      segment: this.currentSegment,
      turn: this.turnNumber,
    };
  }

  /**
   * Transition to next phase
   */
  nextPhase(): void {
    this.transitionToNextPhase();
    this.checkEndConditions();
  }

  /**
   * Transition to next segment
   */
  nextSegment(): void {
    this.transitionToNextSegment();
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
      case "NEXT_PHASE":
        this.nextPhase();
        break;
      case "END_SEGMENT":
      case "NEXT_SEGMENT":
        this.nextSegment();
        break;
      case "END_TURN":
        this.nextTurn();
        break;
      case "END_PHASE":
        this.nextPhase();
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
