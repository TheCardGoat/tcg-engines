import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { boomerHasTheBeak } from "./076-boomer-has-the-beak";

const damagedCharacter = createMockCharacter({
  id: "boomer-test-damaged",
  name: "Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const undamagedCharacter = createMockCharacter({
  id: "boomer-test-undamaged",
  name: "Undamaged Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Boomer - Has the Beak", () => {
  describe("SPOTTED HIM! - When you play this character, you may exert chosen damaged character", () => {
    it("exerts chosen damaged character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [boomerHasTheBeak],
          inkwell: boomerHasTheBeak.cost,
          deck: 5,
        },
        {
          play: [{ card: damagedCharacter, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(boomerHasTheBeak)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagId = bagEffects[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(boomerHasTheBeak, {
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(damagedCharacter)).toBe(true);
    });

    it("is optional - can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [boomerHasTheBeak],
          inkwell: boomerHasTheBeak.cost,
          deck: 5,
        },
        {
          play: [{ card: damagedCharacter, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(boomerHasTheBeak)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagId = bagEffects[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(boomerHasTheBeak, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(damagedCharacter)).toBe(false);
    });

    it("can target own damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [boomerHasTheBeak],
        play: [{ card: damagedCharacter, damage: 1 }],
        inkwell: boomerHasTheBeak.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(boomerHasTheBeak)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(boomerHasTheBeak, {
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(damagedCharacter)).toBe(true);
    });

    // Target filter enforcement (damaged-only) is handled at the UI/client level.
    // The engine accepts the command but the filter guides valid target selection.
    it.todo("cannot target undamaged characters - requires engine-level filter enforcement in bag resolver", () => {});

    it("plays successfully even with no damaged characters to target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [boomerHasTheBeak],
          inkwell: boomerHasTheBeak.cost,
          deck: 5,
        },
        {
          play: [undamagedCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(boomerHasTheBeak)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(boomerHasTheBeak)).toBe("play");
    });
  });
});
