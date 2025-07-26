/**
 * # Lorcana Card Filter Builder
 *
 * This module provides a fluent API for building complex card filters in Lorcana TCG.
 * The builder supports all legacy filter capabilities while providing a more intuitive
 * and type-safe interface.
 */

import type { LorcanaZone } from "./lorcana-engine-types";

// =============================================================================
// FILTER BUILDER TYPES
// =============================================================================

export type NumericComparison = {
  operator: "eq" | "gt" | "gte" | "lt" | "lte" | "ne";
  value: number;
};

export type StringComparison = {
  operator: "eq" | "contains" | "startsWith" | "endsWith" | "ne";
  value: string | string[];
};

export type NumericRange = {
  min?: number;
  max?: number;
  exact?: number;
};

// Enhanced card filter that can be built programmatically
export type LorcanaCardFilterExtended = {
  // Basic attributes
  cost?: NumericRange;
  strength?: NumericRange;
  willpower?: NumericRange;
  lore?: NumericRange;
  moveCost?: NumericRange;

  // String attributes
  name?: StringComparison;
  title?: StringComparison;
  text?: StringComparison;

  // Card types and properties
  cardType?: ("character" | "action" | "item" | "location" | "song")[];
  ink?: string[];
  inkable?: boolean;

  // Keywords and abilities
  hasKeyword?: string[];
  hasAbility?: string[];

  // Card states
  exerted?: boolean;
  damaged?: boolean | NumericComparison;
  banished?: boolean;
  ready?: boolean;
  dry?: boolean;
  atLocation?: boolean;
  hasCardUnder?: boolean;

  // Capabilities
  canQuest?: boolean;
  canChallenge?: boolean;
  canSing?: boolean;
  canSingTogether?: boolean;
  canShift?: boolean;
  canBePlayed?: boolean;
  canTarget?: string | string[]; // instanceId(s)

  // Context and ownership
  owner?: "self" | "opponent" | string;
  controller?: "self" | "opponent" | string;
  zone?: LorcanaZone | LorcanaZone[];
  source?: "self" | "trigger" | "target" | "other";
  location?: "source" | string; // instanceId for specific location

  // Turn-based filters
  playedThisTurn?: boolean;
  questedThisTurn?: boolean;
  challengedThisTurn?: boolean;
  usedInkwellThisTurn?: boolean;
  wasChallenged?: boolean;

  // Combat-related
  challengeRole?: "attacker" | "defender";
  singRole?: "singer" | "song";

  // Dynamic filters
  instanceId?: string | string[];
  publicId?: string | string[];

  // Deck/top-related
  topDeck?: "self" | "opponent";

  // Special filters
  namedCard?: string; // For "name a card" effects

  // Logical operators
  and?: LorcanaCardFilterExtended[];
  or?: LorcanaCardFilterExtended[];
  not?: LorcanaCardFilterExtended;

  // Misc options
  negate?: boolean;
  ignoreBonuses?: boolean;
};

/**
 * Builder class for constructing Lorcana card filters with a fluent API
 */
export class LorcanaCardFilterBuilder {
  private filter: LorcanaCardFilterExtended = {};

  // === BASIC ATTRIBUTE METHODS ===

  cost(range: NumericRange): this;
  cost(comparison: NumericComparison): this;
  cost(exact: number): this;
  cost(value: NumericRange | NumericComparison | number): this {
    if (typeof value === "number") {
      this.filter.cost = { exact: value };
    } else if ("operator" in value) {
      // Convert comparison to range for consistency
      const { operator, value: compValue } = value;
      switch (operator) {
        case "eq":
          this.filter.cost = { exact: compValue };
          break;
        case "gte":
          this.filter.cost = { min: compValue };
          break;
        case "lte":
          this.filter.cost = { max: compValue };
          break;
        case "gt":
          this.filter.cost = { min: compValue + 1 };
          break;
        case "lt":
          this.filter.cost = { max: compValue - 1 };
          break;
        default:
          this.filter.cost = { exact: compValue };
          break;
      }
    } else {
      this.filter.cost = value;
    }
    return this;
  }

  strength(range: NumericRange): this;
  strength(comparison: NumericComparison): this;
  strength(exact: number): this;
  strength(value: NumericRange | NumericComparison | number): this {
    if (typeof value === "number") {
      this.filter.strength = { exact: value };
    } else if ("operator" in value) {
      const { operator, value: compValue } = value;
      switch (operator) {
        case "eq":
          this.filter.strength = { exact: compValue };
          break;
        case "gte":
          this.filter.strength = { min: compValue };
          break;
        case "lte":
          this.filter.strength = { max: compValue };
          break;
        case "gt":
          this.filter.strength = { min: compValue + 1 };
          break;
        case "lt":
          this.filter.strength = { max: compValue - 1 };
          break;
        default:
          this.filter.strength = { exact: compValue };
          break;
      }
    } else {
      this.filter.strength = value;
    }
    return this;
  }

  willpower(range: NumericRange): this;
  willpower(comparison: NumericComparison): this;
  willpower(exact: number): this;
  willpower(value: NumericRange | NumericComparison | number): this {
    if (typeof value === "number") {
      this.filter.willpower = { exact: value };
    } else if ("operator" in value) {
      const { operator, value: compValue } = value;
      switch (operator) {
        case "eq":
          this.filter.willpower = { exact: compValue };
          break;
        case "gte":
          this.filter.willpower = { min: compValue };
          break;
        case "lte":
          this.filter.willpower = { max: compValue };
          break;
        case "gt":
          this.filter.willpower = { min: compValue + 1 };
          break;
        case "lt":
          this.filter.willpower = { max: compValue - 1 };
          break;
        default:
          this.filter.willpower = { exact: compValue };
          break;
      }
    } else {
      this.filter.willpower = value;
    }
    return this;
  }

  lore(range: NumericRange): this;
  lore(comparison: NumericComparison): this;
  lore(exact: number): this;
  lore(value: NumericRange | NumericComparison | number): this {
    if (typeof value === "number") {
      this.filter.lore = { exact: value };
    } else if ("operator" in value) {
      const { operator, value: compValue } = value;
      switch (operator) {
        case "eq":
          this.filter.lore = { exact: compValue };
          break;
        case "gte":
          this.filter.lore = { min: compValue };
          break;
        case "lte":
          this.filter.lore = { max: compValue };
          break;
        case "gt":
          this.filter.lore = { min: compValue + 1 };
          break;
        case "lt":
          this.filter.lore = { max: compValue - 1 };
          break;
        default:
          this.filter.lore = { exact: compValue };
          break;
      }
    } else {
      this.filter.lore = value;
    }
    return this;
  }

  moveCost(range: NumericRange): this;
  moveCost(comparison: NumericComparison): this;
  moveCost(exact: number): this;
  moveCost(value: NumericRange | NumericComparison | number): this {
    if (typeof value === "number") {
      this.filter.moveCost = { exact: value };
    } else if ("operator" in value) {
      const { operator, value: compValue } = value;
      switch (operator) {
        case "eq":
          this.filter.moveCost = { exact: compValue };
          break;
        case "gte":
          this.filter.moveCost = { min: compValue };
          break;
        case "lte":
          this.filter.moveCost = { max: compValue };
          break;
        case "gt":
          this.filter.moveCost = { min: compValue + 1 };
          break;
        case "lt":
          this.filter.moveCost = { max: compValue - 1 };
          break;
        default:
          this.filter.moveCost = { exact: compValue };
          break;
      }
    } else {
      this.filter.moveCost = value;
    }
    return this;
  }

  // === STRING ATTRIBUTE METHODS ===

  name(comparison: StringComparison): this;
  name(exact: string): this;
  name(value: StringComparison | string): this {
    if (typeof value === "string") {
      this.filter.name = { operator: "eq", value };
    } else {
      this.filter.name = value;
    }
    return this;
  }

  nameContains(text: string): this {
    this.filter.name = { operator: "contains", value: text };
    return this;
  }

  title(comparison: StringComparison): this;
  title(exact: string): this;
  title(value: StringComparison | string): this {
    if (typeof value === "string") {
      this.filter.title = { operator: "eq", value };
    } else {
      this.filter.title = value;
    }
    return this;
  }

  text(comparison: StringComparison): this;
  text(exact: string): this;
  text(value: StringComparison | string): this {
    if (typeof value === "string") {
      this.filter.text = { operator: "eq", value };
    } else {
      this.filter.text = value;
    }
    return this;
  }

  textContains(text: string): this {
    this.filter.text = { operator: "contains", value: text };
    return this;
  }

  // === CARD TYPE AND PROPERTIES ===

  type(
    ...types: ("character" | "action" | "item" | "location" | "song")[]
  ): this {
    this.filter.cardType = types;
    return this;
  }

  ink(...colors: string[]): this {
    this.filter.ink = colors;
    return this;
  }

  inkable(value = true): this {
    this.filter.inkable = value;
    return this;
  }

  // === KEYWORDS AND ABILITIES ===

  hasKeyword(...keywords: string[]): this {
    this.filter.hasKeyword = [...(this.filter.hasKeyword || []), ...keywords];
    return this;
  }

  hasAbility(...abilities: string[]): this {
    this.filter.hasAbility = [...(this.filter.hasAbility || []), ...abilities];
    return this;
  }

  // === CARD STATES ===

  exerted(value = true): this {
    this.filter.exerted = value;
    return this;
  }

  ready(value = true): this {
    this.filter.ready = value;
    return this;
  }

  damaged(value: boolean | NumericComparison = true): this {
    this.filter.damaged = value;
    return this;
  }

  banished(value = true): this {
    this.filter.banished = value;
    return this;
  }

  dry(value = true): this {
    this.filter.dry = value;
    return this;
  }

  atLocation(value = true): this {
    this.filter.atLocation = value;
    return this;
  }

  hasCardUnder(value = true): this {
    this.filter.hasCardUnder = value;
    return this;
  }

  // === CAPABILITIES ===

  canQuest(value = true): this {
    this.filter.canQuest = value;
    return this;
  }

  canChallenge(value = true): this {
    this.filter.canChallenge = value;
    return this;
  }

  canSing(value = true): this {
    this.filter.canSing = value;
    return this;
  }

  canSingTogether(value = true): this {
    this.filter.canSingTogether = value;
    return this;
  }

  canShift(value = true): this {
    this.filter.canShift = value;
    return this;
  }

  canBePlayed(value = true): this {
    this.filter.canBePlayed = value;
    return this;
  }

  canTarget(...instanceIds: string[]): this {
    if (instanceIds.length === 1) {
      this.filter.canTarget = instanceIds[0];
    } else {
      this.filter.canTarget = instanceIds;
    }
    return this;
  }

  // === CONTEXT AND OWNERSHIP ===

  ownedBy(owner: "self" | "opponent" | string): this {
    this.filter.owner = owner;
    return this;
  }

  controlledBy(controller: "self" | "opponent" | string): this {
    this.filter.controller = controller;
    return this;
  }

  inZone(...zones: LorcanaZone[]): this {
    if (zones.length === 1) {
      this.filter.zone = zones[0];
    } else {
      this.filter.zone = zones;
    }
    return this;
  }

  source(source: "self" | "trigger" | "target" | "other"): this {
    this.filter.source = source;
    return this;
  }

  location(location: "source" | string): this {
    this.filter.location = location;
    return this;
  }

  // === TURN-BASED FILTERS ===

  playedThisTurn(value = true): this {
    this.filter.playedThisTurn = value;
    return this;
  }

  questedThisTurn(value = true): this {
    this.filter.questedThisTurn = value;
    return this;
  }

  challengedThisTurn(value = true): this {
    this.filter.challengedThisTurn = value;
    return this;
  }

  usedInkwellThisTurn(value = true): this {
    this.filter.usedInkwellThisTurn = value;
    return this;
  }

  wasChallenged(value = true): this {
    this.filter.wasChallenged = value;
    return this;
  }

  // === COMBAT-RELATED ===

  challengeRole(role: "attacker" | "defender"): this {
    this.filter.challengeRole = role;
    return this;
  }

  singRole(role: "singer" | "song"): this {
    this.filter.singRole = role;
    return this;
  }

  // === DYNAMIC FILTERS ===

  withInstanceId(...ids: string[]): this {
    if (ids.length === 1) {
      this.filter.instanceId = ids[0];
    } else {
      this.filter.instanceId = ids;
    }
    return this;
  }

  withPublicId(...ids: string[]): this {
    if (ids.length === 1) {
      this.filter.publicId = ids[0];
    } else {
      this.filter.publicId = ids;
    }
    return this;
  }

  // === DECK/TOP-RELATED ===

  topDeck(owner: "self" | "opponent"): this {
    this.filter.topDeck = owner;
    return this;
  }

  // === SPECIAL FILTERS ===

  namedCard(cardName: string): this {
    this.filter.namedCard = cardName;
    return this;
  }

  // === LOGICAL OPERATORS ===

  and(...builders: LorcanaCardFilterBuilder[]): this;
  and(...filters: LorcanaCardFilterExtended[]): this;
  and(...args: (LorcanaCardFilterBuilder | LorcanaCardFilterExtended)[]): this {
    const filters = args.map((arg) =>
      arg instanceof LorcanaCardFilterBuilder ? arg.build() : arg,
    );
    this.filter.and = [...(this.filter.and || []), ...filters];
    return this;
  }

  or(...builders: LorcanaCardFilterBuilder[]): this;
  or(...filters: LorcanaCardFilterExtended[]): this;
  or(...args: (LorcanaCardFilterBuilder | LorcanaCardFilterExtended)[]): this {
    const filters = args.map((arg) =>
      arg instanceof LorcanaCardFilterBuilder ? arg.build() : arg,
    );
    this.filter.or = [...(this.filter.or || []), ...filters];
    return this;
  }

  not(builder: LorcanaCardFilterBuilder): this;
  not(filter: LorcanaCardFilterExtended): this;
  not(arg: LorcanaCardFilterBuilder | LorcanaCardFilterExtended): this {
    const filter = arg instanceof LorcanaCardFilterBuilder ? arg.build() : arg;
    this.filter.not = filter;
    return this;
  }

  // === MISC OPTIONS ===

  negate(value = true): this {
    this.filter.negate = value;
    return this;
  }

  ignoreBonuses(value = true): this {
    this.filter.ignoreBonuses = value;
    return this;
  }

  // === BUILD METHOD ===

  build(): LorcanaCardFilterExtended {
    return { ...this.filter };
  }

  // === STATIC FACTORY METHODS ===

  static create(): LorcanaCardFilterBuilder {
    return new LorcanaCardFilterBuilder();
  }

  static and(
    ...builders: LorcanaCardFilterBuilder[]
  ): LorcanaCardFilterBuilder {
    return new LorcanaCardFilterBuilder().and(...builders);
  }

  static or(...builders: LorcanaCardFilterBuilder[]): LorcanaCardFilterBuilder {
    return new LorcanaCardFilterBuilder().or(...builders);
  }
}
