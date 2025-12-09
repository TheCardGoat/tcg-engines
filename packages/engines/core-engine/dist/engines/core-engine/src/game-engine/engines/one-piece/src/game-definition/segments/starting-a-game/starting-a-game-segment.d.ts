import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { OnePieceGameState } from "~/game-engine/engines/one-piece/src/one-piece-engine-types";
/**
 * Starting a Game Segment for One Piece TCG
 *
 * Based on One Piece TCG rules:
 * 1. Choose first player
 * 2. Each player draws 5 cards for starting hand
 * 3. Each player may mulligan once (redraw entire hand)
 * 4. Set Life cards equal to Leader's life value
 * 5. Place 10 DON!! cards in DON!! deck
 * 6. First player places 1 DON!! in cost area, second player places 2
 */
export declare const startingAGameSegment: SegmentConfig<OnePieceGameState>;
//# sourceMappingURL=starting-a-game-segment.d.ts.map