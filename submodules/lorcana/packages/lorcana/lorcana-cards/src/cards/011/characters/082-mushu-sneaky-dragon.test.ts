import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mushuSneakyDragon } from "./082-mushu-sneaky-dragon";

const toughTarget = createMockCharacter({
  id: "mushu-test-tough",
  name: "Tough Target",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const fragileTarget = createMockCharacter({
  id: "mushu-test-fragile",
  name: "Fragile Target",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Mushu - Sneaky Dragon", () => {
  describe("SNOWY SURPRISE - When you play this character, deal 2 damage to chosen character", () => {
    it("deals 2 damage to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mushuSneakyDragon],
          inkwell: mushuSneakyDragon.cost,
          deck: 5,
        },
        {
          play: [toughTarget],
        },
      );

      expect(testEngine.asPlayerOne().playCard(mushuSneakyDragon)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagId = bagEffects[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mushuSneakyDragon, { targets: [toughTarget] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(toughTarget)).toBe(2);
    });

    it("can target own characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mushuSneakyDragon],
        play: [toughTarget],
        inkwell: mushuSneakyDragon.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(mushuSneakyDragon)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mushuSneakyDragon, { targets: [toughTarget] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(toughTarget)).toBe(2);
    });

    it("can target opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mushuSneakyDragon],
          inkwell: mushuSneakyDragon.cost,
          deck: 5,
        },
        {
          play: [toughTarget],
        },
      );

      expect(testEngine.asPlayerOne().playCard(mushuSneakyDragon)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mushuSneakyDragon, { targets: [toughTarget] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(toughTarget)).toBe(2);
    });

    it("can banish character if damage exceeds willpower", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mushuSneakyDragon],
          inkwell: mushuSneakyDragon.cost,
          deck: 5,
        },
        {
          play: [fragileTarget],
        },
      );

      expect(testEngine.asPlayerOne().playCard(mushuSneakyDragon)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mushuSneakyDragon, { targets: [fragileTarget] }),
      ).toBeSuccessfulCommand();

      // 2 damage on 2 willpower = banished
      expect(testEngine.asPlayerTwo().getCardZone(fragileTarget)).toBe("discard");
    });

    it("triggers only when Mushu is played, not when already in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mushuSneakyDragon],
          deck: 5,
        },
        {
          play: [toughTarget],
        },
      );

      // Mushu is already in play - no bag effects should exist
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(toughTarget)).toBe(0);
    });

    it("plays successfully even with no valid targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mushuSneakyDragon],
        inkwell: mushuSneakyDragon.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(mushuSneakyDragon)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mushuSneakyDragon)).toBe("play");
    });

    it("deals exactly 2 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mushuSneakyDragon],
          inkwell: mushuSneakyDragon.cost,
          deck: 5,
        },
        {
          play: [toughTarget],
        },
      );

      expect(testEngine.asPlayerOne().playCard(mushuSneakyDragon)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mushuSneakyDragon, { targets: [toughTarget] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(toughTarget)).toBe(2);
      // 4 willpower - 2 damage = still alive
      expect(testEngine.asPlayerTwo().getCardZone(toughTarget)).toBe("play");
    });
  });
});
