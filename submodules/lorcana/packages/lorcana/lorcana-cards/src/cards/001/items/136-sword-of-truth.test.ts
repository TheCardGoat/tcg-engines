import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { captainHookRuthlessPirate } from "../characters";
import { swordOfTruth } from "./136-sword-of-truth";

describe("Sword of Truth", () => {
  it("banishes itself to banish the chosen Villain character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [swordOfTruth],
      },
      {
        play: [captainHookRuthlessPirate],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(swordOfTruth, {
      ability: "FINAL ENCHANTMENT",
      targets: [captainHookRuthlessPirate],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(swordOfTruth)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(captainHookRuthlessPirate)).toBe("discard");
  });
});
