import { describe, expect, it } from "bun:test";
import { balooFunLovingBear } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { kaaHypnotizingPython } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kaa - Hypnotizing Python", () => {
  it("LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: kaaHypnotizingPython.cost,
        play: [kaaHypnotizingPython],
      },
      {
        play: [balooFunLovingBear],
      },
    );

    await testEngine.questCard(kaaHypnotizingPython, {
      targets: [balooFunLovingBear],
    });

    expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(2);
    await testEngine.passTurn();

    expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(2);
    expect(testEngine.getCardModel(balooFunLovingBear).hasReckless).toBe(true);
    await testEngine.challenge({
      attacker: balooFunLovingBear,
      defender: kaaHypnotizingPython,
    });

    await testEngine.passTurn();

    expect(testEngine.getCardModel(balooFunLovingBear).strength).toBe(4);
    expect(testEngine.getCardModel(balooFunLovingBear).hasReckless).toBe(false);
  });
});
