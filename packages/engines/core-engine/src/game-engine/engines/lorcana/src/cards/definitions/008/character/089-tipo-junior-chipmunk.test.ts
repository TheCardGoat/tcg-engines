/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tipoJuniorChipmunk } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tipo - Junior Chipmunk", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [tipoJuniorChipmunk],
    });

    const cardUnderTest = testEngine.getCardModel(tipoJuniorChipmunk);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
