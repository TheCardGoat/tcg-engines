import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theBayouMysteriousSwamp } from "./204-the-bayou-mysterious-swamp";

const swampQuester = createMockCharacter({
  id: "swamp-quester",
  name: "Swamp Quester",
  cost: 2,
  lore: 1,
});

const discardFodder = createMockCharacter({
  id: "bayou-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const drawnCard = createMockCharacter({
  id: "bayou-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("The Bayou - Mysterious Swamp", () => {
  it("lets you draw then discard when a character quests here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [discardFodder],
        deck: [drawnCard],
        play: [
          { card: swampQuester, atLocation: theBayouMysteriousSwamp },
          theBayouMysteriousSwamp,
        ],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().quest(swampQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(swampQuester.lore);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theBayouMysteriousSwamp),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodder] }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });
});
