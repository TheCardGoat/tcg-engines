import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mysticalRose } from "./064-mystical-rose";

const beast = createMockCharacter({
  id: "mystical-rose-beast",
  name: "Beast",
  cost: 4,
  lore: 1,
});

const belle = createMockCharacter({
  id: "mystical-rose-belle",
  name: "Belle",
  cost: 4,
});

const damagedAlly = createMockCharacter({
  id: "mystical-rose-ally",
  name: "Damaged Ally",
  cost: 2,
});

const opposingTarget = createMockCharacter({
  id: "mystical-rose-opponent",
  name: "Opposing Target",
  cost: 2,
});

describe("Mystical Rose", () => {
  it("gives Beast +2 lore and moves up to 3 damage when Belle is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mysticalRose, beast, belle, damagedAlly],
      },
      {
        play: [opposingTarget],
      },
    );

    testEngine.asServer().manualSetDamage(damagedAlly, 3);
    const baseLore = testEngine.asPlayerOne().getCardLore(beast);

    expect(
      testEngine.asPlayerOne().activateAbility(mysticalRose, {
        targets: [beast, damagedAlly, opposingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(beast)).toBe(baseLore + 2);
    expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(opposingTarget)).toBe(3);
    expect(testEngine.asPlayerOne().getCardZone(mysticalRose)).toBe("discard");
  });

  it("still gives Beast +2 lore when Belle is not in play, but does not move damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mysticalRose, beast, damagedAlly],
      },
      {
        play: [opposingTarget],
      },
    );

    testEngine.asServer().manualSetDamage(damagedAlly, 3);
    const baseLore = testEngine.asPlayerOne().getCardLore(beast);

    expect(
      testEngine.asPlayerOne().activateAbility(mysticalRose, {
        targets: [beast, damagedAlly, opposingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(beast)).toBe(baseLore + 2);
    expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
    expect(testEngine.asPlayerTwo().getDamage(opposingTarget)).toBe(0);
  });
});
