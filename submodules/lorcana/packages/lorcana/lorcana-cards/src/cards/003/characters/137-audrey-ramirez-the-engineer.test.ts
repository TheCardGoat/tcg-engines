import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { theSorcerersHat, wildcatsWrench } from "../items";
import { audreyRamirezTheEngineer } from "./137-audrey-ramirez-the-engineer";

describe("Audrey Ramirez - The Engineer", () => {
  it("readies only the chosen item when she quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        audreyRamirezTheEngineer,
        { card: theSorcerersHat, exerted: true },
        { card: wildcatsWrench, exerted: true },
      ],
    });

    expect(testEngine.asPlayerOne().quest(audreyRamirezTheEngineer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(audreyRamirezTheEngineer, {
        targets: [wildcatsWrench],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(wildcatsWrench)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(theSorcerersHat)).toBe(true);
  });
});
