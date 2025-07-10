/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  diabloSpitefulRaven,
  doloresMadrigalWithinEarshot,
  jasmineInspiredResearcher,
  merlinCleverClairvoyant,
  rayaGuidanceSeeker,
  theQueenJealousBeauty,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Queen - Jealous Beauty", () => {
  describe("NOT AN ORDINARY APPLE {E} - Choose 3 cards in an opponent's discard and put them under their deck to gain 3 lore. If you moved at least 1 Princess this way, gain 4 lore instead.", () => {
    it("Moving a princess", async () => {
      const targets = [
        jasmineInspiredResearcher,
        rayaGuidanceSeeker,
        diabloSpitefulRaven,
      ];
      const testEngine = new TestEngine(
        {
          play: [theQueenJealousBeauty],
        },
        {
          discard: targets,
        },
      );

      await testEngine.activateCard(theQueenJealousBeauty, {
        targets: targets,
      });

      expect(testEngine.getLoreForPlayer()).toEqual(4);
    });

    it("NOT Moving a princess", async () => {
      const targets = [
        doloresMadrigalWithinEarshot,
        merlinCleverClairvoyant,
        diabloSpitefulRaven,
      ];
      const testEngine = new TestEngine(
        {
          play: [theQueenJealousBeauty],
        },
        {
          discard: targets,
        },
      );

      await testEngine.activateCard(theQueenJealousBeauty, {
        targets: targets,
      });

      for (const target of targets) {
        expect(testEngine.getCardModel(target).zone).toBe("deck");
      }

      expect(testEngine.getLoreForPlayer()).toEqual(3);
    });
  });
});
