import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princePhillipDragonslayer } from "./016-prince-phillip-dragonslayer";

// Prince Phillip: strength 3, willpower 3
// To banish him: defender needs strength >= 3

const strongDefender = createMockCharacter({
  id: "pp-dragonslayer-strong-defender",
  name: "Strong Defender",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const weakDefender = createMockCharacter({
  id: "pp-dragonslayer-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Prince Phillip - Dragonslayer", () => {
  describe("HEROISM — When this character challenges and is banished, you may banish the challenged character.", () => {
    it("triggers when Prince Phillip challenges and is banished, allowing player to banish the challenged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princePhillipDragonslayer],
          deck: 2,
        },
        {
          play: [{ card: strongDefender, exerted: true }],
          deck: 2,
        },
      );

      // Prince Phillip challenges the strong defender and gets banished (STR 5 >= WP 3)
      expect(
        testEngine.asPlayerOne().challenge(princePhillipDragonslayer, strongDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princePhillipDragonslayer)).toBe("discard");

      // HEROISM should trigger and put an optional ability in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("banishes the challenged character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princePhillipDragonslayer],
          deck: 2,
        },
        {
          play: [{ card: strongDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(princePhillipDragonslayer, strongDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princePhillipDragonslayer)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability to banish the challenged character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princePhillipDragonslayer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(strongDefender)).toBe("discard");
    });

    it("does not banish the challenged character when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princePhillipDragonslayer],
          deck: 2,
        },
        {
          play: [{ card: strongDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(princePhillipDragonslayer, strongDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princePhillipDragonslayer)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princePhillipDragonslayer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Challenged character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(strongDefender)).toBe("play");
    });

    it("does NOT trigger when Prince Phillip challenges and survives", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princePhillipDragonslayer],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      // Prince Phillip (STR 3, WP 3) challenges weak defender (STR 1, WP 2)
      // Phillip deals 3 damage to defender (WP 2) → defender banished
      // Defender deals 1 damage to Phillip (WP 3) → Phillip survives
      expect(
        testEngine.asPlayerOne().challenge(princePhillipDragonslayer, weakDefender),
      ).toBeSuccessfulCommand();

      // Phillip should survive
      expect(testEngine.asPlayerOne().getCardZone(princePhillipDragonslayer)).toBe("play");

      // HEROISM should NOT trigger since Phillip was not banished
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
