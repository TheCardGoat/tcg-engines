import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../characters";
import { eyeOfTheFates } from "./167-eye-of-the-fates";

describe("Eye of the Fates", () => {
  it("gives the chosen character +1 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [eyeOfTheFates, mickeyMouseTrueFriend],
    });

    const result = testEngine.asPlayerOne().activateAbility(eyeOfTheFates, {
      ability: "SEE THE FUTURE",
      targets: [mickeyMouseTrueFriend],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(eyeOfTheFates)).toBe(true);
    expect(testEngine.asPlayerOne().getCardLore(mickeyMouseTrueFriend)).toBe(
      mickeyMouseTrueFriend.lore + 1,
    );
  });
});
