import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { tinkerBellGenerousFairy } from "./022-tinker-bell-generous-fairy";

const matchingCharacter = createMockCharacter({
  id: "matching-char",
  name: "Matching Character",
  cost: 2,
});

const nonMatchA = createMockItem({
  id: "non-match-item-a",
  name: "Non Match Item A",
  cost: 1,
});

const nonMatchB = createMockItem({
  id: "non-match-item-b",
  name: "Non Match Item B",
  cost: 3,
});

const nonMatchC = createMockItem({
  id: "non-match-item-c",
  name: "Non Match Item C",
  cost: 4,
});

describe("Tinker Bell - Generous Fairy (Set 3)", () => {
  it("MAKE A NEW FRIEND - reveals a character card to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tinkerBellGenerousFairy],
      inkwell: tinkerBellGenerousFairy.cost,
      deck: [nonMatchA, matchingCharacter, nonMatchB, nonMatchC],
    });

    expect(testEngine.asPlayerOne().playCard(tinkerBellGenerousFairy)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tinkerBellGenerousFairy),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [matchingCharacter] },
          { zone: "deck-bottom", cards: [nonMatchC, nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(matchingCharacter)).toBe("hand");
  });
});
