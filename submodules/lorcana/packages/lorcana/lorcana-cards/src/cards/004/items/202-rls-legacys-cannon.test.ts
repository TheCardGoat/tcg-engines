import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theWallBorderFortress } from "../locations";
import { rlsLegacysCannon } from "./202-rls-legacys-cannon";

const cannonFodder = createMockCharacter({
  id: "rls-cannon-fodder",
  name: "Cannon Fodder",
  cost: 1,
});

describe("RLS Legacy's Cannon", () => {
  it("discards a card to deal 2 damage to a chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cannonFodder],
        inkwell: 2,
        play: [rlsLegacysCannon],
      },
      {
        play: [theWallBorderFortress],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(rlsLegacysCannon, {
        targets: [theWallBorderFortress],
        costs: {
          discardCards: [cannonFodder],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(theWallBorderFortress)).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(cannonFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(rlsLegacysCannon)).toBe(true);
  });

  it("discards a card to deal 2 damage to a chosen character", () => {
    const targetCharacter = createMockCharacter({
      id: "target-character",
      name: "Target Character",
      cost: 2,
      willpower: 5,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cannonFodder],
        inkwell: 2,
        play: [rlsLegacysCannon],
      },
      {
        play: [targetCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(rlsLegacysCannon, {
        targets: [targetCharacter],
        costs: {
          discardCards: [cannonFodder],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(cannonFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(rlsLegacysCannon)).toBe(true);
  });
});
