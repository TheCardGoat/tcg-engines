/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { sisuWiseFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  sisuInHerElement,
  sisuUnitingDragon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Sisu - Uniting Dragon", () => {
  describe("TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.", () => {
    it("Two dragons on top", async () => {
      const testEngine = new TestEngine({
        play: [sisuUnitingDragon],
        deck: [sisuInHerElement, sisuWiseFriend],
      });

      await testEngine.questCard(sisuUnitingDragon);

      await testEngine.resolveTopOfStack(
        {
          scry: { hand: [sisuWiseFriend] },
        },
        true,
      );

      expect(testEngine.getCardModel(sisuWiseFriend).zone).toBe("hand");

      await testEngine.resolveTopOfStack({
        scry: { hand: [sisuInHerElement] },
      });

      expect(testEngine.getCardModel(sisuInHerElement).zone).toBe("hand");
    });
  });
});
