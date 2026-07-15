import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { gosalynMallardCuriousChild } from "./149-gosalyn-mallard-curious-child";

const matchingItem = createMockItem({
  id: "matching-item",
  name: "Matching Item",
  cost: 2,
});

const nonMatchA = createMockCharacter({
  id: "non-match-a",
  name: "Non Match A",
  cost: 1,
});

const nonMatchB = createMockCharacter({
  id: "non-match-b",
  name: "Non Match B",
  cost: 3,
});

const nonMatchC = createMockCharacter({
  id: "non-match-c",
  name: "Non Match C",
  cost: 4,
});

describe("Gosalyn Mallard - Curious Child", () => {
  it("KEEN GEAR - reveals an item card to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gosalynMallardCuriousChild],
      inkwell: gosalynMallardCuriousChild.cost,
      deck: [nonMatchA, matchingItem, nonMatchB, nonMatchC],
    });

    expect(testEngine.asPlayerOne().playCard(gosalynMallardCuriousChild)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gosalynMallardCuriousChild),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [matchingItem] },
          { zone: "deck-bottom", cards: [nonMatchC, nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(matchingItem)).toBe("hand");
  });
});
