// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import type { ActionCard } from "@tcg/lorcana-types";
import { fireTheCannons, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { rajahGhostlyTiger } from "@tcg/lorcana-cards/cards/007";
import { swoopingStrike } from "@tcg/lorcana-cards/cards/010";

function createMockActionCard(params: {
  id: string;
  name: string;
  cost: number;
  text: string;
  abilities: ActionCard["abilities"];
}): ActionCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "action",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    text: params.text,
    abilities: params.abilities,
    i18n: {
      en: {
        name: params.name,
        text: params.text,
      },
      de: {
        name: params.name,
        text: params.text,
      },
      fr: {
        name: params.name,
        text: params.text,
      },
      it: {
        name: params.name,
        text: params.text,
      },
    },
    cardNumber: 666,
  };
}

const fillerInk = createMockCharacter({
  id: "section-08-vanish-filler-ink",
  name: "Filler Ink",
  cost: 1,
});

const vanishReturnAction = createMockActionCard({
  id: "section-08-vanish-return",
  name: "Vanish Return",
  cost: 1,
  text: "Return chosen character to their player's hand.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Return chosen character to their player's hand.",
    },
  ],
});

describe("#### 8. KEYWORDS", () => {
  describe("## 8.14. Vanish", () => {
    it('8.14.1. The Vanish keyword represents a triggered ability. Vanish means "When this character is chosen by an opponent as part of resolving an action\'s effect, banish this character."', () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          play: [simbaProtectiveCub],
        },
        {
          play: [rajahGhostlyTiger],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [rajahGhostlyTiger] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(rajahGhostlyTiger)).toBe("discard");
    });

    it("8.14.1. Vanish doesn't trigger when the character is chosen by its own controller while resolving an action.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [swoopingStrike],
          inkwell: swoopingStrike.cost,
        },
        {
          play: [rajahGhostlyTiger],
        },
      );

      expect(testEngine.asPlayerOne().playCard(swoopingStrike)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [rajahGhostlyTiger] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(rajahGhostlyTiger)).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(rajahGhostlyTiger)).toBe("play");
    });

    it("8.14.2. The Vanish triggered ability resolves after the action's effect resolves. If the character has moved to a different zone before the triggered ability resolves, it resolves with no effect.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [vanishReturnAction],
          inkwell: [fillerInk],
        },
        {
          play: [rajahGhostlyTiger],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(vanishReturnAction, { targets: [rajahGhostlyTiger] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(rajahGhostlyTiger)).toBe("hand");
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(0);
    });
  });
});
