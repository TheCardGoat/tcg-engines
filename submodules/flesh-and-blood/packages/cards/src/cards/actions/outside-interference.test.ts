import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { tearDownTheIdolsRed } from "./tear-down-the-idols.ts";
import { outsideInterferenceBlue } from "./outside-interference.ts";

/**
 * Outside Interference (SUP066) — Reviled Brute Action Attack, blue, cost 3, 6{p}.
 *
 * Printed: "Instant - Discard this: You may reveal a Reviled attack action
 * card from your inventory and put it into your hand."
 */

describe("Outside Interference (SUP066) AAA", () => {
  it("happy: Instant discards this and puts a Reviled attack action from inventory into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [outsideInterferenceBlue],
        inventory: [tearDownTheIdolsRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.activate(outsideInterferenceBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expectFabCard(Kayo, outsideInterferenceBlue).toBeIn("graveyard");
    expectFabCard(Kayo, tearDownTheIdolsRed).toBeIn("hand");
  });

  it("boundary: declining the optional leaves inventory in place after the discard", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [outsideInterferenceBlue],
        inventory: [tearDownTheIdolsRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.activate(outsideInterferenceBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Kayo, outsideInterferenceBlue).toBeIn("graveyard");
    expect(Kayo.zone("inventory")).toContain(tearDownTheIdolsRed.canonicalId);
    expect(Kayo.zone("hand")).not.toContain(tearDownTheIdolsRed.canonicalId);
  });

  it("boundary: playing it as an attack deals printed 6 and does not fetch inventory", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [outsideInterferenceBlue],
        inventory: [tearDownTheIdolsRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(outsideInterferenceBlue);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Kayo, outsideInterferenceBlue).toBeIn("graveyard");
    expect(Kayo.zone("inventory")).toContain(tearDownTheIdolsRed.canonicalId);
  });
});
