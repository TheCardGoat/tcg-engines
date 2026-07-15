import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { luisaMadrigalConfidentClimber } from "./060-luisa-madrigal-confident-climber";

/**
 * Triage report 2026-05-11 (#13, game mgVeSc0EO-Mq31mErsDyv-7 turn 20):
 *
 * Player activated Luisa's I CAN TAKE IT (`move-damage` from
 * `CHOSEN_CHARACTER_OF_YOURS` to `SELF`). The target picker offered Luisa
 * herself as a `from` candidate — picking her produces a no-op (the resolver
 * skips when source === destination), making the prompt unconfirmable for the
 * player and creating the "soft-lock" they reported (two undos, then gave up).
 *
 * Engine fix: when `effect.type === "move-damage"` and `effect.to === "SELF"`
 * (or `effect.from === "SELF"`), the chosen-side target descriptor must carry
 * `excludeSelf: true`, removing the source card from the candidate list.
 */

const friendlyChar = createMockCharacter({
  id: "luisa-exclude-self-friend",
  name: "Friend",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Luisa Madrigal - Confident Climber — I CAN TAKE IT excludes self from `from` candidates", () => {
  it("rejects targeting Luisa herself as the move-damage source", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: luisaMadrigalConfidentClimber, damage: 2 },
          { card: friendlyChar, damage: 1 },
        ],
        inkwell: 1,
        deck: 5,
      },
      { deck: 5 },
    );

    const luisaId = testEngine.findCardInstanceId(luisaMadrigalConfidentClimber, "play");
    expect(
      testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
    ).toBeSuccessfulCommand();

    // Picking Luisa herself as the source must be rejected as an illegal target.
    const result = testEngine.asPlayerOne().resolveNextPending({ targets: [luisaId] });
    expect(result.success).toBe(false);
  });

  it("still allows a different friendly character as the move-damage source", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: luisaMadrigalConfidentClimber, damage: 0 },
          { card: friendlyChar, damage: 2 },
        ],
        inkwell: 1,
        deck: 5,
      },
      { deck: 5 },
    );

    const friendlyId = testEngine.findCardInstanceId(friendlyChar, "play");
    expect(
      testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [friendlyId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(1);
    expect(testEngine.asPlayerOne().getDamage(friendlyChar)).toBe(1);
  });
});
