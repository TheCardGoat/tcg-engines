import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { discardedArmor } from "./204-discarded-armor";

const armorTarget = createMockCharacter({
  id: "discarded-armor-target",
  name: "Armor Target",
  cost: 2,
});

const discardFodder = createMockCharacter({
  id: "discarded-armor-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const discardSetupItem = createMockItem({
  id: "discarded-armor-setup-item",
  name: "Discard Setup Item",
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

describe("Discarded Armor", () => {
  it("gives a chosen character of yours Resist +1 after you discarded a card this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [discardFodder],
      play: [discardedArmor, discardSetupItem, armorTarget],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(discardSetupItem, {
        costs: { discardCards: [discardFodder] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(discardedArmor, {
        targets: [armorTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(armorTarget, "Resist")).toBe(1);
  });
});
