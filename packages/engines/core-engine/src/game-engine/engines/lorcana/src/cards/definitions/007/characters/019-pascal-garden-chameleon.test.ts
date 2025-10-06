/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { pascalGardenChameleon } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Pascal - Garden Chameleon", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [pascalGardenChameleon],
    });

    const cardUnderTest = testEngine.getCardModel(pascalGardenChameleon);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
