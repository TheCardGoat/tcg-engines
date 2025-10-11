import { describe, expect, it } from "bun:test";
import {
  atlanteanCrystal,
  roquefortLockExpert,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Roquefort - Lock Expert", () => {
  it("SAFEKEEPING Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: roquefortLockExpert.cost + 2,
      play: [roquefortLockExpert, atlanteanCrystal],
    });
    const cardUnderTest = testEngine.getCardModel(roquefortLockExpert);
    const target = testEngine.getCardModel(atlanteanCrystal);
    cardUnderTest.quest();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getZonesCardCount().inkwell).toEqual(5);
    expect(testEngine.getCardModel(atlanteanCrystal).zone).toEqual("inkwell");
  });
});
