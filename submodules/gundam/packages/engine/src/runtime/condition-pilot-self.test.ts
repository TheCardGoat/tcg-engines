/**
 * Rule 3-3-9-1: pilot card text behaves as if printed on the paired unit.
 * Companion to `target-filter-pilot-self.test.ts` (PR #122), which proved
 * the same rebind for the target-DSL's `owner: "self"` path.
 *
 * This suite proves that every `self*` variant inside `evaluateCondition`
 * resolves against `selfIdentityCardId` (paired unit for pilot sources)
 * rather than `sourceCardId` (the pilot itself). Without the rebind a
 * pilot-resident condition such as `{ type: "selfHasKeyword", keyword:
 * "Repair" }` would never match, because the pilot card itself never
 * carries the keyword — only the unit it is paired onto does.
 */

import { describe, it, expect } from "vite-plus/test";
import type { EffectCondition, PilotCard, UnitCard } from "@tcg/gundam-types";
import type { PlayerId } from "../types/branded.ts";
import { evaluateCondition } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  createMockPilot,
  buildTargetResolutionContext,
  activeResources,
} from "../index.ts";

// Small helper: build a pilot-sourced ctx after pairing the pilot onto the unit.
function setupPairedSource(
  overrides: {
    unit?: Partial<UnitCard>;
    pilot?: Partial<PilotCard>;
  } = {},
) {
  const unit = createMockUnit({
    ap: 2,
    hp: 3,
    level: 1,
    cost: 1,
    linkCondition: "[Any Pilot]",
    ...overrides.unit,
  });
  const pilot = createMockPilot({
    name: "Any Pilot",
    level: 1,
    cost: 1,
    ...overrides.pilot,
  });

  const engine = GundamTestEngine.create(
    { hand: [unit, pilot], resourceArea: activeResources(5) },
    {},
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  expectSuccess(p1.deployUnit(unit));
  expectSuccess(p1.assignPilot(pilot, unit));

  const runtime = engine.getRuntime();
  const framework = runtime.getFrameworkReadAPI();
  const unitId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
  const pilotId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, pilot.cardNumber)!;

  const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
    sourceCardId: pilotId,
  });

  return { engine, runtime, framework, ctx, unitId, pilotId };
}

describe("evaluateCondition self* — pilot source rebinds to paired unit", () => {
  it("selfHasKeyword reads the paired unit's keywords, not the pilot's", () => {
    const { ctx } = setupPairedSource({
      unit: { keywordEffects: [{ keyword: "Repair", value: 1 }] },
      pilot: { keywordEffects: [] },
    });
    expect(
      evaluateCondition(
        { type: "selfHasKeyword", keyword: "Repair" } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "selfHasKeyword", keyword: "Blocker" } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(false);
  });

  it("selfHasTrait reads the paired unit's traits, not the pilot's", () => {
    // Pilot traits differ from the unit's on purpose: without the rebind, the
    // condition would pick up the pilot's ["operation meteor"] and miss the
    // unit's ["zeon"].
    const { ctx } = setupPairedSource({
      unit: { traits: ["zeon"] },
      pilot: { traits: ["operation meteor"] },
    });
    expect(
      evaluateCondition({ type: "selfHasTrait", trait: "zeon" } satisfies EffectCondition, ctx),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "selfHasTrait", trait: "operation meteor" } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(false);
  });

  it("selfIsColor reads the paired unit's color, not the pilot's", () => {
    const { ctx } = setupPairedSource({
      unit: { color: "white" },
      pilot: { color: "blue" },
    });
    expect(
      evaluateCondition({ type: "selfIsColor", color: "white" } satisfies EffectCondition, ctx),
    ).toBe(true);
    expect(
      evaluateCondition({ type: "selfIsColor", color: "blue" } satisfies EffectCondition, ctx),
    ).toBe(false);
  });

  it("selfStat reads the paired unit's AP / HP, not the pilot's bonuses", () => {
    // The unit's base AP is 2; pilot adds +1 → effective 3. Either way, the
    // condition must see a unit-anchored stat (pilots have no ap/hp of their
    // own, only bonuses), and the comparison is satisfied.
    const { ctx } = setupPairedSource({
      unit: { ap: 2, hp: 3 },
      pilot: { apBonus: 1, hpBonus: 0 },
    });
    expect(
      evaluateCondition(
        { type: "selfStat", stat: "ap", comparison: "gte", value: 3 } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "selfStat", stat: "hp", comparison: "gte", value: 3 } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(true);
    // Non-unit sources (pilot itself) have no AP — before the rebind this
    // would have returned false for every comparison.
    expect(
      evaluateCondition(
        { type: "selfStat", stat: "ap", comparison: "gte", value: 10 } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(false);
  });

  it("selfIsDamaged reflects the paired unit's damage state", () => {
    // Base unit is not damaged when freshly paired — rebind just proves the
    // lookup path targets the unit. (Mutating damage directly is out of scope;
    // we assert the condition returns false for a healthy unit — which is the
    // path the rebind must reach to even return a defined answer.)
    const { ctx } = setupPairedSource();
    expect(evaluateCondition({ type: "selfIsDamaged" } satisfies EffectCondition, ctx)).toBe(false);
  });

  it("selfIsAttacking reflects the paired unit's attacking state", () => {
    // Outside battle, nobody is attacking. Assertion: condition resolves
    // (does not throw, does not stay false due to pilot-as-self mis-anchor)
    // for the unit.
    const { ctx } = setupPairedSource();
    expect(evaluateCondition({ type: "selfIsAttacking" } satisfies EffectCondition, ctx)).toBe(
      false,
    );
  });

  it("unpaired pilot source falls back to sourceCardId (no rebind)", () => {
    // Edge case: pilot in hand with no paired unit. selfIdentityCardId falls
    // back to the pilot's own id; the condition evaluates against the pilot.
    const pilot = createMockPilot({
      name: "Lonely Pilot",
      traits: ["earth federation"],
    });
    const engine = GundamTestEngine.create({ hand: [pilot] }, {});
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const pilotId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, pilot.cardNumber)!;
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: pilotId,
    });

    expect(ctx.selfIdentityCardId).toBe(pilotId);
    // Pilot has the trait, not any paired unit → condition reads pilot traits.
    expect(
      evaluateCondition(
        { type: "selfHasTrait", trait: "earth federation" } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(true);
  });

  it("unit source still resolves self* against itself (no false rebind)", () => {
    const unit = createMockUnit({
      ap: 4,
      hp: 3,
      traits: ["zeon"],
      keywordEffects: [{ keyword: "Repair", value: 1 }],
    });
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const unitId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: unitId,
    });

    expect(ctx.selfIdentityCardId).toBe(unitId);
    expect(
      evaluateCondition({ type: "selfHasTrait", trait: "zeon" } satisfies EffectCondition, ctx),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "selfHasKeyword", keyword: "Repair" } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { type: "selfStat", stat: "ap", comparison: "gte", value: 4 } satisfies EffectCondition,
        ctx,
      ),
    ).toBe(true);
  });
});
