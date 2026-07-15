import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theHuntsmanReluctantEnforcer } from "./194-the-huntsman-reluctant-enforcer";

const drawnCard = createMockCharacter({
  id: "huntsman-reluctant-enforcer-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "huntsman-reluctant-enforcer-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("The Huntsman - Reluctant Enforcer", () => {
  it("CHANGE OF HEART - When quests, may draw a card then choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [discardFodder],
      play: [{ card: theHuntsmanReluctantEnforcer }],
    });

    const huntsmanId = testEngine.findCardInstanceId(theHuntsmanReluctantEnforcer, "play");

    testEngine.asPlayerOne().quest(huntsmanId);

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(theHuntsmanReluctantEnforcer, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 0,
      discard: 0,
      hand: 2,
      play: 1,
    });

    const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodderId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 0,
      discard: 1,
      hand: 1,
      play: 1,
    });
  });
});
