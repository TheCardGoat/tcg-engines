import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { CoreEngineState, FlowInterface, FlowPhase, FlowPhaseType, FnContext, GameDefinition } from "../game-configuration";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";
/**
 * Unified Flow Manager that handles all game flow operations
 * All transitions, phases, segments, and player actions are managed here
 * When called externally, it processes the current state and applies any necessary transitions and hooks
 */
export declare class FlowManager<G> implements FlowInterface<G> {
    private config;
    private gameDefinition;
    readonly moveMap: Record<string, Move<G>>;
    readonly moveNames: string[];
    readonly startingSegment: string | null;
    readonly initialPhase: string | null;
    readonly initialStep: string | null;
    constructor(gameDefinition: GameDefinition<G>, cards: GameCards, players?: string[]);
    /**
     * Initialize move resolution system (consolidates Flow function logic)
     */
    private initializeMoveResolution;
    /**
     * Determine initial phase and step from starting segment
     */
    private determineInitialFlow;
    /**
     * Get move function by name (replaces Flow.getMove)
     */
    getMove(ctx: CoreCtx, name: string, playerID: PlayerID): Move<G> | null;
    getCurrentPhase(state: CoreEngineState<G>): FlowPhase<G> | null;
    getPhaseById(phaseId: FlowPhaseType): FlowPhase<G> | null;
    getNextPhase(state: CoreEngineState<G>, fnContext: FnContext<G>): FlowPhaseType | null;
    canPlayerAct(state: CoreEngineState<G>, playerID: string): boolean;
    executeHook<R>(hook: ((context: FnContext<G>) => R) | undefined, ctx: FnContext<G>): R | undefined;
    /**
     * Find the starting phase (marked with start: true) in a phases object.
     */
    private findStartingPhase;
    /**
     * Find the starting step (marked with start: true) in a steps object.
     */
    private findStartingStep;
    /**
     * Handles segment ending and advancing to the next segment if needed.
     */
    private handleSegmentTransition;
    /**
     * Handles phase ending and advancing to the next phase if needed.
     */
    private handlePhaseTransition;
    /**
     * Handles initializing the starting phase and step for a segment if there is a segment but no phase.
     */
    private handleSegmentPhaseInitialization;
    /**
     * Process flow transitions including segments and phases
     * This handles both segment-based transitions (pre-game) and phase-based transitions (gameplay)
     */
    processFlowTransitions(state: CoreEngineState<G>, fnContext: FnContext<G>): CoreEngineState<G>;
    /**
     * Check if the current segment should end based on its endIf condition
     */
    private shouldEndSegment;
    /**
     * Check if the current phase should end based on its endIf condition
     */
    private shouldEndPhase;
    /**
     * Get the next segment in the game flow
     */
    private getNextSegment;
    /**
     * Get segment configuration from game definition
     */
    private getSegmentConfig;
    /**
     * Get phase configuration from segment configuration
     */
    private getPhaseConfig;
}
//# sourceMappingURL=flow-manager.d.ts.map