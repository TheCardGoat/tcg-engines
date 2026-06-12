import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { sleepyDeepSleeper } from "./044-sleepy-deep-sleeper";

const sevenDwarfsAlly = createMockCharacter({
  id: "sleepy-deep-sleeper-seven-dwarfs-ally",
  name: "Doc",
  version: "Leader of the Seven Dwarfs",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const princessAlly = createMockCharacter({
  id: "sleepy-deep-sleeper-princess-ally",
  name: "Snow White",
  version: "Fair-Hearted",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const nonQualifyingAlly = createMockCharacter({
  id: "sleepy-deep-sleeper-non-qualifying",
  name: "Generic Hero",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Sleepy - Deep Sleeper", () => {
  describe("PLEASANT DREAMS - When this character is banished, if you have a Seven Dwarfs or Princess character in play, you may draw a card.", () => {
    it("lets the controller draw a card when banished while another Seven Dwarfs character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [sleepyDeepSleeper, sevenDwarfsAlly],
          deck: 5,
        },
      );

      const handCountBefore = testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count;

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [sleepyDeepSleeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(sleepyDeepSleeper)).toBe("discard");

      // Trigger should be in the bag for Sleepy's controller
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      // Accept the optional draw
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(sleepyDeepSleeper, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count).toBe(
        handCountBefore + 1,
      );
    });

    it("lets the controller draw a card when banished while a Princess character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [sleepyDeepSleeper, princessAlly],
          deck: 5,
        },
      );

      const handCountBefore = testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count;

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [sleepyDeepSleeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(sleepyDeepSleeper)).toBe("discard");

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(sleepyDeepSleeper, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count).toBe(
        handCountBefore + 1,
      );
    });

    it("does not draw a card when the controller has no Seven Dwarfs or Princess characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [sleepyDeepSleeper, nonQualifyingAlly],
          deck: 5,
        },
      );

      const handCountBefore = testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count;

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [sleepyDeepSleeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(sleepyDeepSleeper)).toBe("discard");

      // Resolve any pending trigger (condition should fail, so no draw)
      const bagCount = testEngine.asPlayerTwo().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(sleepyDeepSleeper, {
            resolveOptional: true,
          }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count).toBe(
        handCountBefore,
      );
    });

    it("can decline the optional draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [sleepyDeepSleeper, sevenDwarfsAlly],
          deck: 5,
        },
      );

      const handCountBefore = testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count;

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [sleepyDeepSleeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(sleepyDeepSleeper, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardsInZone("hand", "player_two").count).toBe(
        handCountBefore,
      );
    });
  });
});
