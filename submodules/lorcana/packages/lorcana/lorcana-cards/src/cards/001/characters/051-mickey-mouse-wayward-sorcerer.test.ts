import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseWaywardSorcerer } from "./051-mickey-mouse-wayward-sorcerer";
import { magicBroomBucketBrigade } from "./047-magic-broom-bucket-brigade";
import { mickeyMouseTrueFriend } from "./012-mickey-mouse-true-friend";

const nonBroomCharacter = createMockCharacter({
  id: "wayward-sorcerer-non-broom",
  name: "Non Broom Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Mickey Mouse - Wayward Sorcerer", () => {
  describe("CEASELESS WORKER: Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.", () => {
    it("returns broom attacker to hand when banished in challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicBroomBucketBrigade, mickeyMouseWaywardSorcerer],
          deck: 1,
        },
        {
          play: [{ card: mickeyMouseTrueFriend, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(magicBroomBucketBrigade, mickeyMouseTrueFriend),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMouseWaywardSorcerer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(magicBroomBucketBrigade)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseWaywardSorcerer)).toBe("play");
    });

    it("returns broom defender to hand when banished in challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrueFriend],
          deck: 1,
        },
        {
          play: [{ card: magicBroomBucketBrigade, exerted: true }, mickeyMouseWaywardSorcerer],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, magicBroomBucketBrigade),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(mickeyMouseWaywardSorcerer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(magicBroomBucketBrigade)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseWaywardSorcerer)).toBe("play");
    });

    it("lets player decline the effect (broom stays in discard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrueFriend],
          deck: 1,
        },
        {
          play: [{ card: magicBroomBucketBrigade, exerted: true }, mickeyMouseWaywardSorcerer],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, magicBroomBucketBrigade),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(mickeyMouseWaywardSorcerer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(magicBroomBucketBrigade)).toBe("discard");
    });

    it("does not trigger when a non-broom character is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [nonBroomCharacter, mickeyMouseWaywardSorcerer],
          deck: 1,
        },
        {
          play: [{ card: mickeyMouseTrueFriend, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(nonBroomCharacter, mickeyMouseTrueFriend),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(nonBroomCharacter)).toBe("discard");
    });

    it("does not trigger when an opponent's broom character is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrueFriend, mickeyMouseWaywardSorcerer],
          deck: 1,
        },
        {
          play: [{ card: magicBroomBucketBrigade, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, magicBroomBucketBrigade),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(magicBroomBucketBrigade)).toBe("discard");
    });
  });
});
