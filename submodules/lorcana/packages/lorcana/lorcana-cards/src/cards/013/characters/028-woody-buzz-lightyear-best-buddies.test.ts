import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { woodyBuzzLightyearBestBuddies } from "./028-woody-buzz-lightyear-best-buddies";

const woodyShiftBase = createMockCharacter({
  id: "woody-buzz-best-buddies-shift-base",
  name: "Woody",
  cost: 2,
});

const buzzLightyearShiftBase = createMockCharacter({
  id: "woody-buzz-best-buddies-buzz-lightyear-shift-base",
  name: "Buzz Lightyear",
  cost: 2,
});

const drawnCards = Array.from({ length: 3 }, (_, index) =>
  createMockCharacter({
    id: `woody-buzz-best-buddies-drawn-${index + 1}`,
    name: `Drawn ${index + 1}`,
    cost: 1,
  }),
);

const freeAction = createMockAction({
  id: "woody-buzz-best-buddies-free-action",
  name: "Free Action",
  cost: 2,
});

describe("Woody & Buzz Lightyear - Best Buddies", () => {
  it("can shift onto a character named Woody", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [woodyBuzzLightyearBestBuddies],
      inkwell: 5,
      play: [woodyShiftBase],
    });

    const shiftTarget = testEngine.findCardInstanceId(woodyShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(woodyBuzzLightyearBestBuddies, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(woodyBuzzLightyearBestBuddies)).toBe("play");
  });

  it("can shift onto a character named Buzz Lightyear", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [woodyBuzzLightyearBestBuddies],
      inkwell: 5,
      play: [buzzLightyearShiftBase],
    });

    const shiftTarget = testEngine.findCardInstanceId(buzzLightyearShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(woodyBuzzLightyearBestBuddies, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(woodyBuzzLightyearBestBuddies)).toBe("play");
  });

  it("draws cards until you have the same number as the opponent when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [woodyBuzzLightyearBestBuddies],
        inkwell: woodyBuzzLightyearBestBuddies.cost,
        deck: drawnCards,
      },
      {
        hand: 3,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(woodyBuzzLightyearBestBuddies),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyBuzzLightyearBestBuddies),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3 });
    for (const card of drawnCards) {
      expect(testEngine.asPlayerOne().getCardZone(card)).toBe("hand");
    }
  });

  it("may play a card with cost 2 or less for free when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [woodyBuzzLightyearBestBuddies],
      hand: [freeAction],
    });

    expect(testEngine.asPlayerOne().quest(woodyBuzzLightyearBestBuddies)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(woodyBuzzLightyearBestBuddies, {
        resolveOptional: true,
        targets: [freeAction],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(freeAction)).toBe("discard");
  });
});
