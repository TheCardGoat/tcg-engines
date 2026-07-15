import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jasmineHeirOfAgrabah } from "./155-jasmine-heir-of-agrabah";

const damagedAlly = createMockCharacter({
  id: "jasmine-heir-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const undamagedAlly = createMockCharacter({
  id: "jasmine-heir-undamaged-ally",
  name: "Undamaged Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const damagedOpponent = createMockCharacter({
  id: "jasmine-heir-damaged-opponent",
  name: "Damaged Opponent",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Jasmine - Heir of Agrabah (set 009)", () => {
  describe("I'M A FAST LEARNER — When you play this character, remove up to 1 damage from chosen character of yours.", () => {
    it("triggers when Jasmine is played and creates a bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jasmineHeirOfAgrabah],
        inkwell: jasmineHeirOfAgrabah.cost,
        play: [{ card: damagedAlly, damage: 1 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("removes 1 damage from chosen character when the bag effect is resolved", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jasmineHeirOfAgrabah],
        inkwell: jasmineHeirOfAgrabah.cost,
        play: [{ card: damagedAlly, damage: 1 }],
        deck: 2,
      });

      const allyId = testEngine.findCardInstanceId(damagedAlly, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineHeirOfAgrabah, {
          resolveOptional: true,
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(allyId)?.damage).toBe(0);
    });

    it("removes only up to 1 damage when the character has more than 1 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jasmineHeirOfAgrabah],
        inkwell: jasmineHeirOfAgrabah.cost,
        play: [{ card: damagedAlly, damage: 3 }],
        deck: 2,
      });

      const allyId = testEngine.findCardInstanceId(damagedAlly, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineHeirOfAgrabah, {
          resolveOptional: true,
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      // Only 1 damage removed, leaving 2 remaining
      expect(testEngine.asServer().getCard(allyId)?.damage).toBe(2);
    });

    it("can target own undamaged character (0 damage removed, still valid)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jasmineHeirOfAgrabah],
        inkwell: jasmineHeirOfAgrabah.cost,
        play: [undamagedAlly],
        deck: 2,
      });

      const allyId = testEngine.findCardInstanceId(undamagedAlly, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(jasmineHeirOfAgrabah, {
            resolveOptional: true,
            targets: [allyId],
          }),
        ).toBeSuccessfulCommand();
      }

      // Undamaged character stays at 0 damage
      expect(testEngine.asServer().getCard(allyId)?.damage ?? 0).toBe(0);
    });

    it("can also choose Jasmine herself as the target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jasmineHeirOfAgrabah],
        inkwell: jasmineHeirOfAgrabah.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const jasmineId = testEngine.findCardInstanceId(jasmineHeirOfAgrabah, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineHeirOfAgrabah, {
          resolveOptional: true,
          targets: [jasmineId],
        }),
      ).toBeSuccessfulCommand();
    });

    it("cannot choose an opponent's damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jasmineHeirOfAgrabah],
          inkwell: jasmineHeirOfAgrabah.cost,
          play: [{ card: damagedAlly, damage: 1 }],
          deck: [],
        },
        {
          play: [{ card: damagedOpponent, damage: 1 }],
          deck: [],
        },
      );

      const allyId = testEngine.findCardInstanceId(damagedAlly, "play", PLAYER_ONE);
      const opponentId = testEngine.findCardInstanceId(damagedOpponent, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineHeirOfAgrabah, {
          resolveOptional: true,
          targets: [opponentId],
        }),
      ).not.toBeSuccessfulCommand();
      expect(testEngine.asServer().getCard(opponentId)?.damage).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineHeirOfAgrabah, {
          resolveOptional: true,
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asServer().getCard(allyId)?.damage).toBe(0);
    });
  });
});
