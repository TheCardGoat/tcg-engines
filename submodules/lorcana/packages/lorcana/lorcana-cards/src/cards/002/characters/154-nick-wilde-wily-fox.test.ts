import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { nickWildeWilyFox } from "./154-nick-wilde-wily-fox";

const pawpsicleItem = createMockItem({
  id: "nick-test-pawpsicle",
  name: "Pawpsicle",
  cost: 1,
});

const otherItem = createMockItem({
  id: "nick-test-other-item",
  name: "Dinglehopper",
  cost: 1,
});

describe("Nick Wilde - Wily Fox", () => {
  it("should return Pawpsicle from discard to hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nickWildeWilyFox],
        discard: [{ card: pawpsicleItem }],
        inkwell: 4,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    const pawpsicleId = testEngine.findCardInstanceId(pawpsicleItem, "discard");

    // Play Nick Wilde
    expect(testEngine.asPlayerOne().playCard(nickWildeWilyFox)).toBeSuccessfulCommand();

    // The triggered ability should appear in the bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(nickWildeWilyFox, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // Choose the Pawpsicle from discard
    const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [pawpsicleId] }),
      ).toBeSuccessfulCommand();
    }

    // Pawpsicle should now be in hand
    expect(testEngine.asPlayerOne().getCardZone(pawpsicleItem)).toBe("hand");
  });

  it("should NOT return a non-Pawpsicle item from discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nickWildeWilyFox],
        discard: [{ card: otherItem }],
        inkwell: 4,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    // Play Nick Wilde
    expect(testEngine.asPlayerOne().playCard(nickWildeWilyFox)).toBeSuccessfulCommand();

    // The ability should auto-resolve/skip since there's no valid target (no Pawpsicle in discard)
    // The non-Pawpsicle item should remain in discard
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("discard");
  });

  it("should allow declining the optional ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nickWildeWilyFox],
        discard: [{ card: pawpsicleItem }],
        inkwell: 4,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    // Play Nick Wilde
    expect(testEngine.asPlayerOne().playCard(nickWildeWilyFox)).toBeSuccessfulCommand();

    // The triggered ability should appear in the bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    // Decline the optional ability
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(nickWildeWilyFox, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Pawpsicle should remain in discard
    expect(testEngine.asPlayerOne().getCardZone(pawpsicleItem)).toBe("discard");
  });
});
