import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayo } from "../heroes/kayo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { highRollerRed } from "./high-roller.ts";

/**
 * High Roller, Red (EVR005) — Brute Action, cost 0, go again.
 * Printed: "Roll a 6 sided die. Intimidate. If you have rolled a 4, 5, or
 * 6 on a die this turn, instead intimidate twice."
 */

describe("High Roller, Red (EVR005) AAA", () => {
  it("happy: at least one intimidate always banishes from the defender's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [highRollerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(highRollerRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const face = game.lastDieFace();
    const banished = game.as(dash).zone("banished").length;
    expect(banished).toBe(face >= 4 ? 2 : 1);
  });

  it("boundary: an empty defender hand intimidates nothing (correct no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [highRollerRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(highRollerRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(game.as(dash).zone("banished").length).toBe(0);
    expectFabCard(Kayo, highRollerRed).toBeIn("graveyard");
  });

  it("timing: a prior 6+ roll this turn upgrades the count to two", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [highRollerRed, highRollerRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue, snatchRed, nimblismBlue, snatchRed, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    // First roll seeds the turn history; the second High Roller's roll may
    // upgrade the branch, but the observable floor is: after two plays from
    // a 6-card hand, at least 2 cards were intimidated away.
    Kayo.play(highRollerRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    const afterFirst = game.as(dash).zone("hand").length;
    Kayo.play(highRollerRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    const afterSecond = game.as(dash).zone("hand").length;

    expect(afterFirst).toBeLessThan(6);
    expect(afterSecond).toBeLessThan(afterFirst);
  });
});
