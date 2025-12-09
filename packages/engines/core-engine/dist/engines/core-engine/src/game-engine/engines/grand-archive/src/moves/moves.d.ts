/**
 * Grand Archive Move Registry
 *
 * Central registry for all Grand Archive moves and player actions
 */
import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { GrandArchiveGameState } from "../../grand-archive-engine-types";
export type GrandArchiveMove = Move<GrandArchiveGameState>;
export declare const grandArchiveMoves: {
    chooseFirstPlayer: GrandArchiveMove;
    chooseChampion: GrandArchiveMove;
    mulligan: GrandArchiveMove;
    keepHand: GrandArchiveMove;
    activateCard: GrandArchiveMove;
    materializeCard: GrandArchiveMove;
    activateAbility: GrandArchiveMove;
    pass: GrandArchiveMove;
    declareAttack: GrandArchiveMove;
    declareRetaliation: GrandArchiveMove;
    levelUpChampion: GrandArchiveMove;
    skipMaterialization: GrandArchiveMove;
    endTurn: GrandArchiveMove;
};
//# sourceMappingURL=moves.d.ts.map