import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, healingGlow, simbaProtectiveCub } from "../../001";
import { strikeAGoodMatch } from "./094-strike-a-good-match";

const drawnCard1 = createMockCharacter({
  id: "strike-a-good-match-011-drawn-1",
  name: "Drawn Card 1",
  cost: 1,
});

const drawnCard2 = createMockCharacter({
  id: "strike-a-good-match-011-drawn-2",
  name: "Drawn Card 2",
  cost: 1,
});

describe("Strike A Good Match (set 011)", () => {
  it("draws 2 cards and then discards the chosen card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strikeAGoodMatch, healingGlow],
      inkwell: strikeAGoodMatch.cost,
      deck: [simbaProtectiveCub, arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(strikeAGoodMatch, {
        targets: [healingGlow],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
  });

  it("can discard one of the newly drawn cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strikeAGoodMatch],
      inkwell: strikeAGoodMatch.cost,
      deck: [drawnCard1, drawnCard2],
    });

    // Play the action — draw 2 cards first, then need to choose one to discard
    expect(testEngine.asPlayerOne().playCard(strikeAGoodMatch)).toBeSuccessfulCommand();

    // Both drawn cards should now be in hand, waiting for discard choice
    const drawnCard1Id = testEngine.findCardInstanceId(drawnCard1, "hand", "player_one");

    // Resolve the pending discard by choosing drawnCard1
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [drawnCard1Id],
      }),
    ).toBeSuccessfulCommand();

    // drawnCard1 was chosen to be discarded
    expect(testEngine.asPlayerOne().getCardZone(drawnCard1)).toBe("discard");
    // drawnCard2 remains in hand
    expect(testEngine.asPlayerOne().getCardZone(drawnCard2)).toBe("hand");
  });

  it("net hand size increases by 1 after drawing 2 and discarding 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strikeAGoodMatch, healingGlow],
      inkwell: strikeAGoodMatch.cost,
      deck: [drawnCard1, drawnCard2],
    });

    // Starting hand has strikeAGoodMatch + healingGlow = 2 cards
    // After play: strikeAGoodMatch is played (hand -1), draw 2 (+2), discard 1 (-1) = net +0
    // So hand should have: healingGlow + drawnCard1 + drawnCard2 - discarded = 2 cards
    expect(
      testEngine.asPlayerOne().playCard(strikeAGoodMatch, {
        targets: [healingGlow],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
});
