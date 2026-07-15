import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { mowgliManCub } from "../characters/019-mowgli-man-cub";
import { cantHoldItBackAnymoreEnchanted } from "./228-cant-hold-it-back-anymore-enchanted";

describe("Can't Hold it Back Anymore - Enchanted", () => {
  it("exerts the chosen opposing character and moves all damage to them", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantHoldItBackAnymoreEnchanted],
        inkwell: cantHoldItBackAnymoreEnchanted.cost,
        play: [mowgliManCub, simbaProtectiveCub],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    testEngine.asServer().manualSetDamage(mowgliManCub, 1);
    testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);

    const playResult = testEngine.asPlayerOne().playCard(cantHoldItBackAnymoreEnchanted, {
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
        hand: [cantHoldItBackAnymoreEnchanted],
        inkwell: cantHoldItBackAnymoreEnchanted.cost,
        play: [mowgliManCub],
      },
      {
        play: [goofyKnightForADay, mickeyMouseTrueFriend],
      },
    );

    testEngine.asServer().manualSetDamage(mowgliManCub, 1);
    testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 2);

    const playResult = testEngine.asPlayerOne().playCard(cantHoldItBackAnymoreEnchanted, {
      targets: [goofyKnightForADay],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(goofyKnightForADay)).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(3);
    expect(testEngine.asPlayerOne().getDamage(mowgliManCub)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(0);
  });

  it("works when no other characters have damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cantHoldItBackAnymoreEnchanted],
        inkwell: cantHoldItBackAnymoreEnchanted.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(cantHoldItBackAnymoreEnchanted, {
      targets: [mickeyMouseTrueFriend],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(mickeyMouseTrueFriend)).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(0);
  });
});
