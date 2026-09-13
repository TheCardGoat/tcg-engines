import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { loyaltyBeyondTheGraveRed } from "./loyalty-beyond-the-grave.ts";

describe("Loyalty Beyond the Grave (HNT150) AAA", () => {
  it("happy: at the start of your turn, banish 2 copies from GY and draw a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, actionPoints: 1, intellect: 0 },
      {
        hero: bravo,
        hand: [],
        graveyard: [loyaltyBeyondTheGraveRed, loyaltyBeyondTheGraveRed],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expect(Bravo.zone("banished")).toHaveLength(2);
    expect(Bravo.zone("graveyard")).toHaveLength(0);
    // Draw-to-intellect fills to 4; the if-you-do draw is the extra card.
    expectFabPlayer(Bravo).toHaveHandCount(5);
  });

  it("boundary: one GY copy cannot banish two and stays in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, actionPoints: 1, intellect: 0 },
      {
        hero: bravo,
        hand: [],
        graveyard: [loyaltyBeyondTheGraveRed],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Bravo, loyaltyBeyondTheGraveRed).toBeIn("graveyard");
    expect(Bravo.zone("banished")).toHaveLength(0);
  });

  it("timing: 3{d} Defense Reaction blocks from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [loyaltyBeyondTheGraveRed], life: 20, resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.must.playReaction(loyaltyBeyondTheGraveRed);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, loyaltyBeyondTheGraveRed).toBeIn("graveyard");
  });
});
