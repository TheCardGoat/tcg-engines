import type { LorcanitoCard } from "@lorcanito/lorcana-engine";
import { GameCard, type GameContext } from "~/game-engine/core-engine/card/game-card";
/**
 * Lorcana-specific context that extends base GameContext
 * with Lorcana-specific operations
 */
export interface LorcanaGameContext extends GameContext {
    getAvailableInk(playerId: string): number;
    getInkwellCount(playerId: string): number;
    isExerted(instanceId: string): boolean;
    isShifted(instanceId: string): boolean;
    getShiftedFrom(instanceId: string): string | undefined;
    queryLorcanaCards(filter: LorcanaCardFilter): LorcanaCard[];
    hasUsedTurnAction(playerId: string, action: string): boolean;
}
export interface LorcanaCardFilter {
    zone?: string;
    owner?: string;
    type?: string;
    color?: string;
    cost?: number;
    exerted?: boolean;
    shifted?: boolean;
    inkwell?: boolean;
    characteristics?: string[];
}
/**
 * Lorcana-specific card implementation with rich game logic
 * Uses context injection for performance while providing type-safe access
 */
export declare class LorcanaCard extends GameCard<LorcanitoCard> {
    get cost(): number;
    get inkwell(): boolean;
    get lore(): number;
    get type(): string;
    get colors(): string[];
    get characteristics(): string[];
    get strength(): number;
    get willpower(): number;
    isCharacter(): boolean;
    isAction(): boolean;
    isItem(): boolean;
    isSong(): boolean;
    isLocation(): boolean;
    isExerted(ctx: LorcanaGameContext): boolean;
    isShifted(ctx: LorcanaGameContext): boolean;
    getShiftedFrom(ctx: LorcanaGameContext): LorcanaCard | undefined;
    canBePlayed(ctx: LorcanaGameContext): boolean;
    getPlayCost(ctx: LorcanaGameContext): number;
    canBeSung(ctx: LorcanaGameContext): boolean;
    getSongCost(ctx: LorcanaGameContext): number;
    getPotentialSingers(ctx: LorcanaGameContext): LorcanaCard[];
    getBestSinger(ctx: LorcanaGameContext): LorcanaCard | undefined;
    canBePutIntoInkwell(ctx: LorcanaGameContext): boolean;
    canQuest(ctx: LorcanaGameContext): boolean;
    canChallenge(ctx: LorcanaGameContext, target: LorcanaCard): boolean;
    canShift(ctx: LorcanaGameContext, target: LorcanaCard): boolean;
    hasShift(): boolean;
    canShiftOnto(target: LorcanaCard): boolean;
    getBaseName(): string;
    getShiftCost(): number;
    canBeMovedTo(ctx: LorcanaGameContext): boolean;
    sharesColorWith(other: LorcanaCard): boolean;
    sharesCharacteristicWith(other: LorcanaCard, characteristic: string): boolean;
    toString(): string;
}
//# sourceMappingURL=lorcana-game-card.d.ts.map