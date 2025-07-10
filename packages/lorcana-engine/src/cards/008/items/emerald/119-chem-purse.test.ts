/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  brunoMadrigalSingingSeer,
  brunoMadrigalSingleminded,
  chemPurse,
  jumbaJookibaCriticalScientist,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
