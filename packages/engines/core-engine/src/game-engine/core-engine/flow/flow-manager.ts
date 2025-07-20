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

  constructor(
    gameDefinition: GameDefinition<G>,
    cards: GameCards,
    players?: string[],
  ) {
    this.config = gameDefinition.flow || { turns: { phases: [] } };
    this.gameDefinition = gameDefinition;

    // Initialize move maps and flow data (previously Flow function logic)
    this.initializeMoveResolution(cards, players);
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
      logger.debug(
        `FlowManager: executeHook - hook is ${typeof hook}, ctx is ${!!ctx}`,
      );
      return undefined;
    }

    logger.debug(
      `FlowManager: executeHook - calling hook with G=${!!ctx.G}, coreOps=${!!ctx.coreOps}`,
    );
    const result = hook(ctx);
    logger.debug(
      `FlowManager: executeHook - hook returned ${result !== undefined ? "defined result" : "undefined"}`,
    );
    return result;
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
      if (debuggers.flowTransitions) {
        logger.debug(
          `FlowManager: Segment ${ctx.currentSegment} should end, advancing...`,
        );
      }

      const nextSegment = this.getNextSegment(currentState, fnContext);
      if (nextSegment && nextSegment !== ctx.currentSegment) {
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
            currentPhase: startingPhase, // Set starting phase for new segment
            currentStep: startingStep, // Set starting step for new phase
          },
        };

        // CRITICAL FIX: Call onBegin hook for the new segment
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

    logger.debug(
      `FlowManager: handlePhaseTransition - checking if phase ${ctx.currentPhase} should end (step: ${ctx.currentStep})`,
    );
    const shouldEndPhase = this.shouldEndPhase(currentState, fnContext);

    if (shouldEndPhase) {
      if (debuggers.flowTransitions) {
        logger.debug(
          `FlowManager: Phase ${ctx.currentPhase} should end, advancing...`,
        );
      }

      const nextPhase = this.getNextPhase(currentState, fnContext);

      if (nextPhase && nextPhase !== ctx.currentPhase) {
        logger.debug(
          `FlowManager: Advancing from phase ${ctx.currentPhase} to ${nextPhase}`,
        );

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
            currentStep: null, // Reset step when changing phase
            // Reset per-turn move counters when transitioning back to mainPhase
            // Note: numTurns increment is handled in phase transition, not here
            ...(nextPhase === "mainPhase" && ctx.currentPhase !== "mainPhase"
              ? { numTurnMoves: 0 }
              : {}),
          },
        };
      } else {
        logger.debug(
          `FlowManager: Phase ${ctx.currentPhase} should end but no next phase found or same phase`,
        );
      }
    } else {
      logger.debug(`FlowManager: Phase ${ctx.currentPhase} should NOT end`);
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
      logger.debug(
        `FlowManager: No current step in phase ${ctx.currentPhase}, checking if we should initialize a starting step`,
      );
      return currentState;
    }

    const shouldEndStep = this.shouldEndStep(currentState, fnContext);
    logger.debug(
      `FlowManager: Step ${ctx.currentStep} should end: ${shouldEndStep}`,
    );

    if (shouldEndStep) {
      logger.debug(
        `FlowManager: Step ${ctx.currentStep} should end, advancing...`,
      );

      const nextStep = this.getNextStep(currentState, fnContext);
      if (nextStep && nextStep !== ctx.currentStep) {
        logger.debug(`FlowManager: Advancing to step ${nextStep}`);

        currentState = {
          ...currentState,
          ctx: {
            ...currentState.ctx,
            currentStep: nextStep,
          },
        };

        // Apply step onBegin hook AFTER changing step so ctx is updated
        const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
        const phaseConfig = segmentConfig?.turn?.phases?.[ctx.currentPhase];
        const stepConfig = phaseConfig?.steps?.[nextStep];

        logger.debug(
          `FlowManager: Executing onBegin hook for step ${nextStep}`,
        );

        // Create updated fnContext with new step
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
            logger.debug(
              `FlowManager: Step ${nextStep} onBegin hook returned result, updating G`,
            );
            currentState = {
              ...currentState,
              G: result,
            };
          } else {
            logger.debug(
              `FlowManager: Step ${nextStep} onBegin hook returned undefined`,
            );
          }
        } catch (error) {
          logger.error(
            `FlowManager: Error executing onBegin hook for step ${nextStep}: ${error}`,
          );
        }
      } else {
        logger.debug(
          "FlowManager: No next step found - all steps complete, triggering phase transition",
        );

        // When no next step exists, all steps are complete
        // Set currentStep to null and check if phase should end
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

        const shouldEndPhase = this.shouldEndPhase(
          currentState,
          updatedFnContext,
        );
        const phaseConfig = this.getPhaseConfig(
          ctx.currentSegment,
          ctx.currentPhase,
        );

        // If phase has a next, it should end after step completion
        if (phaseConfig?.next) {
          logger.debug(
            `FlowManager: Phase ${ctx.currentPhase} should end after step completion`,
          );

          const nextPhase = this.getNextPhase(currentState, updatedFnContext);
          if (nextPhase && nextPhase !== ctx.currentPhase) {
            logger.debug(
              `FlowManager: Immediately transitioning from ${ctx.currentPhase} to ${nextPhase}`,
            );

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
                // Only increment numTurns when completing a full turn cycle from beginningPhase
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

    // Handle case where we have a phase but no step (e.g., after phase transition or step completion)
    if (ctx.currentSegment && ctx.currentPhase && !ctx.currentStep) {
      logger.debug(
        `FlowManager: Phase ${ctx.currentPhase} has no step, checking for starting step`,
      );
      const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
      const phaseConfig = segmentConfig?.turn?.phases?.[ctx.currentPhase];

      if (phaseConfig?.steps) {
        // Check if phase should end instead of reinitializing steps
        // Evaluate the actual next value and endIf condition
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

        // Phase should stay complete (null step) if:
        // 1. No next phase to transition to, AND
        // 2. Phase doesn't explicitly want to continue (endIf returns false/undefined)
        const shouldPhaseEnd = !(nextPhase || shouldExplicitlyEnd);

        if (shouldPhaseEnd) {
          logger.debug(
            `FlowManager: Phase ${ctx.currentPhase} has no next phase and doesn't want to continue - keeping currentStep as null (phase complete)`,
          );
          return currentState;
        }

        // Allow step initialization only for phases that should continue
        const startingStep = this.findStartingStep(phaseConfig.steps);
        if (startingStep) {
          logger.debug(
            `FlowManager: Initializing starting step ${startingStep} for phase ${ctx.currentPhase}`,
          );

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
            // Create updated fnContext with new step
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
        logger.debug(
          `FlowManager: Initializing starting phase ${startingPhase} for segment ${ctx.currentSegment}`,
        );

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

    while (hasTransitions && maxIterations > 0) {
      const { ctx } = currentState; // Get updated context each iteration

      const prevState = JSON.stringify({
        segment: currentState.ctx.currentSegment,
        phase: currentState.ctx.currentPhase,
        step: currentState.ctx.currentStep,
      });

      hasTransitions = false;
      maxIterations--;

      if (debuggers.flowTransitions) {
        logger.debug(
          `FlowManager: Processing transitions, iteration ${11 - maxIterations}`,
        );
        logger.debug(
          `Current segment: ${ctx.currentSegment}, phase: ${ctx.currentPhase}, step: ${ctx.currentStep}`,
        );
      }

      currentState = this.handleSegmentTransition(currentState, fnContext);

      // Update fnContext to reflect segment changes
      const updatedFnContext = {
        ...fnContext,
        ctx: currentState.ctx,
        G: currentState.G,
      };

      // CRITICAL CHANGE: Handle step transitions BEFORE phase transitions
      // This ensures step completion can trigger phase advancement in the same iteration
      currentState = this.handleStepTransition(currentState, updatedFnContext);

      // Update fnContext again to reflect step changes
      const updatedFnContext2 = {
        ...fnContext,
        ctx: currentState.ctx,
        G: currentState.G,
      };

      currentState = this.handlePhaseTransition(
        currentState,
        updatedFnContext2,
      );

      // Update fnContext one more time to reflect phase changes
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
        logger.debug(
          `FlowManager: State changed from ${prevState} to ${newState}, continuing transitions`,
        );
      } else {
        logger.debug("FlowManager: No state change, stopping transitions");
      }
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

    return !!this.executeHook(segmentConfig.endIf, fnContext);
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
      if (explicitEnd) {
        return true;
      }
      // If explicit endIf returns false, don't override with step completion logic
      if (explicitEnd === false) {
        return false;
      }
      // If explicitEnd is undefined/null, continue to check step completion
    }

    // Phase should only auto-end based on explicit endIf conditions
    // Step completion handling is done at the step transition level

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
    return !!this.executeHook(stepConfig.endIf, fnContext);
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

    if (typeof stepConfig.next === "function") {
      return stepConfig.next(fnContext) ?? null;
    }

    return stepConfig.next;
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
   * Check if a phase should end after all its steps are complete.
   * This prevents infinite loops by detecting step completion.
   */
  private shouldEndPhaseAfterStepCompletion(
    state: CoreEngineState<G>,
    fnContext: FnContext<G>,
  ): boolean {
    const { ctx } = state;
    if (!(ctx.currentSegment && ctx.currentPhase)) {
      return false;
    }

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    const phaseConfig = segmentConfig?.turn?.phases?.[ctx.currentPhase];

    // If phase has steps, check if we just completed the last step
    if (phaseConfig?.steps && ctx.currentStep) {
      // We're here because getNextStep returned null for currentStep
      // This means all steps are complete, so phase should end
      logger.debug(
        `FlowManager: Phase ${ctx.currentPhase} has steps and current step ${ctx.currentStep} has no next - steps complete`,
      );

      // Check if phase has an explicit endIf that might override step completion
      if (phaseConfig.endIf) {
        // Create updated fnContext with current state
        const updatedFnContext = {
          ...fnContext,
          ctx: state.ctx,
        };
        const explicitEnd = this.executeHook(
          phaseConfig.endIf,
          updatedFnContext,
        );
        logger.debug(
          `FlowManager: Phase ${ctx.currentPhase} explicit endIf returned: ${explicitEnd}`,
        );
        // If explicit endIf returns true, definitely end. If false/undefined, still end because steps are complete
        return explicitEnd !== false;
      }

      // No explicit endIf, and steps are complete, so end the phase
      return true;
    }

    // Phase has no steps or no current step - check explicit endIf only
    if (phaseConfig?.endIf) {
      // Create updated fnContext with current state
      const updatedFnContext = {
        ...fnContext,
        ctx: state.ctx,
      };
      const explicitEnd = this.executeHook(phaseConfig.endIf, updatedFnContext);
      logger.debug(
        `FlowManager: Phase ${ctx.currentPhase} explicit endIf returned: ${explicitEnd}`,
      );
      return !!explicitEnd;
    }

    // Default: don't end phase
    return false;
  }
}
