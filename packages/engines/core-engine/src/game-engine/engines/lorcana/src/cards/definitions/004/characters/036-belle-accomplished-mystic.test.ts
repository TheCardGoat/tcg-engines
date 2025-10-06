/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  donaldDuck,
  mickeyBraveLittleTailor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  goofyKnightForADay,
  madamMimSnake,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  belleAccomplishedMystic,
  goofySuperGoof,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Belle - Accomplished Mystic", () => {
  it("**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: belleAccomplishedMystic.cost * 2 + madamMimSnake.cost,
        play: [goofySuperGoof, donaldDuck],
        hand: [belleAccomplishedMystic, madamMimSnake],
      },
      {
        play: [mickeyBraveLittleTailor, goofyKnightForADay],
      },
    );

    await testEngine.setCardDamage(donaldDuck, 2);
    await testEngine.playCard(
      belleAccomplishedMystic,
      {
        targets: [donaldDuck],
      },
      true,
    );
    await testEngine.resolveTopOfStack({
      targets: [goofyKnightForADay],
    });

    expect(testEngine.getCardModel(donaldDuck).damage).toBe(0);
    expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(2);

    // Returning Belle to the hand, so we can test teh same instance of the card model
    await testEngine.playCard(
      madamMimSnake,
      {
        targets: [belleAccomplishedMystic],
        acceptOptionalLayer: true,
      },
      true,
    );
    expect(testEngine.getCardModel(belleAccomplishedMystic).zone).toBe("hand");

    await testEngine.setCardDamage(goofySuperGoof, 3);
    await testEngine.playCard(
      belleAccomplishedMystic,
      {
        targets: [goofySuperGoof],
      },
      true,
    );
    await testEngine.resolveTopOfStack({
      targets: [mickeyBraveLittleTailor],
    });

    expect(testEngine.getCardModel(goofySuperGoof).damage).toBe(0);
    expect(testEngine.getCardModel(mickeyBraveLittleTailor).damage).toBe(3);
  });
});
