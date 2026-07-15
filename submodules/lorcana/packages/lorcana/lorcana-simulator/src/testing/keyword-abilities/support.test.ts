import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { flounderVoiceOfReason, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { resolveOnlyBagEffect, supportTarget } from "../rules/section-08-test-utils";

describe("Support - Hei Hei, Boat Snack - Support (Whenever this character quests, you may add their strength to another chosen character's strength this turn.)", () => {
  it("Support triggers on quest and adds quester's strength to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [heiheiBoatSnack, supportTarget],
      },
      {
        play: [{ card: flounderVoiceOfReason, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().quest(heiheiBoatSnack)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    resolveOnlyBagEffect(testEngine, {
      resolveOptional: true,
      targets: [supportTarget],
    });

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + heiheiBoatSnack.strength,
    );
  });

  it("Support buff enables a character to banish an opponent in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [heiheiBoatSnack, supportTarget],
      },
      {
        play: [{ card: flounderVoiceOfReason, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().quest(heiheiBoatSnack)).toBeSuccessfulCommand();

    resolveOnlyBagEffect(testEngine, {
      resolveOptional: true,
      targets: [supportTarget],
    });

    // supportTarget (str 1 + 1 from HeiHei = str 2) vs flounder (wp 2) — enough to banish
    expect(testEngine.asPlayerOne().challenge(supportTarget, flounderVoiceOfReason).success).toBe(
      true,
    );
    expect(testEngine.asPlayerTwo().getCardZone(flounderVoiceOfReason)).toBe("discard");
  });

  it("Support is optional — declining leaves the character's strength unchanged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [heiheiBoatSnack, supportTarget],
    });

    expect(testEngine.asPlayerOne().quest(heiheiBoatSnack)).toBeSuccessfulCommand();

    resolveOnlyBagEffect(testEngine, {
      resolveOptional: false,
    });

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });

  it.todo("Support buff is this-turn only — strength resets at end of turn", () => {});

  it.todo("Support does not trigger when the character challenges", () => {});
});
