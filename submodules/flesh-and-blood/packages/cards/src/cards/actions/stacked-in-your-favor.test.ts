import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { stackedInYourFavorRed } from "./stacked-in-your-favor.ts";

/**
 * Stacked in Your Favor Red (HVY068) — Guardian Action Aura. Go again.
 *
 * Printed: Your attack action cards get +3{d} while defending.
 * At the start of your turn, destroy this, draw a card, then put a card
 * from your hand on top of your deck.
 */

describe("Stacked in Your Favor (HVY068) AAA", () => {
  it("happy: start-of-turn destroy draws and tops a card back", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [stackedInYourFavorRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(stackedInYourFavorRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, stackedInYourFavorRed).toBeIn("arena");

    // Cycle: at Bravo's next turn start — destroy, draw 1, top 1 from hand.
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      optionalBoolean: false,
    });

    expectFabCard(Bravo, stackedInYourFavorRed).toBeIn("graveyard");
    // Deck 4 drew naturally (intellect 4); the destroy-draw found an empty
    // deck; the top-from-hand leg moved one card back: hand 1+4-1=4, deck 1.
    expectFabPlayer(Bravo).toHaveHandCount(4);
    expect(Bravo.zone("deck")).toHaveLength(1);
  });
});
