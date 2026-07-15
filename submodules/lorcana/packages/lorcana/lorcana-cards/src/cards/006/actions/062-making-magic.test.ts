import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { makingMagic } from "./062-making-magic";

describe("Making Magic", () => {
  it("moves 1 damage from chosen character to chosen opposing character and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makingMagic],
        inkwell: makingMagic.cost,
        deck: 2,
        play: [{ card: simbaProtectiveCub, damage: 2 }],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(makingMagic, {
        targets: [simbaProtectiveCub, goofyKnightForADay],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 1,
      hand: 1,
    });
  });

  it("moves exactly 1 damage even if source has more damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makingMagic],
        inkwell: makingMagic.cost,
        deck: 2,
        play: [{ card: simbaProtectiveCub, damage: 5 }],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(makingMagic, {
        targets: [simbaProtectiveCub, goofyKnightForADay],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(4);
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
  });

  it("draws a card even when source has no damage to move", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makingMagic],
        inkwell: makingMagic.cost,
        deck: 2,
        play: [simbaProtectiveCub],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(makingMagic, {
        targets: [simbaProtectiveCub, goofyKnightForADay],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 1,
      hand: 1,
    });
  });
});
