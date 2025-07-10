/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  madamMimFox,
  merlinCrab,
  merlinGoat,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { aliceTeaAlchemist } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
