import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { cinderellaGentleAndKind } from "./003-cinderella-gentle-and-kind";
import { jasmineQueenOfAgrabah } from "./149-jasmine-queen-of-agrabah";
import { mickeyMouseTrueFriend } from "./012-mickey-mouse-true-friend";

describe("Cinderella - Gentle and Kind", () => {
  it("does not remove damage from a non-Princess target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      play: [
        { card: cinderellaGentleAndKind, isDrying: false },
        jasmineQueenOfAgrabah,
        mickeyMouseTrueFriend,
      ],
    });

    const nonPrincessId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);

    expect(testEngine.asServer().manualSetDamage(jasmineQueenOfAgrabah, 2)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 2)).toBeSuccessfulCommand();

    const invalidTargetResult = testEngine.asPlayerOne().activateAbility(cinderellaGentleAndKind, {
      targets: [nonPrincessId],
    });

    expect(invalidTargetResult.success).toBe(false);
    expect(testEngine.asServer().getCard(nonPrincessId)?.damage).toBe(2);
  });

  it("removes damage from a chosen Princess character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      play: [
        { card: cinderellaGentleAndKind, isDrying: false },
        jasmineQueenOfAgrabah,
        mickeyMouseTrueFriend,
      ],
    });
    const princessId = testEngine.findCardInstanceId(jasmineQueenOfAgrabah, "play", PLAYER_ONE);

    expect(testEngine.asServer().manualSetDamage(jasmineQueenOfAgrabah, 4)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().activateAbility(cinderellaGentleAndKind, {
        targets: [princessId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().getCard(princessId)?.damage).toBe(1);
    const cinderellaId = testEngine.findCardInstanceId(cinderellaGentleAndKind, "play", PLAYER_ONE);
    expect(testEngine.asServer().getCard(cinderellaId)?.exerted).toBe(true);
  });
});
