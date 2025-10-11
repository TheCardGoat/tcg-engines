import { describe, expect, it } from "bun:test";
import {
  anitaRadcliffeDogLover,
  patchPlayfulPup,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Anita Radcliffe - Dog Lover", () => {
  it("I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: anitaRadcliffeDogLover.cost,
      hand: [anitaRadcliffeDogLover],
      play: [patchPlayfulPup],
    });

    expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(false);

    await testEngine.playCard(anitaRadcliffeDogLover);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [patchPlayfulPup] });

    expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(true);
    testEngine.passTurn();
    expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(true);
    testEngine.passTurn();
    expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(false);
  });
});
