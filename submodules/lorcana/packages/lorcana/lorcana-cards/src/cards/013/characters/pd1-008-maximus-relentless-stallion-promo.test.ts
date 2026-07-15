import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { maximusRelentlessStallionPD1Promo } from "./pd1-008-maximus-relentless-stallion-promo";

const promoDiscardFodder = createMockCharacter({
  id: "maximus-promo-discard-fodder",
  name: "Promo Discard Fodder",
  cost: 1,
});

const promoReadyDefender = createMockCharacter({
  id: "maximus-promo-ready-defender",
  name: "Promo Ready Defender",
  cost: 2,
  strength: 0,
  willpower: 8,
});

const promoDiscardSetupItem = createMockItem({
  id: "maximus-promo-discard-setup",
  name: "Promo Discard Setup",
  cost: 1,
  abilities: [
    {
      type: "activated",
      name: "SETUP",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

describe("Maximus - Relentless Stallion Promo", () => {
  it("gains Challenger +2 and can challenge ready characters after you discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [promoDiscardFodder],
        play: [maximusRelentlessStallionPD1Promo, promoDiscardSetupItem],
      },
      {
        play: [promoReadyDefender],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(promoDiscardSetupItem, {
        costs: { discardCards: [promoDiscardFodder] },
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().challenge(maximusRelentlessStallionPD1Promo, promoReadyDefender),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(promoReadyDefender)).toBe(6);
  });
});
