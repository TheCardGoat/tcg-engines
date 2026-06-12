import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { stratosTornadoTitan } from "./055-stratos-tornado-titan";

const titanAlly = createMockCharacter({
  id: "stratos-test-titan-ally",
  name: "Titan Ally",
  cost: 2,
  classifications: ["Titan"],
});

const nonTitanCharacter = createMockCharacter({
  id: "stratos-test-non-titan",
  name: "Non Titan",
  cost: 2,
  classifications: ["Hero"],
});

describe("Stratos - Tornado Titan", () => {
  describe("Evasive", () => {
    it("has the Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stratosTornadoTitan],
      });

      expect(testEngine.asPlayerOne().hasKeyword(stratosTornadoTitan, "Evasive")).toBe(true);
    });
  });

  describe("CYCLONE - {E} — Gain lore equal to the number of Titan characters you have in play", () => {
    it("gains lore equal to the number of Titan characters in play (including itself)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stratosTornadoTitan, titanAlly],
        deck: 5,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(stratosTornadoTitan, {
          ability: "CYCLONE",
        }),
      ).toBeSuccessfulCommand();

      // Stratos + one titan ally = 2 titans in play
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it("gains 1 lore when only Stratos (a Titan) is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stratosTornadoTitan],
        deck: 5,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(stratosTornadoTitan, {
          ability: "CYCLONE",
        }),
      ).toBeSuccessfulCommand();

      // Only Stratos is a Titan in play = 1
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does not count opponent Titan characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [stratosTornadoTitan],
          deck: 5,
        },
        {
          play: [titanAlly],
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(stratosTornadoTitan, {
          ability: "CYCLONE",
        }),
      ).toBeSuccessfulCommand();

      // Only Stratos is a Titan on player one's side
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does not count non-Titan characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stratosTornadoTitan, nonTitanCharacter],
        deck: 5,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().activateAbility(stratosTornadoTitan, {
          ability: "CYCLONE",
        }),
      ).toBeSuccessfulCommand();

      // Only Stratos is a Titan, non-titan is not counted
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("exerts Stratos when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stratosTornadoTitan],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(stratosTornadoTitan, {
          ability: "CYCLONE",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(stratosTornadoTitan)).toBe(true);
    });
  });
});
