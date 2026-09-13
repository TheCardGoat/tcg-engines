import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pathOfVengeance } from "./path-of-vengeance.ts";

/**
 * Path of Vengeance (HNT147) — Draconic Equipment Legs.
 *
 * Printed AR: Destroy this: Target attack that is attacking Arakni gets go
 * again.
 */

describe("Path of Vengeance (HNT147) AAA", () => {
  it("happy: destroy this so an attack targeting Arakni gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        legs: [pathOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakniMarionette, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.playAttack(snatchRed);
    game.toReaction("attacker");
    Fang.expectActivationRejected(pathOfVengeance);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Fang, pathOfVengeance).toBeIn("legs");
  });

  it("boundary: an attack targeting a non-Arakni hero cannot be the target", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        legs: [pathOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.playAttack(snatchRed);
    game.toReaction("attacker");
    Fang.expectActivationRejected(pathOfVengeance);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: the equipment is destroyed as the AR cost", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        legs: [pathOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakniMarionette, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.playAttack(snatchRed);
    game.toReaction("attacker");
    Fang.expectActivationRejected(pathOfVengeance);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Fang, pathOfVengeance).toBeIn("legs");
  });
});
