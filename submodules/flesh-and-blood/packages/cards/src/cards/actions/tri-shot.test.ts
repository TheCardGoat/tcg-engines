import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { dash } from "../heroes/dash.ts";
import { triShotBlue } from "./tri-shot.ts";

/**
 * Tri-Shot (EVR089) — Ranger Action, cost 0, go again.
 *
 * Printed: You may activate target bow you control 2 additional times this turn.
 */

describe("Tri-Shot (EVR089) AAA", () => {
  it("happy: the targeted bow can be activated 3 times this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [triShotBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(triShotBlue, { target: Azalea.findCardInZone("weapon1", deathDealer) });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.activate(deathDealer);
    game.untilIdle({ optionals: "decline" });
    Azalea.activate(deathDealer);
    game.untilIdle({ optionals: "decline" });
    Azalea.activate(deathDealer);
    game.untilIdle({ optionals: "decline" });

    Azalea.expectActivationRejected(deathDealer);
  });

  it("boundary: without Tri-Shot the bow's once-per-turn limit holds", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(deathDealer);
    game.untilIdle({ optionals: "decline" });
    Azalea.expectActivationRejected(deathDealer);
  });

  it("timing: go again refunds the Action point so the extra activations can pay {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [triShotBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(triShotBlue, { target: Azalea.findCardInZone("weapon1", deathDealer) });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);
    Azalea.activate(deathDealer);
    game.untilIdle({ optionals: "decline" });
    expectFabPlayer(Azalea).toHaveAP(1);
  });
});
