/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dopeyAlwaysPlayful } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { dopeyKnightApprentice } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
