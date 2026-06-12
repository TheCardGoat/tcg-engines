import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { princePhillipGallantDefender } from "./152-prince-phillip-gallant-defender";

// Aurora: the character who receives Support (and thus Resist +1)
// strength 3 so she can challenge, willpower 4 so she survives
const aurora = createMockCharacter({
  id: "prince-phillip-test-aurora",
  name: "Aurora",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

// Opponent character that Aurora will challenge:
// strength 3 — would deal 3 damage to Aurora, but Resist +1 reduces it to 2
const opponentCharacter = createMockCharacter({
  id: "prince-phillip-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

// A supporting character owned by opponent (used for the negative test)
const opponentSupportChar = createMockCharacter({
  id: "prince-phillip-test-opp-support-char",
  name: "Opponent Support Char",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  abilities: [{ id: "opp-support-char-support-kw", keyword: "Support", type: "keyword" as const }],
});

// Another character to be chosen for opponent's support target
const opponentTarget = createMockCharacter({
  id: "prince-phillip-test-opp-target",
  name: "Opponent Target",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Prince Phillip - Gallant Defender", () => {
  it("has Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princePhillipGallantDefender],
    });

    const card = testEngine.getCardModel(princePhillipGallantDefender);
    expect(card.hasSupport()).toBe(true);
  });

  describe("BEST DEFENSE - Whenever one of your characters is chosen for Support, they gain Resist +1 this turn.", () => {
    it("character chosen for Support gains Resist +1 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princePhillipGallantDefender, aurora],
          deck: 5,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      // Quest Prince Phillip (has Support) — triggers the Support optional
      expect(testEngine.asPlayerOne().quest(princePhillipGallantDefender)).toBeSuccessfulCommand();

      // Resolve the Support bag effect targeting Aurora; BEST DEFENSE should also trigger
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bagEffect of bagEffects) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(princePhillipGallantDefender, {
            resolveOptional: true,
            targets: [aurora],
          }),
        ).toBeSuccessfulCommand();
      }

      // Aurora should now have Resist +1 this turn
      expect(testEngine.asPlayerOne().hasKeyword(aurora, "Resist")).toBe(true);
    });

    it("Resist +1 reduces damage taken by 1 during a challenge on the same turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princePhillipGallantDefender, aurora],
          deck: 5,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 5,
        },
      );

      // Quest Prince Phillip to apply Support to Aurora (giving Aurora Resist +1 this turn)
      expect(testEngine.asPlayerOne().quest(princePhillipGallantDefender)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bagEffect of bagEffects) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(princePhillipGallantDefender, {
            resolveOptional: true,
            targets: [aurora],
          }),
        ).toBeSuccessfulCommand();
      }

      // Aurora challenges the exerted opponent character on the SAME turn (Resist +1 is still active)
      // opponentCharacter has strength 3, Aurora has Resist +1 → takes max(0, 3-1) = 2 damage
      expect(testEngine.asPlayerOne().challenge(aurora, opponentCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: aurora, value: 2 });
    });

    it("does NOT trigger when opponent supports their character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princePhillipGallantDefender],
          deck: 5,
        },
        {
          play: [opponentSupportChar, opponentTarget],
          deck: 5,
        },
      );

      // Pass to player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two quests opponentSupportChar (has Support) targeting opponentTarget
      expect(testEngine.asPlayerTwo().quest(opponentSupportChar)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      for (const bagEffect of bagEffects) {
        testEngine.asPlayerTwo().resolvePendingByCard(princePhillipGallantDefender, {
          resolveOptional: true,
          targets: [opponentTarget],
        });
      }

      // opponentTarget (player two's character) should NOT have Resist
      // Philip's BEST DEFENSE only triggers for YOUR (player one's) characters
      expect(testEngine.asPlayerTwo().hasKeyword(opponentTarget, "Resist")).toBe(false);
    });
  });
});
