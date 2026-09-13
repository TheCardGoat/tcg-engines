import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { riftBindBlue } from "../actions/rift-bind.ts";
import { chaneBoundByShadow } from "./chane-bound-by-shadow.ts";

/**
 * Chane, Bound by Shadow (MON153) — Shadow Runeblade Hero 40hp.
 *
 * Printed Action: Create a Soul Shackle token: Your next Runeblade or Shadow
 * action this turn gains go again. Go again. Once per turn.
 */

describe("Chane, Bound by Shadow (MON153) AAA", () => {
  it("happy: create a Soul Shackle so the next Shadow action gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chaneBoundByShadow,
        hand: [riftBindBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chaneBoundByShadow);

    Chane.activate(chaneBoundByShadow);
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Chane).toHaveTokenCount("soul-shackle", 1);
    Chane.playAttack(riftBindBlue);

    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: a Generic action does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chaneBoundByShadow,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chaneBoundByShadow);

    Chane.activate(chaneBoundByShadow);
    game.untilIdle({ ordering: "listed" });
    Chane.playAttack(snatchRed);

    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("boundary: once-per-turn rejects a second activation", () => {
    const game = FabTestEngine.start(
      {
        hero: chaneBoundByShadow,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chaneBoundByShadow);

    Chane.activate(chaneBoundByShadow);
    game.untilIdle({ ordering: "listed" });
    Chane.expectActivationRejected(chaneBoundByShadow);
    expectFabPlayer(Chane).toHaveLife(40);
  });
});
