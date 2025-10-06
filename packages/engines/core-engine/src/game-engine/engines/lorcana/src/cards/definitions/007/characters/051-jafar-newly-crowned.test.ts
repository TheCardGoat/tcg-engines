/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hesATramp,
  iagoGiantSpectralParrot,
  jafarNewlyCrowned,
  outOfOrder,
  rajahGhostlyTiger,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007/";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jafar - Newly Crowned", () => {
  it("THIS IS NOT DONE YET During an opponent’s turn, whenever one of your Illusion characters is banished, you may return that card to your hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: outOfOrder.cost + hesATramp.cost,
        hand: [outOfOrder, hesATramp],
      },
      {
        play: [jafarNewlyCrowned, rajahGhostlyTiger, iagoGiantSpectralParrot],
      },
    );

    await testEngine.playCard(
      outOfOrder,
      {
        targets: [iagoGiantSpectralParrot],
      },
      true,
    );
    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();
    expect(testEngine.getCardModel(iagoGiantSpectralParrot).zone).toBe("hand");

    testEngine.changeActivePlayer("player_one");
    await testEngine.playCard(
      hesATramp,
      {
        targets: [rajahGhostlyTiger],
      },
      true,
    );
    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();
    expect(testEngine.getCardModel(rajahGhostlyTiger).zone).toBe("hand");
  });
});
