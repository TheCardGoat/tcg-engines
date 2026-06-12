// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { flynnRiderSpectralScoundrel } from "@tcg/lorcana-cards/cards/010";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.4. Boost", () => {
    it('8.4.1. Boost N means "Once during your turn, you may pay N to put the top card of your deck facedown under this card."', () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderSpectralScoundrel],
          inkwell: 4,
          deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
        },
        {
          deck: [mickeyMouseTrueFriend],
        },
      );

      expect(
        testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel).cardsUnder ?? [],
      ).toHaveLength(0);
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);

      expect(
        testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel).cardsUnder ?? [],
      ).toHaveLength(1);
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);

      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).not.toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("deck");

      const secondActivation = testEngine
        .asPlayerOne()
        .activateAbility(flynnRiderSpectralScoundrel) as CommandFailure;

      expect(secondActivation.success).toBe(false);
      expect(secondActivation.errorCode).toBe("ABILITY_USES_EXHAUSTED");
      expect(
        testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel).cardsUnder ?? [],
      ).toHaveLength(1);
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    });

    it("8.4.3. A card under another card isn't in play, and putting a card under with Boost doesn't count as playing it.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flynnRiderSpectralScoundrel],
        inkwell: 2,
        deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      });

      expect(testEngine.asPlayerOne().getZonesCardCount().play).toBe(1);

      expect(
        testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().play).toBe(1);

      expect(
        testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel).cardsUnder ?? [],
      ).toHaveLength(1);

      expect(testEngine.asServer().getCardZone(simbaProtectiveCub)).not.toBe("deck");
      expect(testEngine.asServer().getCardZone(simbaProtectiveCub)).not.toBe("play");
      expect(testEngine.asServer().getCardZone(mickeyMouseTrueFriend)).toBe("deck");
    });

    it.skip("8.4.2. No player can look at the front of a card put facedown under another card.", () => {
      // TODO: Add this when the multiplayer harness exposes public/private face-visibility checks.
      // Do not fake this rule by asserting against the known fixture definition object.
    });
  });
});
