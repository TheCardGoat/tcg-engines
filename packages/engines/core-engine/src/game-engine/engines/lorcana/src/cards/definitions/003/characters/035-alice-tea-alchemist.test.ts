/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  madamMimFox,
  merlinCrab,
  merlinGoat,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { aliceTeaAlchemist } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Alice - Tea Alchemist", () => {
  it("**CURIOUSER AND CURIOUSER** {E} – Exert chosen opposing character and all other opposing characters with the same name.", () => {
    const testEngine = new TestEngine(
      {
        inkwell: aliceTeaAlchemist.cost,
        play: [aliceTeaAlchemist],
      },
      {
        play: [merlinCrab, merlinGoat, madamMimFox],
      },
    );

    const cardUnderTest = testEngine.getCardModel(aliceTeaAlchemist);

    testEngine.activateCard(cardUnderTest);
    testEngine.resolveTopOfStack({ targets: [merlinCrab] });

    expect(testEngine.getCardModel(merlinCrab).exerted).toBe(true);
    expect(testEngine.getCardModel(merlinGoat).exerted).toBe(true);
    expect(testEngine.getCardModel(madamMimFox).exerted).toBe(false);
  });
});
