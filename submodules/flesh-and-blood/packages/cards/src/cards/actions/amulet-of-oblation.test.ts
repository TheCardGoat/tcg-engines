import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { amuletOfOblationBlue } from "./amulet-of-oblation.ts";

/**
 * Amulet of Oblation (EVR181) — Generic Item, cost 0, Go again.
 *
 * Printed Instant: Destroy this: Until end of turn, target attack action gains
 * "If this would be put into a graveyard, instead put it on the bottom of its
 * owner's deck." Activate only if a card has entered a graveyard this turn.
 */

describe("Amulet of Oblation (EVR181) AAA", () => {
  it("after a card enters a graveyard this turn, the Instant can destroy this targeting the chain attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfOblationBlue],
        hand: [nimblismBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimblismBlue);
    game.untilIdle();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.activate(amuletOfOblationBlue);
    game.untilIdle();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, amuletOfOblationBlue).toBeIn("graveyard");
  });

  it("boundary: cannot activate if no card has entered a graveyard this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfOblationBlue],
        hand: [snatchRed],
        graveyard: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(amuletOfOblationBlue);
    expectFabCard(Dash, amuletOfOblationBlue).toBeIn("arena");
  });

  it("timing: the Instant cannot activate from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [amuletOfOblationBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(amuletOfOblationBlue);
    expectFabCard(Dash, amuletOfOblationBlue).toBeIn("hand");
  });
});
