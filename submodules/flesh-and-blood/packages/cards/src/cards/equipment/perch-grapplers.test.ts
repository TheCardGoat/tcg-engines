import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { drillShotRed } from "../actions/drill-shot.ts";
import { snatchRed } from "../actions/snatch.ts";
import { perchGrapplers } from "./perch-grapplers.ts";

/**
 * Perch Grapplers (1HP227) — Ranger Legs d2, Blade Break.
 * Printed: "Action - {r}{r}, destroy Perch Grapplers: Until end of turn, face
 * up arrow cards played from arsenal gain go again. Go again"
 */

describe("Perch Grapplers (1HP227) AAA", () => {
  it("happy: an arrow played from arsenal after activating resolves with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        legs: [perchGrapplers],
        weapon1: [deathDealer],
        arsenal: [drillShotRed],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(perchGrapplers);
    game.untilIdle();
    // Perch Grapplers' own go again refunds the action point it cost.
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, perchGrapplers).toBeIn("graveyard");

    Azalea.play(drillShotRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    // The arsenal arrow resolves with the granted go again — AP is refunded.
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16); // 20 - 4
  });

  it("boundary: a non-arrow played from arsenal gets no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        legs: [perchGrapplers],
        weapon1: [deathDealer],
        arsenal: [snatchRed],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(perchGrapplers);
    game.untilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.play(snatchRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    // Snatch is not an arrow — its action point stays spent.
    expectFabPlayer(Azalea).toHaveAP(0);
  });
});
