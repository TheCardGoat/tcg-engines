import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { nourishingGlowBlue } from "../instants/nourishing-glow.ts";
import { shatteringStardustRed } from "./shattering-stardust.ts";

/**
 * Shattering Stardust (AZS014) — Lightning Illusionist Attack, 5{p}/3{d}.
 * Printed: Whenever this fragments, amp 1. When this hits a hero, you may
 * banish a lightning aura with no holo counters, then return it with a holo
 * counter. Fragment.
 */

describe("Shattering Stardust (AZS014) AAA", () => {
  it("happy: hitting a hero may return a Lightning aura with a holo counter", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [nourishingGlowBlue],
        hand: [shatteringStardustRed],
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(shatteringStardustRed);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Zyggy, nourishingGlowBlue).toBeIn("arena").toHaveCounters(1, "holo");
  });

  it("boundary: a miss does not offer the hit blink", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [nourishingGlowBlue],
        hand: [shatteringStardustRed],
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(shatteringStardustRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue, nimblismBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(Zyggy, nourishingGlowBlue).toHaveCounters(0, "holo");
  });

  it("timing: fragmenting still amps 1 even when the hit blink is declined", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [nourishingGlowBlue],
        hand: [shatteringStardustRed],
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(shatteringStardustRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Zyggy, nourishingGlowBlue).toHaveCounters(0, "holo");
    expectFabPlayer(Zyggy).toHaveTokenCount("embodiment-of-lightning", 0);
  });
});
