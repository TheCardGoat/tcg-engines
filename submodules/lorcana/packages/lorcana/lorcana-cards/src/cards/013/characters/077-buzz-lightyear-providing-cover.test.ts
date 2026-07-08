import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { buzzLightyearProvidingCover } from "./077-buzz-lightyear-providing-cover";

const toyFriend = createMockCharacter({
  id: "buzz-providing-cover-toy-friend",
  name: "Toy Friend",
  cost: 2,
  classifications: ["Storyborn", "Toy"],
});

const actionInDiscard = createMockAction({
  id: "buzz-providing-cover-action-discard",
  name: "Action In Discard",
  cost: 2,
});

const freeAction = createMockAction({
  id: "buzz-providing-cover-free-action",
  name: "Free Action",
  cost: 2,
});

describe("Buzz Lightyear - Providing Cover", () => {
  it("returns an action from discard and plays a low-cost action for free when another Toy is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [buzzLightyearProvidingCover, freeAction],
      inkwell: buzzLightyearProvidingCover.cost,
      play: [toyFriend],
      discard: [actionInDiscard],
    });

    expect(testEngine.asPlayerOne().playCard(buzzLightyearProvidingCover)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(buzzLightyearProvidingCover, {
        resolveOptional: true,
        targets: [actionInDiscard],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [freeAction],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(freeAction)).toBe("discard");
  });

  it("chooses one branch when no other Toy is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [buzzLightyearProvidingCover, freeAction],
      inkwell: buzzLightyearProvidingCover.cost,
      discard: [actionInDiscard],
    });

    expect(testEngine.asPlayerOne().playCard(buzzLightyearProvidingCover)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(buzzLightyearProvidingCover)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [actionInDiscard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(freeAction)).toBe("hand");
  });
});
