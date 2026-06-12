import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { scarFinallyKing } from "./175-scar-finally-king";
import { scarFinallyKingEnchanted } from "./239-scar-finally-king-enchanted";

const allyCharacter = createMockCharacter({
  id: "scar-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Ally"],
});

const nonAllyCharacter = createMockCharacter({
  id: "scar-test-non-ally",
  name: "Non-Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const lowStrengthAlly = createMockCharacter({
  id: "scar-test-low-ally",
  name: "Low Strength Ally",
  cost: 1,
  strength: 1,
  willpower: 2,
  classifications: ["Storyborn", "Ally"],
});

const discardFodder1 = createMockCharacter({
  id: "scar-test-discard-1",
  name: "Discard Fodder 1",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const discardFodder2 = createMockCharacter({
  id: "scar-test-discard-2",
  name: "Discard Fodder 2",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Scar - Finally King", () => {
  describe("BE GRATEFUL - Your Ally characters get +1 {S}.", () => {
    it("gives +1 strength to Ally characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scarFinallyKing, allyCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength + 1,
      );
    });

    it("does not give +1 strength to non-Ally characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scarFinallyKing, nonAllyCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(nonAllyCharacter)).toBe(
        nonAllyCharacter.strength,
      );
    });

    it("does not give +1 strength to itself (Scar is not an Ally)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scarFinallyKing],
      });

      expect(testEngine.asPlayerOne().getCardStrength(scarFinallyKing)).toBe(
        scarFinallyKing.strength,
      );
    });
  });

  describe("STICK WITH ME - At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.", () => {
    it("triggers at end of turn when Scar is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }, allyCharacter],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("does not trigger when Scar is not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scarFinallyKing, allyCharacter],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, {
          resolveOptional: true,
          targets: [allyCharacter],
        });
      }

      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("draws cards equal to ally strength (including +1 from BE GRATEFUL), discards 2, and banishes the ally", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }, allyCharacter],
          hand: [discardFodder1, discardFodder2],
          deck: 10,
        },
        { deck: 5 },
      );

      const allyBaseStrength = allyCharacter.strength;
      const expectedDrawCount = allyBaseStrength + 1;

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10 - expectedDrawCount);

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodder1, discardFodder2] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(3);

      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("discard");
    });

    it("can be declined (optional ability)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }, allyCharacter],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("works with low strength ally (draw 2 cards from 1 strength ally + 1 bonus)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }, lowStrengthAlly],
          hand: [discardFodder1, discardFodder2],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, {
          resolveOptional: true,
          targets: [lowStrengthAlly],
        }),
      ).toBeSuccessfulCommand();

      const expectedDrawCount = lowStrengthAlly.strength + 1;
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10 - expectedDrawCount);

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodder1, discardFodder2] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(3);
    });

    it("resolves with no effect if Scar is readied before resolution", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }, allyCharacter],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const scarId = testEngine.findCardInstanceId(scarFinallyKing, "play", PLAYER_ONE);
      testEngine.asServer().manualReadyCard(scarId);

      testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, {
        resolveOptional: true,
        targets: [allyCharacter],
      });

      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("can be resolved when Scar is exerted at end of turn with no ally in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("accepting the optional with no ally in play resolves to no-op", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("regression: presents the optional trigger when Scar is exerted at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKing, exerted: true }, allyCharacter],
          deck: 10,
        },
        { deck: 5 },
      );

      // Pass turn - end of turn trigger fires; Scar is exerted, condition is met
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // The optional bag effect should be available
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("enchanted print keeps the controller discard choice instead of random discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarFinallyKingEnchanted, exerted: true }, allyCharacter],
          hand: [discardFodder1, discardFodder2],
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKingEnchanted, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodder1, discardFodder2] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(discardFodder2)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("discard");
    });
  });
});
