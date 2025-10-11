import { describe, expect, it } from "bun:test";
import {
  brunoMadrigalSingingSeer,
  brunoMadrigalSingleminded,
  chemPurse,
  jumbaJookibaCriticalScientist,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Chem Purse", () => {
  it("HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell:
        brunoMadrigalSingingSeer.cost + jumbaJookibaCriticalScientist.cost,
      play: [chemPurse, brunoMadrigalSingleminded],
      hand: [brunoMadrigalSingingSeer, jumbaJookibaCriticalScientist],
    });

    await testEngine.shiftCard({
      shifter: brunoMadrigalSingingSeer,
      shifted: brunoMadrigalSingleminded,
    });

    expect(testEngine.getCardModel(brunoMadrigalSingingSeer).strength).toBe(
      brunoMadrigalSingleminded.strength + 4,
    );

    await testEngine.playCard(jumbaJookibaCriticalScientist);
    expect(
      testEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
    ).toBe(jumbaJookibaCriticalScientist.strength);
  });
});
