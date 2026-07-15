import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { auroraDreamingGuardian } from "@tcg/lorcana-cards/cards/001";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { theyNeverComeBack } from "@tcg/lorcana-cards/cards/008";

/**
 * BUG 17: Aurora - Dreaming Guardian "PROTECTIVE EMBRACE" grants Ward to other
 * allied characters. "They Never Come Back" targets "chosen characters" and
 * must not be allowed to target a Ward-protected allied character.
 */
describe("bug-17 — Aurora - Dreaming Guardian grants Ward; They Never Come Back cannot target warded allies", () => {
  it("allies receive Ward from Aurora (PROTECTIVE EMBRACE)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [auroraDreamingGuardian, simbaProtectiveCub, mickeyMouseTrueFriend],
    });

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Ward")).toBe(true);
    expect(testEngine.hasKeyword(mickeyMouseTrueFriend, "Ward")).toBe(true);
    // Aurora herself does not gain Ward from her own effect.
    expect(testEngine.hasKeyword(auroraDreamingGuardian, "Ward")).toBe(false);
  });

  it("They Never Come Back cannot target an opposing warded character (granted by Aurora)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theyNeverComeBack],
        inkwell: theyNeverComeBack.cost,
        deck: 2,
      },
      {
        // Aurora grants Ward to simba on opponent's side.
        play: [
          { card: auroraDreamingGuardian, isDrying: false },
          { card: simbaProtectiveCub, isDrying: false },
        ],
        deck: 2,
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");

    const result = testEngine.asPlayerOne().playCard(theyNeverComeBack, {
      targets: [simbaId],
    }) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("INVALID_ACTION_TARGET");
  });
});
