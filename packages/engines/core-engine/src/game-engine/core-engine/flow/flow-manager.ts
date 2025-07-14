import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import type { PhaseConfig } from "~/game-engine/core-engine/game/structure/phase";
import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import { CoreOperation } from "../engine/core-operation";
import type {
  CoreEngineState,
  FlowConfiguration,
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
export class FlowManager<G> {
  private config: FlowConfiguration<G>;
  private gameDefinition: GameDefinition<G>;
  private readonly engine: CoreEngine<G>;

  constructor(gameDefinition: GameDefinition<G>, engine: CoreEngine<G>) {
    this.config = gameDefinition.flow;
    this.gameDefinition = gameDefinition;
    this.engine = engine;
  }

  getCurrentPhase(state: CoreEngineState<G>): FlowPhase<G> | null {
    const phaseId = state.ctx.currentPhase;
    if (!phaseId) {
      return null;
    }

    return this.getPhaseById(phaseId);
  }

  getPhaseById(phaseId: FlowPhaseType): FlowPhase<G> | null {
    return (
      this.config.turns.phases.find((phase) => phase.id === phaseId) || null
    );
  }

  getNextPhase(state: CoreEngineState<G>): FlowPhaseType | null {
    const { ctx } = state;

    // First check segment-based phases (for pre-game setup)
    if (ctx.currentSegment && ctx.currentPhase) {
      const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
      if (segmentConfig?.turn?.phases) {
        const phaseConfig = segmentConfig.turn.phases[ctx.currentPhase];
        let nextPhase = phaseConfig?.next ?? null;

        // If next is a function, call it to get the actual next phase name
        if (typeof nextPhase === "function") {
          nextPhase = nextPhase(state);
        }

        if (nextPhase) {
          return nextPhase;
        }
      }
    }

    // Fallback to flow configuration phases (for turn-based gameplay)
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
    const { ctx } = state;

    // First check segment-based phases (for pre-game setup)
    if (ctx.currentSegment && ctx.currentPhase) {
      const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
      if (segmentConfig?.turn?.phases) {
        const phaseConfig = segmentConfig.turn.phases[ctx.currentPhase];
        if (phaseConfig?.allowAnyPlayerToAct) {
          return true;
        }
      }
    }

    // Otherwise, check normal priority system
    return hasPriorityPlayer(state.ctx, playerID);
  }

  executeHook(
    hook:
      | ((context: FnContext<G>) => undefined | G)
      | ((context: FnContext<G>) => boolean | undefined),
    ctx: FnContext<G>,
  ) {
    if (typeof hook !== "function" || !hook || !ctx) {
      return undefined;
    }

    return hook(ctx);
  }

  /**
   * Handles segment ending and advancing to the next segment if needed.
   */
  private handleSegmentTransition(
    state: CoreEngineState<G>,
  ): CoreEngineState<G> {
    let currentState = { ...state };
    const { ctx } = currentState;
    if (!ctx.currentSegment) {
      return currentState;
    }

    const shouldEndSegment = this.shouldEndSegment(currentState);

    if (shouldEndSegment) {
      if (debuggers.flowTransitions) {
        logger.debug(
          `FlowManager: Segment ${ctx.currentSegment} should end, advancing...`,
        );
      }

      const nextSegment = this.getNextSegment(currentState);
      if (nextSegment && nextSegment !== ctx.currentSegment) {
        // Apply segment end hooks
        const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
        if (segmentConfig?.onEnd) {
          const newG = segmentConfig.onEnd({
            G: currentState.G,
            ctx: currentState.ctx,
            coreOps: new CoreOperation({
              state: currentState,
              engine: this.engine,
            }),
          });

          if (newG !== undefined) {
            currentState = {
              ...currentState,
              G: newG,
            };
          }
        }

        // Get the starting phase for the new segment
        const newSegmentConfig = this.getSegmentConfig(nextSegment);
        let startingPhase = null;
        let startingStep = null;

        // Find the phase marked with start: true
        if (newSegmentConfig?.turn?.phases) {
          const phases = newSegmentConfig.turn.phases;
          startingPhase =
            Object.keys(phases).find(
              (phaseId) => phases[phaseId]?.start === true,
            ) || null;

          // Find starting step for the starting phase
          if (startingPhase) {
            const phaseConfig = phases[startingPhase];
            if (phaseConfig?.steps) {
              for (const stepName in phaseConfig.steps) {
                if (phaseConfig.steps[stepName].start) {
                  startingStep = stepName;
                  break;
                }
              }
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
      }
    }

    return currentState;
  }

  /**
   * Handles phase ending and advancing to the next phase if needed.
   */
  private handlePhaseTransition(state: CoreEngineState<G>): CoreEngineState<G> {
    let currentState = state;
    const { ctx } = currentState;
    if (!ctx.currentPhase) {
      return currentState;
    }
    const shouldEndPhase = this.shouldEndPhase(currentState);

    if (shouldEndPhase) {
      if (debuggers.flowTransitions) {
        logger.debug(
          `FlowManager: Phase ${ctx.currentPhase} should end, advancing...`,
        );
      }

      const nextPhase = this.getNextPhase(currentState);

      if (nextPhase && nextPhase !== ctx.currentPhase) {
        // Apply phase onBegin hook before changing phase
        const phaseConfig = this.getPhaseConfig(ctx.currentSegment, nextPhase);
        let newG = currentState.G;

        if (phaseConfig?.onBegin) {
          const result = phaseConfig.onBegin({
            G: currentState.G,
            ctx: currentState.ctx,
            coreOps: new CoreOperation({
              state: currentState,
              engine: this.engine,
            }),
          });
          if (result !== undefined) {
            newG = result;
          }
        }

        currentState = {
          ...currentState,
          G: newG,
          ctx: {
            ...currentState.ctx,
            currentPhase: nextPhase,
          },
        };
      }
    }

    return currentState;
  }

  /**
   * Handles initializing the starting phase and step for a segment if there is a segment but no phase.
   */
  private handleSegmentPhaseInitialization(
    state: CoreEngineState<G>,
  ): CoreEngineState<G> {
    let currentState = state;
    const { ctx } = currentState;
    if (!(ctx.currentSegment && !ctx.currentPhase)) {
      return currentState;
    }
    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);

    if (segmentConfig?.turn?.phases) {
      const phases = segmentConfig.turn.phases;
      const startingPhase = Object.keys(phases).find(
        (phaseId) => phases[phaseId]?.start === true,
      );

      if (startingPhase) {
        if (debuggers.flowTransitions) {
          logger.debug(
            `FlowManager: Initializing starting phase ${startingPhase} for segment ${ctx.currentSegment}`,
          );
        }

        // Find starting step for the phase
        let startingStep = null;
        const phaseConfig = phases[startingPhase];
        if (phaseConfig?.steps) {
          for (const stepName in phaseConfig.steps) {
            if (phaseConfig.steps[stepName].start) {
              startingStep = stepName;
              break;
            }
          }
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
   * Process flow transitions including segments and phases
   * This handles both segment-based transitions (pre-game) and phase-based transitions (gameplay)
   */
  processFlowTransitions(
    state: CoreEngineState<G>,
    // This ensures we always have the latest FnContext, even if the state changes during processing
    getUpdatedFnContext: () => FnContext<G>,
  ): CoreEngineState<G> {
    const fnContext = getUpdatedFnContext();
    let currentState: CoreEngineState<G> = {
      ...state,
      G: fnContext.G,
      ctx: fnContext.ctx,
    };

    let hasTransitions = true;
    let maxIterations = 10; // Prevent infinite loops

    while (hasTransitions && maxIterations > 0) {
      hasTransitions = false;
      maxIterations--;

      const { ctx } = currentState;

      if (debuggers.flowTransitions) {
        logger.debug(
          `FlowManager: Processing transitions, iteration ${11 - maxIterations}`,
        );
        logger.debug(
          `Current segment: ${ctx.currentSegment}, phase: ${ctx.currentPhase}`,
        );
      }

      currentState = this.handleSegmentTransition(currentState);

      // Check if current phase should end (within segment or turn-based)
      currentState = this.handlePhaseTransition(currentState);

      // Handle case where we have a segment but no phase (initialize starting phase)
      currentState = this.handleSegmentPhaseInitialization(currentState);
    }

    return currentState;
  }

  /**
   * Check if the current segment should end based on its endIf condition
   */
  private shouldEndSegment(state: CoreEngineState<G>): boolean {
    const { ctx } = state;
    if (!ctx.currentSegment) {
      return false;
    }

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    if (!segmentConfig?.endIf) {
      return false;
    }

    return !!this.executeHook(segmentConfig.endIf, state);
  }

  /**
   * Check if the current phase should end based on its endIf condition
   */
  private shouldEndPhase(state: CoreEngineState<G>): boolean {
    const { ctx } = state;
    if (!(ctx.currentSegment && ctx.currentPhase)) {
      return false;
    }

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    if (!segmentConfig?.turn?.phases) {
      return false;
    }

    const phaseConfig = segmentConfig.turn.phases[ctx.currentPhase];
    if (!phaseConfig?.endIf) {
      return false;
    }

    return !!this.executeHook(phaseConfig.endIf, state);
  }

  /**
   * Get the next segment in the game flow
   */
  private getNextSegment(state: CoreEngineState<G>): string | null {
    const { ctx } = state;
    if (!ctx.currentSegment) return null;

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    if (!segmentConfig?.next) return null;

    if (typeof segmentConfig.next === "function") {
      return segmentConfig.next(state) ?? null;
    }

    return segmentConfig.next;
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
}
