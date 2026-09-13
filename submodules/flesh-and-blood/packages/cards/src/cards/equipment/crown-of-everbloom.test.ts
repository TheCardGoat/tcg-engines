import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { snatchRed } from "../actions/snatch.ts";
import { crownOfEverbloom } from "./crown-of-everbloom.ts";

/**
 * Crown of Everbloom (PEN215) — Earth Head.
 *
 * Printed:
 *   Instant - Destroy this: Put a card from your arsenal on the bottom of your
 *   deck. If you do, draw a card and create a Spellbane Aegis token.
 */

describe("Crown of Everbloom (PEN215) AAA", () => {
  it("happy: arsenal to bottom draws a card and creates Spellbane Aegis", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfEverbloom],
        arsenal: [nimbleStrikeRed],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(crownOfEverbloom);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: nimbleStrikeRed.canonicalId });

    expectFabCard(Bravo, crownOfEverbloom).toBeIn("graveyard");
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(Bravo.zone("deck")[0]).toBe(nimbleStrikeRed.canonicalId);
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expect(Bravo.zone("arena")).toContain("token:spellbane-aegis");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: empty arsenal still destroys this but skips the if-you-do", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfEverbloom],
        arsenal: [],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(crownOfEverbloom);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, crownOfEverbloom).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(0);
    expect(Bravo.zone("arena")).not.toContain("token:spellbane-aegis");
  });

  it("timing: Instant destroy spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfEverbloom],
        arsenal: [nimbleStrikeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(crownOfEverbloom);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, crownOfEverbloom).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
