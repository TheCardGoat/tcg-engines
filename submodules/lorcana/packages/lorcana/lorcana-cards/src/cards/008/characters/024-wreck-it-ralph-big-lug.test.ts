import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { wreckitRalphBigLug } from "./024-wreck-it-ralph-big-lug";

const racerInDiscard = createMockCharacter({
  id: "ralph-big-lug-racer-discard",
  name: "Racer In Discard",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Racer"],
});

const expensiveRacerInDiscard = createMockCharacter({
  id: "ralph-big-lug-expensive-racer-discard",
  name: "Expensive Racer In Discard",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  classifications: ["Storyborn", "Hero", "Racer"],
});

const nonRacerInDiscard = createMockCharacter({
  id: "ralph-big-lug-non-racer-discard",
  name: "Non Racer In Discard",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Wreck-It Ralph - Big Lug", () => {
  describe("BACK ON TRACK — When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.", () => {
    it("triggers when played and returns a Racer from discard, gaining 1 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphBigLug],
        inkwell: wreckitRalphBigLug.cost,
        discard: [racerInDiscard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(wreckitRalphBigLug)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphBigLug, {
          targets: [racerInDiscard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("hand");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore if the optional is declined when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphBigLug],
        inkwell: wreckitRalphBigLug.cost,
        discard: [racerInDiscard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(wreckitRalphBigLug)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wreckitRalphBigLug, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not allow returning a Racer with cost more than 6", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphBigLug],
        inkwell: wreckitRalphBigLug.cost,
        discard: [expensiveRacerInDiscard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(wreckitRalphBigLug)).toBeSuccessfulCommand();

      // No valid targets → no bag effect should be created
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(expensiveRacerInDiscard)).toBe("discard");
    });

    it("does not allow returning a non-Racer character from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphBigLug],
        inkwell: wreckitRalphBigLug.cost,
        discard: [nonRacerInDiscard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(wreckitRalphBigLug)).toBeSuccessfulCommand();

      // No valid targets → no bag effect should be created
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not create a bag effect when discard is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphBigLug],
        inkwell: wreckitRalphBigLug.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(wreckitRalphBigLug)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers when questing and returns a Racer from discard, gaining 1 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphBigLug, isDrying: false }],
        discard: [racerInDiscard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphBigLug)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphBigLug, {
          targets: [racerInDiscard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("hand");
      // Quest lore (1) + ability lore (1) = 2
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphBigLug.lore + 1);
    });

    it("does not gain ability lore if the optional is declined when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphBigLug, isDrying: false }],
        discard: [racerInDiscard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphBigLug)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wreckitRalphBigLug, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("discard");
      // Only quest lore
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphBigLug.lore);
    });
  });
});
