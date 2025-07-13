import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { LogLevel } from "../../types/log-types";
import type { LogCollector } from "../../utils/log-collector";
import { CoreOperation } from "../engine/core-operation";
import type { CoreEngineState, GameDefinition } from "../game-configuration";
import {
  getCurrentPriorityPlayer,
  getCurrentTurnPlayer,
  hasPriorityPlayer,
  setPriorityPlayer,
} from "../state/context";
import type { PriorityModel } from "./priority-models";
import { createPriorityModel } from "./priority-models";

// Flow configuration types
export type FlowPhaseType = string;
export type FlowStepType = string;

export interface FlowStep {
  id: FlowStepType;
  name: string;
  description?: string;
  allowsPriorityPassing?: boolean;
  advancesTo?: "nextStep" | "nextPhase" | "nextTurn" | string;
  onBegin?: (gameState: any) => any;
  onEnd?: (gameState: any) => any;
}

export interface FlowPhase {
  id: FlowPhaseType;
  name: string;
  description?: string;
  steps?: FlowStep[];
  allowsPriorityPassing?: boolean;
  allowAnyPlayerToAct?: boolean;
  advancesTo?: "nextPhase" | "nextTurn" | string;
  onBegin?: (gameState: any) => any;
  onEnd?: (gameState: any) => any;
}

export interface FlowTurn {
  phases: FlowPhase[];
  onBegin?: (gameState: any) => any;
  onEnd?: (gameState: any) => any;
}

export interface FlowPriority {
  initialPriority: "turnPlayer" | string;
  allowPriorityPassing?: {
    [phaseId: string]: boolean;
  };
  stepPriorityPassing?: {
    [stepId: string]: boolean;
  };
  autoPriorityAdvance?: {
    [phaseOrStepId: string]: "nextStep" | "nextPhase" | "nextTurn" | false;
  };
  priorityModel?: "turn-based" | "apnap" | "focus-based" | "custom";
  customPriorityModel?: PriorityModel<any>;
}

export interface FlowConfiguration {
  turns: FlowTurn;
  priority: FlowPriority;
}

// Event context interface for game definitions
export interface FlowEventContext<_G = any> {
  passPriority(): void;
  passTurn(): void;
  endStep(): void;
  progressStep(targetStep?: string): void;
  endPhase(): void;
  progressPhase(targetPhase?: string): void;
}

/**
 * Unified Flow Manager that handles all game flow operations
 * Combines priority management, phase/step transitions, and event processing
 */
export class FlowManager<G = any> {
  private config: FlowConfiguration;
  private priorityModel: PriorityModel<G>;
  private gameDefinition: GameDefinition<G>;
  private engine: CoreEngine<any, any, any, any, any>;
  private logCollector: LogCollector;

  constructor(
    config: FlowConfiguration,
    gameDefinition: GameDefinition<G>,
    engine: CoreEngine<any, any, any, any, any>,
    logCollector: LogCollector,
  ) {
    this.config = config;
    this.gameDefinition = gameDefinition;
    this.priorityModel = createPriorityModel<G>(config);
    this.engine = engine;
    this.logCollector = logCollector;
  }

  // ===== PHASE & STEP MANAGEMENT =====

  getCurrentPhase(state: CoreEngineState<G>): FlowPhase | null {
    const phaseId = state.ctx.currentPhase;
    if (!phaseId) return null;
    return this.getPhaseById(phaseId);
  }

  getCurrentStep(state: CoreEngineState<G>): FlowStep | null {
    const phaseId = state.ctx.currentPhase;
    const stepId = state.ctx.currentStep;
    if (!(phaseId && stepId)) return null;

    const phase = this.getPhaseById(phaseId);
    if (!phase?.steps) return null;
    return phase.steps.find((step) => step.id === stepId) || null;
  }

  getPhaseById(phaseId: FlowPhaseType): FlowPhase | null {
    return (
      this.config.turns.phases.find((phase) => phase.id === phaseId) || null
    );
  }

  getStepById(phaseId: FlowPhaseType, stepId: FlowStepType): FlowStep | null {
    const phase = this.getPhaseById(phaseId);
    if (!phase?.steps) return null;
    return phase.steps.find((step) => step.id === stepId) || null;
  }

  getFirstPhase(): FlowPhaseType | null {
    const phases = this.config.turns.phases;
    if (!phases || phases.length === 0) return null;
    return phases[0].id;
  }

  getNextStepInPhase(state: CoreEngineState<G>): FlowStepType | null {
    const phase = this.getCurrentPhase(state);
    const currentStep = this.getCurrentStep(state);

    if (!phase?.steps || phase.steps.length === 0) return null;

    if (!currentStep) {
      return phase.steps[0]?.id || null;
    }

    const currentStepIndex = phase.steps.findIndex(
      (step) => step.id === currentStep.id,
    );
    if (currentStepIndex === -1 || currentStepIndex >= phase.steps.length - 1) {
      return null;
    }

    return phase.steps[currentStepIndex + 1].id;
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

    if (!phases || phases.length === 0) return null;

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

  isPriorityPassingAllowed(state: CoreEngineState<G>): boolean {
    const phase = this.getCurrentPhase(state);
    const step = this.getCurrentStep(state);

    // Check step-specific configuration first
    if (step) {
      if (typeof step.allowsPriorityPassing === "boolean") {
        return step.allowsPriorityPassing;
      }
      if (this.config.priority.stepPriorityPassing?.[step.id] !== undefined) {
        return !!this.config.priority.stepPriorityPassing[step.id];
      }
    }

    // Check phase-specific configuration
    if (phase) {
      if (typeof phase.allowsPriorityPassing === "boolean") {
        return phase.allowsPriorityPassing;
      }
      if (
        phase.id &&
        this.config.priority.allowPriorityPassing?.[phase.id] !== undefined
      ) {
        return !!this.config.priority.allowPriorityPassing[phase.id];
      }
    }

    return false;
  }

  getInitialPriorityPlayer(ctx: any): string {
    return this.priorityModel.getInitialPriority(ctx);
  }

  getNextPriorityPlayer(state: CoreEngineState<G>): string | null {
    return this.priorityModel.getNextPriority(state);
  }

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

    // Then check flow-based phases (for regular gameplay)
    const currentPhase = this.getCurrentPhase(state);
    if (currentPhase?.allowAnyPlayerToAct) {
      return true;
    }

    // Otherwise, check normal priority system
    return hasPriorityPlayer(state.ctx, playerID);
  }

  // ===== FLOW EVENTS =====

  passPriority(
    state: CoreEngineState<G>,
    playerID: string,
  ): CoreEngineState<G> {
    // Only the priority player can pass priority
    const priorityPlayer = getCurrentPriorityPlayer(state.ctx);
    if (priorityPlayer !== playerID) {
      return state;
    }

    // Check if priority passing is allowed in current state
    if (!this.isPriorityPassingAllowed(state)) {
      return state;
    }

    const nextPriorityPlayer = this.getNextPriorityPlayer(state);
    if (!nextPriorityPlayer) {
      return state;
    }

    const turnPlayer = getCurrentTurnPlayer(state.ctx);

    // If priority would return to the turn player, check for auto-advancement
    if (nextPriorityPlayer === turnPlayer) {
      const advancement = this.getAutomaticAdvancement(state);

      if (advancement.advancementType) {
        return this.processAdvancement(state, advancement);
      }
    }

    // Otherwise, just update priority
    const newCtx = setPriorityPlayer(state.ctx, nextPriorityPlayer);
    return { ...state, ctx: newCtx };
  }

  passTurn(state: CoreEngineState<G>, playerID: string): CoreEngineState<G> {
    // Only the priority player can pass the turn
    const priorityPlayer = getCurrentPriorityPlayer(state.ctx);
    if (priorityPlayer !== playerID) {
      return state;
    }

    // Calculate next turn player
    const nextTurnPlayerPos =
      (state.ctx.turnPlayerPos + 1) % state.ctx.playerOrder.length;

    // Create new context with updated turn and priority
    const newCtx = {
      ...state.ctx,
      turnPlayerPos: nextTurnPlayerPos,
      priorityPlayerPos: nextTurnPlayerPos, // Priority goes to new turn player
      numTurns: state.ctx.numTurns + 1,
      numTurnMoves: 0,
      // Reset to first phase
      currentPhase: this.getFirstPhase(),
      currentStep: undefined,
    };

    return { ...state, ctx: newCtx };
  }

  // ===== ADVANCEMENT LOGIC =====

  private getPriorityAdvancementType(
    state: CoreEngineState<G>,
  ): "nextStep" | "nextPhase" | "nextTurn" | false {
    const phase = this.getCurrentPhase(state);
    const step = this.getCurrentStep(state);

    // First check step-specific configuration
    if (step?.id) {
      if (step.advancesTo) {
        if (
          step.advancesTo === "nextStep" ||
          step.advancesTo === "nextPhase" ||
          step.advancesTo === "nextTurn"
        ) {
          return step.advancesTo;
        }
      }

      const stepAdvance = this.config.priority.autoPriorityAdvance?.[step.id];
      if (stepAdvance !== undefined) {
        return stepAdvance;
      }
    }

    // Then check phase-specific configuration
    if (phase?.id) {
      if (phase.advancesTo) {
        if (
          phase.advancesTo === "nextPhase" ||
          phase.advancesTo === "nextTurn"
        ) {
          return phase.advancesTo;
        }
      }

      const phaseAdvance = this.config.priority.autoPriorityAdvance?.[phase.id];
      if (phaseAdvance !== undefined) {
        return phaseAdvance;
      }
    }

    return false;
  }

  getAutomaticAdvancement(state: CoreEngineState<G>): {
    advancementType: "nextStep" | "nextPhase" | "nextTurn" | null;
    nextId?: string;
  } {
    const advanceType = this.getPriorityAdvancementType(state);

    switch (advanceType) {
      case "nextStep": {
        const nextStep = this.getNextStepInPhase(state);
        if (nextStep) {
          return {
            advancementType: "nextStep",
            nextId: nextStep,
          };
        }
        // If no next step, try advancing to next phase
        return this.getAutomaticAdvancement({
          ...state,
          ctx: {
            ...state.ctx,
            currentStep: undefined,
          },
        });
      }
      case "nextPhase": {
        const nextPhase = this.getNextPhase(state);
        if (nextPhase) {
          return {
            advancementType: "nextPhase",
            nextId: nextPhase,
          };
        }
        // If no next phase, advance to next turn
        return {
          advancementType: "nextTurn",
        };
      }
      case "nextTurn": {
        return {
          advancementType: "nextTurn",
        };
      }
      default: {
        return {
          advancementType: null,
        };
      }
    }
  }

  private processAdvancement(
    state: CoreEngineState<G>,
    advancement: {
      advancementType: "nextStep" | "nextPhase" | "nextTurn" | null;
      nextId?: string;
    },
  ): CoreEngineState<G> {
    switch (advancement.advancementType) {
      case "nextStep": {
        if (advancement.nextId) {
          return {
            ...state,
            ctx: {
              ...state.ctx,
              currentStep: advancement.nextId,
            },
          };
        }
        return state;
      }

      case "nextPhase": {
        if (advancement.nextId) {
          return {
            ...state,
            ctx: {
              ...state.ctx,
              currentPhase: advancement.nextId,
              currentStep: undefined, // Reset step when changing phases
            },
          };
        }
        return state;
      }

      case "nextTurn": {
        return this.passTurn(state, getCurrentPriorityPlayer(state.ctx) || "");
      }

      default: {
        return state;
      }
    }
  }

  // ===== MOVE VALIDATION =====

  createPriorityValidator<G>(): (
    moveFn: (
      params: { G: G; ctx: any; playerID?: string },
      ...args: any[]
    ) => G,
  ) => (params: { G: G; ctx: any; playerID?: string }, ...args: any[]) => G {
    return (moveFn) => {
      return ({ G, ctx, playerID, ...rest }, ...args) => {
        // If player doesn't have priority, return G unchanged
        if (playerID && !hasPriorityPlayer(ctx, playerID)) {
          return G;
        }

        // Otherwise, proceed with the move
        return moveFn({ G, ctx, playerID, ...rest }, ...args);
      };
    };
  }

  // ===== SEGMENT PROCESSING (for pre-game setup) =====

  /**
   * Process flow transitions including segments and phases
   * This handles both segment-based transitions (pre-game) and phase-based transitions (gameplay)
   */
  processFlowTransitions(state: CoreEngineState<G>): CoreEngineState<G> {
    let currentState = state;
    let hasTransitions = true;
    let maxIterations = 10; // Prevent infinite loops

    while (hasTransitions && maxIterations > 0) {
      hasTransitions = false;
      maxIterations--;

      const { ctx } = currentState;

      this.logCollector.log(
        LogLevel.DEVELOPER,
        `FlowManager: Processing transitions, iteration ${11 - maxIterations}`,
      );
      this.logCollector.log(
        LogLevel.DEVELOPER,
        `Current segment: ${ctx.currentSegment}, phase: ${ctx.currentPhase}`,
      );

      // Check if current segment should end
      if (ctx.currentSegment) {
        const shouldEndSegment = this.shouldEndSegment(currentState);

        if (shouldEndSegment) {
          this.logCollector.log(
            LogLevel.DEVELOPER,
            `FlowManager: Segment ${ctx.currentSegment} should end, advancing...`,
          );

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
                  logCollector: this.logCollector,
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
            hasTransitions = true;

            this.logCollector.log(
              LogLevel.DEVELOPER,
              `FlowManager: Advanced from segment ${ctx.currentSegment} to ${nextSegment}`,
            );
          }
        }
      }

      // Check if current phase should end (within segment or turn-based)
      if (ctx.currentPhase) {
        const shouldEndPhase = this.shouldEndPhase(currentState);

        if (shouldEndPhase) {
          this.logCollector.log(
            LogLevel.DEVELOPER,
            `FlowManager: Phase ${ctx.currentPhase} should end, advancing...`,
          );

          const nextPhase = this.getNextPhase(currentState);

          if (nextPhase && nextPhase !== ctx.currentPhase) {
            // Apply phase onBegin hook before changing phase
            const phaseConfig = this.getPhaseConfig(
              ctx.currentSegment,
              nextPhase,
            );
            let newG = currentState.G;

            if (phaseConfig?.onBegin) {
              const result = phaseConfig.onBegin({
                G: currentState.G,
                ctx: currentState.ctx,
                coreOps: new CoreOperation({
                  state: currentState,
                  engine: this.engine,
                  logCollector: this.logCollector,
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
            hasTransitions = true;

            this.logCollector.log(
              LogLevel.DEVELOPER,
              `FlowManager: Advanced from phase ${ctx.currentPhase} to ${nextPhase}`,
            );
          }
        }
      }

      // Handle case where we have a segment but no phase (initialize starting phase)
      if (ctx.currentSegment && !ctx.currentPhase) {
        const segmentConfig = this.getSegmentConfig(ctx.currentSegment);

        if (segmentConfig?.turn?.phases) {
          const phases = segmentConfig.turn.phases;
          const startingPhase = Object.keys(phases).find(
            (phaseId) => phases[phaseId]?.start === true,
          );

          if (startingPhase) {
            this.logCollector.log(
              LogLevel.DEVELOPER,
              `FlowManager: Initializing starting phase ${startingPhase} for segment ${ctx.currentSegment}`,
            );

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
            hasTransitions = true;
          }
        }
      }
    }

    return currentState;
  }

  /**
   * Check if the current segment should end based on its endIf condition
   */
  private shouldEndSegment(state: CoreEngineState<G>): boolean {
    const { ctx } = state;
    if (!ctx.currentSegment) return false;

    const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
    if (!segmentConfig?.endIf) return false;

    return segmentConfig.endIf(state) ?? false;
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

    return phaseConfig.endIf(state) ?? false;
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
  private getSegmentConfig(segmentName: string): any {
    return this.gameDefinition.segments?.[segmentName];
  }

  /**
   * Get phase configuration from segment configuration
   */
  private getPhaseConfig(segmentName: string, phaseName: string): any {
    const segmentConfig = this.getSegmentConfig(segmentName);
    return segmentConfig?.turn?.phases?.[phaseName];
  }

  // ===== INITIALIZATION =====

  initializeFlow(state: CoreEngineState<G>): CoreEngineState<G> {
    // Handle invalid state or context
    if (!state?.ctx) {
      return state;
    }

    // Set initial priority if priorityPlayerPos is 0
    if (state.ctx.priorityPlayerPos === 0) {
      const initialPriorityPlayer = this.getInitialPriorityPlayer(state.ctx);
      const newCtx = setPriorityPlayer(state.ctx, initialPriorityPlayer);
      state = {
        ...state,
        ctx: newCtx,
      };
    }

    // Set initial phase if not already set
    if (!state.ctx.currentPhase && this.config.turns.phases.length) {
      const firstPhase = this.config.turns.phases[0];
      state = {
        ...state,
        ctx: {
          ...state.ctx,
          currentPhase: firstPhase.id,
        },
      };

      // Set initial step if phase has steps
      if (firstPhase.steps?.length) {
        state = {
          ...state,
          ctx: {
            ...state.ctx,
            currentStep: firstPhase.steps[0].id,
          },
        };
      }
    }

    return state;
  }
}

// ===== FACTORY FUNCTIONS =====

export function createFlowConfiguration(
  config: FlowConfiguration,
): FlowConfiguration {
  return config;
}

export function createFlowManager<G = any>(
  gameDefinition: GameDefinition<G>,
  engine: CoreEngine<any, any, any, any, any>,
  logCollector: LogCollector,
): FlowManager<G> {
  const config = createFlowConfiguration(
    gameDefinition.flow ?? createDefaultFlowConfiguration(),
  );
  return new FlowManager<G>(config, gameDefinition, engine, logCollector);
}

export function createDefaultFlowConfiguration(): FlowConfiguration {
  return createFlowConfiguration({
    turns: {
      phases: [
        {
          id: "main",
          name: "Main Phase",
          allowsPriorityPassing: true,
        },
      ],
    },
    priority: {
      initialPriority: "turnPlayer",
      allowPriorityPassing: {
        main: true,
      },
      autoPriorityAdvance: {
        main: "nextTurn",
      },
    },
  });
}

export function initializeFlow<G = any>(
  state: CoreEngineState<G>,
  gameDefinition: GameDefinition<G>,
  engine: CoreEngine<any, any, any, any, any>,
  logCollector: LogCollector,
): CoreEngineState<G> {
  const flowManager = createFlowManager<G>(
    gameDefinition,
    engine,
    logCollector,
  );
  return flowManager.initializeFlow(state);
}

// ===== UTILITY FUNCTIONS =====

export function validatePlayerHasPriority(
  state: CoreEngineState,
  playerID: string,
): boolean {
  return hasPriorityPlayer(state.ctx, playerID);
}

export function withPriorityCheck<G>(
  moveFn: (params: { G: G; ctx: any; playerID?: string }, ...args: any[]) => G,
): (params: { G: G; ctx: any; playerID?: string }, ...args: any[]) => G {
  return ({ G, ctx, playerID, ...rest }, ...args) => {
    // If player doesn't have priority, return G unchanged
    if (playerID && !hasPriorityPlayer(ctx, playerID)) {
      return G;
    }

    // Otherwise, proceed with the move
    return moveFn({ G, ctx, playerID, ...rest }, ...args);
  };
}

export function getNextPlayerInTurnOrder<G>(
  state: CoreEngineState<G>,
): string | null {
  const ctx = state.ctx;
  const priorityPlayer = getCurrentPriorityPlayer(ctx);
  if (!priorityPlayer) return null;

  const playerOrder = ctx.playerOrder;
  if (!playerOrder || playerOrder.length === 0) return null;
  // For single player games, priority stays with the same player
  if (playerOrder.length === 1) return playerOrder[0];

  const playerIdx = playerOrder.indexOf(priorityPlayer);
  if (playerIdx === -1) return null;

  const nextPlayerIdx = (playerIdx + 1) % playerOrder.length;
  return playerOrder[nextPlayerIdx];
}
