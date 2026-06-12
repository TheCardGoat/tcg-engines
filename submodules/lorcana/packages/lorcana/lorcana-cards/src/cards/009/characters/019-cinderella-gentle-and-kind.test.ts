import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { cinderellaGentleAndKind } from "./019-cinderella-gentle-and-kind";
import { rapunzelSunshine } from "./008-rapunzel-sunshine";
import { mickeyMouseTrueFriend } from "./013-mickey-mouse-true-friend";

describe("Cinderella - Gentle and Kind [Set 009]", () => {
  it("does not remove damage from a non-Princess target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      play: [
        { card: cinderellaGentleAndKind, isDrying: false },
        rapunzelSunshine,
        mickeyMouseTrueFriend,
      ],
    });

    const nonPrincessId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);

    expect(testEngine.asServer().manualSetDamage(rapunzelSunshine, 2)).toBeSuccessfulCommand();
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
        rapunzelSunshine,
        mickeyMouseTrueFriend,
      ],
    });
    const princessId = testEngine.findCardInstanceId(rapunzelSunshine, "play", PLAYER_ONE);

    expect(testEngine.asServer().manualSetDamage(rapunzelSunshine, 2)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().activateAbility(cinderellaGentleAndKind, {
        targets: [princessId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().getCard(princessId)?.damage).toBe(0);
  });
});
