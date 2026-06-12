import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jasmineSoothingPrincess } from "./149-jasmine-soothing-princess";

const ally1 = createMockCharacter({
  id: "jasmine-test-ally1",
  name: "Ally One",
  cost: 2,
  strength: 1,
  willpower: 6,
  lore: 1,
});

const ally2 = createMockCharacter({
  id: "jasmine-test-ally2",
  name: "Ally Two",
  cost: 2,
  strength: 1,
  willpower: 6,
  lore: 1,
});

const deckFiller = createMockCharacter({
  id: "jasmine-test-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Jasmine - Soothing Princess", () => {
  it("has Boost 2 keyword ability", () => {
    const boostAbility = (jasmineSoothingPrincess.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Boost",
    );
    expect(boostAbility).toBeDefined();
    expect(
      boostAbility?.type === "keyword" && "value" in boostAbility ? boostAbility.value : undefined,
    ).toBe(2);
  });

  describe("UPLIFTING AURA — Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.", () => {
    it("removes up to 3 damage from each friendly character when questing with a card under her (boosted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: jasmineSoothingPrincess, cardsUnder: [deckFiller], damage: 4 },
          { card: ally1, damage: 4 },
          { card: ally2, damage: 4 },
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(jasmineSoothingPrincess)).toBeSuccessfulCommand();

      // Each character had 4 damage; remove up to 3 => each should have 1 damage remaining
      expect(testEngine.asPlayerOne().getCard(jasmineSoothingPrincess).damage).toBe(1);
      expect(testEngine.asPlayerOne().getCard(ally1).damage).toBe(1);
      expect(testEngine.asPlayerOne().getCard(ally2).damage).toBe(1);
    });

    it("does NOT remove damage when questing without a card under her (not boosted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jasmineSoothingPrincess, { card: ally1, damage: 4 }, { card: ally2, damage: 4 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(jasmineSoothingPrincess)).toBeSuccessfulCommand();

      // No card under Jasmine => UPLIFTING AURA does not trigger => damage unchanged
      expect(testEngine.asPlayerOne().getCard(ally1).damage).toBe(4);
      expect(testEngine.asPlayerOne().getCard(ally2).damage).toBe(4);
    });

    it("does not remove more than current damage (capped at current damage)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: jasmineSoothingPrincess, cardsUnder: [deckFiller], damage: 1 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(jasmineSoothingPrincess)).toBeSuccessfulCommand();

      // Jasmine had 1 damage; remove up to 3 => capped at 1 => 0 remaining
      expect(testEngine.asPlayerOne().getCard(jasmineSoothingPrincess).damage).toBe(0);
    });
  });
});
