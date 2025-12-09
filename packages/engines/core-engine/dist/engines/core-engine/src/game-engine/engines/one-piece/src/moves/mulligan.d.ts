import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { OnePieceGameState } from "../one-piece-engine-types";
/**
 * Mulligan move for One Piece TCG
 *
 * Based on One Piece rules:
 * - Each player may redraw their hand one time
 * - If you decide to redraw, return your entire hand to the bottom of your deck
 * - Draw 5 new cards, which will become your new starting hand
 * - Then, shuffle your deck
 */
export declare const mulligan: Move<OnePieceGameState>;
//# sourceMappingURL=mulligan.d.ts.map