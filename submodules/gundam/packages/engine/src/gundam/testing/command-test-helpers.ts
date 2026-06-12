/**
 * Command card test helpers.
 *
 * Shared utilities used by the per-card test files under
 * `packages/cards/src/cards/{set}/command/*.test.ts`. These helpers keep the
 * individual card tests short and consistent, while still exercising the full
 * engine pipeline (no stubbing of effect resolution).
 *
 * This file is test-only — it is not imported from any runtime code path.
 */

import type { Card } from "@tcg/gundam-types";
import type { ContinuousEffectEntry } from "../types.ts";
import { createMockResource } from "./card-mocks.ts";
import type { GundamTestEngine, TestCardEntry } from "./test-engine.ts";

// =============================================================================
// Resource helpers
// =============================================================================

/**
 * Build an array of ready (non-exhausted) resource entries.
 * Equivalent to the `resources(count)` helper each command test used to copy.
 */
export function activeResources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: false,
  }));
}

/**
 * Build an array of exhausted resource entries. Useful for checking that
 * "cost cannot be paid" validation kicks in.
 */
export function restedResources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: true,
  }));
}

// =============================================================================
// Continuous effect accessors
// =============================================================================

/**
 * Find the first `stat-modifier` continuous effect on `targetId` for the
 * requested stat. Returns `undefined` if none exists.
 */
export function findStatModifier(
  engine: GundamTestEngine,
  targetId: string,
  stat: "ap" | "hp" = "ap",
): { targetId: string; stat: "ap" | "hp"; modifier: number } | undefined {
  const effects = engine.getG().continuousEffects;
  for (const entry of effects) {
    if (entry.targetId !== targetId) continue;
    if (entry.payload.kind === "stat-modifier" && entry.payload.stat === stat) {
      return { targetId, stat, modifier: entry.payload.modifier };
    }
  }
  return undefined;
}

/**
 * Count `stat-modifier` continuous effects on `targetId` for the requested
 * stat. Handy for cards that can apply multiple buffs from one play.
 */
export function countStatModifiers(
  engine: GundamTestEngine,
  targetId: string,
  stat: "ap" | "hp" = "ap",
): number {
  return engine
    .getG()
    .continuousEffects.filter(
      (entry) =>
        entry.targetId === targetId &&
        entry.payload.kind === "stat-modifier" &&
        entry.payload.stat === stat,
    ).length;
}

/**
 * True if `targetId` has a `keyword-grant` continuous effect for `keyword`.
 */
export function hasKeywordGrant(
  engine: GundamTestEngine,
  targetId: string,
  keyword: string,
): boolean {
  return engine
    .getG()
    .continuousEffects.some(
      (entry) =>
        entry.targetId === targetId &&
        entry.payload.kind === "keyword-grant" &&
        entry.payload.keyword === keyword,
    );
}

/**
 * True if `targetId` has a `restriction` continuous effect with the given
 * restriction string. Named `hasContinuousRestriction` (rather than
 * `hasRestriction`) so it does not collide with the same-named function
 * exported from `../rules/derived-state.ts`.
 */
export function hasContinuousRestriction(
  engine: GundamTestEngine,
  targetId: string,
  restriction: string,
): boolean {
  return engine
    .getG()
    .continuousEffects.some(
      (entry) =>
        entry.targetId === targetId &&
        entry.payload.kind === "restriction" &&
        entry.payload.restriction === restriction,
    );
}

/**
 * True if `targetId` has a `prevent-damage` continuous effect.
 */
export function hasPreventDamage(engine: GundamTestEngine, targetId: string): boolean {
  return engine
    .getG()
    .continuousEffects.some(
      (entry) => entry.targetId === targetId && entry.payload.kind === "prevent-damage",
    );
}

/**
 * True if `playerId` has a `prevent-damage-to-zone` continuous effect for the
 * named zone.
 */
export function hasPreventDamageToZone(
  engine: GundamTestEngine,
  playerId: string,
  zone: string,
): boolean {
  return engine
    .getG()
    .continuousEffects.some(
      (entry) =>
        entry.targetId === playerId &&
        entry.payload.kind === "prevent-damage-to-zone" &&
        entry.payload.zone === zone,
    );
}

/**
 * True if `targetId` has a `force-attack-target` continuous effect.
 */
export function hasForceAttackTarget(engine: GundamTestEngine, targetId: string): boolean {
  return engine
    .getG()
    .continuousEffects.some(
      (entry) => entry.targetId === targetId && entry.payload.kind === "force-attack-target",
    );
}

/**
 * True if `targetId` has a `grant-attack-target-option` continuous effect
 * (permissive / may-choose attack target grant).
 */
export function hasGrantAttackTargetOption(engine: GundamTestEngine, targetId: string): boolean {
  return engine
    .getG()
    .continuousEffects.some(
      (entry) => entry.targetId === targetId && entry.payload.kind === "grant-attack-target-option",
    );
}

/**
 * Direct typed accessor to the `continuousEffects` array — avoids every test
 * file re-casting `engine.getG().continuousEffects` to the internal shape.
 */
export function getContinuousEffects(engine: GundamTestEngine): ContinuousEffectEntry[] {
  return engine.getG().continuousEffects;
}

// =============================================================================
// Card location / state accessors
// =============================================================================

/**
 * Assert that the currently pending combat has been intercepted by the
 * supplied blocker (rule 8-3 / 13-1-4). The engine does NOT re-point
 * `pendingCombat.target` at the blocker — it keeps the original target
 * and records the blocker in `pendingCombat.blockerId`, with
 * `stage = "blocker-declared"`. Damage resolution then routes through
 * the blocker.
 *
 * This helper folds the three-fields-in-one check so block-redirection
 * tests can stay terse:
 *
 *   p1.enterBattle(attacker, "direct");
 *   p2.declareBlock(blocker);
 *   expectAttackRedirectedTo(engine, blocker);
 */
export function expectAttackRedirectedTo(engine: GundamTestEngine, blockerId: string): void {
  const combat = engine.getG().turnMetadata.pendingCombat;
  if (!combat) {
    throw new Error(`expectAttackRedirectedTo: no pendingCombat present (blocker="${blockerId}")`);
  }
  if (combat.blockerId !== blockerId) {
    throw new Error(
      `expectAttackRedirectedTo: pendingCombat.blockerId is "${combat.blockerId ?? "undefined"}", expected "${blockerId}"`,
    );
  }
  if (combat.stage !== "blocker-declared") {
    throw new Error(
      `expectAttackRedirectedTo: pendingCombat.stage is "${combat.stage}", expected "blocker-declared"`,
    );
  }
}

/**
 * Return the zone key a card currently lives in, or `undefined` if the card
 * instance is not known to the engine.
 */
export function getCardZoneKey(engine: GundamTestEngine, cardId: string): string | undefined {
  return engine.getState().ctx.zones.private.cardIndex[cardId]?.zoneKey;
}

/**
 * Throw unless `cardId` is in the `trash` zone for `playerId`. This is the
 * final assertion every command test needs after a successful play.
 */
export function expectCardInTrash(
  engine: GundamTestEngine,
  cardId: string,
  playerId: string,
): void {
  const actual = getCardZoneKey(engine, cardId);
  const expected = `trash:${playerId}`;
  if (actual !== expected) {
    throw new Error(
      `Expected card "${cardId}" in zone "${expected}", but it is in "${actual ?? "unknown"}"`,
    );
  }
}

/**
 * Throw unless `cardId` is in `hand` for `playerId`.
 */
export function expectCardInHand(engine: GundamTestEngine, cardId: string, playerId: string): void {
  const actual = getCardZoneKey(engine, cardId);
  const expected = `hand:${playerId}`;
  if (actual !== expected) {
    throw new Error(
      `Expected card "${cardId}" in zone "${expected}", but it is in "${actual ?? "unknown"}"`,
    );
  }
}

/**
 * Get the damage counter on a card. Named `getDamageCounter` so it does not
 * collide with `getDamage(cardId, G)` exported from
 * `../rules/derived-state.ts`.
 */
export function getDamageCounter(engine: GundamTestEngine, cardId: string): number {
  return engine.getG().damage[cardId] ?? 0;
}

/**
 * Get the exhausted state of a card.
 */
export function isCardExhausted(engine: GundamTestEngine, cardId: string): boolean {
  return engine.getG().exhausted[cardId] ?? false;
}

// =============================================================================
// Link unit setup
// =============================================================================

/**
 * Mark a unit as a Link Unit for targeting purposes — short-circuits the
 * actual pilot-pairing move.
 *
 * Link-Unit status requires (rule 3-2-6-2):
 *   (a) the unit's definition has a `linkCondition`, and
 *   (b) a paired pilot's name satisfies that condition.
 *
 * To keep test setup terse, this helper mutates the unit definition to
 * carry `linkCondition: "[Synthetic Pilot]"` (if not already present)
 * and registers a synthetic pilot definition whose name matches. Safe
 * to call on a unit that already has a real `linkCondition`; in that
 * case the synthetic pilot name must include the bracketed requirement
 * to satisfy `satisfiesLinkCondition`.
 */
export function markAsLinkUnit(
  engine: GundamTestEngine,
  unitId: string,
  optsOrPilotId?: string | { pilotId?: string; pilotTraits?: string[] },
): void {
  const pilotId =
    typeof optsOrPilotId === "string"
      ? optsOrPilotId
      : (optsOrPilotId?.pilotId ?? `synthetic-pilot-${unitId}`);
  const pilotTraits = typeof optsOrPilotId === "object" ? (optsOrPilotId.pilotTraits ?? []) : [];
  const runtime = engine.getRuntime();
  // biome-ignore lint/suspicious/noExplicitAny: test-only access to internal maps
  const staticResources = (runtime as any).staticResources;
  const defs = staticResources.cardsMaps.definitions as Map<string, Card>;
  const instances = staticResources.cardsMaps.instances;

  const unitInstance = instances.get(unitId);
  const unitDef = unitInstance ? defs.get(unitInstance.definitionId) : undefined;
  if (!unitDef || unitDef.type !== "unit") {
    throw new Error(`markAsLinkUnit: no unit definition for ${unitId}`);
  }

  // Reuse any existing link requirement; default to a synthetic one
  // when the mock unit was created without one. The synthetic pilot
  // matches via name OR trait so trait-based link conditions like
  // "(AEUG) Trait" or "(Newtype)/(Cyber-Newtype) Trait" link as well.
  const existing = (unitDef as { linkCondition?: string }).linkCondition;
  const bracket = existing?.match(/\[([^\]]+)\]/)?.[1] ?? "Synthetic Pilot";
  const traitRequirements = existing
    ? [...existing.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]!.toLowerCase())
    : [];
  if (!existing) {
    (unitDef as { linkCondition?: string }).linkCondition = `[${bracket}]`;
  }

  // Register a minimal pilot definition whose name AND traits satisfy
  // the link condition, owned by the unit's controller so
  // pilotAssignments lookups resolve via the card index too. When the
  // unit has a trait-based linkCondition, the synthetic pilot inherits
  // those traits in addition to any explicitly-supplied `pilotTraits`.
  const ownerId = unitInstance?.ownerID;
  const traitsForPilot = [...pilotTraits, ...traitRequirements];
  const pilotDef: Card = {
    id: pilotId,
    type: "pilot",
    name: bracket,
    level: 1,
    cost: 1,
    // Populate array-shaped fields that downstream consumers (e.g.,
    // `resolveCombat`'s enemy-keyword scan at derived-state.ts:234, the
    // Link-Unit keyword-aggregation path at derived-state.ts:456, and
    // trait-matching predicates) iterate unconditionally. Leaving these
    // undefined crashes any test that exercises a pilot-paired unit
    // entering combat or being queried for keywords/traits.
    keywordEffects: [],
    traits: traitsForPilot,
    abilities: [],
    // `getEffectiveStats` unconditionally adds `pilot.apBonus` /
    // `pilot.hpBonus` to the paired unit's base stats. Leaving these
    // undefined poisons the unit's ap/hp with NaN, which in turn makes
    // `isDefeated` (`damage >= hp`) always false — so a `resolveCombat`
    // that should destroy the defender leaves it in battleArea with
    // `damage: NaN`. Default to 0 so `markAsLinkUnit` is purely a
    // pairing fixture and does not perturb combat math.
    apBonus: 0,
    hpBonus: 0,
    // biome-ignore lint/suspicious/noExplicitAny: Card shape varies by type; test mock intentionally minimal
  } as any;
  defs.set(pilotId, pilotDef);
  if (ownerId) {
    instances.register?.(pilotId, { definitionId: pilotId, ownerID: ownerId });
  }

  engine.getG().pilotAssignments[unitId] = pilotId;
}

// =============================================================================
// Shorthand
// =============================================================================

/**
 * Return the first card id in the given (hand/play) array of `TestCardEntry`
 * after seeding — matches the pattern `const [u1Id, u2Id] = p.getCardsInZone(...)`
 * by resolving a specific index.
 */
export function firstIdOr<T>(ids: readonly T[]): T {
  if (ids.length === 0) {
    throw new Error("Expected at least one id in the zone");
  }
  return ids[0] as T;
}

/**
 * Identity helper — re-exported for tests that import `Card` purely as a type.
 */
export type { Card };
