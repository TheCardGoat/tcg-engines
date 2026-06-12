import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { coldstoneReincarnatedCyborg } from "./051-coldstone-reincarnated-cyborg";

const gargoyleDiscardOne = createMockCharacter({
  id: "coldstone-gargoyle-discard-1",
  name: "Gargoyle Discard 1",
  cost: 1,
  classifications: ["Storyborn", "Ally", "Gargoyle"],
});

const gargoyleDiscardTwo = createMockCharacter({
  id: "coldstone-gargoyle-discard-2",
  name: "Gargoyle Discard 2",
  cost: 1,
  classifications: ["Storyborn", "Ally", "Gargoyle"],
});

const nonGargoyleDiscard = createMockCharacter({
  id: "coldstone-non-gargoyle-discard",
  name: "Non-Gargoyle Discard",
  cost: 1,
  classifications: ["Storyborn", "Ally"],
});

function playColdstoneWithDiscard(
  discard: Array<ReturnType<typeof createMockCharacter>>,
): LorcanaMultiplayerTestEngine {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [coldstoneReincarnatedCyborg],
    inkwell: coldstoneReincarnatedCyborg.cost,
    discard,
  });

  expect(testEngine.asPlayerOne().playCard(coldstoneReincarnatedCyborg)).toBeSuccessfulCommand();

  if (testEngine.asPlayerOne().getBagCount() > 0) {
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(coldstoneReincarnatedCyborg),
    ).toBeSuccessfulCommand();
  }

  return testEngine;
}

describe("Coldstone - Reincarnated Cyborg", () => {
  it("THE CANTRIPS HAVE BEEN SPOKEN gains 2 lore when you have 2 Gargoyle characters in discard", () => {
    const testEngine = playColdstoneWithDiscard([gargoyleDiscardOne, gargoyleDiscardTwo]);

    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("THE CANTRIPS HAVE BEEN SPOKEN does not trigger with fewer than 2 Gargoyle characters in discard", () => {
    const testEngine = playColdstoneWithDiscard([gargoyleDiscardOne, nonGargoyleDiscard]);

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
