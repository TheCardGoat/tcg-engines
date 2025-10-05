import { describe, expect, it } from "bun:test";
import {
  principeNaveenCarefreeExplorer,
  simbaHappygolucky,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { onlySoMuchRoom } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Only So Much Room", () => {
  it("Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: onlySoMuchRoom.cost,
      hand: [onlySoMuchRoom],
      play: [simbaHappygolucky],
      discard: [principeNaveenCarefreeExplorer],
    });

    const cardUnderTest = testEngine.getCardModel(onlySoMuchRoom);
    const simbaCard = testEngine.getCardModel(simbaHappygolucky);
    const principeCard = testEngine.getCardModel(
      principeNaveenCarefreeExplorer,
    );

    await testEngine.playCard(cardUnderTest);

    // Single ability with two effects requires both targets in one call
    await testEngine.resolveTopOfStack({
      targets: [simbaCard.instanceId, principeCard.instanceId],
    });

    expect(testEngine.getCardModel(simbaHappygolucky).zone).toBe("hand");
    expect(testEngine.getCardModel(principeNaveenCarefreeExplorer).zone).toBe(
      "hand",
    );
  });
});
