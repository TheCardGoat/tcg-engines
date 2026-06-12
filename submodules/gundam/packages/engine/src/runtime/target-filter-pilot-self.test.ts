/**
 * Rule 3-3-9-1: text printed on a pilot card belongs to the pilot, but
 * "this Unit" in that text refers to the paired unit. When a pilot
 * source evaluates a target filter with `owner: "self"`, the filter
 * must resolve against the paired unit's id — otherwise
 * `{ owner: "self", cardType: "unit" }` can never match (a pilot is
 * not a unit) and Char Aznable / Heero Yuy / Kira Yamato's "this Unit"
 * directives silently drop.
 *
 * Complementary guard: `cardType: "unit"` filters without an
 * `owner: "self"` anchor should still exclude pilots — our scan now
 * iterates pilots in battleArea, but the type filter keeps them out of
 * e.g. "your friendly unit gets AP+1" target sets.
 */

import { describe, it, expect } from "vite-plus/test";
import type { PlayerId } from "../types/branded.ts";
import { evaluateTargetFilter } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  buildTargetResolutionContext,
  createMockUnit,
  createMockPilot,
  expectSuccess,
  activeResources,
} from "../index.ts";

describe("TargetFilter owner:self — pilot source rebinds to paired unit", () => {
  it('{ owner: "self", cardType: "unit" } on a pilot source matches the paired unit', () => {
    const unit = createMockUnit({
      ap: 2,
      hp: 3,
      level: 1,
      cost: 1,
      linkCondition: "[Any Pilot]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({
      name: "Any Pilot",
      level: 1,
      cost: 1,
    } as unknown as Parameters<typeof createMockPilot>[0]);

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

    // Source = pilot card. `owner: "self"` should resolve to the paired unit.
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: pilotId,
    });

    const candidates = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_ONE })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter({ owner: "self", cardType: "unit" }, candidates, ctx);
    expect(matched).toContain(unitId);
    expect(matched).not.toContain(pilotId);
  });

  it('{ owner: "friendly", cardType: "unit" } scan does not over-match paired pilots', () => {
    // Passive scan / executor iterate every battleArea card, which now
    // includes paired pilots. The type filter must still keep pilots out
    // of unit-only target sets so unit-wide buffs don't accidentally
    // apply to pilots.
    const unit = createMockUnit({ ap: 2, hp: 3, level: 1, cost: 1 });
    const pilot = createMockPilot({ name: "Some Pilot", level: 1, cost: 1 });

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

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework);

    const candidates = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_ONE })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter({ owner: "friendly", cardType: "unit" }, candidates, ctx);
    expect(matched).toContain(unitId);
    expect(matched).not.toContain(pilotId);
  });

  it("falls back to sourceCardId for unpaired pilot sources", () => {
    // Edge case: a pilot sitting in hand / shield (unpaired). With no
    // paired unit to rebind onto, `owner: "self"` keeps pointing at the
    // pilot itself — which correctly yields an empty match for any
    // `cardType: "unit"` filter.
    const pilot = createMockPilot({ name: "Lonely Pilot", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [pilot] }, {});
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const pilotId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, pilot.cardNumber)!;

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: pilotId,
    });

    // No pairing → selfIdentityCardId falls back to the pilot's own id.
    expect(ctx.selfIdentityCardId).toBe(pilotId);
  });
});

describe("TargetResolutionContext.selfIdentityCardId (cross-player)", () => {
  it("does not rebind when the source is a unit", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const unitId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: unitId,
    });
    expect(ctx.selfIdentityCardId).toBe(unitId);
    expect(ctx.sourceCardId).toBe(unitId);
  });

  it("opponent's paired pilot does not rebind onto our controller's unit", () => {
    // Sanity: rebind keys off pilotAssignments by pilot ID, regardless of
    // which player's unit owns the pairing. The pilot's paired-unit
    // lookup finds the correct unit even when evaluating as the
    // opponent's perspective.
    const unit = createMockUnit({
      ap: 2,
      hp: 3,
      linkCondition: "[Any Pilot]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({ name: "Any Pilot" });
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

    // Evaluate as PLAYER_TWO (opponent) with PLAYER_ONE's pilot as source.
    // selfIdentity still finds the paired unit because the lookup is by
    // pilot id, not by player id.
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_TWO, framework, {
      sourceCardId: pilotId,
    });
    expect(ctx.selfIdentityCardId).toBe(unitId);
  });
});
