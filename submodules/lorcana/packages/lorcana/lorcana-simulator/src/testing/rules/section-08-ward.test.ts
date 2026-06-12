// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  donaldDuckStruttingHisStuff,
  grabYourSword,
  partOfYourWorld,
  plasmaBlaster,
  ransack,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy, theNokkWaterSpirit } from "@tcg/lorcana-cards/cards/002";

describe("#### 8. KEYWORDS", () => {
  describe("## 8.15. Ward", () => {
    it(`8.15.1. The Ward keyword represents a static ability. Ward means "Your opponents can't choose this card when resolving an effect."`, () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 2,
          play: [plasmaBlaster],
        },
        {
          play: [donaldDuckStruttingHisStuff],
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(plasmaBlaster, {
        targets: [donaldDuckStruttingHisStuff],
      }) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("INVALID_ACTION_TARGET");
      expect(testEngine.asPlayerTwo().getDamage(donaldDuckStruttingHisStuff)).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(donaldDuckStruttingHisStuff)).toBe("play");
    });

    it("8.15.2. Effects that don't require the player to choose still affect a character with Ward.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [grabYourSword],
          inkwell: grabYourSword.cost,
        },
        {
          play: [peteBadGuy, theNokkWaterSpirit],
        },
      );

      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(peteBadGuy)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(theNokkWaterSpirit)).toBe(2);
    });

    it("Legacy regression: Ward doesn't stop a card in hand from being chosen.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ransack, theNokkWaterSpirit, donaldDuckStruttingHisStuff],
        inkwell: ransack.cost,
        deck: [peteBadGuy, partOfYourWorld],
      });

      expect(testEngine.asPlayerOne().playCard(ransack)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().respondWith(theNokkWaterSpirit, donaldDuckStruttingHisStuff),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(theNokkWaterSpirit)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(donaldDuckStruttingHisStuff)).toBe("discard");
    });

    it("Legacy regression: Ward doesn't stop a card in discard from being chosen.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [partOfYourWorld],
        inkwell: partOfYourWorld.cost,
        discard: [peteBadGuy],
      });

      expect(
        testEngine.asPlayerOne().playCard(partOfYourWorld, {
          targets: [peteBadGuy],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(partOfYourWorld)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(peteBadGuy)).toBe("hand");
    });
  });
});
