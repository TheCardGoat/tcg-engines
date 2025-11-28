/**
 * Spec 4: Core Moves Test Suite
 *
 * Tests for inkwell and play card moves.
 */

import { describe, expect, it } from "bun:test";
import { createTurnTrackers, setHasInked } from "../flow/turn-manager";
import type { TurnTrackers } from "../flow/turn-types";
import {
  canPutIntoInkwell,
  getInkableCardsInHand,
  validatePutIntoInkwell,
} from "../moves/inkwell";
import { type PaymentMethod, validMove } from "../moves/move-types";
import {
  calculateCost,
  canPlayCard,
  validatePlayCard,
  validateShiftPayment,
  validateSingerPayment,
  validateSingTogetherPayment,
} from "../moves/play-card";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import {
  type CardInstanceState,
  createCardInstanceState,
} from "../zones/card-state";

const player1 = "player1" as PlayerId;
const cardId = (id: string): CardId => id as CardId;

// Helper to create mock cards
function createMockCard(
  overrides: Partial<LorcanaCardDefinition> = {},
): LorcanaCardDefinition {
  return {
    id: `card-${Math.random().toString(36).slice(2)}`,
    name: "Test Card",
    version: "Test Version",
    fullName: "Test Card - Test Version",
    inkType: "amber",
    cost: 3,
    inkable: true,
    cardType: "character",
    strength: 2,
    willpower: 3,
    lore: 1,
    ...overrides,
  };
}

// Create a mock turn tracker in main phase
function createMainPhaseTurnTrackers(): TurnTrackers {
  const trackers = createTurnTrackers(player1);
  return {
    ...trackers,
    currentPhase: "main",
    currentStep: undefined,
  };
}

describe("Spec 4: Core Moves - Inkwell & Play", () => {
  describe("Put into Inkwell (Rule 4.3.3)", () => {
    it("allows putting inkable card into inkwell", () => {
      const card = createMockCard({ inkable: true });
      const trackers = createMainPhaseTurnTrackers();

      const result = validatePutIntoInkwell(
        card,
        true, // in hand
        trackers,
        true, // active player
        true, // main phase
      );

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects non-inkable cards (Rule 4.3.3.2)", () => {
      const card = createMockCard({ inkable: false });
      const trackers = createMainPhaseTurnTrackers();

      const result = validatePutIntoInkwell(card, true, trackers, true, true);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "CARD_NOT_INKABLE")).toBe(
        true,
      );
    });

    it("limits to once per turn (Rule 4.3.3)", () => {
      const card = createMockCard({ inkable: true });
      const trackers = setHasInked(createMainPhaseTurnTrackers());

      const result = validatePutIntoInkwell(card, true, trackers, true, true);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.type === "ALREADY_INKED_THIS_TURN"),
      ).toBe(true);
    });

    it("requires card to be in hand", () => {
      const card = createMockCard({ inkable: true });
      const trackers = createMainPhaseTurnTrackers();

      const result = validatePutIntoInkwell(
        card,
        false, // not in hand
        trackers,
        true,
        true,
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_IN_HAND")).toBe(true);
    });

    it("requires main phase", () => {
      const card = createMockCard({ inkable: true });
      const trackers = createTurnTrackers(player1); // beginning phase

      const result = validatePutIntoInkwell(
        card,
        true,
        trackers,
        true,
        false, // not main phase
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_MAIN_PHASE")).toBe(true);
    });

    it("requires active player's turn", () => {
      const card = createMockCard({ inkable: true });
      const trackers = createMainPhaseTurnTrackers();

      const result = validatePutIntoInkwell(
        card,
        true,
        trackers,
        false, // not active player
        true,
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_YOUR_TURN")).toBe(true);
    });

    it("getInkableCardsInHand returns correct cards", () => {
      const trackers = createMainPhaseTurnTrackers();
      const handCards = [
        {
          cardId: cardId("card-1"),
          definition: createMockCard({ inkable: true }),
        },
        {
          cardId: cardId("card-2"),
          definition: createMockCard({ inkable: false }),
        },
        {
          cardId: cardId("card-3"),
          definition: createMockCard({ inkable: true }),
        },
      ];

      const inkable = getInkableCardsInHand(handCards, trackers, true, true);

      expect(inkable).toHaveLength(2);
      expect(inkable).toContain("card-1");
      expect(inkable).toContain("card-3");
    });

    it("getInkableCardsInHand returns empty if already inked", () => {
      const trackers = setHasInked(createMainPhaseTurnTrackers());
      const handCards = [
        {
          cardId: cardId("card-1"),
          definition: createMockCard({ inkable: true }),
        },
      ];

      const inkable = getInkableCardsInHand(handCards, trackers, true, true);

      expect(inkable).toHaveLength(0);
    });
  });

  describe("Play Card - Basic (Rule 4.3.4)", () => {
    it("requires card to be in hand (Rule 4.3.4.1)", () => {
      const card = createMockCard({ cost: 3 });
      const trackers = createMainPhaseTurnTrackers();
      const payment: PaymentMethod = { type: "ink" };

      const result = validatePlayCard(
        card,
        false, // not in hand
        payment,
        5,
        trackers,
        true,
        true,
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_IN_HAND")).toBe(true);
    });

    it("calculates correct total cost (Rule 4.3.4.4)", () => {
      const card = createMockCard({ cost: 5 });
      const payment: PaymentMethod = { type: "ink" };

      const cost = calculateCost(card, payment);

      expect(cost.baseCost).toBe(5);
      expect(cost.totalCost).toBe(5);
    });

    it("applies cost increases then reductions (Rule 4.3.4.4)", () => {
      const card = createMockCard({ cost: 5 });
      const payment: PaymentMethod = { type: "ink" };
      const modifiers = [
        { source: "effect" as const, amount: 2, reason: "increase" },
        { source: "effect" as const, amount: -3, reason: "reduction" },
      ];

      const cost = calculateCost(card, payment, modifiers);

      expect(cost.baseCost).toBe(5);
      expect(cost.increases).toHaveLength(1);
      expect(cost.reductions).toHaveLength(1);
      expect(cost.totalCost).toBe(4); // 5 + 2 - 3
    });

    it("cost cannot go below 0", () => {
      const card = createMockCard({ cost: 2 });
      const payment: PaymentMethod = { type: "ink" };
      const modifiers = [
        { source: "effect" as const, amount: -10, reason: "big reduction" },
      ];

      const cost = calculateCost(card, payment, modifiers);

      expect(cost.totalCost).toBe(0);
    });

    it("rejects play with insufficient ink", () => {
      const card = createMockCard({ cost: 5 });
      const trackers = createMainPhaseTurnTrackers();
      const payment: PaymentMethod = { type: "ink" };

      const result = validatePlayCard(
        card,
        true,
        payment,
        3, // only 3 ink, need 5
        trackers,
        true,
        true,
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "INSUFFICIENT_INK")).toBe(
        true,
      );
    });

    it("allows play with sufficient ink", () => {
      const card = createMockCard({ cost: 3 });
      const trackers = createMainPhaseTurnTrackers();
      const payment: PaymentMethod = { type: "ink" };

      const result = validatePlayCard(
        card,
        true,
        payment,
        5, // 5 ink, need 3
        trackers,
        true,
        true,
      );

      expect(result.valid).toBe(true);
    });
  });

  describe("Shift (Rule 10.8)", () => {
    it("allows playing on character with matching name", () => {
      const shiftCard = createMockCard({
        name: "Elsa",
        keywords: [{ type: "Shift", cost: 4, targetName: "Elsa" }],
      });
      const targetCard = createMockCard({
        name: "Elsa",
        version: "Snow Queen",
      });
      const targetState = createCardInstanceState(cardId("target"), {
        isDrying: false,
      });

      const result = validateShiftPayment(shiftCard, targetCard, targetState);

      expect(result.valid).toBe(true);
    });

    it("rejects shift on non-matching name", () => {
      const shiftCard = createMockCard({
        name: "Elsa",
        keywords: [{ type: "Shift", cost: 4, targetName: "Elsa" }],
      });
      const targetCard = createMockCard({
        name: "Anna",
      });
      const targetState = createCardInstanceState(cardId("target"));

      const result = validateShiftPayment(shiftCard, targetCard, targetState);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "INVALID_SHIFT_TARGET")).toBe(
        true,
      );
    });

    it("pays shift cost instead of ink cost", () => {
      const shiftCard = createMockCard({
        cost: 7,
        keywords: [{ type: "Shift", cost: 4, targetName: "Elsa" }],
      });
      const payment: PaymentMethod = {
        type: "shift",
        targetCardId: cardId("target"),
      };

      const cost = calculateCost(shiftCard, payment);

      expect(cost.baseCost).toBe(4); // Shift cost, not card cost
      expect(cost.totalCost).toBe(4);
    });

    it("rejects shift if card doesn't have Shift keyword", () => {
      const card = createMockCard({ name: "Elsa" });
      const targetCard = createMockCard({ name: "Elsa" });
      const targetState = createCardInstanceState(cardId("target"));

      const result = validateShiftPayment(card, targetCard, targetState);

      expect(result.valid).toBe(false);
    });
  });

  describe("Singer (Rule 10.9)", () => {
    it("allows singing songs by exerting singer", () => {
      const song = createMockCard({
        cardType: "action",
        actionSubtype: "song",
        cost: 4,
      });
      const singerCard = createMockCard({
        keywords: [{ type: "Singer", value: 5 }],
      });
      const singerState = createCardInstanceState(cardId("singer"), {
        isDrying: false,
      });

      const result = validateSingerPayment(song, singerCard, singerState);

      expect(result.valid).toBe(true);
    });

    it("singer must have Singer value >= song cost", () => {
      const song = createMockCard({
        cardType: "action",
        actionSubtype: "song",
        cost: 6,
      });
      const singerCard = createMockCard({
        keywords: [{ type: "Singer", value: 4 }],
      });
      const singerState = createCardInstanceState(cardId("singer"), {
        isDrying: false,
      });

      const result = validateSingerPayment(song, singerCard, singerState);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "SINGER_VALUE_TOO_LOW")).toBe(
        true,
      );
    });

    it("singer must be dry to sing", () => {
      const song = createMockCard({
        cardType: "action",
        actionSubtype: "song",
        cost: 3,
      });
      const singerCard = createMockCard({
        keywords: [{ type: "Singer", value: 5 }],
      });
      const singerState = createCardInstanceState(cardId("singer"), {
        isDrying: true,
      });

      const result = validateSingerPayment(song, singerCard, singerState);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "SINGER_NOT_DRY")).toBe(true);
    });

    it("rejects singing non-song cards", () => {
      const card = createMockCard({
        cardType: "action",
        actionSubtype: null, // Not a song
        cost: 3,
      });
      const singerCard = createMockCard({
        keywords: [{ type: "Singer", value: 5 }],
      });
      const singerState = createCardInstanceState(cardId("singer"), {
        isDrying: false,
      });

      const result = validateSingerPayment(card, singerCard, singerState);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_A_SONG")).toBe(true);
    });
  });

  describe("Sing Together (Rule 10.10)", () => {
    it("allows multiple characters to sing together", () => {
      const song = createMockCard({
        cardType: "action",
        actionSubtype: "song",
        cost: 6,
      });
      const singers = [
        {
          card: createMockCard({
            keywords: [{ type: "SingTogether", value: 3 }],
          }),
          state: createCardInstanceState(cardId("singer1"), {
            isDrying: false,
          }),
        },
        {
          card: createMockCard({
            keywords: [{ type: "SingTogether", value: 4 }],
          }),
          state: createCardInstanceState(cardId("singer2"), {
            isDrying: false,
          }),
        },
      ];

      const result = validateSingTogetherPayment(song, singers);

      expect(result.valid).toBe(true);
    });

    it("combined Sing Together values must >= song cost", () => {
      const song = createMockCard({
        cardType: "action",
        actionSubtype: "song",
        cost: 8,
      });
      const singers = [
        {
          card: createMockCard({
            keywords: [{ type: "SingTogether", value: 2 }],
          }),
          state: createCardInstanceState(cardId("singer1"), {
            isDrying: false,
          }),
        },
        {
          card: createMockCard({
            keywords: [{ type: "SingTogether", value: 3 }],
          }),
          state: createCardInstanceState(cardId("singer2"), {
            isDrying: false,
          }),
        },
      ];

      const result = validateSingTogetherPayment(song, singers);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "SINGER_VALUE_TOO_LOW")).toBe(
        true,
      );
    });

    it("all singers must be dry", () => {
      const song = createMockCard({
        cardType: "action",
        actionSubtype: "song",
        cost: 4,
      });
      const singers = [
        {
          card: createMockCard({
            keywords: [{ type: "SingTogether", value: 3 }],
          }),
          state: createCardInstanceState(cardId("singer1"), {
            isDrying: false,
          }),
        },
        {
          card: createMockCard({
            keywords: [{ type: "SingTogether", value: 3 }],
          }),
          state: createCardInstanceState(cardId("singer2"), { isDrying: true }), // not dry
        },
      ];

      const result = validateSingTogetherPayment(song, singers);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "SINGER_NOT_DRY")).toBe(true);
    });
  });
});
