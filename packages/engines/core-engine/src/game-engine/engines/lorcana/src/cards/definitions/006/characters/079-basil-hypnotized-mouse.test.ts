/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { basilHypnotizedMouse } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Basil - Hypnotized Mouse", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [basilHypnotizedMouse],
    });

    const cardUnderTest = testEngine.getCardModel(basilHypnotizedMouse);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
