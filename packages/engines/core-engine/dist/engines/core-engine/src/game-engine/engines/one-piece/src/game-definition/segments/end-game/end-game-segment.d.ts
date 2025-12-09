import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { OnePieceGameState } from "~/game-engine/engines/one-piece/src/one-piece-engine-types";
/**
 * End Game Segment for One Piece TCG
 *
 * Handles the conclusion of the game when a player meets a defeat condition:
 * 1. Player has 0 Life cards and Leader takes damage
 * 2. Player has 0 cards in deck at start of turn
 * 3. Player concedes
 * 4. Special card effects cause win/loss
 */
export declare const endGameSegment: SegmentConfig<OnePieceGameState>;
//# sourceMappingURL=end-game-segment.d.ts.map