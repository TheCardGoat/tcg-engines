/**
 * Card Catalog Index - Comprehensive card search and filtering utilities
 *
 * This module provides a type-safe API for finding and filtering cards from the
 * complete Gundamito card catalog. It supports searching by:
 * - Set codes (ST01, ST02, ST03, ST04, GD01)
 * - Card types (unit, pilot, command, base, resource)
 * - Colors (blue, white, red, green, black, yellow)
 * - Stats (cost, AP, HP)
 * - Keywords (blocker, repair, breach, etc.)
 * - Traits (Mobile Suit, Pilot, Earth Federation, etc.)
 *
 * These utilities follow the "Real Cards First" principle - always prefer using
 * real cards from the catalog in tests rather than creating mock cards.
 *
 * @module card-catalog-index
 */

import { allGundamCards } from "../../src/cards/definitions/cards";
import type {
  GundamitoCard,
  GundamitoUnitCard,
} from "../../src/cards/definitions/cardTypes";

/**
 * Get all cards from a specific set.
 *
 * Returns cards from official Gundamito card sets:
 * - ST01: Starter Deck 01 (Gundam) - 17 cards
 * - ST02: Starter Deck 02 (Wing Gundam) - 16 cards
 * - ST03: Starter Deck 03 (Zaku) - 16 cards
 * - ST04: Starter Deck 04 (Strike) - 16 cards
 * - GD01: Booster Set 01 - 146 cards
 *
 * @param setCode - The set identifier (e.g., "ST01", "GD01")
 * @returns Array of cards from the specified set
 *
 * @example
 * ```typescript
 * // Get all ST01 cards
 * const st01Cards = getCardsBySet("ST01");
 * expect(st01Cards).toHaveLength(17);
 *
 * // Use in test scenarios
 * const starter Deck = getCardsBySet("ST01");
 * const unitsForTest = starterDeck.filter(c => c.type === "unit");
 * ```
 *
 * @see getCatalogStats for set statistics
 */
export const getCardsBySet = (setCode: string): GundamitoCard[] => {
  return allGundamCards.filter((card) => card.set === setCode);
};

/**
 * Get all cards of a specific type.
 *
 * Filters the card catalog by card type:
 * - unit: Mobile Suit units that can battle
 * - pilot: Character pilots that pair with units
 * - command: Action cards that provide effects
 * - base: Base cards for shield section
 * - resource: Resource cards for resource generation
 *
 * @param type - The card type to filter by
 * @returns Array of cards of the specified type
 *
 * @example
 * ```typescript
 * // Get all unit cards
 * const units = getCardsByType("unit");
 *
 * // Get all pilots
 * const pilots = getCardsByType("pilot");
 *
 * // Test pilot pairing mechanics
 * const testPilot = getCardsByType("pilot")[0];
 * const testUnit = getCardsByType("unit")[0];
 * ```
 *
 * @see LLM-RULES Section 2: Card Information
 */
export const getCardsByType = (
  type: "unit" | "pilot" | "command" | "base" | "resource",
): GundamitoCard[] => {
  return allGundamCards.filter((card) => card.type === type);
};

/**
 * Get all cards of a specific color.
 *
 * Filters by card color according to the Gundamito color system:
 * - blue: Tech and ranged combat
 * - white: Support and healing
 * - red: Aggressive and direct combat
 * - green: Resource acceleration
 * - black: Disruptive effects
 * - yellow: Defensive and control
 *
 * Note: Resource cards have no color and are automatically excluded.
 *
 * @param color - The color to filter by
 * @returns Array of cards of the specified color (excludes resource cards)
 *
 * @example
 * ```typescript
 * // Get blue cards
 * const blueCards = getCardsByColor("blue");
 *
 * // Test mono-color deck construction
 * const redUnits = getCardsByColor("red").filter(c => c.type === "unit");
 *
 * // Test color-based effects
 * const whiteSupport = getCardsByColor("white")
 *   .find(c => getCardsByKeyword("repair").includes(c));
 * ```
 *
 * @see LLM-RULES Section 2: Card Information (Color)
 * @see LLM-RULES Section 5: Preparing to Play (Deck Construction)
 */
export const getCardsByColor = (
  color: "blue" | "white" | "red" | "green" | "black" | "yellow",
): GundamitoCard[] => {
  return allGundamCards.filter(
    (card) =>
      card.type !== "resource" && "color" in card && card.color === color,
  );
};

/**
 * Get cards by cost (exact match or range).
 *
 * Filters cards by their deployment/play cost. Useful for testing:
 * - Early game low-cost cards (0-3 cost)
 * - Mid game medium-cost cards (4-6 cost)
 * - Late game high-cost cards (7+ cost)
 * - Resource management and cost payment
 *
 * Note: Resource cards have no cost and are automatically excluded.
 *
 * @param minCost - Minimum cost (or exact cost if maxCost not provided)
 * @param maxCost - Optional maximum cost for range filtering
 * @returns Array of cards matching the cost criteria (excludes resource cards)
 *
 * @example
 * ```typescript
 * // Get cards with exact cost
 * const threeCostCards = getCardsByCost(3);
 *
 * // Get cards in cost range
 * const earlyCostCards = getCardsByCost(0, 3); // 0-3 cost
 * const lateCostCards = getCardsByCost(7, 10); // 7-10 cost
 *
 * // Test cost-based strategies
 * const cheapUnits = getCardsByCost(0, 2)
 *   .filter(c => c.type === "unit");
 * ```
 *
 * @see LLM-RULES Section 2: Card Information (Cost)
 * @see LLM-RULES Section 6: Game Progression (Resource Phase)
 */
export const getCardsByCost = (
  minCost: number,
  maxCost?: number,
): GundamitoCard[] => {
  if (maxCost === undefined) {
    return allGundamCards.filter(
      (card) =>
        card.type !== "resource" && "cost" in card && card.cost === minCost,
    );
  }
  return allGundamCards.filter(
    (card) =>
      card.type !== "resource" &&
      "cost" in card &&
      card.cost !== undefined &&
      card.cost >= minCost &&
      card.cost <= maxCost,
  );
};

/**
 * Get units by Attack Power (AP) - exact match or range.
 *
 * Filters unit cards by their attack power stat. Useful for testing:
 * - Low AP units (0-3 AP) - early game, defensive units
 * - Medium AP units (4-6 AP) - mid game balanced units
 * - High AP units (7+ AP) - late game powerful attackers
 * - Combat damage calculations
 * - <Support> keyword effects that boost AP
 *
 * @param minAP - Minimum AP (or exact AP if maxAP not provided)
 * @param maxAP - Optional maximum AP for range filtering
 * @returns Array of unit cards matching the AP criteria
 *
 * @example
 * ```typescript
 * // Get units with exactly 5 AP
 * const fiveAPUnits = getUnitsByAP(5);
 *
 * // Get high-power units
 * const powerhouses = getUnitsByAP(7, 10);
 *
 * // Test combat with specific AP matchups
 * const attacker = getUnitsByAP(6)[0];
 * const defender = getUnitsByAP(4)[0];
 * ```
 *
 * @see LLM-RULES Section 2: Card Information (Unit Stats)
 * @see LLM-RULES Section 7: Combat (Damage Calculation)
 * @see LLM-RULES Section 11: Keyword Effects (<Support>)
 */
export const getUnitsByAP = (
  minAP: number,
  maxAP?: number,
): GundamitoUnitCard[] => {
  const units = allGundamCards.filter(
    (card) => card.type === "unit",
  ) as GundamitoUnitCard[];

  if (maxAP === undefined) {
    return units.filter((unit) => unit.ap === minAP);
  }
  return units.filter((unit) => unit.ap >= minAP && unit.ap <= maxAP);
};

/**
 * Get units by Hit Points (HP) - exact match or range.
 *
 * Filters unit cards by their hit points stat. Useful for testing:
 * - Low HP units (1-3 HP) - fragile but often efficient units
 * - Medium HP units (4-6 HP) - balanced durability
 * - High HP units (7+ HP) - tanks and defensive units
 * - Destruction management (0 HP rule)
 * - <Repair> keyword effects that restore HP
 * - Combat survival scenarios
 *
 * @param minHP - Minimum HP (or exact HP if maxHP not provided)
 * @param maxHP - Optional maximum HP for range filtering
 * @returns Array of unit cards matching the HP criteria
 *
 * @example
 * ```typescript
 * // Get units with exactly 5 HP
 * const fiveHPUnits = getCardsByHP(5);
 *
 * // Get tanky high-HP units
 * const tanks = getCardsByHP(7, 10);
 *
 * // Test destruction at 0 HP
 * const fragileUnit = getCardsByHP(1)[0]; // Dies to 1 damage
 * ```
 *
 * @see LLM-RULES Section 2: Card Information (Unit Stats)
 * @see LLM-RULES Section 10: Rules Management (Destruction)
 * @see LLM-RULES Section 11: Keyword Effects (<Repair>)
 */
export const getCardsByHP = (
  minHP: number,
  maxHP?: number,
): GundamitoUnitCard[] => {
  const units = allGundamCards.filter(
    (card) => card.type === "unit",
  ) as GundamitoUnitCard[];

  if (maxHP === undefined) {
    return units.filter((unit) => unit.hp === minHP);
  }
  return units.filter((unit) => unit.hp >= minHP && unit.hp <= maxHP);
};

/**
 * Get cards with specific keyword or ability type.
 *
 * Searches for cards containing specific keywords or abilities:
 * - Keyword effects: blocker, breach, support, repair, first strike, high-maneuver
 * - Timing keywords: activate·main, activate·action, main, action, burst
 * - Trigger keywords: deploy, attack, destroyed, when paired, during pair
 * - Special keywords: pilot, once per turn
 *
 * The search is case-insensitive and supports both legacy and new card structures.
 *
 * @param keyword - The keyword to search for (case-insensitive)
 * @returns Array of cards containing the specified keyword
 *
 * @example
 * ```typescript
 * // Get all cards with Blocker
 * const blockers = getCardsByKeyword("blocker");
 *
 * // Get cards with Deploy triggers
 * const deployCards = getCardsByKeyword("deploy");
 *
 * // Test keyword interactions
 * const repairUnits = getCardsByKeyword("repair");
 * const breachUnits = getCardsByKeyword("breach");
 * const supportUnits = getCardsByKeyword("support");
 * ```
 *
 * @see LLM-RULES Section 11: Keyword Effects
 * @see LLM-RULES Section 7: Combat (Keyword Interactions)
 */
export const getCardsByKeyword = (keyword: string): GundamitoCard[] => {
  return allGundamCards.filter((card) => {
    if (
      !("abilities" in card && card.abilities) ||
      card.abilities.length === 0
    ) {
      return false;
    }
    return card.abilities.some((ability) => {
      // Check for abilityType field (legacy structure)
      if (
        "abilityType" in ability &&
        ability.abilityType === keyword.toLowerCase()
      ) {
        return true;
      }
      // Check for effects array with keyword field (new structure)
      if ("effects" in ability && Array.isArray(ability.effects)) {
        return ability.effects.some(
          (effect) =>
            effect.type === "keyword" &&
            effect.keyword?.toLowerCase() === keyword.toLowerCase(),
        );
      }
      return false;
    });
  });
};

/**
 * Get cards with a specific trait.
 *
 * Filters units and pilots by their trait tags. Traits represent:
 * - Faction affiliations (Earth Federation, Zeon, etc.)
 * - Unit types (Mobile Suit, Mobile Armor, etc.)
 * - Character traits (Newtype, Ace Pilot, etc.)
 * - Series origins (UC, CE, AD, etc.)
 *
 * Only unit and pilot cards have traits. The search is case-insensitive.
 *
 * @param trait - The trait to search for (case-insensitive)
 * @returns Array of cards (units/pilots) with the specified trait
 *
 * @example
 * ```typescript
 * // Get Earth Federation units
 * const federationUnits = getCardsByTrait("Earth Federation");
 *
 * // Get Mobile Suit units
 * const mobileSuits = getCardsByTrait("Mobile Suit");
 *
 * // Test trait-based effects
 * const newtypes = getCardsByTrait("Newtype");
 * ```
 *
 * @see LLM-RULES Section 2: Card Information (Traits)
 */
export const getCardsByTrait = (trait: string): GundamitoCard[] => {
  return allGundamCards.filter((card) => {
    if (card.type === "unit" || card.type === "pilot") {
      return card.traits?.some((t) => t.toLowerCase() === trait.toLowerCase());
    }
    return false;
  });
};

/**
 * Get a random card from the catalog, optionally filtered by criteria.
 *
 * Returns a random card that matches the specified criteria. Useful for:
 * - Randomized test scenarios
 * - Fuzzing tests with varied card combinations
 * - Property-based testing
 * - Generating diverse test decks
 *
 * Multiple criteria can be combined to narrow the selection.
 *
 * @param criteria - Optional filtering criteria to apply
 * @param criteria.type - Filter by card type
 * @param criteria.color - Filter by card color
 * @param criteria.set - Filter by set code
 * @param criteria.minCost - Filter by minimum cost
 * @param criteria.maxCost - Filter by maximum cost
 * @returns A random card matching all specified criteria
 *
 * @throws {Error} If no cards match the specified criteria
 *
 * @example
 * ```typescript
 * // Get any random card
 * const randomCard = getRandomCard();
 *
 * // Get random blue unit
 * const randomBlueUnit = getRandomCard({
 *   type: "unit",
 *   color: "blue"
 * });
 *
 * // Get random low-cost card from ST01
 * const randomStarter = getRandomCard({
 *   set: "ST01",
 *   minCost: 0,
 *   maxCost: 3
 * });
 *
 * // Randomized test scenarios
 * const testDeck = Array.from({ length: 10 }, () =>
 *   getRandomCard({ type: "unit" })
 * );
 * ```
 */
export const getRandomCard = (
  criteria?: Partial<{
    type: "unit" | "pilot" | "command" | "base" | "resource";
    color: "blue" | "white" | "red" | "green" | "black" | "yellow";
    set: string;
    minCost: number;
    maxCost: number;
  }>,
): GundamitoCard => {
  let filteredCards = [...allGundamCards];

  if (criteria?.type) {
    filteredCards = filteredCards.filter((card) => card.type === criteria.type);
  }

  if (criteria?.color) {
    filteredCards = filteredCards.filter(
      (card) =>
        card.type !== "resource" &&
        "color" in card &&
        card.color === criteria.color,
    );
  }

  if (criteria?.set) {
    filteredCards = filteredCards.filter((card) => card.set === criteria.set);
  }

  if (criteria?.minCost !== undefined) {
    filteredCards = filteredCards.filter(
      (card) =>
        card.type !== "resource" &&
        "cost" in card &&
        card.cost !== undefined &&
        card.cost >= (criteria.minCost ?? 0),
    );
  }

  if (criteria?.maxCost !== undefined) {
    filteredCards = filteredCards.filter(
      (card) =>
        card.type !== "resource" &&
        "cost" in card &&
        card.cost !== undefined &&
        card.cost <= (criteria.maxCost ?? 999),
    );
  }

  if (filteredCards.length === 0) {
    throw new Error("No cards match the specified criteria");
  }

  const randomIndex = Math.floor(Math.random() * filteredCards.length);
  return filteredCards[randomIndex];
};

/**
 * Get a specific card by its unique ID.
 *
 * Returns a single card matching the exact ID. Card IDs follow the pattern:
 * - SET-NUMBER (e.g., "ST01-001", "GD01-042")
 * - Includes set code and card number within that set
 *
 * Returns undefined if no card matches the ID.
 *
 * @param id - The unique card ID to find
 * @returns The card with matching ID, or undefined if not found
 *
 * @example
 * ```typescript
 * // Get specific card
 * const gundam = getCardById("ST01-001"); // Gundam RX-78-2
 * const amuro = getCardById("ST01-010"); // Amuro Ray
 *
 * // Safe undefined handling
 * const card = getCardById("INVALID-ID");
 * if (card) {
 *   // Use card
 * }
 *
 * // Type-safe card access in tests
 * const testUnit = getCardById("ST01-001");
 * expect(testUnit).toBeDefined();
 * expect(testUnit?.name).toBe("Gundam RX-78-2");
 * ```
 */
export const getCardById = (id: string): GundamitoCard | undefined => {
  return allGundamCards.find((card) => card.id === id);
};

/**
 * Get comprehensive statistics about the card catalog.
 *
 * Returns detailed statistics about the catalog composition:
 * - Total card count across all sets
 * - Breakdown by card type (unit, pilot, command, base, resource)
 * - Breakdown by set (ST01, ST02, ST03, ST04, GD01)
 * - Breakdown by color (blue, white, red, green, black, yellow)
 *
 * Useful for:
 * - Verifying catalog completeness
 * - Understanding card distribution
 * - Testing catalog integrity
 * - Generating reports and documentation
 *
 * @returns Object containing catalog statistics
 * @returns Object.total - Total number of cards in catalog
 * @returns Object.byType - Card counts by type
 * @returns Object.bySet - Card counts by set
 * @returns Object.byColor - Card counts by color
 *
 * @example
 * ```typescript
 * const stats = getCatalogStats();
 * console.log(`Total cards: ${stats.total}`);
 * console.log(`Units: ${stats.byType.unit}`);
 * console.log(`ST01 cards: ${stats.bySet.ST01}`);
 * console.log(`Blue cards: ${stats.byColor.blue}`);
 *
 * // Verify catalog completeness
 * expect(stats.bySet.ST01).toBe(17);
 * expect(stats.bySet.GD01).toBe(146);
 *
 * // Test distribution
 * expect(stats.byType.unit).toBeGreaterThan(0);
 * expect(stats.byColor.blue).toBeGreaterThan(0);
 * ```
 */
export const getCatalogStats = () => {
  const byType = {
    unit: getCardsByType("unit").length,
    pilot: getCardsByType("pilot").length,
    command: getCardsByType("command").length,
    base: getCardsByType("base").length,
    resource: getCardsByType("resource").length,
  };

  const bySet = {
    ST01: getCardsBySet("ST01").length,
    ST02: getCardsBySet("ST02").length,
    ST04: getCardsBySet("ST04").length,
    GD01: getCardsBySet("GD01").length,
  };

  const byColor = {
    blue: getCardsByColor("blue").length,
    white: getCardsByColor("white").length,
    red: getCardsByColor("red").length,
    green: getCardsByColor("green").length,
    black: getCardsByColor("black").length,
    yellow: getCardsByColor("yellow").length,
  };

  return {
    total: allGundamCards.length,
    byType,
    bySet,
    byColor,
  };
};
