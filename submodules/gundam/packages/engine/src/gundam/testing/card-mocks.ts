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

import type { UnitCard, PilotCard, CommandCard, BaseCard, ResourceCard } from "@tcg/gundam-types";

let mockCounter = 0;

function uid(prefix: string): string {
  return `${prefix}-MOCK-${(++mockCounter).toString().padStart(4, "0")}`;
}

/**
 * Create a minimal UnitCard. Defaults: level 1, cost 1, ap 2, hp 3.
 */
export function createMockUnit(overrides: Partial<UnitCard> = {}): UnitCard {
  return {
    cardNumber: uid("TEST-U"),
    name: "Test Unit",
    type: "unit",
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
  return {
    cardNumber: uid("TEST-R"),
    name: "Test Resource",
    type: "resource",
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
  return {
    cardNumber: uid("TEST-C"),
    name: "Test Command",
    type: "command",
    color: "blue",
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
  return {
    cardNumber: uid("TEST-P"),
    name: "Test Pilot",
    type: "pilot",
    color: "blue",
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
  return {
    cardNumber: uid("TEST-B"),
    name: "Test Base",
    type: "base",
    traits: [],
    level: 0,
    cost: 0,
    hp: 5,
    keywordEffects: [],
    rarity: "common",
    ...overrides,
  };
}
