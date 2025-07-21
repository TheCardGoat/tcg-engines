import type {
  PhaseConfig,
  StepConfig,
} from "~/game-engine/core-engine/game/structure/phase";
import type {
  SegmentConfig,
  SegmentMap,
} from "~/game-engine/core-engine/game/structure/segment";
import { processSegments } from "~/game-engine/core-engine/game/structure/segment";
import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";
import type {
  CoreEngineState,
  FlowConfiguration,
  FlowInterface,
  FlowPhase,
  FlowPhaseType,
  FnContext,
  GameDefinition,
} from "../game-configuration";
import { hasPriorityPlayer } from "../state/context";
import { debuggers, logger } from "../utils/logger";

// Enhanced logging and telemetry types based on core tenets
interface FlowTransitionEvent {
  type:
    | "segment_transition"
    | "phase_transition"
    | "step_transition"
    | "initialization";
  from: {
    segment?: string | null;
    phase?: string | null;
    step?: string | null;
  };
  to: {
    segment?: string | null;
    phase?: string | null;
    step?: string | null;
  };
  reason: string;
  timestamp: number;
  playerContext?: {
    currentPlayer?: string;
    priorityPlayer?: string;
  };
}

interface FlowDecisionEvent {
  type: "condition_evaluation";
  condition:
    | "segment_end"
    | "phase_end"
    | "step_end"
    | "phase_next"
    | "step_next";
  result: boolean | string | null;
  context: string;
  timestamp: number;
}

/**
 * Unified Flow Manager that handles all game flow operations
 * All transitions, phases, segments, and player actions are managed here
 * When called externally, it processes the current state and applies any necessary transitions and hooks
 */
export class FlowManager<G> implements FlowInterface<G> {
  private config: FlowConfiguration<G>;
  private gameDefinition: GameDefinition<G>;

  // Move resolution properties (previously from Flow function)
  public readonly moveMap: Record<string, Move<G>> = {};
  public readonly moveNames: string[] = [];
  public readonly startingSegment: string | null = null;
  public readonly initialPhase: string | null = null;
  public readonly initialStep: string | null = null;

  // Telemetry and logging enhancement
  private flowEvents: FlowTransitionEvent[] = [];
  private decisionEvents: FlowDecisionEvent[] = [];

  constructor(
    gameDefinition: GameDefinition<G>,
    cards: GameCards,
    players?: string[],
  ) {
    this.config = gameDefinition.flow || { turns: { phases: [] } };
    this.gameDefinition = gameDefinition;

    // Initialize move maps and flow data (previously Flow function logic)
    this.initializeMoveResolution(cards, players);

    // NORMAL PLAYER LOG: Engine initialization
    this.logPlayerEvent("Flow engine initialized", {
      startingSegment: this.startingSegment,
      moveCount: this.moveNames.length,
    });
  }

  /**
   * Enhanced logging methods following core tenets
   */
  private logPlayerEvent(message: string, context?: any): void {
    // Normal Player Logs: Clear, concise game events
    logger.info(`[PLAYER] ${message}`, context);
  }

  private logAdvancedPlayerEvent(message: string, context?: any): void {
    // Advanced Player Logs: Detailed why/how information
    logger.info(`[ADVANCED] ${message}`, context);
  }

  private logDeveloperEvent(message: string, context?: any): void {
    // Developer Logs: Internal operations and debugging
    if (debuggers.flowTransitions) {
      logger.debug(`[DEV] ${message}`, context);
    }
  }

  private recordTransitionEvent(event: FlowTransitionEvent): void {
    this.flowEvents.push(event);

    // Telemetry: Record significant flow transitions for analysis
    const transitionSummary = `${event.from.segment || "none"}/${event.from.phase || "none"}/${event.from.step || "none"} → ${event.to.segment || "none"}/${event.to.phase || "none"}/${event.to.step || "none"}`;

    // ADVANCED PLAYER LOG: Flow transitions with reasoning
    this.logAdvancedPlayerEvent(`Flow transition: ${transitionSummary}`, {
      reason: event.reason,
      type: event.type,
    });

    // DEVELOPER LOG: Full transition details
    this.logDeveloperEvent("Transition recorded", event);
  }

  private recordDecisionEvent(event: FlowDecisionEvent): void {
    this.decisionEvents.push(event);

    // DEVELOPER LOG: Decision evaluation details
    this.logDeveloperEvent(
      `Condition evaluated: ${event.condition} = ${event.result}`,
      {
        context: event.context,
      },
    );
  }

  /**
   * Initialize move resolution system (consolidates Flow function logic)
   */
  private initializeMoveResolution(cards: GameCards, players?: string[]): void {
    const { segments } = this.gameDefinition;
    const segmentsMap = { ...segments };
    const moveNames = new Set<string>();

    // Add top-level moves
    if (this.gameDefinition.moves) {
      for (const name of Object.keys(this.gameDefinition.moves)) {
        this.moveMap[name] = this.gameDefinition.moves[name];
        moveNames.add(name);
      }
    }

    // Process segments and extract moves
    const { startingSegment, segmentMoveNames, segmentMoveMap } =
      processSegments(segmentsMap);

    // Store segment-based moves with qualified and simple names
    for (const qualifiedName of Object.keys(segmentMoveMap)) {
      this.moveMap[qualifiedName] = segmentMoveMap[qualifiedName];

      // Extract simple name from qualified name
      const parts = qualifiedName.split(".");
      const simpleName = parts[parts.length - 1];
      this.moveMap[simpleName] = segmentMoveMap[qualifiedName];
    }

    // Collect all move names
    for (const moveName of segmentMoveNames) {
      moveNames.add(moveName);
    }

    // Set readonly properties
    (this as any).startingSegment = startingSegment;
    (this as any).moveNames = [...moveNames.values()];

    // Determine initial phase and step
    this.determineInitialFlow(startingSegment, segments);
  }

  /**
   * Determine initial phase and step from starting segment
   */
  private determineInitialFlow(
    startingSegment: string | null,
    segments: SegmentMap<G> | undefined,
  ): void {
    let initialPhase = null;
    let initialStep = null;

    if (startingSegment && segments?.[startingSegment]) {
      const segmentConfig = segments[startingSegment];
      const phases = segmentConfig.turn?.phases;

      if (phases) {
        for (const phaseName in phases) {
          if (phases[phaseName].start) {
            initialPhase = phaseName;

            const steps = phases[phaseName].steps;
            if (steps) {
              for (const stepName in steps) {
                if (steps[stepName].start) {
                  initialStep = stepName;
                  break;
                }
              }
            }
            break;
          }
        }
      }
    }

    (this as any).initialPhase = initialPhase;
    (this as any).initialStep = initialStep;

    // DEVELOPER LOG: Initial flow determination
    this.logDeveloperEvent("Initial flow determined", {
      startingSegment,
      initialPhase,
      initialStep,
    });
  }

  /**
   * Get move function by name (replaces Flow.getMove)
   */
  getMove(ctx: CoreCtx, name: string, playerID: PlayerID): Move<G> | null {
    return this.moveMap[name] || null;
  }

  getCurrentPhase(state: CoreEngineState<G>): FlowPhase<G> | null {
    const phaseId = state.ctx.currentPhase;
    if (!phaseId) {
      return null;
    }

    return this.getPhaseById(phaseId);
  }

  getPhaseById(phaseId: FlowPhaseType): FlowPhase<G> | null {
    // If no flow configuration, return null (segments-only mode)
    if (!this.config?.turns?.phases) {
      return null;
    }
    return (
      this.config.turns.phases.find((phase) => phase.id === phaseId) || null
    );
  }

  getNextPhase(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): FlowPhaseType | null {
    const { ctx } = state;

    // First check segment-based phases (for pre-game setup)
    if (ctx.currentSegment && ctx.currentPhase) {
      const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
      if (segmentConfig?.turn?.phases) {
        const phaseConfig = segmentConfig.turn.phases[ctx.currentPhase];
        let nextPhase: string | null = null;
        const nextConfig = phaseConfig?.next;

        // If next is a function, call it to get the actual next phase name
        if (typeof nextConfig === "function") {
          try {
            nextPhase = nextConfig(fnContext) ?? null;
          } catch (error) {
            logger.error(`FlowManager: Error in phase next function: ${error}`);
            nextPhase = null;
          }
        } else if (typeof nextConfig === "string") {
          nextPhase = nextConfig;
        }

        // Record decision for telemetry
        this.recordDecisionEvent({
          type: "condition_evaluation",
          condition: "phase_next",
          result: nextPhase,
          context: `Segment: ${ctx.currentSegment}, Phase: ${ctx.currentPhase}`,
          timestamp: Date.now(),
        });

        if (nextPhase) {
          return nextPhase;
        }
      }
    }

    // Fallback to flow configuration phases (for turn-based gameplay)
    // If no flow configuration, return null (segments-only mode)
    if (!this.config?.turns?.phases) {
      return null;
    }

    const currentPhase = this.getCurrentPhase(state);
    const phases = this.config.turns.phases;

    if (!phases || phases.length === 0) {
      return null;
    }

    if (!currentPhase) {
      return phases[0]?.id || null;
    }

    const currentPhaseIndex = phases.findIndex(
      (phase) => phase.id === currentPhase.id,
    );
    if (currentPhaseIndex === -1 || currentPhaseIndex >= phases.length - 1) {
      return null;
    }

    return phases[currentPhaseIndex + 1].id;
  }

  // ===== PRIORITY MANAGEMENT =====

  canPlayerAct(state: CoreEngineState<G>, playerID: string): boolean {
    // Otherwise, check normal priority system
    return hasPriorityPlayer(state.ctx, playerID);
  }

  executeHook<R>(
    hook: ((context: FnContext<G>) => R) | undefined,
    ctx: FnContext<G>,
  ): R | undefined {
    if (typeof hook !== "function" || !ctx) {
      return undefined;
    }

    try {
      const result = hook(ctx);
      // DEVELOPER LOG: Hook execution (only when significant)
      if (result !== undefined) {
        this.logDeveloperEvent("Hook executed with result", {
          hasResult: true,
          resultType: typeof result,
        });
      }
      return result;
    } catch (error) {
      logger.error(`FlowManager: Hook execution failed: ${error}`);
      return undefined;
    }
  }

  /**
   * Find the starting phase (marked with start: true) in a phases object.
   */
  private findStartingPhase(
    phases: Record<string, PhaseConfig<G>>,
  ): string | null {
    return (
      Object.keys(phases).find((phaseId) => phases[phaseId]?.start === true) ||
      null
    );
  }

  /**
   * Find the starting step (marked with start: true) in a steps object.
   */
  private findStartingStep(steps: Record<string, any>): string | null {
    for (const stepName in steps) {
      if (steps[stepName].start) {
        return stepName;
      }
    }
    return null;
  }

  /**
   * Handles segment ending and advancing to the next segment if needed.
   */
  private handleSegmentTransition(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): CoreEngineState<G> {
    let currentState = { ...state };
    const { ctx } = currentState;
    if (!ctx.currentSegment) {
      logger.error("FlowManager: No current segment defined.");
      return currentState;
    }

    const shouldEndSegment = this.shouldEndSegment(currentState, fnContext);
    if (shouldEndSegment) {
      const nextSegment = this.getNextSegment(currentState, fnContext);
      if (nextSegment && nextSegment !== ctx.currentSegment) {
        // PLAYER LOG: Segment transition
        this.logPlayerEvent(
          `Game segment complete: ${ctx.currentSegment} → ${nextSegment}`,
        );

        // Record transition event
        this.recordTransitionEvent({
          type: "segment_transition",
          from: {
            segment: ctx.currentSegment,
            phase: ctx.currentPhase,
            step: ctx.currentStep,
          },
          to: { segment: nextSegment, phase: null, step: null },
          reason: "Segment end condition met",
          timestamp: Date.now(),
        });

        // Apply segment end hooks
        const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
        const onEnd = this.executeHook(segmentConfig.onEnd, fnContext);

        if (onEnd !== undefined) {
          currentState = fnContext._getUpdatedState();
        }

        // Get the starting phase and step for the new segment
        const newSegmentConfig = this.getSegmentConfig(nextSegment);
        let startingPhase = null;
        let startingStep = null;

        if (newSegmentConfig?.turn?.phases) {
          const phases = newSegmentConfig.turn.phases;
          startingPhase = this.findStartingPhase(phases);

          if (startingPhase) {
            const phaseConfig = phases[startingPhase];
            if (phaseConfig?.steps) {
              startingStep = this.findStartingStep(phaseConfig.steps);
            }
          }
        }

        currentState = {
          ...currentState,
          ctx: {
            ...currentState.ctx,
            currentSegment: nextSegment,
            currentPhase: startingPhase,
            currentStep: startingStep,
          },
        };

        // Execute onBegin hook for the new segment
        const updatedFnContext = {
          ...fnContext,
          ctx: currentState.ctx,
          G: currentState.G,
        };

        const onBegin = this.executeHook(
          newSegmentConfig?.onBegin,
          updatedFnContext,
        );
        if (onBegin !== undefined) {
          currentState = {
            ...currentState,
            G: onBegin,
          };
        }
      }
    }

    return currentState;
  }

  /**
   * Handles phase ending and advancing to the next phase if needed.
   */
  private handlePhaseTransition(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): CoreEngineState<G> {
    let currentState = { ...state };
    const { ctx } = currentState;
    if (!ctx.currentPhase) {
      return currentState;
    }

    const shouldEndPhase = this.shouldEndPhase(currentState, fnContext);

    if (shouldEndPhase) {
      const nextPhase = this.getNextPhase(currentState, fnContext);

      if (nextPhase && nextPhase !== ctx.currentPhase) {
        // ADVANCED PLAYER LOG: Phase transition with context
        this.logAdvancedPlayerEvent(
          `Phase transition: ${ctx.currentPhase} → ${nextPhase}`,
          {
            reason: "Phase end condition met",
            step: ctx.currentStep,
          },
        );

        // Record transition event
        this.recordTransitionEvent({
          type: "phase_transition",
          from: {
            segment: ctx.currentSegment,
            phase: ctx.currentPhase,
            step: ctx.currentStep,
          },
          to: { segment: ctx.currentSegment, phase: nextPhase, step: null },
          reason: "Phase end condition met",
          timestamp: Date.now(),
        });

        // Apply phase onBegin hook before changing phase
        const phaseConfig = this.getPhaseConfig(ctx.currentSegment, nextPhase);
        const result = this.executeHook(phaseConfig?.onBegin, fnContext);

        if (result !== undefined) {
          currentState = fnContext._getUpdatedState();
        }

        currentState = {
          ...currentState,
          ctx: {
            ...currentState.ctx,
            currentPhase: nextPhase,
            currentSegment: state.ctx.currentSegment,
            currentStep: null,
            // Reset per-turn move counters when transitioning back to mainPhase
            ...(nextPhase === "mainPhase" && ctx.currentPhase !== "mainPhase"
              ? { numTurnMoves: 0 }
              : {}),
          },
        };
      }
    }

    return currentState;
  }

  /**
   * Handles step ending and advancing to the next step if needed.
   */
  private handleStepTransition(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): CoreEngineState<G> {
    let currentState = { ...state };
    const { ctx } = currentState;
    if (!ctx.currentStep) {
      return currentState;
    }

    const shouldEndStep = this.shouldEndStep(currentState, fnContext);

    if (shouldEndStep) {
      const nextStep = this.getNextStep(currentState, fnContext);
      if (nextStep && nextStep !== ctx.currentStep) {
        // DEVELOPER LOG: Step transition (internal detail)
        this.logDeveloperEvent(
          `Step transition: ${ctx.currentStep} → ${nextStep}`,
        );

        // Record transition event
        this.recordTransitionEvent({
          type: "step_transition",
          from: {
            segment: ctx.currentSegment,
            phase: ctx.currentPhase,
            step: ctx.currentStep,
          },
          to: {
            segment: ctx.currentSegment,
            phase: ctx.currentPhase,
            step: nextStep,
          },
          reason: "Step end condition met",
          timestamp: Date.now(),
        });

        currentState = {
          ...currentState,
          ctx: {
            ...currentState.ctx,
            currentStep: nextStep,
          },
        };

        // Apply step onBegin hook AFTER changing step
        const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
        const phaseConfig = segmentConfig?.turn?.phases?.[ctx.currentPhase];
        const stepConfig = phaseConfig?.steps?.[nextStep];

        const updatedFnContext = {
          ...fnContext,
          ctx: currentState.ctx,
        };

        try {
          const result = this.executeHook(
            stepConfig?.onBegin,
            updatedFnContext,
          );

          if (result !== undefined) {
            // Capture G changes from the hook result
            currentState = {
              ...currentState,
              G: result,
            };

            // Check if context has game over state changes and capture those specifically
            const updatedState = updatedFnContext._getUpdatedState();
            if (
              updatedState.ctx.gameOver !== undefined ||
              updatedState.ctx.winner !== undefined
            ) {
              currentState = {
                ...currentState,
                ctx: {
                  ...currentState.ctx,
                  gameOver: updatedState.ctx.gameOver,
                  winner: updatedState.ctx.winner,
                },
              };
            }
          }
        } catch (error) {
          logger.error(
            `FlowManager: Error executing onBegin hook for step ${nextStep}: ${error}`,
          );
        }
      } else {
        // When no next step exists, all steps are complete
        // ADVANCED PLAYER LOG: Phase completion through step completion
        this.logAdvancedPlayerEvent(
          `Phase ${ctx.currentPhase} steps completed`,
          {
            lastStep: ctx.currentStep,
          },
        );

        currentState = {
          ...currentState,
          ctx: {
            ...currentState.ctx,
            currentStep: null,
          },
        };

        // Immediately check if the phase should end after step completion
        const updatedFnContext = {
          ...fnContext,
          ctx: currentState.ctx,
        };

        const phaseConfig = this.getPhaseConfig(
          ctx.currentSegment,
          ctx.currentPhase,
        );

        // If phase has a next, it should end after step completion
        if (phaseConfig?.next) {
          const nextPhase = this.getNextPhase(currentState, updatedFnContext);
          if (nextPhase && nextPhase !== ctx.currentPhase) {
            // Apply phase onBegin hook for next phase
            const nextPhaseConfig = this.getPhaseConfig(
              ctx.currentSegment,
              nextPhase,
            );
            const onBeginResult = this.executeHook(
              nextPhaseConfig?.onBegin,
              updatedFnContext,
            );

            if (onBeginResult !== undefined) {
              currentState = {
                ...currentState,
                G: onBeginResult,
              };
            }

            currentState = {
              ...currentState,
              ctx: {
                ...currentState.ctx,
                currentPhase: nextPhase,
                currentStep: null,
                // Reset numMoves when completing a turn cycle back to mainPhase
                ...(nextPhase === "mainPhase" &&
                ctx.currentPhase === "beginningPhase"
                  ? {
                      numTurnMoves: 0,
                      numTurns: (currentState.ctx.numTurns || 0) + 1,
                    }
                  : nextPhase === "mainPhase" &&
                      ctx.currentPhase !== "mainPhase"
                    ? { numTurnMoves: 0 }
                    : {}),
              },
            };
          }
        }
      }
    }

    return currentState;
  }

  /**
   * Handles initializing the starting phase and step for a segment if there is a segment but no phase.
   */
  private handleSegmentPhaseInitialization(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): CoreEngineState<G> {
    let currentState = { ...state };
    const { ctx } = currentState;

    // Handle case where we have a phase but no step
    if (ctx.currentSegment && ctx.currentPhase && !ctx.currentStep) {
      const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
      const phaseConfig = segmentConfig?.turn?.phases?.[ctx.currentPhase];

      if (phaseConfig?.steps) {
        // Check if phase should end instead of reinitializing steps
        let nextPhase = null;
        if (typeof phaseConfig.next === "function") {
          try {
            nextPhase = phaseConfig.next(fnContext);
          } catch (error) {
            logger.error(`FlowManager: Error in phase next function: ${error}`);
          }
        } else {
          nextPhase = phaseConfig.next;
        }

        let shouldExplicitlyEnd = false;
        if (phaseConfig.endIf) {
          try {
            shouldExplicitlyEnd = !!this.executeHook(
              phaseConfig.endIf,
              fnContext,
            );
          } catch (error) {
            logger.error(
              `FlowManager: Error in phase endIf function: ${error}`,
            );
          }
        }

        const shouldPhaseEnd = !(nextPhase || shouldExplicitlyEnd);

        if (shouldPhaseEnd) {
          return currentState;
        }

        // Allow step initialization only for phases that should continue
        const startingStep = this.findStartingStep(phaseConfig.steps);
        if (startingStep) {
          // DEVELOPER LOG: Step initialization
          this.logDeveloperEvent(
            `Initializing step: ${startingStep} in phase ${ctx.currentPhase}`,
          );

          // Record initialization event
          this.recordTransitionEvent({
            type: "initialization",
            from: {
              segment: ctx.currentSegment,
              phase: ctx.currentPhase,
              step: null,
            },
            to: {
              segment: ctx.currentSegment,
              phase: ctx.currentPhase,
              step: startingStep,
            },
            reason: "Step initialization for phase continuation",
            timestamp: Date.now(),
          });

          currentState = {
            ...currentState,
            ctx: {
              ...currentState.ctx,
              currentStep: startingStep,
            },
          };

          // Execute the onBegin hook for the starting step
          const stepConfig = phaseConfig.steps[startingStep];
          if (stepConfig?.onBegin) {
            const updatedFnContext = {
              ...fnContext,
              ctx: currentState.ctx,
            };

            const result = this.executeHook(
              stepConfig.onBegin,
              updatedFnContext,
            );
            if (result !== undefined) {
              currentState = {
                ...currentState,
                G: result,
              };
            }
          }
        }
      }
    }

    if (!(ctx.currentSegment && !ctx.currentPhase)) {
      return currentState;
    }

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);

    if (segmentConfig?.turn?.phases) {
      const phases = segmentConfig.turn.phases;
      const startingPhase = this.findStartingPhase(phases);

      if (startingPhase) {
        // PLAYER LOG: Initial phase setup
        this.logPlayerEvent(`Starting phase: ${startingPhase}`, {
          segment: ctx.currentSegment,
        });

        // Record initialization event
        this.recordTransitionEvent({
          type: "initialization",
          from: { segment: ctx.currentSegment, phase: null, step: null },
          to: { segment: ctx.currentSegment, phase: startingPhase, step: null },
          reason: "Phase initialization for segment",
          timestamp: Date.now(),
        });

        // Find starting step for the phase
        let startingStep = null;
        const phaseConfig = phases[startingPhase];
        if (phaseConfig?.steps) {
          startingStep = this.findStartingStep(phaseConfig.steps);
        }

        currentState = {
          ...currentState,
          ctx: {
            ...currentState.ctx,
            currentPhase: startingPhase,
            currentStep: startingStep,
          },
        };
      }
    }

    return currentState;
  }

  /**
   * Process flow transitions including segments, phases, and steps
   * This handles both segment-based transitions (pre-game) and phase-based transitions (gameplay)
   */
  processFlowTransitions(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): CoreEngineState<G> {
    let currentState: CoreEngineState<G> = {
      ...state,
      G: fnContext.G,
      ctx: fnContext.ctx,
    };

    let hasTransitions = true;
    let maxIterations = 10; // Prevent infinite loops
    let transitionCount = 0;

    const startingState = {
      segment: currentState.ctx.currentSegment,
      phase: currentState.ctx.currentPhase,
      step: currentState.ctx.currentStep,
    };

    while (hasTransitions && maxIterations > 0) {
      const { ctx } = currentState;

      const prevState = JSON.stringify({
        segment: currentState.ctx.currentSegment,
        phase: currentState.ctx.currentPhase,
        step: currentState.ctx.currentStep,
      });

      hasTransitions = false;
      maxIterations--;
      transitionCount++;

      currentState = this.handleSegmentTransition(currentState, fnContext);

      const updatedFnContext = {
        ...fnContext,
        ctx: currentState.ctx,
        G: currentState.G,
      };

      currentState = this.handleStepTransition(currentState, updatedFnContext);

      const updatedFnContext2 = {
        ...fnContext,
        ctx: currentState.ctx,
        G: currentState.G,
      };

      currentState = this.handlePhaseTransition(
        currentState,
        updatedFnContext2,
      );

      const updatedFnContext3 = {
        ...fnContext,
        ctx: currentState.ctx,
        G: currentState.G,
      };

      currentState = this.handleSegmentPhaseInitialization(
        currentState,
        updatedFnContext3,
      );

      const newState = JSON.stringify({
        segment: currentState.ctx.currentSegment,
        phase: currentState.ctx.currentPhase,
        step: currentState.ctx.currentStep,
      });

      if (prevState !== newState) {
        hasTransitions = true;
      }
    }

    // ADVANCED PLAYER LOG: Summary of transition processing
    if (transitionCount > 1) {
      const finalState = {
        segment: currentState.ctx.currentSegment,
        phase: currentState.ctx.currentPhase,
        step: currentState.ctx.currentStep,
      };

      const stateChanged =
        JSON.stringify(startingState) !== JSON.stringify(finalState);

      if (stateChanged) {
        this.logAdvancedPlayerEvent("Flow transitions completed", {
          iterations: transitionCount,
          from: startingState,
          to: finalState,
        });
      }
    }

    // Warn if we hit the iteration limit
    if (maxIterations === 0) {
      logger.warn(
        "FlowManager: Maximum transition iterations reached - potential infinite loop detected",
      );
    }

    return currentState;
  }

  /**
   * Check if the current segment should end based on its endIf condition
   */
  private shouldEndSegment(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): boolean {
    const { ctx } = state;
    if (!ctx.currentSegment) {
      return false;
    }

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    if (!segmentConfig?.endIf) {
      return false;
    }

    const result = !!this.executeHook(segmentConfig.endIf, fnContext);

    // Record decision for telemetry
    this.recordDecisionEvent({
      type: "condition_evaluation",
      condition: "segment_end",
      result,
      context: `Segment: ${ctx.currentSegment}`,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Check if the current phase should end based on its endIf condition
   */
  private shouldEndPhase(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): boolean {
    const { ctx } = state;
    if (!(ctx.currentSegment && ctx.currentPhase)) {
      return false;
    }

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    if (!segmentConfig?.turn?.phases) {
      return false;
    }

    const phaseConfig = segmentConfig.turn.phases[ctx.currentPhase];

    // First check explicit endIf condition
    if (phaseConfig?.endIf) {
      const explicitEnd = this.executeHook(phaseConfig.endIf, fnContext);

      // Record decision for telemetry
      this.recordDecisionEvent({
        type: "condition_evaluation",
        condition: "phase_end",
        result: explicitEnd,
        context: `Segment: ${ctx.currentSegment}, Phase: ${ctx.currentPhase}`,
        timestamp: Date.now(),
      });

      if (explicitEnd) {
        return true;
      }
      if (explicitEnd === false) {
        return false;
      }
    }

    return false;
  }

  /**
   * Check if the current step should end based on its endIf condition
   */
  private shouldEndStep(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): boolean {
    const { ctx } = state;
    if (!(ctx.currentSegment && ctx.currentPhase && ctx.currentStep)) {
      return false;
    }
    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    const phaseConfig = segmentConfig?.turn?.phases?.[ctx.currentPhase];
    const stepConfig = phaseConfig?.steps?.[ctx.currentStep];
    if (!stepConfig?.endIf) {
      return false;
    }

    const result = !!this.executeHook(stepConfig.endIf, fnContext);

    // Record decision for telemetry
    this.recordDecisionEvent({
      type: "condition_evaluation",
      condition: "step_end",
      result,
      context: `Segment: ${ctx.currentSegment}, Phase: ${ctx.currentPhase}, Step: ${ctx.currentStep}`,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Get the next step in the current phase
   */
  private getNextStep(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): string | null {
    const { ctx } = state;
    if (!(ctx.currentSegment && ctx.currentPhase && ctx.currentStep)) {
      return null;
    }

    const stepConfig = this.getStepConfig(
      ctx.currentSegment,
      ctx.currentPhase,
      ctx.currentStep,
    );
    if (!stepConfig?.next) {
      return null;
    }

    let result: string | null = null;
    if (typeof stepConfig.next === "function") {
      result = stepConfig.next(fnContext) ?? null;
    } else {
      result = stepConfig.next;
    }

    // Record decision for telemetry
    this.recordDecisionEvent({
      type: "condition_evaluation",
      condition: "step_next",
      result,
      context: `Segment: ${ctx.currentSegment}, Phase: ${ctx.currentPhase}, Step: ${ctx.currentStep}`,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Get segment configuration from game definition
   */
  private getSegmentConfig(segmentName: string): SegmentConfig<G> | undefined {
    return this.gameDefinition.segments?.[segmentName];
  }

  /**
   * Get phase configuration from segment configuration
   */
  private getPhaseConfig(
    segmentName: string,
    phaseName: string,
  ): PhaseConfig<G> | undefined {
    const segmentConfig = this.getSegmentConfig(segmentName);
    return segmentConfig?.turn?.phases?.[phaseName];
  }

  /**
   * Get step configuration from phase configuration
   */
  private getStepConfig(
    segmentName: string,
    phaseName: string,
    stepName: string,
  ): StepConfig<G> | undefined {
    const phaseConfig = this.getPhaseConfig(segmentName, phaseName);
    return phaseConfig?.steps?.[stepName];
  }

  /**
   * Get the next segment in the game flow
   */
  private getNextSegment(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): string | null {
    const { ctx } = state;
    if (!ctx.currentSegment) return null;

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    if (!segmentConfig?.next) return null;

    if (typeof segmentConfig.next === "function") {
      try {
        return segmentConfig.next(fnContext) ?? null;
      } catch (error) {
        logger.error(`FlowManager: Error in segment next function: ${error}`);
        return null;
      }
    }

    return segmentConfig.next;
  }

  /**
   * Get telemetry data for analysis (public method for external access)
   */
  public getTelemetryData() {
    return {
      flowEvents: [...this.flowEvents],
      decisionEvents: [...this.decisionEvents],
      summary: {
        totalTransitions: this.flowEvents.length,
        totalDecisions: this.decisionEvents.length,
        lastEvent:
          this.flowEvents[this.flowEvents.length - 1]?.timestamp || null,
      },
    };
  }

  /**
   * Clear telemetry data (useful for testing or memory management)
   */
  public clearTelemetry(): void {
    this.flowEvents = [];
    this.decisionEvents = [];
  }
}
