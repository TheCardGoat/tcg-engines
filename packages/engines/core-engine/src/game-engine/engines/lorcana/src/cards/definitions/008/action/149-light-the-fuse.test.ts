import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  generalLiHeadOfTheImperialArmy,
  jumbaJookibaCriticalScientist,
  khanWarHorse,
  lightTheFuse,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Light The Fuse", () => {
  it("Deal 1 damage to chosen character for each exerted character you have in play.", async () => {
    const exertedChars = [
      khanWarHorse,
      generalLiHeadOfTheImperialArmy,
      jumbaJookibaCriticalScientist,
    ];

    const testEngine = new TestEngine(
      {
        inkwell: lightTheFuse.cost,
        hand: [lightTheFuse],
        play: exertedChars,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    for (const exertedChar of exertedChars) {
      await testEngine.tapCard(exertedChar);
    }

    await testEngine.playCard(lightTheFuse, { targets: [goofyKnightForADay] });

    expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(
      exertedChars.length,
    );
  });
});
