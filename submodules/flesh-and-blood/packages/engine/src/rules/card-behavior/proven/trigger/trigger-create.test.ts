/**
 * AAA test for trigger:create.
 * Representative card: Victor Goldmane, High and Mighty (HVY047) — Guardian Hero.
 * Triggered ability a1: "The first time each turn you create a Gold token from
 * an effect you control, draw a card."
 *
 * Trigger: { name: "create", actor: "controller", filter: { name: "Gold" } }
 * Limit: first per turn.
 * Effect: draw 1 card.
 */
import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "../../../../index.ts";
import { bravo } from "../../../fixtures.ts";
import { victorGoldmaneHighAndMighty } from "../../../../../../cards/src/cards/heroes/victor-goldmane-high-and-mighty.ts";
import { visitGoldmaneEstateBlue } from "../../../../../../cards/src/cards/actions/visit-goldmane-estate.ts";

describe("trigger: create", () => {
  it("AAA: Victor Goldmane draws a card the first time he creates a Gold token each turn (CR 6.6)", () => {
    // Arrange — Victor has Visit Goldmane Estate (cost 1, creates a Gold token)
    // in hand with enough resources and a deck to draw from.
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneHighAndMighty,
        hand: [visitGoldmaneEstateBlue],
        deck: 4,
        resourcePoints: 1,
      },
      { hero: bravo, deck: 4 },
    );
    const Victor = game.as(victorGoldmaneHighAndMighty);

    // Act — play Visit Goldmane Estate. It creates a Gold token, firing
    // Victor's a1 "first Gold token each turn draws a card" trigger.
    Victor.play(visitGoldmaneEstateBlue);

    // Assert — Victor drew 1 card from the trigger. He played 1 card from
    // hand, then drew 1 back, so hand count is 1.
    expectFabPlayer(Victor).toHaveHandCount(1);
  });
});
