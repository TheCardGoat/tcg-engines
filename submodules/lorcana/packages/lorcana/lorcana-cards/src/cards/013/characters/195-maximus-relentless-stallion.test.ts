import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { maximusRelentlessStallion } from "./195-maximus-relentless-stallion";

const discardFodder = createMockCharacter({
  id: "maximus-relentless-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const readyDefender = createMockCharacter({
  id: "maximus-relentless-ready-defender",
  name: "Ready Defender",
  cost: 2,
  strength: 0,
  willpower: 8,
});

const discardSetupItem = createMockItem({
  id: "maximus-relentless-discard-setup",
  name: "Discard Setup",
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

describe("Maximus - Relentless Stallion", () => {
  it("gains Challenger +2 and can challenge ready characters after you discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [discardFodder],
        play: [maximusRelentlessStallion, discardSetupItem],
      },
      {
        play: [readyDefender],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(discardSetupItem, {
        costs: { discardCards: [discardFodder] },
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().challenge(maximusRelentlessStallion, readyDefender),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(readyDefender)).toBe(6);
  });
});
