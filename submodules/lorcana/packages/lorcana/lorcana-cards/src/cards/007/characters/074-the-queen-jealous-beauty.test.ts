import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theQueenJealousBeauty } from "./074-the-queen-jealous-beauty";

const princessCard = createMockCharacter({
  id: "queen-test-princess",
  name: "Test Princess",
  cost: 2,
  classifications: ["Princess"],
});

const nonPrincessCardA = createMockCharacter({
  id: "queen-test-non-princess-a",
  name: "Test Non-Princess A",
  cost: 2,
});

const nonPrincessCardB = createMockCharacter({
  id: "queen-test-non-princess-b",
  name: "Test Non-Princess B",
  cost: 2,
});

const nonPrincessCardC = createMockCharacter({
  id: "queen-test-non-princess-c",
  name: "Test Non-Princess C",
  cost: 2,
});

describe("The Queen - Jealous Beauty", () => {
  describe("NO ORDINARY APPLE", () => {
    it("gains 4 lore when a Princess card is among the 3 cards moved from opponent's discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theQueenJealousBeauty, exerted: false }],
          inkwell: theQueenJealousBeauty.cost,
        },
        {
          discard: [princessCard, nonPrincessCardA, nonPrincessCardB],
        },
      );

      const princessId = testEngine.findCardInstanceId(princessCard, "discard", "player_two");
      const nonPrincessAId = testEngine.findCardInstanceId(
        nonPrincessCardA,
        "discard",
        "player_two",
      );
      const nonPrincessBId = testEngine.findCardInstanceId(
        nonPrincessCardB,
        "discard",
        "player_two",
      );

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenJealousBeauty, {
          ability: "NO ORDINARY APPLE",
          targets: [princessId, nonPrincessAId, nonPrincessBId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(4);
      expect(testEngine.asPlayerTwo().getCardZone(princessCard)).toBe("deck");
      expect(testEngine.asPlayerTwo().getCardZone(nonPrincessCardA)).toBe("deck");
      expect(testEngine.asPlayerTwo().getCardZone(nonPrincessCardB)).toBe("deck");
    });

    it("gains 3 lore when no Princess card is among the 3 cards moved from opponent's discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theQueenJealousBeauty, exerted: false }],
          inkwell: theQueenJealousBeauty.cost,
        },
        {
          discard: [nonPrincessCardA, nonPrincessCardB, nonPrincessCardC],
        },
      );

      const nonPrincessAId = testEngine.findCardInstanceId(
        nonPrincessCardA,
        "discard",
        "player_two",
      );
      const nonPrincessBId = testEngine.findCardInstanceId(
        nonPrincessCardB,
        "discard",
        "player_two",
      );
      const nonPrincessCId = testEngine.findCardInstanceId(
        nonPrincessCardC,
        "discard",
        "player_two",
      );

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenJealousBeauty, {
          ability: "NO ORDINARY APPLE",
          targets: [nonPrincessAId, nonPrincessBId, nonPrincessCId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
      expect(testEngine.asPlayerTwo().getCardZone(nonPrincessCardA)).toBe("deck");
      expect(testEngine.asPlayerTwo().getCardZone(nonPrincessCardB)).toBe("deck");
      expect(testEngine.asPlayerTwo().getCardZone(nonPrincessCardC)).toBe("deck");
    });
  });
});
