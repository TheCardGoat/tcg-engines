import { describe, expect, it } from "bun:test";
import {
  mickeyMouseGiantMouse,
  pullTheLever,
  wrongLeverAction,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wrong Lever!", () => {
  it("- Return chosen character to their player's hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: wrongLeverAction.cost,
        hand: [wrongLeverAction],
      },
      {
        play: [mickeyMouseGiantMouse],
      },
    );

    await testEngine.playCard(wrongLeverAction);
    await testEngine.resolveTopOfStack({ mode: "1" });
    await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });

    expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("hand");
  });

  it("- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: wrongLeverAction.cost,
        discard: [pullTheLever],
        hand: [wrongLeverAction],
      },
      {
        play: [mickeyMouseGiantMouse],
      },
    );

    // Verify pullTheLever is in discard before playing the action
    const pullLeverModel = testEngine.getCardModel(pullTheLever);
    expect(pullLeverModel.zone).toBe("discard");

    await testEngine.playCard(wrongLeverAction);

    await testEngine.resolveTopOfStack({ mode: "2" });
    expect(testEngine.getCardModel(pullTheLever).zone).toBe("deck");
    expect(testEngine.stackLayers).toHaveLength(1);

    await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
    expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("deck");
  });

  it("Selecting second mode without Pull the Lever on discard", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: wrongLeverAction.cost,
        hand: [wrongLeverAction],
      },
      {
        play: [mickeyMouseGiantMouse],
      },
    );

    await testEngine.playCard(wrongLeverAction);

    await testEngine.resolveTopOfStack({ mode: "2" });
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
