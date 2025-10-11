import { describe, expect, it } from "bun:test";
import {
  faZhouWarHero,
  helgaSinclairToughAsNails,
  merlinCleverClairvoyant,
  thePrinceChallengerOfTheRise,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fa Zhou - War Hero", () => {
  it("TRAINING EXERCISES Each time one of your characters challenges another, if it is the second challenge of this turn, gain 3 lore shards.", async () => {
    const testEngine = new TestEngine(
      {
        play: [faZhouWarHero, thePrinceChallengerOfTheRise],
      },
      {
        play: [helgaSinclairToughAsNails, merlinCleverClairvoyant],
      },
    );

    expect(testEngine.getPlayerLore("player_one")).toBe(0);
    expect(testEngine.getPlayerLore("player_two")).toBe(0);

    const cardUnderTest = testEngine.getCardModel(faZhouWarHero);

    const challenger = testEngine.getCardModel(thePrinceChallengerOfTheRise);

    const defender1 = testEngine.getCardModel(helgaSinclairToughAsNails);

    const defender2 = testEngine.getCardModel(merlinCleverClairvoyant);

    await testEngine.tapCard(defender1);

    // First challenge of the turn.
    challenger.challenge(defender1);

    expect(testEngine.getPlayerLore("player_one")).toBe(0);
    expect(testEngine.getPlayerLore("player_two")).toBe(0);

    // Ready the challanger (so it can challenge again).
    await testEngine.tapCard(thePrinceChallengerOfTheRise, true);

    // Second challenge of the turn.
    challenger.challenge(defender1);

    // Verify that there was 3 lore gained (second challenge of the turn).
    expect(testEngine.getPlayerLore("player_one")).toBe(3);
    expect(testEngine.getPlayerLore("player_two")).toBe(0);

    await testEngine.tapCard(defender2);

    await cardUnderTest.challenge(defender2);

    // Verify that there was no lore gained (third challenge of the turn).
    expect(testEngine.getPlayerLore("player_one")).toBe(3);
    expect(testEngine.getPlayerLore("player_two")).toBe(0);

    // Ready the challanger (so it can challenge again)
    await testEngine.tapCard(cardUnderTest, true);

    cardUnderTest.challenge(defender1);

    // Verify that there was still no lore gained (fourth challenge of the turn).
    expect(testEngine.getPlayerLore("player_one")).toBe(3);
    expect(testEngine.getPlayerLore("player_two")).toBe(0);
  });
});
