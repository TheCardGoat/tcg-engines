import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hiroHamadaIntuitiveThinker } from "./106-hiro-hamada-intuitive-thinker";

const floodbornCharacter = createMockCharacter({
  id: "hiro-it-floodborn",
  name: "Floodborn Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Floodborn", "Hero"],
});

const exertedFloodbornCharacter = createMockCharacter({
  id: "hiro-it-exerted-floodborn",
  name: "Exerted Floodborn Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Floodborn", "Hero"],
});

const nonFloodbornCharacter = createMockCharacter({
  id: "hiro-it-non-floodborn",
  name: "Non-Floodborn Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Hiro Hamada - Intuitive Thinker", () => {
  describe("LOOK FOR A NEW ANGLE — {E} — Ready chosen Floodborn character.", () => {
    it("readies a chosen Floodborn character when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: hiroHamadaIntuitiveThinker, isDrying: false },
          { card: exertedFloodbornCharacter, exerted: true },
        ],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().isExerted(exertedFloodbornCharacter)).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(hiroHamadaIntuitiveThinker, {
          ability: "LOOK FOR A NEW ANGLE",
          targets: [exertedFloodbornCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(exertedFloodbornCharacter)).toBe(false);
    });

    it("exerts Hiro Hamada when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: hiroHamadaIntuitiveThinker, isDrying: false },
          { card: exertedFloodbornCharacter, exerted: true },
        ],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(hiroHamadaIntuitiveThinker, {
          ability: "LOOK FOR A NEW ANGLE",
          targets: [exertedFloodbornCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(hiroHamadaIntuitiveThinker)).toBe(true);
    });

    it("cannot target a non-Floodborn character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: hiroHamadaIntuitiveThinker, isDrying: false },
          { card: nonFloodbornCharacter, exerted: true },
        ],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(hiroHamadaIntuitiveThinker, {
          ability: "LOOK FOR A NEW ANGLE",
          targets: [nonFloodbornCharacter],
        }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(nonFloodbornCharacter)).toBe(true);
    });

    it("can target an opponent's Floodborn character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: hiroHamadaIntuitiveThinker, isDrying: false }],
        },
        {
          play: [{ card: exertedFloodbornCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(hiroHamadaIntuitiveThinker, {
          ability: "LOOK FOR A NEW ANGLE",
          targets: [exertedFloodbornCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(exertedFloodbornCharacter)).toBe(false);
    });

    it("cannot activate when Hiro is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: hiroHamadaIntuitiveThinker, exerted: true, isDrying: false },
          { card: exertedFloodbornCharacter, exerted: true },
        ],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(hiroHamadaIntuitiveThinker, {
          ability: "LOOK FOR A NEW ANGLE",
          targets: [exertedFloodbornCharacter],
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("can ready a ready Floodborn character (no exerted requirement on target)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hiroHamadaIntuitiveThinker, isDrying: false }, floodbornCharacter],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(hiroHamadaIntuitiveThinker, {
          ability: "LOOK FOR A NEW ANGLE",
          targets: [floodbornCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(floodbornCharacter)).toBe(false);
    });
  });
});
