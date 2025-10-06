import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { logger } from "~/game-engine/core-engine/utils";
import type {
  LorcanaAbility,
  TriggerTiming,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  isActivatedAbility,
  type LorcanaActivatedAbility,
} from "~/game-engine/engines/lorcana/src/abilities/activated/activated";
import type { LorcanaEngine } from "../lorcana-engine";
import type {
  LorcanaCardFilter,
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaPlayerState,
  LorcanaZone,
} from "../lorcana-engine-types";
import type { LorcanaCardDefinition } from "./lorcana-card-repository";

export class LorcanaCardInstance extends CoreCardInstance<
  // TODO: Remove this once we have redefined card abilities
  LorcanaCardDefinition & { abilities?: LorcanaAbility[] }
> {
  constructor(
    engine: LorcanaEngine,
    card: LorcanaCardDefinition,
    instanceId: string,
    ownerId: string,
  ) {
    const contextProvider = new CoreCardCtxProvider<
      LorcanaGameState,
      LorcanaCardDefinition,
      LorcanaPlayerState,
      LorcanaCardFilter,
      LorcanaCardInstance
    >({
      engine: engine as unknown as CoreEngine<
        LorcanaGameState,
        LorcanaCardDefinition,
        LorcanaPlayerState,
        LorcanaCardFilter,
        LorcanaCardInstance
      >,
    });

    super({
      instanceId,
      ownerId,
      // TODO: Remove this once we have redefined card abilities
      definition: card as LorcanaCardDefinition & {
        abilities?: LorcanaAbility[];
      },
      contextProvider,
    });
  }

  get moveCost(): number {
    return this.card.moveCost || 0;
  }

  get inkwell(): boolean {
    return this.card.inkwell;
  }

  get zone(): LorcanaZone {
    return super.zone as LorcanaZone;
  }

  get owner(): string {
    return this.ownerId;
  }

  hasTriggerFor(timing: TriggerTiming) {
    if (!this.card.abilities) return false;

    if (timing === "endOfTurn") {
      return this.card.abilities.some((ability) =>
        hasEndOfTurnTrigger(ability, timing),
      );
    }

    if (timing === "startOfTurn") {
      return this.card.abilities.some((ability) =>
        hasStartOfTurnTrigger(ability, timing),
      );
    }

    return false;
  }

  canBePlayed(): boolean {
    return true;
  }

  get type(): LorcanaCardDefinition["type"] {
    return this.card.type;
  }

  get meta(): LorcanaCardMeta {
    const ctx = this.contextProvider.getCtx();
    const meta = ctx.cardMetas?.[this.instanceId];
    return (meta || {}) as LorcanaCardMeta;
  }

  get strength(): number {
    // Only characters and locations have strength/willpower
    const cardDef = this.card;
    const baseStrength =
      cardDef.type === "character" || cardDef.type === "location"
        ? cardDef.strength || 0
        : 0;
    const meta = this.meta;
    const modifier = meta?.modifiers?.strength || 0;
    return baseStrength + modifier;
  }

  get willpower(): number {
    // Only characters and locations have willpower
    const cardDef = this.card;
    const baseWillpower =
      cardDef.type === "character" || cardDef.type === "location"
        ? cardDef.willpower
        : 0;
    const modifier = this.meta?.modifiers?.willpower || 0;
    return baseWillpower + modifier;
  }

  get isExerted(): boolean {
    return !!this.meta.exerted;
  }

  get exerted(): boolean {
    return this.isExerted;
  }

  isAtLocation(location: LorcanaCardInstance): boolean {
    return this.meta.location === location.instanceId;
  }

  get name() {
    return this.card.name;
  }

  getAbilities(): LorcanaAbility[] {
    return this.card.abilities;
  }

  getActivatedAbilities(): LorcanaActivatedAbility[] {
    return this.getAbilities().filter(isActivatedAbility);
  }

  get fullName() {
    if (this.card.title) {
      return `${this.card.name} - ${this.card.title}`;
    }

    return this.name;
  }

  get location(): LorcanaCardInstance | undefined {
    const locationId = this.meta.location;

    if (!locationId) {
      return undefined;
    }

    const cardInstance = this.contextProvider.getCardInstance(locationId);

    // The engine ensures all instances are properly typed after initialization
    // This check validates that we have the expected LorcanaCardInstance
    if (cardInstance instanceof LorcanaCardInstance) {
      return cardInstance;
    }

    return undefined;
  }

  isEqual(other: LorcanaCardInstance): boolean {
    return this.instanceId === other.instanceId;
  }

  containsCharacter(character: LorcanaCardInstance): boolean {
    return (
      Array.isArray(this.meta.characters) &&
      this.meta.characters.includes(character.instanceId)
    );
  }

  // STUB METHODS - Runtime API stubs for test compatibility during migration
  // These throw "not implemented" errors to clearly indicate they need actual implementation

  playFromHand(_opts?: any): void {
    throw new Error("playFromHand() not implemented");
  }

  play(): void {
    throw new Error("play() not implemented");
  }

  sing(song?: any): void {
    throw new Error("sing() not implemented");
  }

  banish(): void {
    throw new Error("banish() not implemented");
  }

  shift(card?: any): void {
    throw new Error("shift() not implemented");
  }

  activate(ability?: any): void {
    throw new Error("activate() not implemented");
  }

  enterLocation(_location?: unknown): void {
    throw new Error("enterLocation() not implemented");
  }

  hasSinger(): boolean {
    throw new Error("hasSinger() not implemented");
  }

  hasBodyguard(): boolean {
    throw new Error("hasBodyguard() not implemented");
  }

  canBeChallenged(_challenger?: any): boolean {
    throw new Error("canBeChallenged() not implemented");
  }

  get singerCost(): number {
    throw new Error("singerCost not implemented");
  }

  get hasVoiceless(): boolean {
    throw new Error("hasVoiceless not implemented");
  }

  get hasVanish(): boolean {
    throw new Error("hasVanish not implemented");
  }

  get hasDamageDealtRestriction(): boolean {
    throw new Error("hasDamageDealtRestriction not implemented");
  }

  get hasChallengeCharactersRestriction(): boolean {
    throw new Error("hasChallengeCharactersRestriction not implemented");
  }

  hasShift(): boolean {
    throw new Error("hasShift() not implemented");
  }

  hasEvasive(): boolean {
    throw new Error("hasEvasive() not implemented");
  }

  get hasChallenger(): boolean {
    throw new Error("hasChallenger not implemented");
  }

  hasReckless(): boolean {
    throw new Error("hasReckless() not implemented");
  }

  hasWard(): boolean {
    throw new Error("hasWard() not implemented");
  }

  hasSupport(): boolean {
    throw new Error("hasSupport() not implemented");
  }

  get hasResist(): boolean {
    throw new Error("hasResist not implemented");
  }

  get canChallengeReadyCharacters(): boolean {
    throw new Error("canChallengeReadyCharacters not implemented");
  }

  get lore(): number {
    const cardDef = this.card;
    if (cardDef.type === "character") {
      return cardDef.lore || 0;
    }
    return 0;
  }

  get damage(): number {
    return this.meta.damage || 0;
  }

  set damage(value: number) {
    throw new Error(
      "Setting damage directly not implemented - use damage action",
    );
  }

  get canQuest(): boolean {
    throw new Error("canQuest not implemented");
  }

  addToInkwell(): void {
    throw new Error("addToInkwell() not implemented");
  }

  damageReduction(): number {
    throw new Error("damageReduction() not implemented");
  }

  isRevealed(): boolean {
    throw new Error("isRevealed() not implemented");
  }

  moveCostToEnterLocation(_character?: LorcanaCardInstance): number {
    throw new Error("moveCostToEnterLocation() not implemented");
  }

  get hasSingTogether(): boolean {
    return this.card.abilities?.some(
      (ability) =>
        ability.type === "keyword" && ability.keyword === "sing-together",
    );
  }

  get hasRush(): boolean {
    return this.card.abilities?.some(
      (ability) => ability.type === "keyword" && ability.keyword === "rush",
    );
  }

  get isDead(): boolean {
    return this.zone === "discard" || this.meta.damage >= this.willpower;
  }

  get hasSingRestriction(): boolean {
    throw new Error("hasSingRestriction not implemented");
  }

  get hasChallengeRestriction(): boolean {
    throw new Error("hasChallengeRestriction not implemented");
  }

  get hasQuestRestriction(): boolean {
    throw new Error("hasQuestRestriction not implemented");
  }

  ready = true;
}

/**
 * Check if an ability has an end-of-turn trigger
 * This handles various formats that end-of-turn abilities might be defined in
 */
function hasEndOfTurnTrigger(ability: any, timing: string): boolean {
  if (!ability) return false;

  // Check various common formats for end-of-turn triggers
  return (
    // Format 1: Simple trigger property
    ability.trigger === timing ||
    (ability.trigger === "endOfTurn" && timing === "endOfTurn") ||
    (ability.trigger === "startOfTurn" && timing === "startOfTurn") ||
    // Format 2: Nested trigger object
    (ability.trigger?.on === "end-of-turn" && timing === "endOfTurn") ||
    (ability.trigger?.on === "start-of-turn" && timing === "startOfTurn") ||
    // Format 2b: Handle start_turn format (consolidate to startOfTurn)
    (ability.trigger?.on === "start_turn" && timing === "startOfTurn") ||
    (ability.trigger?.on === "end_turn" && timing === "endOfTurn") ||
    // Format 3: Text-based detection (common in card games)
    (typeof ability.text === "string" &&
      timing === "endOfTurn" &&
      (ability.text.toLowerCase().includes("at the end of") ||
        ability.text.toLowerCase().includes("end of turn"))) ||
    (typeof ability.text === "string" &&
      timing === "startOfTurn" &&
      (ability.text.toLowerCase().includes("at the start of") ||
        ability.text.toLowerCase().includes("beginning of turn"))) ||
    // Format 4: Lorcana-specific triggered ability format
    (ability.type === "triggered" && ability.trigger === timing) ||
    // Format 5: timing property
    ability.timing === timing
  );
}

/**
 * Check if an ability has a start-of-turn trigger
 * Reuses the same logic as hasEndOfTurnTrigger since it handles both formats
 */
function hasStartOfTurnTrigger(ability: any, timing: string): boolean {
  return hasEndOfTurnTrigger(ability, timing);
}
