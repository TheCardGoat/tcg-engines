/**
 * Test helper builders for Riftbound targets
 *
 * Provides fluent builders for creating target objects in tests.
 * These match the types in @tcg/riftbound-types.
 */

import type {
  AnyTarget,
  CardType,
  Filter,
  Location,
  PlayerTarget,
  Quantity,
  SelfTarget,
  Target,
  TargetController,
  TriggerSourceTarget,
} from "@tcg/riftbound-types";

/**
 * Target builder helpers for tests
 */
export const Targets = {
  // Self references
  self: (): SelfTarget => ({ type: "self" }),
  selfString: (): "self" => "self",
  controller: (): "controller" => "controller",
  opponent: (): "opponent" => "opponent",
  triggerSource: (): TriggerSourceTarget => ({ type: "trigger-source" }),

  // Player targets
  player: (which: PlayerTarget["which"]): PlayerTarget => ({
    type: "player",
    which,
  }),

  // Card targets
  unit: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "unit",
    ...opts,
  }),

  gear: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "gear",
    ...opts,
  }),

  equipment: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "equipment",
    ...opts,
  }),

  spell: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "spell",
    ...opts,
  }),

  legend: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "legend",
    ...opts,
  }),

  rune: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "rune",
    ...opts,
  }),

  card: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "card",
    ...opts,
  }),

  permanent: (opts?: Partial<Omit<Target, "type">>): Target => ({
    type: "permanent",
    ...opts,
  }),

  // Controller-specific targets
  friendly: (
    cardType: CardType,
    opts?: Partial<Omit<Target, "type" | "controller">>,
  ): Target => ({
    type: cardType,
    controller: "friendly",
    ...opts,
  }),

  enemy: (
    cardType: CardType,
    opts?: Partial<Omit<Target, "type" | "controller">>,
  ): Target => ({
    type: cardType,
    controller: "enemy",
    ...opts,
  }),

  any: (
    cardType: CardType,
    opts?: Partial<Omit<Target, "type" | "controller">>,
  ): Target => ({
    type: cardType,
    controller: "any",
    ...opts,
  }),

  // Common unit targets
  friendlyUnit: (opts?: Partial<Omit<Target, "type" | "controller">>): Target =>
    Targets.friendly("unit", opts),

  enemyUnit: (opts?: Partial<Omit<Target, "type" | "controller">>): Target =>
    Targets.enemy("unit", opts),

  anyUnit: (opts?: Partial<Omit<Target, "type" | "controller">>): Target =>
    Targets.any("unit", opts),

  // Location-specific targets
  unitAtBattlefield: (
    opts?: Partial<Omit<Target, "type" | "location">>,
  ): Target => ({
    type: "unit",
    location: "battlefield",
    ...opts,
  }),

  unitHere: (opts?: Partial<Omit<Target, "type" | "location">>): Target => ({
    type: "unit",
    location: "here",
    ...opts,
  }),

  unitInBase: (opts?: Partial<Omit<Target, "type" | "location">>): Target => ({
    type: "unit",
    location: "base",
    ...opts,
  }),

  unitInTrash: (opts?: Partial<Omit<Target, "type" | "location">>): Target => ({
    type: "unit",
    location: "trash",
    ...opts,
  }),

  gearInTrash: (opts?: Partial<Omit<Target, "type" | "location">>): Target => ({
    type: "gear",
    location: "trash",
    ...opts,
  }),

  // Quantity helpers
  all: (target: Target): Target => ({
    ...target,
    quantity: "all",
  }),

  upTo: (count: number, target: Target): Target => ({
    ...target,
    quantity: { upTo: count },
  }),

  exactly: (count: number, target: Target): Target => ({
    ...target,
    quantity: count,
  }),

  // Filter helpers
  withFilter: (target: Target, filter: Filter | Filter[]): Target => ({
    ...target,
    filter,
  }),

  withTag: (target: Target, tag: string): Target => ({
    ...target,
    filter: { tag },
  }),

  withMight: (
    target: Target,
    comparison: {
      eq?: number;
      lt?: number;
      lte?: number;
      gt?: number;
      gte?: number;
    },
  ): Target => ({
    ...target,
    filter: { might: comparison },
  }),

  withKeyword: (target: Target, keyword: string): Target => ({
    ...target,
    filter: { keyword },
  }),

  // Exclude self
  excludingSelf: (target: Target): Target => ({
    ...target,
    excludeSelf: true,
  }),

  // Optional targeting
  optionally: (target: Target): Target => ({
    ...target,
    optional: true,
  }),
};
