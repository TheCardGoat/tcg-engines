/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { basilHypnotizedMouse } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Basil - Hypnotized Mouse", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [basilHypnotizedMouse],
    });

    const cardUnderTest = testEngine.getCardModel(basilHypnotizedMouse);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
