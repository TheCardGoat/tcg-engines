import type { FnContext, MoveMap } from "~/game-engine/core-engine/game-configuration";
/**
 * PhaseMap defines a mapping of phase names to phase configurations.
 */
export interface PhaseMap<G = unknown> {
    [phaseName: string]: PhaseConfig<G>;
}
/**
 * PhaseConfig defines configuration for a game phase.
 */
export interface PhaseConfig<G = unknown> {
    start?: boolean;
    next?: ((context: FnContext<G>) => string | undefined) | string;
    onBegin?: (context: FnContext<G>) => undefined | G;
    onEnd?: (context: FnContext<G>) => undefined | G;
    endIf?: (context: FnContext<G>) => boolean | undefined;
    moves?: MoveMap<G>;
    steps?: Record<string, StepConfig<G>>;
    allowAnyPlayerToAct?: boolean;
}
/**
 * StepConfig defines configuration for a step within a phase.
 */
export interface StepConfig<G = unknown> {
    start?: boolean;
    next?: ((context: FnContext<G>) => string | undefined) | string;
    onBegin?: (context: FnContext<G>) => undefined | G;
    onEnd?: (context: FnContext<G>) => undefined | G;
    endIf?: (context: FnContext<G>) => boolean | undefined | {
        next: string;
    };
    moves?: MoveMap<G>;
}
/**
 * Process all phases in a phase map.
 */
export declare function processPhases<G = unknown>(phaseMap: PhaseMap<G>): {
    startingPhase: any;
    phaseMoveMap: {};
    phaseMoveNames: Set<string>;
};
//# sourceMappingURL=phase.d.ts.map