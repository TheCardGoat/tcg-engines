import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { magicaDeSpellThievingSorceress } from "./050-magica-de-spell-thieving-sorceress";
import { dinglehopper } from "../../001/items/032-dinglehopper";
import { fishboneQuill } from "../../001/items/168-fishbone-quill";
import { swordOfTruth } from "../../001/items/136-sword-of-truth";

describe("Magica De Spell - Thieving Sorceress", () => {
  it("has the expected printed metadata", () => {
    expect(magicaDeSpellThievingSorceress).toMatchObject({
      id: "iq5",
      canonicalId: "ci_iq5",
      cardType: "character",
      name: "Magica De Spell",
      version: "Thieving Sorceress",
      set: "003",
      cardNumber: 50,
      cost: 4,
      strength: 3,
      willpower: 4,
      lore: 2,
      inkable: true,
    });
  });

  describe("TELEKINESIS {E} - Return chosen item with cost equal to or less than this character's {S} to its player's hand.", () => {
    it("exerts Magica and returns an opponent's item with cost 1 to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicaDeSpellThievingSorceress],
        },
        {
          play: [dinglehopper],
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(magicaDeSpellThievingSorceress, {
        ability: "TELEKINESIS",
        targets: [dinglehopper],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(magicaDeSpellThievingSorceress)).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("hand");
    });

    it("exerts Magica and returns own item with cost 1 to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicaDeSpellThievingSorceress, dinglehopper],
      });

      const result = testEngine.asPlayerOne().activateAbility(magicaDeSpellThievingSorceress, {
        ability: "TELEKINESIS",
        targets: [dinglehopper],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(magicaDeSpellThievingSorceress)).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("hand");
    });

    it("returns an item with cost equal to Magica's strength (3)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicaDeSpellThievingSorceress],
        },
        {
          play: [fishboneQuill],
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(magicaDeSpellThievingSorceress, {
        ability: "TELEKINESIS",
        targets: [fishboneQuill],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(magicaDeSpellThievingSorceress)).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(fishboneQuill)).toBe("hand");
    });

    it("cannot use ability when Magica is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: magicaDeSpellThievingSorceress, exerted: true }],
      });

      const result = testEngine.asPlayerOne().activateAbility(magicaDeSpellThievingSorceress, {
        ability: "TELEKINESIS",
        targets: [dinglehopper],
      });

      expect(result).not.toBeSuccessfulCommand();
    });
  });
});
