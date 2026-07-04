/**
 * Gundam TCG — Mock Card Factories
 *
 * Shared factories for constructing minimal, valid card definitions in tests.
 * Each factory generates a unique cardNumber so instances are distinguishable.
 *
 * @example
 * ```ts
 * const unit = createMockUnit({ ap: 5, hp: 3 });
 * const resource = createMockResource();
 * const cmd = createMockCommand({ pilotName: "Test Pilot", apBonus: 1, hpBonus: 0 });
 * ```
 */

import type {
  UnitCard,
  PilotCard,
  CommandCard,
  BaseCard,
  ResourceCard,
  CardPrinting,
} from "@tcg/gundam-types";

let mockCounter = 0;

function uid(prefix: string): string {
  return `${prefix}-MOCK-${(++mockCounter).toString().padStart(4, "0")}`;
}

/**
 * Build the minimal catalog-identity block (`canonicalId`, `slug`, `printings`)
 * required by `BaseCardDefinition` for a mock card. Mock cards do not flow
 * through the catalog generator, so this synthesizes a single degenerate
 * printing whose `artId === canonicalId` (base art). Returned fields are
 * deterministic from `cardNumber` + `name` so mock instances stay distinct.
 */
export function mockCatalogFields(
  cardNumber: string,
  name: string,
): {
  canonicalId: string;
  slug: string;
  printings: CardPrinting[];
} {
  const canonicalId = cardNumber.replace(/[-_]p\d+$/i, "");
  const slug = `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${cardNumber.toLowerCase()}`;
  const printing: CardPrinting = {
    id: cardNumber,
    artId: canonicalId,
    setCode: "MOCK",
    collectorNumber: cardNumber,
    cardNumber,
    set: { code: "MOCK", name: "Mock" },
    rarity: "common",
    finish: "standard",
    imageUrl: "",
  };
  return { canonicalId, slug, printings: [printing] };
}

/**
 * Create a minimal UnitCard. Defaults: level 1, cost 1, ap 2, hp 3.
 */
export function createMockUnit(overrides: Partial<UnitCard> = {}): UnitCard {
  const cardNumber = uid("TEST-U");
  return {
    cardNumber,
    name: "Test Unit",
    type: "unit",
    ...mockCatalogFields(cardNumber, "Test Unit"),
    traits: [],
    level: 1,
    cost: 1,
    keywordEffects: [],
    rarity: "common",
    ap: 2,
    hp: 3,
    ...overrides,
  };
}

/**
 * Create a minimal ResourceCard. Defaults: level 0, cost 0.
 */
export function createMockResource(overrides: Partial<ResourceCard> = {}): ResourceCard {
  const cardNumber = uid("TEST-R");
  return {
    cardNumber,
    name: "Test Resource",
    type: "resource",
    ...mockCatalogFields(cardNumber, "Test Resource"),
    traits: [],
    level: 0,
    cost: 0,
    keywordEffects: [],
    rarity: "common",
    ...overrides,
  };
}

/**
 * Create a minimal CommandCard. Defaults: blue, level 1, cost 1, no pilot mode.
 */
export function createMockCommand(overrides: Partial<CommandCard> = {}): CommandCard {
  const cardNumber = uid("TEST-C");
  return {
    cardNumber,
    name: "Test Command",
    type: "command",
    color: "blue",
    ...mockCatalogFields(cardNumber, "Test Command"),
    traits: [],
    level: 1,
    cost: 1,
    keywordEffects: [],
    rarity: "common",
    ...overrides,
  };
}

/**
 * Create a minimal PilotCard. Defaults: blue, level 1, cost 1, apBonus 1, hpBonus 1.
 */
export function createMockPilot(overrides: Partial<PilotCard> = {}): PilotCard {
  const cardNumber = uid("TEST-P");
  return {
    cardNumber,
    name: "Test Pilot",
    type: "pilot",
    color: "blue",
    ...mockCatalogFields(cardNumber, "Test Pilot"),
    traits: [],
    level: 1,
    cost: 1,
    apBonus: 1,
    hpBonus: 1,
    keywordEffects: [],
    rarity: "common",
    ...overrides,
  };
}

/**
 * Create a minimal BaseCard. Defaults: level 0, cost 0, hp 5.
 */
export function createMockBase(overrides: Partial<BaseCard> = {}): BaseCard {
  const cardNumber = uid("TEST-B");
  return {
    cardNumber,
    name: "Test Base",
    type: "base",
    ...mockCatalogFields(cardNumber, "Test Base"),
    traits: [],
    level: 0,
    cost: 0,
    hp: 5,
    keywordEffects: [],
    rarity: "common",
    ...overrides,
  };
}
