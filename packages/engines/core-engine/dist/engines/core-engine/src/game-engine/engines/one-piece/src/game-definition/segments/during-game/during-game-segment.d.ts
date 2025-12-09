import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { OnePieceGameState } from "~/game-engine/engines/one-piece/src/one-piece-engine-types";
/**
 * During Game Segment for One Piece TCG
 *
 * Implements the main gameplay loop with the 5 turn phases:
 * 1. Refresh Phase - Set all rested cards to active, set all DON!! cards to active
 * 2. Draw Phase - Draw 1 card from deck
 * 3. DON!! Phase - Place up to 2 DON!! cards from DON!! deck to cost area
 * 4. Main Phase - Play cards, attack, activate abilities
 * 5. End Phase - End of turn cleanup
 */
export declare const duringGameSegment: SegmentConfig<OnePieceGameState>;
//# sourceMappingURL=during-game-segment.d.ts.map