/**
 * CRU177 Talishar, the Lost Prince — Generic Sword 2H — power 4.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}, put a rust counter on Talishar,
 *       the Lost Prince: Attack
 *   a2: At the beginning of your end phase, if Talishar, the Lost Prince
 *       has 3 or more rust counters on it, destroy it.
 *
 * Status: 🟡→✅ — a1 add-counter activation cost → 4-power attack proven;
 * a2 controller-scoped end-phase destroy at 3+ rust counters proven.
 * Card fix: a2 end-phase trigger gains `actor:"controller"` (bare
 * `end-phase` matches every seat — §7 `your end-phase actor` DTD222 family).
 * Reuses proven add-counter cost path (weapon-pilots4 charge) + the
 * `has-counter` condition evaluator.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { talisharTheLostPrince } from "../../../../../../cards/src/cards/weapons/talishar-the-lost-prince.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  game.helpers.resolveUntilIdle({
    optionalBoolean: true,
    entityTargets: "minimum",
    ordering: "listed",
  });
}

function rustCount(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  const meta = game.objectState(instanceId) as
    | { namedCounters?: Record<string, number> }
    | undefined;
  const named = typeof meta?.namedCounters === "object" ? meta.namedCounters : {};
  if (typeof named.rust === "number") return named.rust;
  const live = game.getState().objects[instanceId];
  if (!live) return 0;
  return live.counters
    .filter((counter) => counter.kind === "named" && counter.name === "rust")
    .reduce((sum, counter) => sum + counter.count, 0);
}

describe("talishar-the-lost-prince (CRU177)", () => {
  it("a1: {r}{r} + rust counter cost → 4-power attack, counter lands", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [talisharTheLostPrince],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const talisharId = Bravo.findCardInZone("weapon1", talisharTheLostPrince);
    const lifeBefore = Opp.life();

    expect(rustCount(game, talisharId)).toBe(0);
    Bravo.activate(talisharTheLostPrince);
    game.helpers.resolveRestOfCombat();

    // Counter cost paid: one rust counter sits on the weapon.
    expect(rustCount(game, talisharId)).toBe(1);
    // Attack resolves at base power 4 (undefended).
    expect(Opp.life()).toBe(lifeBefore - 4);
    // Resources spent: 2{r} cost.
    expect(game.getState().players[Bravo.id]?.resourcePoints).toBe(0);
  });

  it("a1 boundary: once per turn — second activation in the same turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [talisharTheLostPrince],
        hand: [],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(talisharTheLostPrince);
    game.helpers.resolveRestOfCombat();
    expect(() => Bravo.activate(talisharTheLostPrince)).toThrow();
  });

  it("a2: 3 rust counters → destroyed at the beginning of YOUR end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: talisharTheLostPrince, state: { namedCounters: { rust: 3 } } }],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const talisharId = Bravo.findCardInZone("weapon1", talisharTheLostPrince);
    game.setCounters(talisharId, { namedCounters: { rust: 3 } });

    expect(rustCount(game, talisharId)).toBe(3);

    Bravo.endTurn();
    drain(game);

    expect(Bravo.zone("weapon1")).not.toContain(talisharTheLostPrince.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(talisharTheLostPrince.canonicalId);
  });

  it("a2 boundary: 2 rust counters survive the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: talisharTheLostPrince, state: { namedCounters: { rust: 2 } } }],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const talisharId = Bravo.findCardInZone("weapon1", talisharTheLostPrince);
    game.setCounters(talisharId, { namedCounters: { rust: 2 } });

    Bravo.endTurn();
    drain(game);

    expect(Bravo.zone("weapon1")).toContain(talisharTheLostPrince.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(talisharTheLostPrince.canonicalId);
  });

  it("a2 boundary: opponent's end phase does not destroy the controller's Talishar", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: talisharTheLostPrince, state: { namedCounters: { rust: 3 } } }],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const talisharId = Bravo.findCardInZone("weapon1", talisharTheLostPrince);
    game.setCounters(talisharId, { namedCounters: { rust: 3 } });

    // Dash starts the game. Her end phase must not destroy Bravo's weapon even
    // though the fixture seats it at the three-rust threshold.
    expect(rustCount(game, talisharId)).toBe(3);
    Opp.endTurn();
    drain(game);
    expect(Bravo.zone("weapon1")).toContain(talisharTheLostPrince.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(talisharTheLostPrince.canonicalId);

    // Bravo's next end phase runs at 3+ counters → destroy.
    Bravo.endTurn();
    drain(game);
    expect(Bravo.zone("weapon1")).not.toContain(talisharTheLostPrince.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(talisharTheLostPrince.canonicalId);
  });
});
