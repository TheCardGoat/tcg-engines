import {
  GameCard,
  type GameContext,
} from "~/game-engine/core-engine/card/game-card";
import type { LorcanaAbility } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

/**
 * Lorcana-specific context that extends base GameContext
 * with Lorcana-specific operations
 */
export interface LorcanaGameContext extends GameContext {
  // Lorcana-specific ink system
  getAvailableInk(playerId: string): number;
  getInkwellCount(playerId: string): number;

  // Lorcana-specific card states
  isExerted(instanceId: string): boolean;
  isShifted(instanceId: string): boolean;
  getShiftedFrom(instanceId: string): string | undefined;

  // Lorcana-specific queries
  queryLorcanaCards(filter: LorcanaCardFilter): LorcanaCard[];

  // Turn actions tracking
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
 * This class should not have any method that performs an action or change game state.
 */
export class LorcanaCard extends GameCard<LorcanaCardDefinition> {
  // Type-safe access to Lorcana-specific properties
  get cost(): number {
    return this.definition.cost;
  }

  get inkwell(): boolean {
    return this.definition.inkwell;
  }

  get lore(): number {
    return this.definition.lore || 0;
  }

  get type(): string {
    return this.definition.type;
  }

  get colors(): string[] {
    return this.definition.colors || [];
  }

  get characteristics(): string[] {
    return this.definition.characteristics || [];
  }

  get strength(): number {
    // Only characters and locations have strength
    const def = this.definition;
    const baseStrength =
      def.type === "character" || def.type === "location"
        ? def.strength || 0
        : 0;
    const modifier = this.meta?.modifiers?.strength || 0;
    return baseStrength + modifier;
  }

  get willpower(): number {
    // Only characters and locations have willpower
    const def = this.definition;
    const baseWillpower =
      def.type === "character" || def.type === "location" ? def.willpower : 0;
    const modifier = this.meta?.modifiers?.willpower || 0;
    return baseWillpower + modifier;
  }

  // Lorcana-specific type checks
  isCharacter(): boolean {
    return this.type === "character";
  }

  isAction(): boolean {
    return this.type === "action";
  }

  isItem(): boolean {
    return this.type === "item";
  }

  isSong(): boolean {
    return this.isAction() && this.characteristics.includes("Song");
  }

  isLocation(): boolean {
    return this.type === "location";
  }

  get abilities(): LorcanaAbility[] {
    return this.definition.abilities || [];
  }

  // Context-dependent state checks
  isExerted(ctx: LorcanaGameContext): boolean {
    return ctx.isExerted(this.instanceId);
  }

  isShifted(ctx: LorcanaGameContext): boolean {
    return ctx.isShifted(this.instanceId);
  }

  getShiftedFrom(ctx: LorcanaGameContext): LorcanaCard | undefined {
    const shiftedFromId = ctx.getShiftedFrom(this.instanceId);
    if (!shiftedFromId) return undefined;

    const cardData = ctx.getCardData(shiftedFromId);
    return cardData
      ? new LorcanaCard(
          cardData.instanceId,
          cardData.ownerId,
          cardData.definition,
        )
      : undefined;
  }

  // Game-specific play validation
  canBePlayed(ctx: LorcanaGameContext): boolean {
    const zone = this.getZone(ctx);
    if (zone !== "hand") return false;

    const availableInk = ctx.getAvailableInk(this.ownerId);
    const playCost = this.getPlayCost(ctx);

    if (this.isSong()) {
      return this.canBeSung(ctx) && availableInk >= playCost;
    }

    return availableInk >= playCost;
  }

  getPlayCost(ctx: LorcanaGameContext): number {
    if (this.isSong()) {
      return this.getSongCost(ctx);
    }
    return this.cost;
  }

  // Song-specific logic
  canBeSung(ctx: LorcanaGameContext): boolean {
    if (!this.isSong()) return false;

    const singers = this.getPotentialSingers(ctx);
    return singers.length > 0;
  }

  getSongCost(ctx: LorcanaGameContext): number {
    if (!this.isSong()) return this.cost;

    const bestSinger = this.getBestSinger(ctx);
    if (!bestSinger) return this.cost;

    return Math.max(0, this.cost - bestSinger.cost);
  }

  getPotentialSingers(ctx: LorcanaGameContext): LorcanaCard[] {
    if (!this.isSong()) return [];

    return ctx
      .queryLorcanaCards({
        zone: "play",
        owner: this.ownerId,
        type: "character",
        exerted: false,
      })
      .filter((singer) => singer.cost >= this.cost);
  }

  getBestSinger(ctx: LorcanaGameContext): LorcanaCard | undefined {
    const singers = this.getPotentialSingers(ctx);
    if (singers.length === 0) return undefined;

    return singers.reduce((best, current) =>
      current.cost > best.cost ? current : best,
    );
  }

  // Inkwell-specific logic
  canBePutIntoInkwell(ctx: LorcanaGameContext): boolean {
    if (!this.inkwell) return false;
    if (this.getZone(ctx) !== "hand") return false;

    // Check if player has already used this action this turn
    return !ctx.hasUsedTurnAction(this.ownerId, "putCardIntoInkwell");
  }

  // Character-specific logic
  canQuest(ctx: LorcanaGameContext): boolean {
    if (!this.isCharacter()) return false;
    if (this.getZone(ctx) !== "play") return false;
    if (this.isExerted(ctx)) return false;

    // Characters can't quest the turn they're played (unless shifted)
    // This would need additional game state tracking
    return true;
  }

  canChallenge(ctx: LorcanaGameContext, target: LorcanaCard): boolean {
    if (!this.isCharacter()) return false;
    if (this.getZone(ctx) !== "play") return false;
    if (this.isExerted(ctx)) return false;
    if (!target.isCharacter()) return false;
    if (target.getZone(ctx) !== "play") return false;
    if (target.ownerId === this.ownerId) return false;

    return true;
  }

  // Shift-specific logic
  canShift(ctx: LorcanaGameContext, target: LorcanaCard): boolean {
    if (!this.hasShift()) return false;
    if (this.getZone(ctx) !== "hand") return false;
    if (target.getZone(ctx) !== "play") return false;
    if (target.ownerId !== this.ownerId) return false;
    if (target.isExerted(ctx)) return false;

    // Check if target has the same name (basic shift rule)
    return this.canShiftOnto(target);
  }

  hasShift(): boolean {
    // Check if card has shift ability
    return this.definition.abilities?.some((ability) =>
      ability.name?.toLowerCase().includes("shift"),
    );
  }

  canShiftOnto(target: LorcanaCard): boolean {
    // Basic shift rule: same character name
    return this.getBaseName() === target.getBaseName();
  }

  getBaseName(): string {
    // Extract base character name (before title)
    return this.name.split(" - ")[0] || this.name;
  }

  getShiftCost(): number {
    // Extract shift cost from abilities
    const shiftAbility = this.definition.abilities?.find((ability) =>
      ability.name?.toLowerCase().includes("shift"),
    );
    return (shiftAbility as any)?.cost || this.cost;
  }

  // Location-specific logic
  canBeMovedTo(ctx: LorcanaGameContext): boolean {
    if (!this.isLocation()) return true; // Non-locations can always be moved

    // Location-specific movement rules would go here
    return true;
  }

  // Card interaction helpers
  sharesColorWith(other: LorcanaCard): boolean {
    return this.colors.some((color) => other.colors.includes(color));
  }

  sharesCharacteristicWith(
    other: LorcanaCard,
    characteristic: string,
  ): boolean {
    return (
      this.characteristics.includes(characteristic) &&
      other.characteristics.includes(characteristic)
    );
  }

  // Override toString for better debugging
  toString(): string {
    return `${this.name} (${this.cost} cost, ${this.type}) [${this.instanceId}]`;
  }
}
