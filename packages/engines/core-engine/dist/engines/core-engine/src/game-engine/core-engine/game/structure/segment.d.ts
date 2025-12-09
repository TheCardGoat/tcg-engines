import { type TurnConfig } from "~/game-engine/core-engine/game/structure/turn";
import type { FnContext } from "~/game-engine/core-engine/game-configuration";
export interface SegmentMap<G = unknown> {
    [segmentName: string]: SegmentConfig<G>;
}
export interface SegmentConfig<G = unknown> {
    start?: boolean;
    end?: boolean;
    next?: ((context: FnContext<G>) => string | undefined) | string;
    onBegin?: (context: FnContext<G>) => undefined | G;
    onEnd?: (context: FnContext<G>) => undefined | G;
    endIf?: (context: FnContext<G>) => boolean | undefined;
    turn: TurnConfig<G>;
}
export declare function processSegments<G = unknown>(segmentMap: SegmentMap<G>): {
    startingSegment: any;
    segmentMoveMap: {};
    segmentMoveNames: Set<string>;
};
//# sourceMappingURL=segment.d.ts.map