import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { sicEmShotBlue, sicEmShotRed } from "../actions/sic-em-shot.ts";
import { sealaceSarong } from "./sealace-sarong.ts";

/**
 * Sealace Sarong — Ranger Legs d2, Blade Break.
 *
 * Printed: "Instant - {t}, turn a blue arrow in your arsenal face-up: it gets
 * go again this turn. Blade Break"
 */

describe("Sealace Sarong (AAA) AAA", () => {
  it("happy: the face-up blue arrow attacks with go again and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        legs: [sealaceSarong],
        arsenal: [{ card: sicEmShotBlue, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.activate(sealaceSarong);
    game.passBoth(); // the Instant resolves, granting the arrow go again

    expectFabCard(Azalea, sicEmShotBlue).toBeIn("arsenal");
    expectFabCard(Azalea, sicEmShotBlue).toBeFaceUp();
    expectFabCard(Azalea, sealaceSarong).toBeTapped();

    Azalea.playFromArsenal(sicEmShotBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    // The granted go again pays the arrow's action point back.
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: a face-down red arrow cannot be turned face-up by the sarong", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        legs: [sealaceSarong],
        arsenal: [{ card: sicEmShotRed, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.expectActivationRejected(sealaceSarong);
    expectFabCard(Azalea, sealaceSarong).toBeIn("legs");
    expectFabCard(Azalea, sicEmShotRed).toBeFaceDown();
  });
});
