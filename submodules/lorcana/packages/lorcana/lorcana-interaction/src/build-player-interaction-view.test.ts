import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";
import type {
  LorcanaProjectedBagEffect,
  LorcanaProjectedBoardView,
  LorcanaProjectedPendingChoice,
  LorcanaProjectedPendingEffect,
  ResolutionSelectionContext,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";

import { buildPlayerInteractionView } from "./build-player-interaction-view";

const PLAYER_ONE = "p1" as PlayerId;
const PLAYER_TWO = "p2" as PlayerId;
const SOURCE_CARD = "card_source_1" as CardInstanceId;
const TARGET_A = "card_target_a" as CardInstanceId;
const TARGET_B = "card_target_b" as CardInstanceId;
const LOCATION_A = "card_location_a" as CardInstanceId;
const HAND_A = "card_hand_a" as CardInstanceId;
const HAND_B = "card_hand_b" as CardInstanceId;

function emptyBoard(): LorcanaProjectedBoardView {
  return {
    gameID: "g",
    matchID: "m",
    stateID: 1,
    playerOrder: [PLAYER_ONE, PLAYER_TWO],
    turnPlayer: PLAYER_ONE,
    priorityPlayer: PLAYER_ONE,
    turnNumber: 1,
    pendingMulligan: [],
    status: "playing",
    winner: null,
    reason: null,
    timerView: { serverTimestamp: 0 },
    players: {
      [PLAYER_ONE]: {
        lore: 0,
        canAddCardToInkwell: true,
        handCount: 0,
        deckCount: 0,
        hand: [],
        play: [],
        inkwell: [],
        discard: [],
      },
      [PLAYER_TWO]: {
        lore: 0,
        canAddCardToInkwell: true,
        handCount: 0,
        deckCount: 0,
        hand: [],
        play: [],
        inkwell: [],
        discard: [],
      },
    },
    cards: {
      [SOURCE_CARD]: {
        id: SOURCE_CARD,
        ownerId: PLAYER_ONE,
        controllerId: PLAYER_ONE,
        zone: "play",
        cardType: "character",
      },
      [TARGET_A]: {
        id: TARGET_A,
        ownerId: PLAYER_ONE,
        controllerId: PLAYER_ONE,
        zone: "play",
        cardType: "character",
      },
      [TARGET_B]: {
        id: TARGET_B,
        ownerId: PLAYER_TWO,
        controllerId: PLAYER_TWO,
        zone: "play",
        cardType: "character",
      },
      [LOCATION_A]: {
        id: LOCATION_A,
        ownerId: PLAYER_ONE,
        controllerId: PLAYER_ONE,
        zone: "play",
        cardType: "location",
      },
      [HAND_A]: {
        id: HAND_A,
        ownerId: PLAYER_ONE,
        controllerId: PLAYER_ONE,
        zone: "hand",
        cardType: "character",
      },
      [HAND_B]: {
        id: HAND_B,
        ownerId: PLAYER_ONE,
        controllerId: PLAYER_ONE,
        zone: "hand",
        cardType: "character",
      },
    },
    activeEffects: [],
    pendingEffects: [],
    bagEffects: [],
  };
}

function withPendingPrompt(
  context: ResolutionSelectionContext,
  origin: "pending-effect" | "bag" = "pending-effect",
): LorcanaProjectedBoardView {
  const board = emptyBoard();
  const pendingChoice: LorcanaProjectedPendingChoice = {
    type: "action-effect",
    playerID: context.chooserId,
    requestID: context.requestId,
  };
  if (origin === "pending-effect") {
    const effect: LorcanaProjectedPendingEffect = {
      id: context.requestId,
      type: "action-effect",
      sourceId: SOURCE_CARD,
      payload: {},
      selectionContext: context,
    };
    return { ...board, pendingChoice, pendingEffects: [effect] };
  }
  const effect: LorcanaProjectedBagEffect = {
    id: context.requestId,
    type: "trigger",
    controllerId: PLAYER_ONE,
    chooserId: context.chooserId,
    sourceId: SOURCE_CARD,
    payload: {},
    selectionContext: context,
  };
  return { ...board, pendingChoice, bagEffects: [effect] };
}

function targetContext(
  overrides: Partial<TargetResolutionSelectionContext> = {},
): TargetResolutionSelectionContext {
  return {
    origin: "pending-effect",
    requestId: "req-1",
    kind: "target-selection",
    sourceCardId: SOURCE_CARD,
    chooserId: PLAYER_ONE,
    currentSelection: {},
    submitField: "targets",
    targetDsl: [],
    cardCandidateIds: [TARGET_A, TARGET_B],
    playerCandidateIds: [],
    allowedZones: ["play"],
    minSelections: 1,
    maxSelections: 1,
    ordered: false,
    autoRejected: false,
    ...overrides,
  };
}

describe("buildPlayerInteractionView", () => {
  it("returns an empty view when no prompt is active", () => {
    const view = buildPlayerInteractionView(emptyBoard(), PLAYER_ONE);
    expect(view.activePrompt).toBeNull();
    expect(view.surface).toBe("none");
    expect(view.interactions).toEqual([]);
    expect(view.submission.canSubmit).toBe(false);
    expect(view.viewerRole).toBe("spectator");
  });

  describe("target-selection", () => {
    it("emits one select-card interaction per engine candidate, no extras", () => {
      const board = withPendingPrompt(targetContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE);

      expect(view.viewerRole).toBe("chooser");
      expect(view.surface).toBe("inline-board");
      expect(view.activePrompt?.kind).toBe("target-selection");
      expect(view.activePrompt?.requestId).toBe("req-1");

      const cardInteractions = view.interactions.filter((i) => i.kind === "select-card");
      expect(cardInteractions.map((i) => (i.kind === "select-card" ? i.cardId : null))).toEqual([
        TARGET_A,
        TARGET_B,
      ]);
    });

    it("uses modal-card-picker surface when targets are in deck/discard/inkwell/limbo", () => {
      const board = withPendingPrompt(targetContext({ allowedZones: ["discard"] }));
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.surface).toBe("modal-card-picker");
    });

    it("exposes autoRejected in submission and emits no interactions when engine fizzled", () => {
      const board = withPendingPrompt(targetContext({ autoRejected: true, cardCandidateIds: [] }));
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.submission.autoRejected).toBe(true);
      expect(view.interactions).toEqual([]);
    });

    it("emits a decline-target-prompt interaction when prompt originates from a declined optional", () => {
      const board = withPendingPrompt(targetContext({ originatesFromOptional: true }));
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      const decline = view.interactions.find((i) => i.kind === "decline-target-prompt");
      expect(decline).toBeDefined();
      expect(view.submission.canCancel).toBe(true);
      expect(view.submission.cancelPayload).toEqual({ resolveOptional: false });
    });

    it("identifies the viewer as a non-chooser-controller when the opponent is choosing your card", () => {
      const board = withPendingPrompt(targetContext({ chooserId: PLAYER_TWO }));
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.viewerRole).toBe("non-chooser-controller");
      expect(view.interactions).toEqual([]);
      expect(view.activePrompt).not.toBeNull();
    });

    it("identifies a third-party viewer as a spectator", () => {
      const board = withPendingPrompt(targetContext());
      const view = buildPlayerInteractionView(board, "p3" as PlayerId);
      expect(view.viewerRole).toBe("spectator");
      expect(view.interactions).toEqual([]);
    });

    it("can submit when pendingSelectedCardIds count meets minSelections", () => {
      const board = withPendingPrompt(targetContext({ minSelections: 1, maxSelections: 1 }));
      const view = buildPlayerInteractionView(board, PLAYER_ONE, {
        pendingSelectedCardIds: [TARGET_A],
      });
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({ targets: [TARGET_A] });
    });

    it("advances modal candidates through generic multi-step target DSL buckets", () => {
      const context = targetContext({
        cardCandidateIds: [HAND_A, HAND_B, TARGET_A],
        allowedZones: ["hand", "play"],
        minSelections: 1,
        maxSelections: 2,
        targetDsl: [
          {
            selector: "chosen",
            zones: ["hand"],
            count: 1,
          },
          {
            selector: "chosen",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            count: { upTo: 1 },
          },
        ],
      });

      const initialView = buildPlayerInteractionView(withPendingPrompt(context), PLAYER_ONE);
      expect(
        initialView.interactions
          .filter((interaction) => interaction.kind === "select-card")
          .map((interaction) => interaction.cardId),
      ).toEqual([HAND_A, HAND_B]);

      const afterHandSelectionView = buildPlayerInteractionView(
        withPendingPrompt(context),
        PLAYER_ONE,
        {
          pendingSelectedCardIds: [HAND_A],
        },
      );
      expect(
        afterHandSelectionView.interactions
          .filter((interaction) => interaction.kind === "select-card")
          .map((interaction) => interaction.cardId),
      ).toEqual([TARGET_A]);
    });

    it("locked-state invariant: chooser with active prompt and no autoRejected always has interactions", () => {
      const board = withPendingPrompt(targetContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      const stuck =
        view.activePrompt !== null &&
        !view.submission.autoRejected &&
        view.interactions.length === 0 &&
        view.viewerRole === "chooser";
      expect(stuck).toBe(false);
    });
  });

  describe("choice-selection", () => {
    it("emits one select-choice per engine option with legality flags preserved", () => {
      const board = withPendingPrompt({
        origin: "pending-effect",
        requestId: "req-2",
        kind: "choice-selection",
        sourceCardId: SOURCE_CARD,
        chooserId: PLAYER_ONE,
        currentSelection: {},
        submitField: "choiceIndex",
        options: [
          { index: 0, label: "Draw 2 cards", legal: true },
          { index: 1, label: "Banish chosen character", legal: false },
        ],
      });
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.surface).toBe("choice-modal");
      expect(view.interactions).toHaveLength(2);
      const first = view.interactions[0];
      if (first.kind !== "select-choice") throw new Error("expected select-choice");
      expect(first.label).toBe("Draw 2 cards");
      expect(first.payload).toEqual({ choiceIndex: 0 });
      const second = view.interactions[1];
      if (second.kind !== "select-choice") throw new Error("expected select-choice");
      expect(second.legal).toBe(false);
    });

    it("exposes prior selected targets so choice prompts can identify the affected card", () => {
      const board = withPendingPrompt({
        origin: "pending-effect",
        requestId: "req-2",
        kind: "choice-selection",
        sourceCardId: SOURCE_CARD,
        chooserId: PLAYER_TWO,
        currentSelection: { targets: [TARGET_B] },
        submitField: "choiceIndex",
        options: [
          { index: 0, label: "Put that character on the bottom of their deck", legal: true },
          { index: 1, label: "Opponent draws 2 cards", legal: true },
        ],
      });

      const view = buildPlayerInteractionView(board, PLAYER_TWO);

      expect(view.surface).toBe("choice-modal");
      expect(view.activePrompt?.sourceCardId).toBe(SOURCE_CARD);
      expect(view.activePrompt?.selectedCardIds).toEqual([TARGET_B]);
    });
  });

  describe("optional-selection", () => {
    it("emits accept and decline interactions with engine-supplied labels", () => {
      const board = withPendingPrompt({
        origin: "pending-effect",
        requestId: "req-3",
        kind: "optional-selection",
        sourceCardId: SOURCE_CARD,
        chooserId: PLAYER_ONE,
        currentSelection: {},
        submitField: "resolveOptional",
        acceptLabel: "Yes, draw a card",
        rejectLabel: "No",
      });
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.surface).toBe("optional-banner");
      expect(view.interactions).toHaveLength(2);
      const accept = view.interactions[0];
      const decline = view.interactions[1];
      if (accept.kind !== "accept-optional") throw new Error("expected accept-optional");
      if (decline.kind !== "decline-optional") throw new Error("expected decline-optional");
      expect(accept.acceptLabel).toBe("Yes, draw a card");
      expect(accept.payload).toEqual({ resolveOptional: true });
      expect(decline.payload).toEqual({ resolveOptional: false });
    });
  });

  describe("prompt queue", () => {
    it("exposes a single queue entry when only one prompt is pending", () => {
      const board = withPendingPrompt(targetContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.promptQueue).toHaveLength(1);
      expect(view.activeQueueIndex).toBe(0);
      expect(view.promptQueue[0].requestId).toBe("req-1");
    });

    it("exposes every prompt-bearing effect, not just the active one", () => {
      const base = emptyBoard();
      const ctxA = targetContext({ requestId: "req-a" });
      const ctxB = targetContext({ requestId: "req-b" });
      const board: typeof base = {
        ...base,
        bagEffects: [
          {
            id: "req-a",
            type: "trigger",
            controllerId: PLAYER_ONE,
            chooserId: PLAYER_ONE,
            sourceId: SOURCE_CARD,
            payload: {},
            selectionContext: ctxA,
          },
          {
            id: "req-b",
            type: "trigger",
            controllerId: PLAYER_ONE,
            chooserId: PLAYER_ONE,
            sourceId: SOURCE_CARD,
            payload: {},
            selectionContext: ctxB,
          },
        ],
      };
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.promptQueue.map((e) => e.requestId)).toEqual(["req-a", "req-b"]);
      // No explicit pendingChoice → first entry is active by default.
      expect(view.activeQueueIndex).toBe(0);
      expect(view.activePrompt?.requestId).toBe("req-a");
    });

    it("honors pendingChoice.requestID when the engine explicitly points at a queue entry", () => {
      const base = emptyBoard();
      const ctxA = targetContext({ requestId: "req-a" });
      const ctxB = targetContext({ requestId: "req-b" });
      const board: typeof base = {
        ...base,
        pendingChoice: {
          type: "action-effect",
          playerID: PLAYER_ONE,
          requestID: "req-b",
        },
        bagEffects: [
          {
            id: "req-a",
            type: "trigger",
            controllerId: PLAYER_ONE,
            chooserId: PLAYER_ONE,
            sourceId: SOURCE_CARD,
            payload: {},
            selectionContext: ctxA,
          },
          {
            id: "req-b",
            type: "trigger",
            controllerId: PLAYER_ONE,
            chooserId: PLAYER_ONE,
            sourceId: SOURCE_CARD,
            payload: {},
            selectionContext: ctxB,
          },
        ],
      };
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.activeQueueIndex).toBe(1);
      expect(view.activePrompt?.requestId).toBe("req-b");
    });

    it("reports an empty queue and -1 index when no prompts are pending", () => {
      const view = buildPlayerInteractionView(emptyBoard(), PLAYER_ONE);
      expect(view.promptQueue).toEqual([]);
      expect(view.activeQueueIndex).toBe(-1);
    });
  });

  describe("slotted target prompts (move-damage)", () => {
    function moveDamageContext(
      overrides: Partial<TargetResolutionSelectionContext> = {},
    ): TargetResolutionSelectionContext {
      return targetContext({
        cardCandidateIds: [TARGET_A, TARGET_B],
        expectedSlottedKind: "move-damage",
        minSelections: 2,
        maxSelections: 2,
        ...overrides,
      });
    }

    it("emits two slots for move-damage with engine-aligned indices", () => {
      const board = withPendingPrompt(moveDamageContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      const slots = view.activePrompt?.slots;
      expect(slots).toHaveLength(2);
      expect(slots?.[0]).toMatchObject({
        index: 0,
        key: "from",
        labelKey: "prompt.slot.move-damage.from",
        autoResolved: false,
        locked: false,
        targetCardId: null,
      });
      expect(slots?.[1]).toMatchObject({
        index: 1,
        key: "to",
        labelKey: "prompt.slot.move-damage.to",
        autoResolved: false,
        locked: false,
        targetCardId: null,
      });
    });

    it("marks slot 0 as auto-resolved when the engine declares `autoResolvedSlots: ['from']` (from: SELF, to: CHOSEN)", () => {
      const ctx = moveDamageContext({
        minSelections: 1,
        maxSelections: 1,
        autoResolvedSlots: ["from"],
      });
      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE);
      const fromSlot = view.activePrompt?.slots?.[0];
      expect(fromSlot?.autoResolved).toBe(true);
      expect(fromSlot?.locked).toBe(true);
      expect(fromSlot?.targetCardId).toBe(SOURCE_CARD);
      const toSlot = view.activePrompt?.slots?.[1];
      expect(toSlot?.autoResolved).toBe(false);
      expect(toSlot?.targetCardId).toBeNull();
    });

    it("marks slot 1 as auto-resolved when the engine declares `autoResolvedSlots: ['to']` (from: CHOSEN, to: SELF)", () => {
      // Regression: Luisa "I Can Take It" — `from: CHOSEN_CHARACTER_OF_YOURS,
      // to: SELF`. Previously the heuristic bound source to slot 0 and asked
      // the player to fill slot 1, producing a payload the engine silently
      // rejected because the FROM-DSL excluded the source card.
      const ctx = moveDamageContext({
        minSelections: 1,
        maxSelections: 1,
        autoResolvedSlots: ["to"],
      });
      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE);
      const fromSlot = view.activePrompt?.slots?.[0];
      expect(fromSlot?.autoResolved).toBe(false);
      expect(fromSlot?.locked).toBe(false);
      expect(fromSlot?.targetCardId).toBeNull();
      const toSlot = view.activePrompt?.slots?.[1];
      expect(toSlot?.autoResolved).toBe(true);
      expect(toSlot?.locked).toBe(true);
      expect(toSlot?.targetCardId).toBe(SOURCE_CARD);
      expect(view.activePrompt?.activeSlotIndex).toBe(0);
    });

    it("builds a submission with FROM=chosen and TO=source for `to: SELF` prompts (Luisa regression)", () => {
      const ctx = moveDamageContext({
        cardCandidateIds: [TARGET_A, TARGET_B],
        minSelections: 1,
        maxSelections: 1,
        autoResolvedSlots: ["to"],
        targetDsl: [
          {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
        ],
      });
      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE, {
        pendingSelectedCardIds: [TARGET_A],
      });
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        targets: {
          kind: "move-damage",
          from: [TARGET_A],
          to: [SOURCE_CARD],
        },
      });
    });

    it("aligns the destination slot with the engine's currentSelection.targets[0] for from-self prompts", () => {
      const ctx = moveDamageContext({
        minSelections: 1,
        maxSelections: 1,
        autoResolvedSlots: ["from"],
        currentSelection: { targets: [TARGET_A] },
      });
      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE);
      expect(view.activePrompt?.slots?.[0]?.targetCardId).toBe(SOURCE_CARD);
      expect(view.activePrompt?.slots?.[1]?.targetCardId).toBe(TARGET_A);
    });

    it("filters auto-resolved move-damage destination candidates with the destination target DSL", () => {
      const ctx = moveDamageContext({
        cardCandidateIds: [SOURCE_CARD, TARGET_B],
        minSelections: 1,
        maxSelections: 1,
        autoResolvedSlots: ["from"],
        targetDsl: [
          {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        ],
      });

      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE);

      expect(view.activePrompt?.activeSlotIndex).toBe(1);
      expect(
        view.interactions
          .filter((interaction) => interaction.kind === "select-card")
          .map((interaction) => ({
            cardId: interaction.cardId,
            slotIndex: interaction.slotIndex,
            payload: interaction.payload,
          })),
      ).toEqual([
        {
          cardId: TARGET_B,
          slotIndex: 1,
          payload: {
            targets: {
              kind: "move-damage",
              from: [SOURCE_CARD],
              to: [TARGET_B],
            },
          },
        },
      ]);
    });

    it("locks a slot once a target is bound but does not mark it auto-resolved unless self-targeting", () => {
      const ctx = moveDamageContext({
        currentSelection: { targets: [TARGET_A, TARGET_B] },
      });
      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE);
      expect(view.activePrompt?.slots?.[0]).toMatchObject({
        autoResolved: false,
        locked: true,
        targetCardId: TARGET_A,
      });
      expect(view.activePrompt?.slots?.[1]).toMatchObject({
        autoResolved: false,
        locked: true,
        targetCardId: TARGET_B,
      });
    });

    it("uses pending selected cards to advance move-damage interactions to the destination slot", () => {
      const ctx = moveDamageContext({
        cardCandidateIds: [TARGET_A, TARGET_B],
        targetDsl: [
          {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        ],
      });

      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE, {
        pendingSelectedCardIds: [TARGET_A],
      });

      expect(view.activePrompt?.activeSlotIndex).toBe(1);
      expect(view.activePrompt?.slots?.[0]?.targetCardId).toBe(TARGET_A);
      expect(view.activePrompt?.slots?.[1]?.targetCardId).toBeNull();
      expect(
        view.interactions
          .filter((interaction) => interaction.kind === "select-card")
          .map((interaction) => ({
            cardId: interaction.cardId,
            slotIndex: interaction.slotIndex,
            payload: interaction.payload,
          })),
      ).toEqual([
        {
          cardId: TARGET_B,
          slotIndex: 1,
          payload: {
            targets: {
              kind: "move-damage",
              from: [TARGET_A],
              to: [TARGET_B],
            },
          },
        },
      ]);
    });

    it("serializes a completed pending move-damage selection without duplicating slots", () => {
      const ctx = moveDamageContext({
        cardCandidateIds: [TARGET_A, TARGET_B],
        targetDsl: [
          {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        ],
      });

      const view = buildPlayerInteractionView(withPendingPrompt(ctx), PLAYER_ONE, {
        pendingSelectedCardIds: [TARGET_A, TARGET_B],
      });

      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        targets: {
          kind: "move-damage",
          from: [TARGET_A],
          to: [TARGET_B],
        },
      });
    });

    it("preserves initial engine candidates even when projected cards omit derived cardType", () => {
      const ctx = moveDamageContext({
        cardCandidateIds: [TARGET_A, TARGET_B],
        targetDsl: [
          {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        ],
      });
      const board = withPendingPrompt(ctx);
      board.cards[TARGET_A] = {
        id: TARGET_A,
        ownerId: PLAYER_ONE,
        controllerId: PLAYER_ONE,
        zone: "play",
      };
      board.cards[TARGET_B] = {
        id: TARGET_B,
        ownerId: PLAYER_TWO,
        controllerId: PLAYER_TWO,
        zone: "play",
      };

      const view = buildPlayerInteractionView(board, PLAYER_ONE);

      expect(
        view.interactions
          .filter((interaction) => interaction.kind === "select-card")
          .map((interaction) => interaction.cardId),
      ).toEqual([TARGET_A, TARGET_B]);
    });
  });

  describe("slotted target prompts (move-to-location)", () => {
    function moveToLocationContext(
      overrides: Partial<TargetResolutionSelectionContext> = {},
    ): TargetResolutionSelectionContext {
      return targetContext({
        cardCandidateIds: [SOURCE_CARD, TARGET_A, LOCATION_A],
        expectedSlottedKind: "move-to-location",
        minSelections: 1,
        maxSelections: 3,
        targetDsl: [
          {
            selector: "chosen",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
          {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
          },
        ],
        ...overrides,
      });
    }

    it("keeps characters and location in separate buckets while selecting", () => {
      const view = buildPlayerInteractionView(
        withPendingPrompt(moveToLocationContext()),
        PLAYER_ONE,
        {
          pendingSelectedCardIds: [SOURCE_CARD, TARGET_A],
          pendingActiveSlotIndex: 0,
        },
      );

      expect(view.activePrompt?.activeSlotIndex).toBe(0);
      expect(view.activePrompt?.slots?.[0]?.targetCardId).toBe(SOURCE_CARD);
      expect(view.activePrompt?.slots?.[1]?.targetCardId).toBeNull();
      expect(view.submission.canSubmit).toBe(false);
      expect(
        view.interactions
          .filter((interaction) => interaction.kind === "select-card")
          .map((interaction) => interaction.cardId),
      ).toEqual([SOURCE_CARD, TARGET_A, LOCATION_A]);
    });

    it("submits all selected characters to the chosen location", () => {
      const view = buildPlayerInteractionView(
        withPendingPrompt(moveToLocationContext()),
        PLAYER_ONE,
        {
          pendingSelectedCardIds: [SOURCE_CARD, TARGET_A, LOCATION_A],
          pendingActiveSlotIndex: 1,
        },
      );

      expect(view.activePrompt?.slots?.[0]?.targetCardId).toBe(SOURCE_CARD);
      expect(view.activePrompt?.slots?.[1]?.targetCardId).toBe(LOCATION_A);
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        targets: {
          kind: "move-to-location",
          subject: [SOURCE_CARD, TARGET_A],
          location: [LOCATION_A],
        },
      });
    });

    it("enables submit for one character plus one location when both slots are required", () => {
      const view = buildPlayerInteractionView(
        withPendingPrompt(
          moveToLocationContext({
            minSelections: 2,
            maxSelections: 2,
            declaredMaxSelections: 2,
            targetDsl: [
              {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
              },
              {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
            ],
          }),
        ),
        PLAYER_ONE,
        {
          pendingSelectedCardIds: [SOURCE_CARD, LOCATION_A],
          pendingActiveSlotIndex: 1,
        },
      );

      expect(view.activePrompt?.slots?.[0]?.targetCardId).toBe(SOURCE_CARD);
      expect(view.activePrompt?.slots?.[1]?.targetCardId).toBe(LOCATION_A);
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        targets: {
          kind: "move-to-location",
          subject: [SOURCE_CARD],
          location: [LOCATION_A],
        },
      });
    });

    it("enables submit when the engine already carries the character and this prompt chooses the location", () => {
      const view = buildPlayerInteractionView(
        withPendingPrompt(
          moveToLocationContext({
            currentSelection: { targets: [SOURCE_CARD] },
            cardCandidateIds: [LOCATION_A],
            minSelections: 1,
            maxSelections: 1,
            declaredMaxSelections: 1,
            targetDsl: [
              {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
            ],
          }),
        ),
        PLAYER_ONE,
        {
          pendingSelectedCardIds: [SOURCE_CARD, LOCATION_A],
          pendingActiveSlotIndex: 1,
        },
      );

      expect(view.activePrompt?.slots?.[0]?.targetCardId).toBe(SOURCE_CARD);
      expect(view.activePrompt?.slots?.[1]?.targetCardId).toBe(LOCATION_A);
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        targets: {
          kind: "move-to-location",
          subject: [SOURCE_CARD],
          location: [LOCATION_A],
        },
      });
    });

    it("locks the location slot when the move destination is already fixed", () => {
      const board = withPendingPrompt(
        moveToLocationContext({
          cardCandidateIds: [TARGET_A, TARGET_B],
          maxSelections: 1,
          declaredMaxSelections: 1,
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
          ],
        }),
        "bag",
      );
      board.cards[SOURCE_CARD] = {
        ...board.cards[SOURCE_CARD],
        atLocationId: LOCATION_A,
      };

      const view = buildPlayerInteractionView(board, PLAYER_ONE, {
        pendingSelectedCardIds: [TARGET_A],
        pendingActiveSlotIndex: 0,
      });

      expect(view.activePrompt?.activeSlotIndex).toBe(0);
      expect(view.activePrompt?.slots?.[0]).toMatchObject({
        key: "subject",
        targetCardId: TARGET_A,
        locked: true,
      });
      expect(view.activePrompt?.slots?.[1]).toMatchObject({
        key: "location",
        targetCardId: LOCATION_A,
        autoResolved: true,
        locked: true,
      });
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        targets: {
          kind: "move-to-location",
          subject: [TARGET_A],
          location: [LOCATION_A],
        },
      });
      expect(
        view.interactions
          .filter((interaction) => interaction.kind === "select-card")
          .map((interaction) => interaction.cardId),
      ).toEqual([TARGET_B]);
    });

    it("includes the fixed location in character selection payloads", () => {
      const board = withPendingPrompt(
        moveToLocationContext({
          cardCandidateIds: [TARGET_A],
          maxSelections: 1,
          declaredMaxSelections: 1,
          targetDsl: [
            {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
          ],
        }),
        "bag",
      );
      board.cards[SOURCE_CARD] = {
        ...board.cards[SOURCE_CARD],
        atLocationId: LOCATION_A,
      };

      const view = buildPlayerInteractionView(board, PLAYER_ONE);

      expect(view.interactions).toContainEqual({
        kind: "select-card",
        cardId: TARGET_A,
        slotIndex: 0,
        payload: {
          targets: {
            kind: "move-to-location",
            subject: [TARGET_A],
            location: [LOCATION_A],
          },
        },
      });
    });
  });

  describe("scry-selection", () => {
    const REVEALED_A = "card_revealed_a" as CardInstanceId;
    const REVEALED_B = "card_revealed_b" as CardInstanceId;
    const REVEALED_C = "card_revealed_c" as CardInstanceId;

    function scryContext(
      overrides: Partial<Extract<ResolutionSelectionContext, { kind: "scry-selection" }>> = {},
    ): Extract<ResolutionSelectionContext, { kind: "scry-selection" }> {
      return {
        origin: "pending-effect",
        requestId: "req-scry",
        kind: "scry-selection",
        sourceCardId: SOURCE_CARD,
        chooserId: PLAYER_ONE,
        currentSelection: {},
        submitField: "destinations",
        amount: 3,
        revealedCardIds: [REVEALED_A, REVEALED_B, REVEALED_C],
        revealedCards: [
          { cardId: REVEALED_A, label: "Revealed A", cardType: "character", cost: 2 },
          { cardId: REVEALED_B, label: "Revealed B", cardType: "action", cost: 3 },
          { cardId: REVEALED_C, label: "Revealed C", cardType: "item", cost: 4 },
        ],
        destinationRules: [
          {
            id: "deck-top",
            zone: "deck-top",
            min: 0,
            max: null,
            remainder: false,
            label: "Top of deck",
          },
          {
            id: "deck-bottom",
            zone: "deck-bottom",
            min: 0,
            max: null,
            remainder: true,
            label: "Bottom of deck",
          },
        ],
        ...overrides,
      };
    }

    it("emits scryDestinations and scryRevealed with empty assignments when nothing is selected", () => {
      const board = withPendingPrompt(scryContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.surface).toBe("scry-overlay");
      expect(view.activePrompt?.kind).toBe("scry-selection");
      const destinations = view.activePrompt?.scryDestinations;
      expect(destinations).toHaveLength(2);
      expect(destinations?.[0]).toMatchObject({
        id: "deck-top",
        zone: "deck-top",
        label: "Top of deck",
        min: 0,
        max: null,
        remainder: false,
        orderingEnabled: true,
        currentCardIds: [],
      });
      expect(destinations?.[1]).toMatchObject({
        id: "deck-bottom",
        zone: "deck-bottom",
        remainder: true,
        orderingEnabled: true,
        currentCardIds: [],
      });

      const revealed = view.activePrompt?.scryRevealed;
      expect(revealed).toHaveLength(3);
      expect(revealed?.map((card) => card.cardId)).toEqual([REVEALED_A, REVEALED_B, REVEALED_C]);
      for (const card of revealed ?? []) {
        expect(card.currentDestinationId).toBeNull();
        expect(card.orderIndex).toBeNull();
      }
    });

    it("can submit when no cards are placed if a remainder destination absorbs the unassigned ones", () => {
      const board = withPendingPrompt(scryContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      // remainder absorbs 3 unassigned cards → submittable.
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [] },
        ],
      });
    });

    it("blocks submit when no remainder is set and any card is unassigned", () => {
      const board = withPendingPrompt(
        scryContext({
          destinationRules: [
            {
              id: "deck-top",
              zone: "deck-top",
              min: 0,
              max: null,
              remainder: false,
              label: "Top of deck",
            },
            {
              id: "deck-bottom",
              zone: "deck-bottom",
              min: 0,
              max: null,
              remainder: false,
              label: "Bottom of deck",
            },
          ],
        }),
      );
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.submission.canSubmit).toBe(false);
      expect(view.submission.submitPayload).toBeNull();
    });

    it("reflects mid-flight assignments on scryRevealed and propagates them to submitPayload", () => {
      const board = withPendingPrompt(
        scryContext({
          currentSelection: {
            destinations: [{ zone: "deck-top", cards: [REVEALED_A] }],
          },
        }),
      );
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      const revealed = view.activePrompt?.scryRevealed ?? [];
      const placedA = revealed.find((card) => card.cardId === REVEALED_A);
      expect(placedA?.currentDestinationId).toBe("deck-top");
      expect(placedA?.orderIndex).toBe(0);
      const placedB = revealed.find((card) => card.cardId === REVEALED_B);
      expect(placedB?.currentDestinationId).toBeNull();
      expect(placedB?.orderIndex).toBeNull();

      const destinations = view.activePrompt?.scryDestinations ?? [];
      expect(destinations.find((d) => d.id === "deck-top")?.currentCardIds).toEqual([REVEALED_A]);
      expect(destinations.find((d) => d.id === "deck-bottom")?.currentCardIds).toEqual([]);

      // 1 placed in deck-top, 2 unassigned absorbed by deck-bottom (remainder).
      expect(view.submission.canSubmit).toBe(true);
      expect(view.submission.submitPayload).toEqual({
        destinations: [
          { zone: "deck-top", cards: [REVEALED_A] },
          { zone: "deck-bottom", cards: [] },
        ],
      });
    });

    it("falls back to revealedCardIds when revealedCards is empty", () => {
      const board = withPendingPrompt(
        scryContext({
          revealedCards: [],
        }),
      );
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      const revealed = view.activePrompt?.scryRevealed ?? [];
      expect(revealed.map((card) => card.cardId)).toEqual([REVEALED_A, REVEALED_B, REVEALED_C]);
    });

    it("merges pendingScryAssignments into scryDestinations and re-derives scryRevealed (gap #18)", () => {
      // Engine has accepted no assignments yet; chooser has staged a tap
      // locally that placed REVEALED_A on the deck-top destination.
      const board = withPendingPrompt(scryContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE, {
        pendingScryAssignments: [
          { id: "deck-top", zone: "deck-top", cards: [REVEALED_A] },
          { id: "deck-bottom", zone: "deck-bottom", cards: [] },
        ],
      });

      const destinations = view.activePrompt?.scryDestinations ?? [];
      const top = destinations.find((d) => d.id === "deck-top");
      expect(top?.currentCardIds).toEqual([REVEALED_A]);

      const revealed = view.activePrompt?.scryRevealed ?? [];
      const a = revealed.find((card) => card.cardId === REVEALED_A);
      expect(a?.currentDestinationId).toBe("deck-top");
      expect(a?.orderIndex).toBe(0);
      const b = revealed.find((card) => card.cardId === REVEALED_B);
      expect(b?.currentDestinationId).toBeNull();
    });

    it("pendingScryAssignments overrides currentSelection.destinations (renderer wins for in-flight state)", () => {
      // Engine acknowledged REVEALED_A on deck-bottom; chooser locally moved
      // it to deck-top. The view should reflect the local edit.
      const board = withPendingPrompt(
        scryContext({
          currentSelection: {
            destinations: [{ zone: "deck-bottom", cards: [REVEALED_A] }],
          },
        }),
      );
      const view = buildPlayerInteractionView(board, PLAYER_ONE, {
        pendingScryAssignments: [
          { id: "deck-top", zone: "deck-top", cards: [REVEALED_A] },
          { id: "deck-bottom", zone: "deck-bottom", cards: [] },
        ],
      });

      const top = view.activePrompt?.scryDestinations?.find((d) => d.id === "deck-top");
      const bottom = view.activePrompt?.scryDestinations?.find((d) => d.id === "deck-bottom");
      expect(top?.currentCardIds).toEqual([REVEALED_A]);
      expect(bottom?.currentCardIds).toEqual([]);

      const a = view.activePrompt?.scryRevealed?.find((c) => c.cardId === REVEALED_A);
      expect(a?.currentDestinationId).toBe("deck-top");
    });
  });

  describe("submission requestId stamping (contract law L3)", () => {
    it("stamps requestId on submission so the engine validator can reject stale clicks", () => {
      const board = withPendingPrompt(targetContext({ requestId: "req-stamp-1" }));
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.submission.requestId).toBe("req-stamp-1");
      expect(view.activePrompt?.requestId).toBe("req-stamp-1");
    });

    it("stamps requestId on the empty submission for non-chooser viewers too", () => {
      const board = withPendingPrompt(
        targetContext({ chooserId: PLAYER_TWO, requestId: "req-stamp-2" }),
      );
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.viewerRole).toBe("non-chooser-controller");
      expect(view.submission.requestId).toBe("req-stamp-2");
    });

    it("returns null requestId when no prompt is active", () => {
      const view = buildPlayerInteractionView(emptyBoard(), PLAYER_ONE);
      expect(view.submission.requestId).toBeNull();
    });
  });

  describe("scry assignment validation (disjointness + conservation)", () => {
    const REVEALED_A = "card_revealed_a" as CardInstanceId;
    const REVEALED_B = "card_revealed_b" as CardInstanceId;
    const REVEALED_C = "card_revealed_c" as CardInstanceId;

    function nonRemainderScryContext(): Extract<
      ResolutionSelectionContext,
      { kind: "scry-selection" }
    > {
      return {
        origin: "pending-effect",
        requestId: "req-scry-validation",
        kind: "scry-selection",
        sourceCardId: SOURCE_CARD,
        chooserId: PLAYER_ONE,
        currentSelection: {},
        submitField: "destinations",
        amount: 3,
        revealedCardIds: [REVEALED_A, REVEALED_B, REVEALED_C],
        revealedCards: [
          { cardId: REVEALED_A, label: "A" },
          { cardId: REVEALED_B, label: "B" },
          { cardId: REVEALED_C, label: "C" },
        ],
        destinationRules: [
          { id: "deck-top", zone: "deck-top", min: 0, max: null, remainder: false, label: "Top" },
          {
            id: "deck-bottom",
            zone: "deck-bottom",
            min: 0,
            max: null,
            remainder: false,
            label: "Bottom",
          },
        ],
      };
    }

    it("blocks submit when the same card is assigned to two destinations (disjointness)", () => {
      const board = withPendingPrompt(nonRemainderScryContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE, {
        pendingScryAssignments: [
          { id: "deck-top", zone: "deck-top", cards: [REVEALED_A, REVEALED_B] },
          { id: "deck-bottom", zone: "deck-bottom", cards: [REVEALED_B, REVEALED_C] },
        ],
      });
      expect(view.submission.canSubmit).toBe(false);
    });

    it("blocks submit when assigned + unassigned doesn't equal the revealed set (conservation)", () => {
      const board = withPendingPrompt(nonRemainderScryContext());
      const ghost = "ghost_card" as CardInstanceId;
      const view = buildPlayerInteractionView(board, PLAYER_ONE, {
        pendingScryAssignments: [
          { id: "deck-top", zone: "deck-top", cards: [REVEALED_A, ghost] },
          { id: "deck-bottom", zone: "deck-bottom", cards: [REVEALED_B, REVEALED_C] },
        ],
      });
      expect(view.submission.canSubmit).toBe(false);
    });

    it("allows submit when a complete, disjoint partition is staged", () => {
      const board = withPendingPrompt(nonRemainderScryContext());
      const view = buildPlayerInteractionView(board, PLAYER_ONE, {
        pendingScryAssignments: [
          { id: "deck-top", zone: "deck-top", cards: [REVEALED_A] },
          { id: "deck-bottom", zone: "deck-bottom", cards: [REVEALED_B, REVEALED_C] },
        ],
      });
      expect(view.submission.canSubmit).toBe(true);
    });
  });

  describe("discard-choice prompts", () => {
    it("emits select-card interactions and a stamped requestId for kind: discard-choice", () => {
      const board = withPendingPrompt(
        targetContext({
          kind: "discard-choice",
          requestId: "req-discard",
          submitField: "targets",
          allowedZones: ["hand"],
        }),
      );
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.activePrompt?.kind).toBe("discard-choice");
      expect(view.submission.requestId).toBe("req-discard");
      const cards = view.interactions.filter((i) => i.kind === "select-card");
      expect(cards).toHaveLength(2);
    });
  });

  describe("name-card-selection", () => {
    it("emits a single name-card interaction whose payload is built from the typed name", () => {
      const board = withPendingPrompt({
        origin: "pending-effect",
        requestId: "req-4",
        kind: "name-card-selection",
        sourceCardId: SOURCE_CARD,
        chooserId: PLAYER_ONE,
        currentSelection: {},
        submitField: "namedCard",
        searchMode: "lorcana-catalog",
      });
      const view = buildPlayerInteractionView(board, PLAYER_ONE);
      expect(view.surface).toBe("name-card-modal");
      expect(view.interactions).toHaveLength(1);
      const nameCard = view.interactions[0];
      if (nameCard.kind !== "name-card") throw new Error("expected name-card");
      expect(nameCard.buildPayload("Mickey Mouse")).toEqual({ namedCard: "Mickey Mouse" });
    });
  });
});
