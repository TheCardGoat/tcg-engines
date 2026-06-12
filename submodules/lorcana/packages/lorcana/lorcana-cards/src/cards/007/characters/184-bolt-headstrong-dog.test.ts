import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { boltHeadstrongDog } from "./184-bolt-headstrong-dog";

const drawnCard = createMockCharacter({
  id: "bolt-headstrong-dog-drawn-card",
  name: "Bolt Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "bolt-headstrong-dog-discard-fodder",
  name: "Bolt Discard Fodder",
  cost: 1,
});

describe("Bolt - Headstrong Dog", () => {
  it("THERE'S NO TURNING BACK - draws a card, then chooses and discards a card when questing undamaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [discardFodder],
      play: [{ card: boltHeadstrongDog, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(boltHeadstrongDog)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(boltHeadstrongDog, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");

    const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardFodderId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("does not trigger when questing with damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      play: [{ card: boltHeadstrongDog, damage: 1, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(boltHeadstrongDog)).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });
});
