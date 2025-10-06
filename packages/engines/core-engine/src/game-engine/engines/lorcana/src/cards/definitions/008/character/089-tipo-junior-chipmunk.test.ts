/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tipoJuniorChipmunk } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Tipo - Junior Chipmunk", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [tipoJuniorChipmunk],
    });

    const cardUnderTest = testEngine.getCardModel(tipoJuniorChipmunk);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
