import { type PhaseMap } from "~/game-engine/core-engine/game/structure/phase";
import type { FnContext, MoveMap } from "~/game-engine/core-engine/game-configuration";
export interface TurnMap<G = unknown> {
    [turnName: string]: TurnConfig<G>;
}
export interface TurnConfig<G = unknown> {
    onBegin?: (context: FnContext<G>) => undefined | G;
    onEnd?: (context: FnContext<G>) => undefined | G;
    endIf?: (context: FnContext<G>) => boolean | undefined;
    moves?: MoveMap<G>;
    phases?: PhaseMap<G>;
}
export declare function processTurns<G = unknown>(turnsMap: TurnMap<G>): {
    turnMoveMap: {};
    turnMoveNames: Set<string>;
};
//# sourceMappingURL=turn.d.ts.map