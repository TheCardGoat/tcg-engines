import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import type { ActionCard } from "@tcg/lorcana-types";
import { fireTheCannons, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { rajahGhostlyTiger } from "@tcg/lorcana-cards/cards/007";
import { swoopingStrike } from "@tcg/lorcana-cards/cards/010";

const fillerInk = createMockCharacter({
  id: "keyword-vanish-filler-ink",
  name: "Filler Ink",
  cost: 1,
});

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
      en: { name: params.name, text: params.text },
      de: { name: params.name, text: params.text },
      fr: { name: params.name, text: params.text },
      it: { name: params.name, text: params.text },
    },
    cardNumber: 666,
  };
}

const vanishReturnAction = createMockActionCard({
  id: "keyword-vanish-return",
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

describe("Vanish - Rajah, Ghostly Tiger - Vanish (When this character is chosen by an opponent as part of resolving an action's effect, banish this character.)", () => {
  it("Vanish triggers when opponent chooses this character for an action effect", () => {
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

    // Rajah should be banished by Vanish (not just damaged)
    expect(testEngine.asPlayerTwo().getCardZone(rajahGhostlyTiger)).toBe("discard");
  });

  it("Vanish doesn't trigger when the character is chosen by its own controller", () => {
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

    // Rajah chose himself (own controller), so Vanish should NOT trigger
    expect(testEngine.asPlayerTwo().isExerted(rajahGhostlyTiger)).toBe(true);
    expect(testEngine.asPlayerTwo().getCardZone(rajahGhostlyTiger)).toBe("play");
  });

  it("If the character has moved to a different zone before Vanish resolves, it resolves with no effect", () => {
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

    // Action returned Rajah to hand, then Vanish tries to banish but Rajah already left play
    expect(testEngine.asPlayerTwo().getCardZone(rajahGhostlyTiger)).toBe("hand");
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(0);
  });
});
