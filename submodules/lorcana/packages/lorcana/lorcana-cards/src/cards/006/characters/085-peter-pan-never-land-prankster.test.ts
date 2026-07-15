import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { peterPanNeverLandPrankster } from "./085-peter-pan-never-land-prankster";
import { merlinGoat } from "../../002/characters/051-merlin-goat";
import { donaldDuckFirstMate } from "./080-donald-duck-first-mate";
import { thievery } from "../actions/128-thievery";

describe.skip("Peter Pan - Never Land Prankster", () => {
  it("LOOK INNOCENT - This character enters play exerted.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: peterPanNeverLandPrankster.cost,
      hand: [peterPanNeverLandPrankster],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(peterPanNeverLandPrankster)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(peterPanNeverLandPrankster).exerted).toBe(true);
  });

  it("CAN'T TAKE A JOKE? - While exerted, opponent can't gain lore from effects", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: merlinGoat.cost,
        hand: [merlinGoat],
        play: [donaldDuckFirstMate],
        deck: 5,
      },
      {
        play: [{ card: peterPanNeverLandPrankster, exerted: true }],
        deck: 5,
      },
    );

    // Play Merlin - Goat which triggers "gain 1 lore"
    expect(testEngine.asPlayerOne().playCard(merlinGoat)).toBeSuccessfulCommand();

    // Resolve any bag effects from Merlin's triggered ability
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    if (bagEffects.length > 0) {
      testEngine.asPlayerOne().resolvePendingByCard(peterPanNeverLandPrankster);
    }

    // Player one should NOT have gained lore because Peter Pan is exerted
    // and player one hasn't challenged this turn
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("CAN'T TAKE A JOKE? - After opponent challenges, they can gain lore again", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: merlinGoat.cost + thievery.cost,
        hand: [merlinGoat, thievery],
        play: [{ card: donaldDuckFirstMate, exerted: false, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: peterPanNeverLandPrankster, exerted: true }],
        deck: 5,
      },
    );

    // First, play Merlin - Goat to try gaining lore (should fail)
    expect(testEngine.asPlayerOne().playCard(merlinGoat)).toBeSuccessfulCommand();

    // Resolve Merlin's bag effects
    const merlinBagEffects = testEngine.asPlayerOne().getBagEffects();
    if (merlinBagEffects.length > 0) {
      testEngine.asPlayerOne().resolvePendingByCard(peterPanNeverLandPrankster);
    }

    // Lore should still be 0 (blocked by Peter Pan)
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    // Now challenge Peter Pan with Donald Duck First Mate
    expect(
      testEngine.asPlayerOne().challenge(donaldDuckFirstMate, peterPanNeverLandPrankster),
    ).toBeSuccessfulCommand();

    // Now play Thievery which gains 1 lore - should work since we challenged
    expect(testEngine.asPlayerOne().playCard(thievery)).toBeSuccessfulCommand();

    // After challenging, the restriction is lifted, so lore should be gained
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });
});
