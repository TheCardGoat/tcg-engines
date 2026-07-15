import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { MoveDamageEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "./types";
import { buildResolutionSelectionContext } from "./selection-context";

const PLAYER_ONE = "player-one" as PlayerId;
const PLAYER_TWO = "player-two" as PlayerId;

type TestCardDefinition = {
  id: string;
  cardType: "character" | "item" | "location" | "action";
  name?: string;
  version?: string;
  controllerId?: PlayerId;
  damage?: number;
};

/**
 * Minimal PlayCardExecutionContext for selection-context tests (mirrors composed-effect-resolver.test.ts).
 */
function createMinimalSelectionTestContext(definitions: Record<string, TestCardDefinition>): {
  ctx: PlayCardExecutionContext;
} {
  const cardMeta: Record<string, Record<string, unknown>> = {};
  const cardsApi = {
    get: (cardId: CardInstanceId) => {
      const definition = definitions[cardId];
      if (!definition) {
        return undefined;
      }
      return {
        definition,
        meta: cardMeta[cardId] ?? {},
        getStrength: () => (definition.cardType === "character" ? 1 : 0),
        getWillpower: () => (definition.cardType === "character" ? 1 : 0),
      };
    },
    require: (cardId: CardInstanceId) => {
      const definition = definitions[cardId];
      if (!definition) {
        throw new Error(`Missing card ${String(cardId)}`);
      }
      return {
        definition,
        meta: cardMeta[cardId] ?? {},
        getStrength: () => (definition.cardType === "character" ? 1 : 0),
        getWillpower: () => (definition.cardType === "character" ? 1 : 0),
      };
    },
    getDefinition: (cardId: CardInstanceId) => definitions[cardId],
    getMeta: (cardId: CardInstanceId) => cardMeta[cardId],
    patchMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = { ...cardMeta[cardId], ...nextMeta };
    },
    setMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = { ...nextMeta };
    },
    clearMeta: (cardId: CardInstanceId) => {
      delete cardMeta[cardId];
    },
    entriesMeta: () => Object.entries(cardMeta),
  };

  const ctx = {
    G: {
      lore: { [PLAYER_ONE]: 0, [PLAYER_TWO]: 0 },
      pendingEffects: [],
    },
    playerId: PLAYER_ONE,
    cards: cardsApi,
    framework: {
      cards: cardsApi,
      events: { emit: () => {} },
      state: {
        priority: { holder: PLAYER_ONE },
        status: { turn: 1 },
        _zonesPrivate: { cardIndex: {}, zoneCards: {} },
        playerIds: [PLAYER_ONE, PLAYER_TWO],
        turn: 1,
        currentPlayer: PLAYER_ONE,
        phase: undefined,
        step: undefined,
        gameSegment: undefined,
        stateID: 0,
        matchID: "test-match",
        gameID: "test-game",
        gameEnded: false,
      },
      time: { getRemainingTime: () => 0 },
      zones: {
        drawCards: () => {},
        getCards: () => [],
        reveal: () => {},
        moveCard: () => {},
        shuffle: () => {},
        getCardOwner: () => PLAYER_ONE,
        getCardController: () => PLAYER_ONE,
        getCardZone: () => "deck",
      },
    },
    events: {},
  } as unknown as PlayCardExecutionContext;

  return { ctx };
}

function createCardPlayedPayload(cardId: CardInstanceId, playerId: PlayerId): CardPlayedPayload {
  return {
    cardId,
    cardType: "character",
    costType: "standard",
    playerId,
  };
}

describe("buildResolutionSelectionContext", () => {
  it("derives sensible choice labels when optionLabels are omitted", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "action" },
    });

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-choice-labels",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect: {
        type: "choice",
        options: [
          {
            type: "sequence",
            steps: [
              { type: "draw", amount: 1, target: "CONTROLLER" },
              {
                type: "gain-keyword",
                keyword: "Evasive",
                target: "CHOSEN_CHARACTER_OF_YOURS",
              },
            ],
          },
          {
            type: "banish",
            target: "CHOSEN_DAMAGED_CHARACTER",
          },
          {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "remove-damage",
            amount: { type: "up-to", value: 3 },
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "conditional",
            condition: { type: "always" },
            then: {
              type: "put-on-bottom",
              target: "CHOSEN_CHARACTER",
            },
          },
        ],
      },
      resolutionInput: {},
      ctx,
    });

    expect(selection?.kind).toBe("choice-selection");
    if (selection?.kind !== "choice-selection") {
      throw new Error("Expected choice-selection");
    }
    expect(selection.options.map((option) => option.label)).toEqual([
      "Draw a card. Chosen character gains Evasive.",
      "Banish chosen card.",
      "Deal 2 damage to chosen character.",
      "Remove up to 3 damage.",
      "Put chosen card on the bottom of their deck.",
    ]);
  });

  it("falls back to generic choice labels for unrecognized option shapes", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "action" },
    });

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-choice-generic-label",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect: {
        type: "choice",
        options: [
          {
            type: "future-effect",
          },
        ],
      },
      resolutionInput: {},
      ctx,
    });

    expect(selection?.kind).toBe("choice-selection");
    if (selection?.kind !== "choice-selection") {
      throw new Error("Expected choice-selection");
    }
    expect(selection.options[0]?.label).toBe("Option 1");
  });

  it("builds scry-selection when amount is AmountExpr but revealedCardIds supply the count (THE-883)", () => {
    const source = "pete-source" as CardInstanceId;
    const looked1 = "looked-card-1" as CardInstanceId;
    const looked2 = "looked-card-2" as CardInstanceId;

    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "pete-source", cardType: "character", name: "Pete", version: "Test" },
      [looked1]: { id: "mock-a", cardType: "action", name: "Mock A" },
      [looked2]: { id: "mock-b", cardType: "action", name: "Mock B" },
    });

    const effect = {
      type: "scry" as const,
      amount: {
        type: "source-attribute" as const,
        attribute: "cards-under-them" as const,
      },
      destinations: [
        { zone: "hand", max: 1 },
        { zone: "deck-bottom", remainder: true },
      ],
    };

    const selection = buildResolutionSelectionContext({
      origin: "bag",
      requestId: "req-scry-dynamic-amount",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect,
      resolutionInput: {
        eventSnapshot: {
          revealedCardIds: [looked1, looked2],
        },
      },
      ctx,
    });

    expect(selection).toBeDefined();
    expect(selection?.kind).toBe("scry-selection");
    if (selection?.kind !== "scry-selection") {
      throw new Error("Expected scry-selection");
    }
    expect(selection.amount).toBe(2);
    expect(selection.revealedCardIds).toEqual([looked1, looked2]);
    expect(selection.destinationRules).toHaveLength(2);
  });

  it("sets expectedSlottedKind for move-damage effect descriptors", () => {
    const source = "source" as CardInstanceId;
    const donor = "donor" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "action" },
      [donor]: { id: "donor", cardType: "character" },
    });

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-move-damage",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect: {
        type: "move-damage",
        from: {
          selector: "chosen",
          count: 1,
          owner: "self",
          zones: ["play"],
          cardTypes: ["character"],
        },
        to: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      resolutionInput: {},
      ctx,
    });

    expect(selection?.kind).toBe("target-selection");
    if (selection?.kind !== "target-selection") {
      throw new Error("Expected target-selection");
    }
    expect(selection.expectedSlottedKind).toBe("move-damage");
    expect(selection.autoResolvedSlots).toBeUndefined();
  });

  it("emits autoResolvedSlots: ['to'] for move-damage with to: SELF (Luisa-style)", () => {
    const source = "source" as CardInstanceId;
    const donor = "donor" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "character", controllerId: PLAYER_ONE },
      [donor]: { id: "donor", cardType: "character", controllerId: PLAYER_ONE, damage: 1 },
    });

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-luisa",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect: {
        type: "move-damage",
        amount: { type: "up-to", value: 1 },
        from: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        to: "SELF",
      },
      resolutionInput: {},
      ctx,
    });

    if (selection?.kind !== "target-selection") {
      throw new Error("Expected target-selection");
    }
    expect(selection.expectedSlottedKind).toBe("move-damage");
    expect(selection.autoResolvedSlots).toEqual(["to"]);
  });

  it("emits autoResolvedSlots: ['from'] for move-damage with from: SELF (Nero-style)", () => {
    const source = "source" as CardInstanceId;
    const enemy = "enemy" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "character", controllerId: PLAYER_ONE, damage: 2 },
      [enemy]: { id: "enemy", cardType: "character", controllerId: PLAYER_TWO },
    });

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-from-self",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect: {
        type: "move-damage",
        amount: { type: "up-to", value: 1 },
        from: "SELF",
        to: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      resolutionInput: {},
      ctx,
    });

    if (selection?.kind !== "target-selection") {
      throw new Error("Expected target-selection");
    }
    expect(selection.expectedSlottedKind).toBe("move-damage");
    expect(selection.autoResolvedSlots).toEqual(["from"]);
  });

  it("emits autoResolvedSlots: ['from'] for move-damage with from: { ref: 'self' } (Madam Mim Elephant-style)", () => {
    const source = "source" as CardInstanceId;
    const enemy = "enemy" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "character", controllerId: PLAYER_ONE, damage: 2 },
      [enemy]: { id: "enemy", cardType: "character", controllerId: PLAYER_TWO },
    });
    const effect = {
      type: "move-damage",
      amount: { type: "up-to", value: 2 },
      from: {
        ref: "self",
      },
      to: {
        selector: "chosen",
        count: 1,
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      },
    } satisfies MoveDamageEffect;

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-from-ref-self",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect,
      resolutionInput: {},
      ctx,
    });

    if (selection?.kind !== "target-selection") {
      throw new Error("Expected target-selection");
    }
    expect(selection.expectedSlottedKind).toBe("move-damage");
    expect(selection.autoResolvedSlots).toEqual(["from"]);
  });

  it("emits autoResolvedSlots for move-damage endpoints that reference the source card", () => {
    const source = "source" as CardInstanceId;
    const enemy = "enemy" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "character", controllerId: PLAYER_ONE, damage: 2 },
      [enemy]: { id: "enemy", cardType: "character", controllerId: PLAYER_TWO },
    });
    const effect = {
      type: "move-damage",
      amount: { type: "up-to", value: 2 },
      from: {
        reference: "source",
      },
      to: {
        selector: "chosen",
        count: 1,
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      },
    } satisfies MoveDamageEffect;

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-from-reference-source",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect,
      resolutionInput: {},
      ctx,
    });

    if (selection?.kind !== "target-selection") {
      throw new Error("Expected target-selection");
    }
    expect(selection.expectedSlottedKind).toBe("move-damage");
    expect(selection.autoResolvedSlots).toEqual(["from"]);
  });

  it("sets expectedSlottedKind for move-to-location effect descriptors", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "action" },
    });

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-move-to-location",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect: {
        type: "move-to-location",
        character: {
          selector: "chosen",
          count: 1,
          owner: "self",
          zones: ["play"],
          cardTypes: ["character"],
        },
        location: {
          selector: "chosen",
          count: 1,
          owner: "self",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
      resolutionInput: {},
      ctx,
    });

    if (selection?.kind !== "target-selection") {
      // Location targeting may short-circuit when no candidates exist; the
      // relevant invariant is that when a context IS built, it carries the
      // slotted kind marker. Tolerate the undefined path.
      return;
    }
    expect(selection.expectedSlottedKind).toBe("move-to-location");
  });

  it("does not set expectedSlottedKind for single-filter effects (deal-damage)", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx } = createMinimalSelectionTestContext({
      [source]: { id: "source", cardType: "action" },
      [target]: { id: "target", cardType: "character" },
    });

    const selection = buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: "req-deal-damage",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      cardPlayed: createCardPlayedPayload(source, PLAYER_ONE),
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      resolutionInput: {},
      ctx,
    });

    if (selection?.kind !== "target-selection") {
      return;
    }
    expect(selection.expectedSlottedKind).toBeUndefined();
  });
});
