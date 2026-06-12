import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { headsHeldHigh } from "./175-heads-held-high";

describe("Heads Held High", () => {
  it("removes up to 3 damage from any number of chosen characters and gives all opposing characters -3 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [headsHeldHigh],
        inkwell: headsHeldHigh.cost,
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
      {
        play: [goofyKnightForADay],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p1");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p1");

    testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);
    testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 2);

    expect(
      testEngine.asPlayerOne().playCard(headsHeldHigh, {
        targets: [simbaId, mickeyId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
    expect(testEngine.asPlayerTwo().getCardStrength(goofyKnightForADay)).toBe(
      goofyKnightForADay.strength - 3,
    );
  });

  it("regression: allows choosing undamaged characters (remove 0 damage is valid) and heals all chosen characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [headsHeldHigh],
        inkwell: headsHeldHigh.cost,
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
      {
        play: [goofyKnightForADay],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p1");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p1");

    // Only Simba is damaged, Mickey is undamaged
    testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);

    // Should be able to choose both (including undamaged Mickey)
    expect(
      testEngine.asPlayerOne().playCard(headsHeldHigh, {
        targets: [simbaId, mickeyId],
      }),
    ).toBeSuccessfulCommand();

    // Simba should be healed (2 damage removed)
    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
    // Mickey had 0 damage, still 0 - but the selection should have been valid
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
    // Opposing characters should still get -3 strength
    expect(testEngine.asPlayerTwo().getCardStrength(goofyKnightForADay)).toBe(
      goofyKnightForADay.strength - 3,
    );
  });

  it("regression: heals ALL chosen characters, not just one", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [headsHeldHigh],
        inkwell: headsHeldHigh.cost,
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
      {
        play: [goofyKnightForADay],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p1");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p1");

    // Both damaged
    testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);
    testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 1);

    expect(
      testEngine.asPlayerOne().playCard(headsHeldHigh, {
        targets: [simbaId, mickeyId],
      }),
    ).toBeSuccessfulCommand();

    // Both should be healed
    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
  });
});
