import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scarHeartlessHunter } from "./127-scar-heartless-hunter";
import { tianaCelebratingPrincess } from "../../002/characters/196-tiana-celebrating-princess";

const ownCharacter = createMockCharacter({
  id: "scar-heartless-hunter-own-char",
  name: "Own Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const opposingCharacter = createMockCharacter({
  id: "scar-heartless-hunter-opposing-char",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Scar - Heartless Hunter", () => {
  it("BARED TEETH - deals 2 damage to chosen character of yours to deal 2 damage to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [scarHeartlessHunter],
        inkwell: scarHeartlessHunter.cost,
        play: [ownCharacter],
      },
      {
        play: [opposingCharacter],
      },
    );

    const ownCharId = testEngine.findCardInstanceId(ownCharacter, "play", "p1");
    const opposingCharId = testEngine.findCardInstanceId(opposingCharacter, "play", "p2");

    expect(testEngine.asPlayerOne().playCard(scarHeartlessHunter)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(scarHeartlessHunter, { targets: [ownCharId, opposingCharId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(2);
    expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
  });

  it("BARED TEETH - second damage is not dealt when first damage is fully prevented", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [scarHeartlessHunter],
        inkwell: scarHeartlessHunter.cost,
        play: [tianaCelebratingPrincess],
      },
      {
        play: [opposingCharacter],
      },
    );

    const tianaId = testEngine.findCardInstanceId(tianaCelebratingPrincess, "play", "p1");
    const opposingCharId = testEngine.findCardInstanceId(opposingCharacter, "play", "p2");

    expect(testEngine.asPlayerOne().playCard(scarHeartlessHunter)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(scarHeartlessHunter, { targets: [tianaId, opposingCharId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(tianaCelebratingPrincess)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
  });
});
