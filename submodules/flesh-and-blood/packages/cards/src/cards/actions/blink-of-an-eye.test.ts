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
import { blinkOfAnEyeRed } from "./blink-of-an-eye.ts";

/**
 * Blink of an Eye (AZS007) — Lightning Illusionist Attack, 7{p}/3{d}. Fragment.
 * Printed: Whenever this fragments, you may banish a Lightning aura permanent
 * you control with no holo counters, then return it to the arena with a holo
 * counter.
 */

describe("Blink of an Eye (AZS007) AAA", () => {
  it("happy: fragmenting may return a Lightning aura with a holo counter", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [nourishingGlowBlue],
        hand: [blinkOfAnEyeRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(blinkOfAnEyeRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Zyggy, nourishingGlowBlue).toBeIn("arena").toHaveCounters(1, "holo");
  });

  it("boundary: without a qualifying block this does not fragment", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [nourishingGlowBlue],
        hand: [blinkOfAnEyeRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(blinkOfAnEyeRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Zyggy, nourishingGlowBlue).toHaveCounters(0, "holo");
    expectFabCard(Zyggy, blinkOfAnEyeRed).toBeIn("graveyard");
  });

  it("timing: declining the fragment blink leaves the aura without a holo counter", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [nourishingGlowBlue],
        hand: [blinkOfAnEyeRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(blinkOfAnEyeRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Zyggy, nourishingGlowBlue).toBeIn("arena").toHaveCounters(0, "holo");
  });
});
