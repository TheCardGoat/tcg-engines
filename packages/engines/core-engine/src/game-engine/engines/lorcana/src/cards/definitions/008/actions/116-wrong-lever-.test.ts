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

    // Verify pullTheLever is actually in discard before we start
    console.log("pullTheLever definition:", {
      id: pullTheLever.id,
      name: pullTheLever.name,
      type: pullTheLever.type,
    });

    const discardCards = testEngine.getZone("player_one", "discard");
    console.log(
      "Cards in discard at start:",
      discardCards.map((c: any) => c.card?.name || c.name),
    );
    console.log("Discard card count:", discardCards.length);

    // Try to get the card model
    try {
      const model = testEngine.getCardModel(pullTheLever);
      console.log("Found pullTheLever model:", {
        zone: model.zone,
        instanceId: model.instanceId,
      });
    } catch (e: any) {
      console.log("Error getting pullTheLever model:", e.message);
    }

    await testEngine.playCard(wrongLeverAction);

    await testEngine.resolveTopOfStack({ mode: "2" });
    await testEngine.resolveTopOfStack({ targets: [pullTheLever] });
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
