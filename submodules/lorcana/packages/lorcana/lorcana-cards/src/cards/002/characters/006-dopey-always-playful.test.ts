import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dopeyAlwaysPlayful } from "./006-dopey-always-playful";
import { docLeaderOfTheSevenDwarfs } from "./005-doc-leader-of-the-seven-dwarfs";
import { sleepyNoddingOff } from "./021-sleepy-nodding-off";
import { liloMakingAWish } from "../../001/characters/009-lilo-making-a-wish";
import { smash } from "../../001/actions/200-smash";

describe("Dopey - Always Playful", () => {
  it("ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: smash.cost,
      hand: [smash],
      deck: 1,
      play: [
        { card: dopeyAlwaysPlayful },
        { card: sleepyNoddingOff },
        { card: docLeaderOfTheSevenDwarfs },
        { card: liloMakingAWish },
      ],
    });

    // Get initial strengths
    const initialDocStrength = testEngine
      .asPlayerOne()
      .getCard(docLeaderOfTheSevenDwarfs)?.strength;
    const initialSleepyStrength = testEngine.asPlayerOne().getCard(sleepyNoddingOff)?.strength;
    const initialLiloStrength = testEngine.asPlayerOne().getCard(liloMakingAWish)?.strength;

    // Banish Dopey with Smash
    expect(
      testEngine.asPlayerOne().playCard(smash, { targets: [dopeyAlwaysPlayful] }),
    ).toBeSuccessfulCommand();

    // Verify Dopey is banished (in discard zone)
    expect(testEngine.asPlayerOne().getCardZone(dopeyAlwaysPlayful)).toBe("discard");

    // Check strengths after banish - Seven Dwarfs should get +2, Lilo should be unchanged
    expect(testEngine.asPlayerOne().getCard(docLeaderOfTheSevenDwarfs)?.strength).toBe(
      initialDocStrength! + 2,
    );
    expect(testEngine.asPlayerOne().getCard(sleepyNoddingOff)?.strength).toBe(
      initialSleepyStrength! + 2,
    );
    expect(testEngine.asPlayerOne().getCard(liloMakingAWish)?.strength).toBe(initialLiloStrength);

    // Pass turn to player two
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Strengths should still be boosted during player two's turn
    expect(testEngine.asPlayerTwo().getCard(docLeaderOfTheSevenDwarfs)?.strength).toBe(
      initialDocStrength! + 2,
    );
    expect(testEngine.asPlayerTwo().getCard(sleepyNoddingOff)?.strength).toBe(
      initialSleepyStrength! + 2,
    );

    // Pass turn back to player one (start of their next turn)
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Strengths should return to normal at start of player one's next turn
    expect(testEngine.asPlayerOne().getCard(docLeaderOfTheSevenDwarfs)?.strength).toBe(
      initialDocStrength,
    );
    expect(testEngine.asPlayerOne().getCard(sleepyNoddingOff)?.strength).toBe(
      initialSleepyStrength,
    );
  });
});
