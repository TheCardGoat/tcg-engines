import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ursulasLairEyeOfTheStorm } from "./068-ursulas-lair-eye-of-the-storm";

const ursulaGuest = createMockCharacter({
  id: "ursulas-lair-ursula",
  name: "Ursula",
  cost: 4,
  lore: 2,
  strength: 2,
  willpower: 2,
});

const banishedResident = createMockCharacter({
  id: "ursulas-lair-resident",
  name: "Banished Resident",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const invadingAttacker = createMockCharacter({
  id: "ursulas-lair-attacker",
  name: "Invading Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Ursula's Lair - Eye of the Storm", () => {
  it("gives Ursula +1 lore while here and can return a character banished here in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          ursulasLairEyeOfTheStorm,
          { card: ursulaGuest, atLocation: ursulasLairEyeOfTheStorm },
          { card: banishedResident, atLocation: ursulasLairEyeOfTheStorm, exerted: true },
        ],
        deck: 1,
      },
      {
        play: [invadingAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().getCard(ursulaGuest)?.lore).toBe(ursulaGuest.lore + 1);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(invadingAttacker, banishedResident).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getCardZone(banishedResident)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(ursulasLairEyeOfTheStorm).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getCardZone(banishedResident)).toBe("hand");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });
});
