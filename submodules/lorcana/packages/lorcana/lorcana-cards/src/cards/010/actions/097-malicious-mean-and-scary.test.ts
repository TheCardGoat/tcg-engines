import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { mowgliManCub } from "../characters/019-mowgli-man-cub";
import { maliciousMeanAndScary } from "./097-malicious-mean-and-scary";

describe("Malicious, Mean, and Scary", () => {
  it("puts 1 damage on each opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [maliciousMeanAndScary],
        inkwell: maliciousMeanAndScary.cost,
      },
      {
        play: [simbaProtectiveCub, mowgliManCub],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(maliciousMeanAndScary);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(mowgliManCub)).toBe(1);
  });
});
