import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { violetParrSuperResilient } from "./176-violet-parr-super-resilient";

const drawnCard = createMockCharacter({
  id: "violet-parr-super-resilient-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardedCard = createMockCharacter({
  id: "violet-parr-super-resilient-discarded-card",
  name: "Discarded Card",
  cost: 1,
});

const violetShiftBase = createMockCharacter({
  id: "violet-parr-super-resilient-shift-base",
  name: "Violet Parr",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Violet Parr - Super Resilient", () => {
  it("may draw and discard when you play Violet herself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [violetParrSuperResilient, discardedCard],
      deck: [drawnCard],
      inkwell: violetParrSuperResilient.cost,
    });

    expect(testEngine.asPlayerOne().playCard(violetParrSuperResilient)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        targets: [discardedCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardedCard)).toBe("discard");
  });

  // bugrepbQJ2vGzSUEwD4bI3Thet3: cycle should also fire when shifting Violet
  it("may draw and discard when you shift Violet onto another Violet Parr", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [violetParrSuperResilient, discardedCard],
      play: [violetShiftBase],
      deck: [drawnCard],
      inkwell: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(violetShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(violetParrSuperResilient, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        targets: [discardedCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardedCard)).toBe("discard");
  });
});
