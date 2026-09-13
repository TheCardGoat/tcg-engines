import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchYellow } from "../actions/snatch.ts";
import { graspOfTheDarknight } from "./grasp-of-the-darknight.ts";

/**
 * Grasp of the Darknight — Shadow Runeblade Equipment - Arms, d0.
 *
 * Printed: "Action - {r}, destroy this: Opt 1, then create a Runechant
 * token. Go again"
 */

describe("Grasp of the Darknight (IAR109) AAA", () => {
  it("happy: pay {r} and destroy this to Opt 1, create a Runechant, and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        arms: [graspOfTheDarknight],
        hand: [],
        deckTop: [snatchYellow],
        deck: 6,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.activate(graspOfTheDarknight, { optBottom: 1 });
    game.helpers.resolveUntilIdle();

    expectFabCard(Chane, graspOfTheDarknight).toBeIn("graveyard");
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1);
    // Go again refunded the action point spent on the activation.
    expectFabPlayer(Chane).toHaveAP(1);
    // Opt 1 answered to the bottom: the looked-at card is no longer on top.
    expect(Chane.zone("deck")[0]).not.toBe(Chane.findCardInZone("deck", snatchYellow));
  });

  it("boundary: without {r} the activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        arms: [graspOfTheDarknight],
        hand: [],
        deck: 6,
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.expectActivationRejected(graspOfTheDarknight);
    expectFabCard(Chane, graspOfTheDarknight).toBeIn("arms");
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 0);
  });
});
