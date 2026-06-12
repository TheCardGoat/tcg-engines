/**
 * Responsibility: public testing entrypoint for `@tcg/lorcana-engine`.
 * Re-exports lightweight test utilities and multiplayer harness types without owning
 * engine synchronization or runtime rule execution logic.
 *
 * Docs:
 * - ../../../../core/core-engine/docs/ENGINE_SIMPLIFICATION_PLAN.md
 * - ../../README.md
 *
 * Keep this module Bun-runtime agnostic. Importing Bun-specific matcher setup
 * here leaks `bun:test` into browser bundles that consume `@tcg/lorcana-engine/testing`.
 */

if ("Bun" in globalThis) {
  // Keep Bun matchers out of browser bundles that consume the testing adapter.
  const loadTestingModule = (specifier: string) => import(/* @vite-ignore */ specifier);
  await loadTestingModule("./register-matchers");
}

import { createPlayerId } from "#core";
export { cardRef } from "../types";
export type { CardInput, LorcanaStaticCard } from "../types";
export type {
  BrowserTransportConfig,
  BrowserTransportLatencyModel,
  BrowserTransportMode,
  TimeControlConfig,
} from "#core";
export { normalizeBrowserTransportConfig, DEFAULT_DYNAMIC_CLOCK_CONFIG } from "#core";

export {
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockLocation,
  createMockSong,
  createTestCard,
  createTestCardCatalog,
  buildCardsMaps,
} from "./card-mocks";

/** Standard player ID for first player in tests */
export const PLAYER_ONE = createPlayerId("player_one");
/** Standard player ID for second player in tests */
export const PLAYER_TWO = createPlayerId("player_two");
/** Sentinel ID for spectator view (used by simulator; spectator engine may not be in clients map) */
export const SPECTATOR = "spectator";

/**
 * Minimal card shape accepted by test fixtures.
 * Allows partial card definitions for testing while maintaining type safety.
 * Prefer using full LorcanaCard definitions from card-mocks for production-like tests.
 */
export type TestCardInput = Partial<LorcanaCard> & {
  id: string;
  cardType?: "character" | "action" | "item" | "location";
};

export interface TestFixtureCardState {
  card: TestCardInput;
  exerted?: boolean;
  damage?: number;
  lore?: number;
  cardsUnder?: Array<
    TestCardInput | { card: TestCardInput; publicFaceState?: "faceUp" | "faceDown" }
  >;
  atLocation?: TestCardInput;
  isDrying?: boolean;
  publicFaceState?: "faceUp" | "faceDown";
}

export type TestFixtureCardEntry = TestCardInput | TestFixtureCardState;

/**
 * Per-player fixture spec for test/simulator setup.
 *
 * Describes starting zones (hand, deck, play, inkwell, discard) and optional lore
 * for a single player. Two specs (one per player) are merged into one authoritative
 * state by the test engine.
 *
 * **Test/Simulator Only** - Not used in production.
 * Production engines restore state from SerializedMatchState via loadState().
 *
 * Zones can be specified as:
 * - A number (count) - creates placeholder cards
 * - An array of card definitions - creates real cards (prefer createTestCard/buildCardsMaps from this
 *   package or card-mocks for consistent test fixtures)
 *
 * @example
 * ```typescript
 * const playerOne: TestInitialState = {
 *   hand: [mickeyMouseTrueFriend, arielOnHumanLegs],
 *   deck: 30, // 30 placeholder cards
 *   lore: 5
 * };
 * ```
 */
export interface TestInitialState {
  hand?: number | TestFixtureCardEntry[];
  deck?: number | TestFixtureCardEntry[];
  play?: number | TestFixtureCardEntry[];
  inkwell?: number | TestFixtureCardEntry[];
  discard?: number | TestFixtureCardEntry[];
  lore?: number;
}

export {
  LorcanaMultiplayerTestEngine,
  type LorcanaTestEngineConfig,
  type LorcanaTestMoves,
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
} from "./lorcana-multiplayer-test-engine";

// Re-export client/server wrappers and PlayCardCostInput for convenience
export { LorcanaClient, createLorcanaClient } from "../lorcana-client";
export { LorcanaServer, createLorcanaServerGame } from "../lorcana-server";
export type {
  PlayCardCostInput,
  PlayCardExecutionOptions,
  ResolutionExecutionOptions,
} from "../lorcana-engine-base";

import type { LorcanaCard, AbilityDefinition, KeywordAbilityDefinition } from "@tcg/lorcana-types";
import { isCharacterCard, isLocationCard } from "@tcg/lorcana-types";

/**
 * Card model returned by LorcanaTestEngine.getCardModel()
 * Provides test helpers to verify card properties and abilities
 */
export interface CardModel {
  /** Reference to the original card definition */
  lorcanitoCard: LorcanaCard;

  /** Current zone of the card */
  zone: string;

  /** Card cost (ink cost) */
  cost: number;

  /** Character strength (for characters) */
  strength: number;

  /** Character willpower (for characters) */
  willpower: number;

  /** Lore value (for characters and locations) */
  lore: number;

  /** Current damage on the card */
  damage: number;

  /** Whether the card is exerted */
  exerted: boolean;

  /** Whether the card is ready (not exerted) */
  ready: boolean;

  /** Card metadata/abilities */
  meta: {
    abilities: AbilityDefinition[];
  };

  /** Unique instance ID */
  instanceId: string;

  /** Characteristics/classifications */
  characteristics: string[];

  /** Move cost (for locations) */
  moveCost: number;

  /** Inkwell status */
  inkwell: boolean;

  /** Cards under this card (for Shift) */
  cardsUnder: CardModel[];

  /** Native abilities */
  nativeAbilities: AbilityDefinition[];

  /** Activated abilities */
  activatedAbilities: AbilityDefinition[];

  /** Singer cost (if has Singer ability) */
  singerCost?: number;

  /** Shift ink cost (if has Shift ability) */
  shiftInkCost?: number;

  /** Damage reduction (if has Resist) */
  damageReduction: number;

  /** Boost bonus (if has Boost) */
  boostBonus?: number;

  // Property-style ability checks (no parentheses) - isMethod: false
  /** Has Evasive ability */
  hasEvasive: boolean;
  /** Has Challenger ability */
  hasChallenger: boolean;
  /** Has Resist ability */
  hasResist: boolean;
  /** Has Rush ability */
  hasRush: boolean;
  /** Has Vanish ability */
  hasVanish: boolean;
  /** Has any ability */
  hasAbility: boolean;

  // Method-style ability checks (with parentheses) - isMethod: true
  hasSupport(): boolean;
  hasReckless(): boolean;
  hasBodyguard(): boolean;
  hasWard(): boolean;
  hasShift(): boolean;
  hasSinger(): boolean;
  hasAlert(): boolean;
  hasBoost(): boolean;

  // Other method-style checks
  canBeChallenged(): boolean;
  canChallenge(): boolean;
  canQuest(): boolean;
  canMoveToLocation: boolean;
  isAtLocation(locationId?: string): boolean;
  containsCharacter(card?: LorcanaCard): boolean;

  // Combat methods
  challenge(target: CardModel): void;

  // Location method
  getCardsAtLocation(): CardModel[];
}

/**
 * Test engine configuration
 */
export interface TestEngineConfig {
  /** Cards to place in the play zone */
  play?: LorcanaCard[];

  /** Cards to place in hand */
  hand?: LorcanaCard[];

  /** Cards to place in deck */
  deck?: LorcanaCard[];

  /** Cards to place in discard */
  discard?: LorcanaCard[];

  /** Cards to place in inkwell */
  inkwell?: LorcanaCard[];
}

/**
 * Check if a card definition has a static self-restriction of the given type.
 * Used by the lightweight test engine to evaluate restrictions without full game state.
 */
function hasSelfRestriction(cardDef: LorcanaCard, restriction: string): boolean {
  return (cardDef.abilities ?? []).some(
    (ability) =>
      ability.type === "static" &&
      ability.effect.type === "restriction" &&
      (ability.effect.target === "SELF" || ability.effect.target === "THIS_CHARACTER") &&
      ability.effect.restriction === restriction,
  );
}

/**
 * Test engine for Lorcana card testing
 *
 * Provides a simplified testing environment for verifying
 * card properties and abilities without full game setup.
 *
 * @example
 * ```typescript
 * const testEngine = new LorcanaTestEngine({
 *   play: [heiheiBoatSnack],
 * });
 * const cardUnderTest = testEngine.getCardModel(heiheiBoatSnack);
 * expect(cardUnderTest.hasSupport).toBe(true);
 * ```
 */
export class LorcanaTestEngine {
  private cards: Map<string, CardModel> = new Map();
  private zoneCards: Map<string, Set<string>> = new Map();
  private instanceCounter = 0;

  constructor(config: TestEngineConfig = {}) {
    // Initialize zones
    this.zoneCards.set("play", new Set());
    this.zoneCards.set("hand", new Set());
    this.zoneCards.set("deck", new Set());
    this.zoneCards.set("discard", new Set());
    this.zoneCards.set("inkwell", new Set());

    // Add cards to respective zones
    config.play?.forEach((card) => this.addCard(card, "play"));
    config.hand?.forEach((card) => this.addCard(card, "hand"));
    config.deck?.forEach((card) => this.addCard(card, "deck"));
    config.discard?.forEach((card) => this.addCard(card, "discard"));
    config.inkwell?.forEach((card) => this.addCard(card, "inkwell"));
  }

  /**
   * Get character-specific properties safely
   */
  private getCharacterProperties(cardDef: LorcanaCard): {
    strength: number;
    willpower: number;
    lore: number;
    classifications: string[];
  } {
    if (isCharacterCard(cardDef)) {
      return {
        strength: cardDef.strength,
        willpower: cardDef.willpower,
        lore: cardDef.lore,
        classifications: cardDef.classifications ?? [],
      };
    }
    return {
      strength: 0,
      willpower: 0,
      lore: 0,
      classifications: [],
    };
  }

  /**
   * Get location-specific properties safely
   */
  private getLocationProperties(cardDef: LorcanaCard): {
    moveCost: number;
    lore: number;
  } {
    if (isLocationCard(cardDef)) {
      return {
        moveCost: cardDef.moveCost,
        lore: cardDef.lore,
      };
    }
    return {
      moveCost: 0,
      lore: 0,
    };
  }

  /**
   * Check if a card has a specific keyword ability
   */
  private hasKeywordAbility(cardDef: LorcanaCard, keyword: string): boolean {
    return cardDef.abilities?.some((a) => a.type === "keyword" && a.keyword === keyword) ?? false;
  }

  /**
   * Add a card to a zone
   */
  private addCard(cardDef: LorcanaCard, zone: string): CardModel {
    const instanceId = `${cardDef.id}_${++this.instanceCounter}`;

    const abilities = cardDef.abilities ?? [];
    const charProps = this.getCharacterProperties(cardDef);
    const locProps = this.getLocationProperties(cardDef);

    // Determine lore value (character or location)
    const loreValue = isCharacterCard(cardDef)
      ? charProps.lore
      : isLocationCard(cardDef)
        ? locProps.lore
        : 0;

    const hasKeywordAbility = (keyword: string): boolean =>
      this.hasKeywordAbility(cardDef, keyword);

    // Create the card model with mixed property and method style ability checks
    const cardModel: CardModel = {
      lorcanitoCard: cardDef,
      zone,
      cost: cardDef.cost ?? 0,
      strength: charProps.strength,
      willpower: charProps.willpower,
      lore: loreValue,
      damage: 0,
      exerted: false,
      ready: true,
      meta: {
        abilities,
      },
      instanceId,
      characteristics: charProps.classifications,
      moveCost: locProps.moveCost,
      inkwell: false,
      cardsUnder: [],
      nativeAbilities: abilities,
      activatedAbilities: abilities.filter((a) => a.type === "activated"),
      damageReduction: 0,

      // Property-style ability checks (isMethod: false)
      get hasEvasive() {
        return hasKeywordAbility("Evasive");
      },
      get hasChallenger() {
        return hasKeywordAbility("Challenger");
      },
      get hasResist() {
        return hasKeywordAbility("Resist");
      },
      get hasRush() {
        return hasKeywordAbility("Rush");
      },
      get hasVanish() {
        return hasKeywordAbility("Vanish");
      },
      get hasAbility() {
        return abilities.length > 0;
      },

      // Method-style ability checks (isMethod: true)
      hasSupport: () => hasKeywordAbility("Support"),
      hasReckless: () => hasKeywordAbility("Reckless"),
      hasBodyguard: () => hasKeywordAbility("Bodyguard"),
      hasWard: () => hasKeywordAbility("Ward"),
      hasShift: () => hasKeywordAbility("Shift"),
      hasSinger: () => hasKeywordAbility("Singer"),
      hasAlert: () => hasKeywordAbility("Alert"),
      hasBoost: () => hasKeywordAbility("Boost"),

      // Other method-style checks
      canBeChallenged: () => isCharacterCard(cardDef) && !hasKeywordAbility("Evasive"),
      canChallenge: () =>
        isCharacterCard(cardDef) && !hasSelfRestriction(cardDef, "cant-challenge"),
      canQuest: () => isCharacterCard(cardDef) || isLocationCard(cardDef),
      canMoveToLocation: !hasSelfRestriction(cardDef, "cant-move"),
      isAtLocation: (locationId?: string) => {
        const modelZone = cardModel.zone;
        if (locationId) {
          return modelZone === locationId;
        }
        return (
          modelZone !== undefined &&
          !["play", "hand", "deck", "discard", "inkwell"].includes(modelZone)
        );
      },
      containsCharacter: () => false,

      // Combat methods
      challenge: (target: CardModel) => {
        cardModel.exerted = true;
        cardModel.ready = false;
        const targetModel = this.cards.get(target.instanceId);
        if (targetModel) {
          targetModel.exerted = true;
          targetModel.ready = false;
        }
      },

      // Location method
      getCardsAtLocation: () => [],
    };

    // Set singer cost if present
    const singerAbility = abilities.find(
      (a): a is KeywordAbilityDefinition => a.type === "keyword" && a.keyword === "Singer",
    );
    if (singerAbility && "value" in singerAbility) {
      cardModel.singerCost = singerAbility.value as number;
    }

    // Set shift ink cost if present
    const shiftAbility = abilities.find(
      (a): a is KeywordAbilityDefinition => a.type === "keyword" && a.keyword === "Shift",
    );
    if (shiftAbility && "cost" in shiftAbility) {
      const cost = (shiftAbility as { cost?: { ink?: number } }).cost;
      cardModel.shiftInkCost = cost?.ink;
    }

    // Set boost bonus if present
    const boostAbility = abilities.find(
      (a): a is KeywordAbilityDefinition => a.type === "keyword" && a.keyword === "Boost",
    );
    if (boostAbility && "value" in boostAbility) {
      cardModel.boostBonus = boostAbility.value as number;
    }

    // Set resist damage reduction
    const resistAbility = abilities.find(
      (a): a is KeywordAbilityDefinition => a.type === "keyword" && a.keyword === "Resist",
    );
    if (resistAbility && "value" in resistAbility) {
      cardModel.damageReduction = resistAbility.value as number;
    }

    this.cards.set(instanceId, cardModel);
    this.zoneCards.get(zone)?.add(instanceId);

    return cardModel;
  }

  /**
   * Get the card model for a card definition
   *
   * If multiple instances exist, returns the first one found.
   * For specific instance access, use getCardModel with index.
   *
   * @param cardDef - The card definition to look up
   * @returns The card model
   */
  getCardModel(cardDef: LorcanaCard): CardModel;

  /**
   * Get the card model for a card definition at a specific index
   *
   * Useful when multiple copies of the same card exist.
   *
   * @param cardDef - The card definition to look up
   * @param index - The index of the instance (0-based)
   * @returns The card model
   */
  getCardModel(cardDef: LorcanaCard, index: number): CardModel;

  getCardModel(cardDef: LorcanaCard, index?: number): CardModel {
    const matchingCards: CardModel[] = [];

    for (const cardModel of this.cards.values()) {
      if (cardModel.lorcanitoCard.id === cardDef.id) {
        matchingCards.push(cardModel);
      }
    }

    if (matchingCards.length === 0) {
      // Create the card on-demand in the play zone if not found
      return this.addCard(cardDef, "play");
    }

    const idx = index ?? 0;
    if (idx >= matchingCards.length) {
      throw new Error(
        `Card ${cardDef.id} instance ${idx} not found. Only ${matchingCards.length} instances exist.`,
      );
    }

    return matchingCards[idx];
  }

  /**
   * Get all cards in a specific zone
   */
  getCardsInZone(zone: string): CardModel[] {
    const instanceIds = this.zoneCards.get(zone);
    if (!instanceIds) return [];

    return Array.from(instanceIds)
      .map((id) => this.cards.get(id))
      .filter((card): card is CardModel => card !== undefined);
  }

  /**
   * Move a card to a different zone
   */
  moveCard(cardModel: CardModel, toZone: string): void {
    const currentZone = cardModel.zone;

    // Remove from current zone
    this.zoneCards.get(currentZone)?.delete(cardModel.instanceId);

    // Add to new zone
    cardModel.zone = toZone;
    this.zoneCards.get(toZone)?.add(cardModel.instanceId);
  }
}

export default LorcanaTestEngine;

// ============================================================================
// Serialization Helpers
// ============================================================================

export type {
  SerializedMatchState,
  LorcanaG,
  LorcanaMatchState,
  MatchStaticResources,
  Player,
} from "./serialization";
