import { describe, expect, it } from "bun:test";
import {
  jumbaJookibaCriticalScientist,
  khanWarHorse,
  pouncingPractice,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pouncing Practice", () => {
  it("Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: pouncingPractice.cost,
        hand: [pouncingPractice],
        play: [jumbaJookibaCriticalScientist],
      },
      {
        play: [khanWarHorse],
      },
    );

    await testEngine.playCard(
      pouncingPractice,
      { targets: [khanWarHorse] },
      true,
    );
    expect(testEngine.getCardModel(khanWarHorse).strength).toBe(
      khanWarHorse.strength - 2,
    );

    await testEngine.resolveTopOfStack({
      targets: [jumbaJookibaCriticalScientist],
    });
    expect(
      testEngine.getCardModel(jumbaJookibaCriticalScientist).hasEvasive,
    ).toBe(true);
  });
});
