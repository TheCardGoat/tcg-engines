import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { lenaSabrewingPureEnergy } from "./049-lena-sabrewing-pure-energy";

const targetCharacter = createMockCharacter({
  id: "lena-pe-target-char",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const alliedCharacter = createMockCharacter({
  id: "lena-pe-allied-char",
  name: "Allied Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Lena Sabrewing - Pure Energy", () => {
  it("has Evasive keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [lenaSabrewingPureEnergy],
    });

    expect(testEngine.getCardModel(lenaSabrewingPureEnergy).hasEvasive).toBe(true);
  });

  describe("SUPERNATURAL VENGEANCE — {E} — Deal 1 damage to chosen character.", () => {
    it("deals 1 damage to a chosen opponent character when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: lenaSabrewingPureEnergy, isDrying: false }],
        },
        {
          play: [targetCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(lenaSabrewingPureEnergy, {
          ability: "SUPERNATURAL VENGEANCE",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(1);
    });

    it("deals 1 damage to a chosen allied character when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: lenaSabrewingPureEnergy, isDrying: false }, alliedCharacter],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(lenaSabrewingPureEnergy, {
          ability: "SUPERNATURAL VENGEANCE",
          targets: [alliedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(alliedCharacter)).toBe(1);
    });

    it("exerts Lena Sabrewing when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: lenaSabrewingPureEnergy, isDrying: false }],
        },
        {
          play: [targetCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(lenaSabrewingPureEnergy, {
          ability: "SUPERNATURAL VENGEANCE",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(lenaSabrewingPureEnergy)).toBe(true);
    });

    it("cannot activate when already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: lenaSabrewingPureEnergy, exerted: true, isDrying: false }],
        },
        {
          play: [targetCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(lenaSabrewingPureEnergy, {
          ability: "SUPERNATURAL VENGEANCE",
          targets: [targetCharacter],
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("banishes target when damage equals willpower", () => {
      const fragileCharacter = createMockCharacter({
        id: "lena-pe-fragile-char",
        name: "Fragile Character",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: lenaSabrewingPureEnergy, isDrying: false }],
        },
        {
          play: [fragileCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(lenaSabrewingPureEnergy, {
          ability: "SUPERNATURAL VENGEANCE",
          targets: [fragileCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(fragileCharacter)).toBe("discard");
    });
  });
});
