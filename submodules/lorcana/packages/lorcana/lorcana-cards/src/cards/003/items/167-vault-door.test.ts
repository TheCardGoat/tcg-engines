import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../characters";
import { mcduckManorScroogesMansion } from "../locations/169-mcduck-manor-scrooges-mansion";
import { vaultDoor } from "./167-vault-door";

const notAtLocation = createMockCharacter({
  id: "vault-door-not-at-location",
  name: "Not At Location",
  cost: 2,
  willpower: 5,
});

describe("Vault Door", () => {
  describe("SEALED AWAY — Your locations and characters at locations gain Resist +1.", () => {
    it("gives locations Resist +1 while Vault Door is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [vaultDoor, mcduckManorScroogesMansion],
      });

      expect(testEngine.asPlayerOne().getKeywordValue(mcduckManorScroogesMansion, "Resist")).toBe(
        1,
      );
    });

    it("does not give locations Resist +1 when Vault Door is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mcduckManorScroogesMansion],
      });

      expect(
        testEngine.asPlayerOne().getKeywordValue(mcduckManorScroogesMansion, "Resist"),
      ).toBeNull();
    });

    it("gives characters at locations Resist +1 while Vault Door is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          vaultDoor,
          mcduckManorScroogesMansion,
          { card: simbaScrappyCub, atLocation: mcduckManorScroogesMansion },
        ],
      });

      expect(testEngine.asPlayerOne().getKeywordValue(simbaScrappyCub, "Resist")).toBe(1);
    });

    it("does not give Resist +1 to characters NOT at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [vaultDoor, mcduckManorScroogesMansion, notAtLocation],
      });

      expect(testEngine.asPlayerOne().getKeywordValue(notAtLocation, "Resist")).toBeNull();
    });

    it("gives Resist +1 to a character after they move to a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [vaultDoor, mcduckManorScroogesMansion, simbaScrappyCub],
        inkwell: mcduckManorScroogesMansion.moveCost,
      });

      expect(testEngine.asPlayerOne().getKeywordValue(simbaScrappyCub, "Resist")).toBeNull();

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(simbaScrappyCub, mcduckManorScroogesMansion),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getKeywordValue(simbaScrappyCub, "Resist")).toBe(1);
    });
  });
});
