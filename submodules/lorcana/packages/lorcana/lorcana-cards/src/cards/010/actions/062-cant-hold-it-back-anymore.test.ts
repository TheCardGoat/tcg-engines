import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { mowgliManCub } from "../characters/019-mowgli-man-cub";
import { cantHoldItBackAnymore } from "./062-cant-hold-it-back-anymore";

describe("Can't Hold It Back Anymore", () => {
  it("exerts the chosen opposing character and moves all damage to them", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantHoldItBackAnymore],
        inkwell: cantHoldItBackAnymore.cost,
        play: [mowgliManCub, simbaProtectiveCub],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    testEngine.asServer().manualSetDamage(mowgliManCub, 1);
    testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);

    const playResult = testEngine.asPlayerOne().playCard(cantHoldItBackAnymore, {
      targets: [goofyKnightForADay],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(goofyKnightForADay)).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(3);
    expect(testEngine.asPlayerOne().getDamage(mowgliManCub)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
  });

  it("moves damage from both players' characters to the target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantHoldItBackAnymore],
        inkwell: cantHoldItBackAnymore.cost,
        play: [mowgliManCub],
      },
      {
        play: [goofyKnightForADay, mickeyMouseTrueFriend],
      },
    );

    // Add damage to characters on both sides
    testEngine.asServer().manualSetDamage(mowgliManCub, 1);
    testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 2);

    const playResult = testEngine.asPlayerOne().playCard(cantHoldItBackAnymore, {
      targets: [goofyKnightForADay],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(goofyKnightForADay)).toBe(true);
    // Goofy receives 1 (from Mowgli) + 2 (from Mickey) = 3 damage
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(3);
    expect(testEngine.asPlayerOne().getDamage(mowgliManCub)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(0);
  });

  it("works when no other characters have damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantHoldItBackAnymore],
        inkwell: cantHoldItBackAnymore.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(cantHoldItBackAnymore, {
      targets: [mickeyMouseTrueFriend],
    });

    // Character should be exerted even with no damage to move
    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(mickeyMouseTrueFriend)).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(0);
  });

  it("banishes the target when accumulated damage exceeds willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantHoldItBackAnymore],
        inkwell: cantHoldItBackAnymore.cost,
        play: [goofyKnightForADay],
      },
      {
        // Mickey has 3 willpower
        play: [mickeyMouseTrueFriend],
      },
    );

    // Add 2 damage to Goofy and 1 damage to Mickey (target)
    testEngine.asServer().manualSetDamage(goofyKnightForADay, 2);
    testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 1);

    const playResult = testEngine.asPlayerOne().playCard(cantHoldItBackAnymore, {
      targets: [mickeyMouseTrueFriend],
    });

    expect(playResult).toBeSuccessfulCommand();
    // Mickey had 1 damage + receives 2 from Goofy = 3 damage, which equals willpower (3), so banished
    expect(testEngine.getCard(mickeyMouseTrueFriend)).toBeInZone("discard");
    expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(0);
  });
});
