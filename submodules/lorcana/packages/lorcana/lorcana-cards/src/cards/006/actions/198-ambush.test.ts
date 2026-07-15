import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyMusketeer, arielOnHumanLegs } from "../../001";
import { ambush } from "./198-ambush";

describe("Ambush!", () => {
  it("exerts a character and deals damage equal to their strength to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ambush],
        inkwell: ambush.cost,
        // goofyMusketeer has 3 strength
        play: [goofyMusketeer],
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    const goofyId = testEngine.findCardInstanceId(goofyMusketeer, "play", "p1");
    const arielId = testEngine.findCardInstanceId(arielOnHumanLegs, "play", "p2");

    // Target 1: goofy (exert), Target 2: ariel (deal damage)
    const result = testEngine.asPlayerOne().playCard(ambush, {
      targets: [goofyId, arielId],
    });
    expect(result).toBeSuccessfulCommand();

    // Goofy should now be exerted
    expect(testEngine.asPlayerOne().isExerted(goofyMusketeer)).toBe(true);

    // Ariel should have taken 3 damage (equal to Goofy's strength)
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: arielOnHumanLegs, value: 3 });
  });

  it("does not deal damage if the exert fails (character already exerted)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ambush],
        inkwell: ambush.cost,
        play: [{ card: goofyMusketeer, exerted: true }],
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    const goofyId = testEngine.findCardInstanceId(goofyMusketeer, "play", "p1");
    const arielId = testEngine.findCardInstanceId(arielOnHumanLegs, "play", "p2");

    // Can't play ambush if no ready characters to exert
    const result = testEngine.asPlayerOne().playCard(ambush, {
      targets: [goofyId, arielId],
    });

    // Ariel should have 0 damage since the exert failed
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: arielOnHumanLegs, value: 0 });
  });
});
