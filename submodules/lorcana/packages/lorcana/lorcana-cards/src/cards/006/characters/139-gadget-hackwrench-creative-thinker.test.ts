import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { gadgetHackwrenchCreativeThinker } from "./139-gadget-hackwrench-creative-thinker";

const playedItem = createMockItem({
  id: "gadget-creative-thinker-item",
  name: "Test Item",
  cost: 1,
});

describe("Gadget Hackwrench - Creative Thinker", () => {
  it("BRAINSTORM gains +1 lore this turn whenever you play an item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gadgetHackwrenchCreativeThinker],
      hand: [playedItem],
      inkwell: playedItem.cost,
    });

    const baseLore = gadgetHackwrenchCreativeThinker.lore;
    expect(testEngine.asPlayerOne().getCardLore(gadgetHackwrenchCreativeThinker)).toBe(baseLore);

    expect(testEngine.asPlayerOne().playCard(playedItem)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(gadgetHackwrenchCreativeThinker)).toBe(
      baseLore + 1,
    );
  });

  it("the lore bonus expires at the end of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [gadgetHackwrenchCreativeThinker],
        hand: [playedItem],
        inkwell: playedItem.cost,
        deck: 1,
      },
      { deck: 1 },
    );

    expect(testEngine.asPlayerOne().playCard(playedItem)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardLore(gadgetHackwrenchCreativeThinker)).toBe(
      gadgetHackwrenchCreativeThinker.lore + 1,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardLore(gadgetHackwrenchCreativeThinker)).toBe(
      gadgetHackwrenchCreativeThinker.lore,
    );
  });
});
