import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, createMockLocation } from ".";

// A chosen-character effect cannot acquire location targets through healing analysis.
describe("healing preserves printed target types", () => {
  for (const cardTypes of [["character"], ["location"], ["character", "location"]] as const) {
    it(`permits only ${cardTypes.join("/")} while keeping other damage unchanged`, () => {
      const patient = createMockCharacter({
        id: "heal-type-patient",
        name: "Patient",
        cost: 1,
        willpower: 5,
      });
      const location = createMockLocation({
        id: "heal-type-location",
        name: "Location",
        cost: 1,
        willpower: 5,
      });
      const healer = createMockCharacter({
        id: "heal-type-source",
        name: "Healer",
        cost: 1,
        abilities: [
          {
            type: "triggered",
            trigger: { event: "quest", on: "SELF", timing: "whenever" },
            effect: {
              type: "remove-damage",
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: [...cardTypes],
              },
            },
          },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: healer, isDrying: false },
          { card: patient, damage: 3 },
          { card: location, damage: 3 },
        ],
      });
      expect(g.asPlayerOne().quest(healer)).toBeSuccessfulCommand();
      const onlyCharacters = cardTypes.length === 1 && cardTypes[0] === "character";
      const onlyLocations = cardTypes.length === 1 && cardTypes[0] === "location";
      if (onlyCharacters || onlyLocations) {
        expect(
          g
            .asPlayerOne()
            .resolvePendingByCard(healer, { targets: [onlyCharacters ? location : patient] }),
        ).not.toBeSuccessfulCommand();
        expect(g.asServer().getDamage(patient)).toBe(3);
        expect(g.asServer().getDamage(location)).toBe(3);
      }
      const chosen = onlyCharacters ? patient : location;
      expect(
        g.asPlayerOne().resolvePendingByCard(healer, { targets: [chosen] }),
      ).toBeSuccessfulCommand();
      expect(g.asServer().getDamage(chosen)).toBe(1);
      expect(g.asServer().getDamage(onlyCharacters ? location : patient)).toBe(3);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(g.asPlayerOne().getBagCount()).toBe(0);
    });
  }
});
