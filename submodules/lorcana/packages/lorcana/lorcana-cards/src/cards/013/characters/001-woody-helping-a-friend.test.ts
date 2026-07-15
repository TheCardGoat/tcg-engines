import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { woodyHelpingAFriend } from "./001-woody-helping-a-friend";

const toyFriend = createMockCharacter({
  id: "woody-helping-toy-friend",
  name: "Toy Friend",
  cost: 1,
  classifications: ["Storyborn", "Toy"],
});

const discardFriend = createMockCharacter({
  id: "woody-helping-discard-friend",
  name: "Discard Friend",
  cost: 2,
});

const handFriend = createMockCharacter({
  id: "woody-helping-hand-friend",
  name: "Hand Friend",
  cost: 2,
});

describe("Woody - Helping a Friend", () => {
  it("returns a cheap character from discard and plays a cheap character for free when another Toy is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [woodyHelpingAFriend, handFriend],
      inkwell: woodyHelpingAFriend.cost,
      play: [toyFriend],
      discard: [discardFriend],
    });

    expect(testEngine.asPlayerOne().playCard(woodyHelpingAFriend)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(woodyHelpingAFriend, {
        resolveOptional: true,
        targets: [discardFriend],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(woodyHelpingAFriend, {
        resolveOptional: true,
        targets: [handFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFriend)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(handFriend)).toBe("play");
  });
});
