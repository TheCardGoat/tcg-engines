/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  judyHoppsResourcefulRabbit,
  principeNaveenCarefreeExplorer,
} from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Judy Hopps - Resourceful Rabbit", () => {
  it("NEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.", async () => {
    const testEngine = new TestEngine({
      play: [judyHoppsResourcefulRabbit, principeNaveenCarefreeExplorer],
    });

    const target = testEngine.getCardModel(principeNaveenCarefreeExplorer);

    await testEngine.tapCard(principeNaveenCarefreeExplorer);

    expect(testEngine.store.turnCount).toBe(0);
    await testEngine.passTurn("player_one", true);
    expect(testEngine.store.turnCount).toBe(0);

    await testEngine.acceptOptionalLayer();

    expect(target.ready).toEqual(false);
    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(target.ready).toEqual(true);

    expect(testEngine.store.turnCount).toBe(1);
    expect(testEngine.store.priorityPlayer).toBe("player_two");
    expect(testEngine.store.turnPlayer).toBe("player_two");
  });
});
