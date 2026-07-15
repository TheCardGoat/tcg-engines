import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { maximusPalaceHorse, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { shesYourPerson } from "./040-shes-your-person";

describe("She's Your Person", () => {
  it("removes up to 3 damage from the chosen character in mode 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shesYourPerson],
      inkwell: shesYourPerson.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCardWithChoice(shesYourPerson, 0, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
  });

  it("removes up to 3 damage from each of your Bodyguard characters in mode 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shesYourPerson],
      inkwell: shesYourPerson.cost,
      play: [simbaProtectiveCub, maximusPalaceHorse, mickeyMouseTrueFriend],
    });

    expect(testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(maximusPalaceHorse, 1)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 2)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCardWithChoice(shesYourPerson, 1)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(maximusPalaceHorse)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(2);
  });
});
