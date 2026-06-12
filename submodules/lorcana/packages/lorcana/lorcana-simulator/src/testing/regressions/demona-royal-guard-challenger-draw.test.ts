import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { royalGuardOctopusSoldier } from "@tcg/lorcana-cards/cards/008";
import { demonaScourgeOfTheWyvernClan } from "@tcg/lorcana-cards/cards/010";

/**
 * Regression: Royal Guard - Octopus Soldier's HEAVILY ARMED gains Challenger +1
 * for every card drawn that turn. When Demona - Scourge of the Wyvern Clan
 * is played and both players draw up to 3, Royal Guard should stack
 * Challenger +N equal to the number of cards drawn by its controller.
 */
describe("Royal Guard + Demona (AD SAXUM COMMUTATE) - stacks Challenger from each draw", () => {
  it("grants Challenger +2 to Royal Guard when Demona draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: royalGuardOctopusSoldier, isDrying: false }],
        hand: [demonaScourgeOfTheWyvernClan],
        inkwell: demonaScourgeOfTheWyvernClan.cost,
        // Hand has 1 card before play (Demona), so after playing Demona hand=0, then draw up to 3 => 3 draws.
        // But Royal Guard only triggers on the controller's draws, not opponent's.
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    // Pre-condition
    expect(testEngine.asPlayerOne().hasKeyword(royalGuardOctopusSoldier, "Challenger")).toBe(false);

    // Playing Demona: exerts opposing chars (none here), then both players draw up to 3.
    // Player One had 1 card (Demona) + 0 other cards in hand; after playing Demona they have 0
    // -> drawing up to hand size 3 means 3 draws for Player One.
    expect(testEngine.asPlayerOne().playCard(demonaScourgeOfTheWyvernClan)).toBeSuccessfulCommand();

    // Royal Guard should now have Challenger +3 (from 3 draws).
    expect(testEngine.asPlayerOne().hasKeyword(royalGuardOctopusSoldier, "Challenger")).toBe(true);
    expect(
      testEngine.asPlayerOne().getKeywordValue(royalGuardOctopusSoldier, "Challenger"),
    ).toBeGreaterThanOrEqual(2);
  });
});
