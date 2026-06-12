import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { candleheadDedicatedRacer } from "./017-candlehead-dedicated-racer";

const damagedAlly = createMockCharacter({
  id: "candlehead-test-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const strongOpponent = createMockCharacter({
  id: "candlehead-test-strong-opponent",
  name: "Strong Opponent",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Candlehead - Dedicated Racer", () => {
  describe("WINNING ISN'T EVERYTHING - When this character is banished, you may remove up to 2 damage from chosen character.", () => {
    it("removes up to 2 damage from chosen character when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [candleheadDedicatedRacer, { card: damagedAlly, damage: 3 }],
        deck: 2,
      });

      // Banish Candlehead by setting damage equal to willpower
      expect(
        testEngine
          .asServer()
          .manualSetDamage(candleheadDedicatedRacer, candleheadDedicatedRacer.willpower),
      ).toBeSuccessfulCommand();

      // Candlehead should be banished
      expect(testEngine.asPlayerOne().getCardZone(candleheadDedicatedRacer)).toBe("discard");

      // WINNING ISN'T EVERYTHING triggers as optional
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(candleheadDedicatedRacer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // Damaged ally had 3 damage, remove up to 2 -> should have 1 damage remaining
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedAlly,
        value: 1,
      });
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [candleheadDedicatedRacer, { card: damagedAlly, damage: 3 }],
        deck: 2,
      });

      expect(
        testEngine
          .asServer()
          .manualSetDamage(candleheadDedicatedRacer, candleheadDedicatedRacer.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(candleheadDedicatedRacer)).toBe("discard");

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(candleheadDedicatedRacer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedAlly,
        value: 3,
      });
    });

    it("triggers when banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: candleheadDedicatedRacer, exerted: true },
            { card: damagedAlly, damage: 4 },
          ],
          deck: 2,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent challenges exerted Candlehead (5 str vs 2 willpower = banished)
      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, candleheadDedicatedRacer),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(candleheadDedicatedRacer)).toBe("discard");

      // WINNING ISN'T EVERYTHING triggers
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(candleheadDedicatedRacer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // Damaged ally had 4 damage, remove up to 2 -> should have 2 damage remaining
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedAlly,
        value: 2,
      });
    });

    it("still queues the trigger if no legal choices remain", () => {
      const healthyAlly = createMockCharacter({
        id: "candlehead-test-healthy-ally",
        name: "Healthy Ally",
        cost: 2,
        strength: 1,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [candleheadDedicatedRacer, healthyAlly],
        deck: 2,
      });

      expect(
        testEngine
          .asServer()
          .manualSetDamage(candleheadDedicatedRacer, candleheadDedicatedRacer.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(candleheadDedicatedRacer)).toBe("discard");

      // The trigger still goes to the bag. There are no legal choices once it resolves,
      // so declining it is the clean no-op path.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(candleheadDedicatedRacer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();
    });
  });
});
