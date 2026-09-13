/**
 * AAA test for trigger:crank.
 * Representative card: Puffin Hightail (SEA001) — Pirate Mechanologist Hero.
 * Static triggered ability: "The second time you crank each turn, draw a card."
 * The crank event is produced by the play-card crank keyword procedure (CR 8.3.29).
 */
import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "../../../../index.ts";
import { dash } from "../../../fixtures.ts";
import { puffinHightail } from "../../../../../../cards/src/cards/heroes/puffin-hightail.ts";
import { grindingGearsBlue } from "../../../../../../cards/src/cards/actions/grinding-gears.ts";

describe("trigger: crank", () => {
  it("AAA: Puffin Hightail draws a card on the second crank each turn (CR 8.3.29)", () => {
    // Arrange — Puffin with two Grinding Gears (cost 0, crank keyword) in hand.
    const game = FabTestEngine.start(
      { hero: puffinHightail, hand: [grindingGearsBlue, grindingGearsBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Puffin = game.as(puffinHightail);

    // Act — first crank (occurrence 1; Puffin limit ordinals [2] skips it).
    Puffin.play(grindingGearsBlue);

    // Second crank (occurrence 2; Puffin's trigger fires → draw 1 card).
    Puffin.play(grindingGearsBlue);

    // Assert — started with 2 cards in hand, played both, drew 1 from trigger.
    expectFabPlayer(Puffin).toHaveHandCount(1);
  });
});
