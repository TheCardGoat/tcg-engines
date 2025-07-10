/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  figaroTuxedoCat,
  scarab,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
