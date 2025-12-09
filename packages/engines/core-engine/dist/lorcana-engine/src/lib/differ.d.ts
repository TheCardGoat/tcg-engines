import type { Match } from "@lorcanito/lorcana-engine/types/types";
import type { Diff } from "deep-diff";
declare const dictionary: {
    E: {
        color: string;
        text: string;
    };
    N: {
        color: string;
        text: string;
    };
    D: {
        color: string;
        text: string;
    };
    A: {
        color: string;
        text: string;
    };
};
export declare function style(kind: keyof typeof dictionary): string;
export declare function render(diff: any): any[];
export declare function diffAndLog(prevState: Match, newState: Match, logger: typeof console, isCollapsed?: boolean, onDiff?: (prev: Match, after: Match) => void): Diff<Match, Match>[] | undefined;
export declare function logDiff(diff: Diff<Match, Match>[] | undefined, logger: typeof console, isCollapsed?: boolean, onDiff?: (prev: Match, after: Match) => void, prefix?: string): Diff<Match, Match>[];
export {};
//# sourceMappingURL=differ.d.ts.map