import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { donaldDuckMusketeerSoldier } from "./008-donald-duck-musketeer-soldier";

const allyCharacter = createMockCharacter({
  id: "donald-musketeer-ally",
  name: "Musketeer Ally",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Donald Duck - Musketeer Soldier", () => {
  it("has Bodyguard keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckMusketeerSoldier],
      deck: 5,
    });

    expect(testEngine.hasKeyword(donaldDuckMusketeerSoldier, "Bodyguard")).toBe(true);
  });

  describe("WAIT FOR ME! - When you play this character, chosen character gets +1 {L} this turn.", () => {
    it("triggers when played and requires choosing a target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckMusketeerSoldier],
        inkwell: donaldDuckMusketeerSoldier.cost,
        play: [allyCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckMusketeerSoldier)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("gives +1 lore to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckMusketeerSoldier],
        inkwell: donaldDuckMusketeerSoldier.cost,
        play: [allyCharacter],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(allyCharacter);

      expect(testEngine.asPlayerOne().playCard(donaldDuckMusketeerSoldier)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(donaldDuckMusketeerSoldier, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(initialLore + 1);
    });

    it("lore bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [donaldDuckMusketeerSoldier],
          inkwell: donaldDuckMusketeerSoldier.cost,
          play: [allyCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const initialLore = testEngine.asPlayerOne().getCardLore(allyCharacter);

      expect(testEngine.asPlayerOne().playCard(donaldDuckMusketeerSoldier)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(donaldDuckMusketeerSoldier, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(initialLore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(initialLore);
    });

    it("can target Donald Duck himself with the lore boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckMusketeerSoldier],
        inkwell: donaldDuckMusketeerSoldier.cost,
        deck: 5,
      });

      const initialLore = donaldDuckMusketeerSoldier.lore;

      expect(testEngine.asPlayerOne().playCard(donaldDuckMusketeerSoldier)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckMusketeerSoldier, {
          targets: [donaldDuckMusketeerSoldier],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(donaldDuckMusketeerSoldier)).toBe(
        initialLore + 1,
      );
    });
  });
});
