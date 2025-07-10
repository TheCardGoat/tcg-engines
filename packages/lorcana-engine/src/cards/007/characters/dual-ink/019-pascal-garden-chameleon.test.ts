/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pascalGardenChameleon } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Pascal - Garden Chameleon", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [pascalGardenChameleon],
    });

    const cardUnderTest = testEngine.getCardModel(pascalGardenChameleon);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
