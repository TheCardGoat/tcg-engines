import { processSegments } from "~/game-engine/core-engine/game/structure/segment";
import { hasPriorityPlayer } from "../state/context";
import { debuggers, logger } from "../utils/logger";
/**
 * Unified Flow Manager that handles all game flow operations
 * All transitions, phases, segments, and player actions are managed here
 * When called externally, it processes the current state and applies any necessary transitions and hooks
 */
export class FlowManager {
    config;
    gameDefinition;
    // Move resolution properties (previously from Flow function)
    moveMap = {};
    moveNames = [];
    startingSegment = null;
    initialPhase = null;
    initialStep = null;
    constructor(gameDefinition, cards, players) {
        this.config = gameDefinition.flow;
        this.gameDefinition = gameDefinition;
        // Initialize move maps and flow data (previously Flow function logic)
        this.initializeMoveResolution(cards, players);
    }
    /**
     * Initialize move resolution system (consolidates Flow function logic)
     */
    initializeMoveResolution(cards, players) {
        const { segments } = this.gameDefinition;
        const segmentsMap = { ...segments };
        const moveNames = new Set();
        // Add top-level moves
        if (this.gameDefinition.moves) {
            for (const name of Object.keys(this.gameDefinition.moves)) {
                this.moveMap[name] = this.gameDefinition.moves[name];
                moveNames.add(name);
            }
        }
        // Process segments and extract moves
        const { startingSegment, segmentMoveNames, segmentMoveMap } = processSegments(segmentsMap);
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
        this.startingSegment = startingSegment;
        this.moveNames = [...moveNames.values()];
        // Determine initial phase and step
        this.determineInitialFlow(startingSegment, segments);
    }
    /**
     * Determine initial phase and step from starting segment
     */
    determineInitialFlow(startingSegment, segments) {
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
        this.initialPhase = initialPhase;
        this.initialStep = initialStep;
    }
    /**
     * Get move function by name (replaces Flow.getMove)
     */
    getMove(ctx, name, playerID) {
        return this.moveMap[name] || null;
    }
    getCurrentPhase(state) {
        const phaseId = state.ctx.currentPhase;
        if (!phaseId) {
            return null;
        }
        return this.getPhaseById(phaseId);
    }
    getPhaseById(phaseId) {
        return (this.config.turns.phases.find((phase) => phase.id === phaseId) || null);
    }
    getNextPhase(state, fnContext) {
        const { ctx } = state;
        // First check segment-based phases (for pre-game setup)
        if (ctx.currentSegment && ctx.currentPhase) {
            const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
            if (segmentConfig?.turn?.phases) {
                const phaseConfig = segmentConfig.turn.phases[ctx.currentPhase];
                let nextPhase = phaseConfig?.next ?? null;
                // If next is a function, call it to get the actual next phase name
                if (typeof nextPhase === "function") {
                    nextPhase = nextPhase(fnContext);
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
        const currentPhaseIndex = phases.findIndex((phase) => phase.id === currentPhase.id);
        if (currentPhaseIndex === -1 || currentPhaseIndex >= phases.length - 1) {
            return null;
        }
        return phases[currentPhaseIndex + 1].id;
    }
    // ===== PRIORITY MANAGEMENT =====
    canPlayerAct(state, playerID) {
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
    executeHook(hook, ctx) {
        if (typeof hook !== "function" || !ctx) {
            return undefined;
        }
        return hook(ctx);
    }
    /**
     * Find the starting phase (marked with start: true) in a phases object.
     */
    findStartingPhase(phases) {
        return (Object.keys(phases).find((phaseId) => phases[phaseId]?.start === true) ||
            null);
    }
    /**
     * Find the starting step (marked with start: true) in a steps object.
     */
    findStartingStep(steps) {
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
    handleSegmentTransition(state, fnContext) {
        let currentState = { ...state };
        const { ctx } = currentState;
        if (!ctx.currentSegment) {
            logger.error("FlowManager: No current segment defined.");
            return currentState;
        }
        const shouldEndSegment = this.shouldEndSegment(currentState, fnContext);
        if (shouldEndSegment) {
            if (debuggers.flowTransitions) {
                logger.debug(`FlowManager: Segment ${ctx.currentSegment} should end, advancing...`);
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
            }
        }
        return currentState;
    }
    /**
     * Handles phase ending and advancing to the next phase if needed.
     */
    handlePhaseTransition(state, fnContext) {
        let currentState = { ...state };
        const { ctx } = currentState;
        if (!ctx.currentPhase) {
            return currentState;
        }
        const shouldEndPhase = this.shouldEndPhase(currentState, fnContext);
        if (shouldEndPhase) {
            if (debuggers.flowTransitions) {
                logger.debug(`FlowManager: Phase ${ctx.currentPhase} should end, advancing...`);
            }
            const nextPhase = this.getNextPhase(currentState, fnContext);
            if (nextPhase && nextPhase !== ctx.currentPhase) {
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
                        currentTurn: state.ctx.currentTurn,
                        currentStep: null, // Reset step when changing phase
                    },
                };
            }
        }
        return currentState;
    }
    /**
     * Handles initializing the starting phase and step for a segment if there is a segment but no phase.
     */
    handleSegmentPhaseInitialization(state) {
        let currentState = { ...state };
        const { ctx } = currentState;
        if (!(ctx.currentSegment && !ctx.currentPhase)) {
            return currentState;
        }
        const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
        if (segmentConfig?.turn?.phases) {
            const phases = segmentConfig.turn.phases;
            const startingPhase = this.findStartingPhase(phases);
            if (startingPhase) {
                if (debuggers.flowTransitions) {
                    logger.debug(`FlowManager: Initializing starting phase ${startingPhase} for segment ${ctx.currentSegment}`);
                }
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
     * Process flow transitions including segments and phases
     * This handles both segment-based transitions (pre-game) and phase-based transitions (gameplay)
     */
    processFlowTransitions(state, fnContext) {
        let currentState = {
            ...state,
            G: fnContext.G,
            ctx: fnContext.ctx,
        };
        const { ctx } = currentState;
        let hasTransitions = true;
        let maxIterations = 10; // Prevent infinite loops
        while (hasTransitions && maxIterations > 0) {
            hasTransitions = false;
            maxIterations--;
            if (debuggers.flowTransitions) {
                logger.debug(`FlowManager: Processing transitions, iteration ${11 - maxIterations}`);
                logger.debug(`Current segment: ${ctx.currentSegment}, phase: ${ctx.currentPhase}`);
            }
            currentState = this.handleSegmentTransition(currentState, fnContext);
            currentState = this.handlePhaseTransition(currentState, fnContext);
            currentState = this.handleSegmentPhaseInitialization(currentState);
        }
        return currentState;
    }
    /**
     * Check if the current segment should end based on its endIf condition
     */
    shouldEndSegment(state, fnContext) {
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
    shouldEndPhase(state, fnContext) {
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
        return !!this.executeHook(phaseConfig.endIf, fnContext);
    }
    /**
     * Get the next segment in the game flow
     */
    getNextSegment(state, fnContext) {
        const { ctx } = state;
        if (!ctx.currentSegment)
            return null;
        const segmentConfig = this.getSegmentConfig(ctx.currentSegment);
        if (!segmentConfig?.next)
            return null;
        if (typeof segmentConfig.next === "function") {
            return segmentConfig.next(fnContext) ?? null;
        }
        return segmentConfig.next;
    }
    /**
     * Get segment configuration from game definition
     */
    getSegmentConfig(segmentName) {
        return this.gameDefinition.segments?.[segmentName];
    }
    /**
     * Get phase configuration from segment configuration
     */
    getPhaseConfig(segmentName, phaseName) {
        const segmentConfig = this.getSegmentConfig(segmentName);
        return segmentConfig?.turn?.phases?.[phaseName];
    }
}
//# sourceMappingURL=flow-manager.js.map