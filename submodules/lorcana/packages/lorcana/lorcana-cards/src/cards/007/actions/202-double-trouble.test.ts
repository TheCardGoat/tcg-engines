import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { doubleTrouble } from "./202-double-trouble";

describe("Double Trouble", () => {
  it("deals 1 damage each to up to 2 chosen characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [doubleTrouble],
        inkwell: doubleTrouble.cost,
      },
      {
        play: [simbaProtectiveCub, arielOnHumanLegs, mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(doubleTrouble, {
        targets: [simbaProtectiveCub, arielOnHumanLegs],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(0);
  });
});
