/**
 * During Game segment for Alpha Clash
 *
 * Handles the main game flow including:
 * - Turn structure (Start, Expansion, Primary, Clash, End phases)
 * - Expansion phase steps (Ready, Draw, Resource)
 * - Clash phase steps (Attack, Counter, Obstruct, Clash Buffs, Damage)
 * - Priority windows and effect resolution
 */
import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { AlphaClashGameState } from "../../../../alpha-clash-engine-types";
export declare const duringGameSegment: SegmentConfig<AlphaClashGameState>;
//# sourceMappingURL=during-game-segment.d.ts.map