/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  figaroTuxedoCat,
  scarab,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Figaro - Tuxedo Cat", () => {
  it("PLAYFULNESS Opposing items enter play exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: scarab.cost,
        hand: [scarab],
      },
      {
        play: [figaroTuxedoCat],
      },
    );

    await testEngine.playCard(scarab);

    expect(testEngine.getCardModel(scarab).exerted).toEqual(true);
  });
});
