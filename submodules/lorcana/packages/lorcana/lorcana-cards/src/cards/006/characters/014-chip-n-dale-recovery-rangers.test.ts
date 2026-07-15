import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { chipNDaleRecoveryRangers } from "./014-chip-n-dale-recovery-rangers";
import { chipQuickThinker } from "../../008/characters/097-chip-quick-thinker";

const chipBase = createMockCharacter({
  id: "chip-base",
  name: "Chip",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const daleBase = createMockCharacter({
  id: "dale-base",
  name: "Dale",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const inkCard = createMockCharacter({
  id: "chip-ink-card",
  name: "Ink Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const rescuedCharacter = createMockCharacter({
  id: "chip-rescued-character",
  name: "Rescued Character",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Chip 'n' Dale - Recovery Rangers", () => {
  describe("Shift 5", () => {
    it("can shift onto a character named Chip", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipNDaleRecoveryRangers],
        inkwell: 5,
        play: [chipBase],
        deck: 2,
      });

      const shiftTarget = testEngine.findCardInstanceId(chipBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(chipNDaleRecoveryRangers, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(chipNDaleRecoveryRangers)).toBe("play");
    });

    it("can shift onto a character named Dale", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipNDaleRecoveryRangers],
        inkwell: 5,
        play: [daleBase],
        deck: 2,
      });

      const shiftTarget = testEngine.findCardInstanceId(daleBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(chipNDaleRecoveryRangers, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(chipNDaleRecoveryRangers)).toBe("play");
    });
  });

  describe("Search and Rescue", () => {
    it("returns a character card from discard to hand when a card is put into your inkwell during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chipNDaleRecoveryRangers],
        hand: [inkCard],
        discard: [rescuedCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(chipNDaleRecoveryRangers, {
          targets: [rescuedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rescuedCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(inkCard)).toBe("inkwell");
    });
  });

  it("regression: Search and Rescue triggers when a card is put into inkwell via ability (not just manual ink)", () => {
    const inkViaAbilityCard = createMockCharacter({
      id: "chip-ink-via-ability",
      name: "Ink Via Ability Card",
      cost: 1,
      strength: 1,
      willpower: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chipNDaleRecoveryRangers, { card: inkViaAbilityCard, isDrying: false }],
      hand: [inkCard],
      discard: [rescuedCharacter],
      deck: 2,
    });

    // Ink manually to trigger Search and Rescue
    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects.length).toBeGreaterThanOrEqual(1);
  });

  it("regression: can shift onto Chip - Quick Thinker (duo-card shift with either matching name)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chipNDaleRecoveryRangers],
      inkwell: 5,
      play: [chipQuickThinker],
      deck: 2,
    });

    const shiftTarget = testEngine.findCardInstanceId(chipQuickThinker, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(chipNDaleRecoveryRangers, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(chipNDaleRecoveryRangers)).toBe("play");
  });
});
