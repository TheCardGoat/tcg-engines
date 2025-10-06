/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { dopeyAlwaysPlayful } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { dopeyKnightApprentice } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Dopey - Knight Apprentice", () => {
  describe("**STRONGER TOGETHER** When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.", () => {
    it("Doesn't trigger when he's the only knight in play", async () => {
      const testEngine = new TestEngine({
        inkwell: dopeyKnightApprentice.cost,
        hand: [dopeyKnightApprentice],
        play: [dopeyAlwaysPlayful],
      });

      await testEngine.playCard(dopeyKnightApprentice);
      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
