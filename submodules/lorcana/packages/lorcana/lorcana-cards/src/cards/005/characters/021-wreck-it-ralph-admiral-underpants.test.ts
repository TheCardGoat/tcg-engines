import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { wreckitRalphAdmiralUnderpants } from "./021-wreck-it-ralph-admiral-underpants";
import { vanellopeVonSchweetzSugarRushChamp } from "./006-vanellope-von-schweetz-sugar-rush-champ";

const nonPrincessCharacter = createMockCharacter({
  id: "wir-non-princess",
  name: "Non-Princess Character",
  cost: 2,
  classifications: ["Hero"],
});

describe("Wreck-It Ralph - Admiral Underpants", () => {
  describe("I'VE GOT THE COOLEST FRIEND - When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.", () => {
    it("returns a non-princess character from discard to hand without gaining lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphAdmiralUnderpants],
        inkwell: wreckitRalphAdmiralUnderpants.cost,
        discard: [nonPrincessCharacter],
      });

      expect(
        testEngine.asPlayerOne().playCard(wreckitRalphAdmiralUnderpants),
      ).toBeSuccessfulCommand();

      const nonPrincessId = testEngine.findCardInstanceId(nonPrincessCharacter, "discard", "p1");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [nonPrincessId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nonPrincessCharacter)).toBe("hand");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("returns a princess character from discard to hand and gains 2 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphAdmiralUnderpants],
        inkwell: wreckitRalphAdmiralUnderpants.cost,
        discard: [vanellopeVonSchweetzSugarRushChamp],
      });

      expect(
        testEngine.asPlayerOne().playCard(wreckitRalphAdmiralUnderpants),
      ).toBeSuccessfulCommand();

      const princessId = testEngine.findCardInstanceId(
        vanellopeVonSchweetzSugarRushChamp,
        "discard",
        "p1",
      );
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [princessId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(vanellopeVonSchweetzSugarRushChamp)).toBe("hand");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("does nothing when discard has no character cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphAdmiralUnderpants],
        inkwell: wreckitRalphAdmiralUnderpants.cost,
        discard: [],
      });

      expect(
        testEngine.asPlayerOne().playCard(wreckitRalphAdmiralUnderpants),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(wreckitRalphAdmiralUnderpants)).toBe("play");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });

  it("regression: should gain 2 lore when returning a Princess character from discard", () => {
    // Bug: Wreck-It Ralph was not gaining lore on princess recovery from discard.
    // When a Princess character is returned, the conditional should fire and gain 2 lore.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wreckitRalphAdmiralUnderpants],
      inkwell: wreckitRalphAdmiralUnderpants.cost,
      discard: [vanellopeVonSchweetzSugarRushChamp],
    });

    expect(
      testEngine.asPlayerOne().playCard(wreckitRalphAdmiralUnderpants),
    ).toBeSuccessfulCommand();

    const princessId = testEngine.findCardInstanceId(
      vanellopeVonSchweetzSugarRushChamp,
      "discard",
      "p1",
    );
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [princessId] }),
    ).toBeSuccessfulCommand();

    // Should gain 2 lore because Vanellope is a Princess
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(vanellopeVonSchweetzSugarRushChamp)).toBe("hand");
  });
});
