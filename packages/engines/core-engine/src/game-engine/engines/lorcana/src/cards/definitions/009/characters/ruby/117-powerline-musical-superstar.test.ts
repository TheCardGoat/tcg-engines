/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { grabYourSword } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/198-grab-your-sword";
import { powerlineMusicalSuperstar } from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Powerline - Musical Superstar", () => {
  it("ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      inkwell: grabYourSword.cost,
      play: [powerlineMusicalSuperstar],
      hand: [grabYourSword],
    });

    expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
      false,
    );

    await testEngine.playCard(grabYourSword);

    expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
      true,
    );

    await testEngine.passTurn();

    expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
      false,
    );
  });
});
