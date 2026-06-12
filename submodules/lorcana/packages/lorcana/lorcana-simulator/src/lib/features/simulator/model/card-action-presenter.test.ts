import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayCardDisabledReason } from "@tcg/lorcana-engine";
import { buildCardActionViews } from "./card-action-presenter.js";
import type { ExecutableMoveEntry, LorcanaCardSnapshot } from "./contracts.js";

function createCard(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: "card-1",
    definitionId: "def-1",
    isMasked: false,
    label: "Moana - Determined Explorer",
    ownerId: "player_one",
    ownerSide: "playerOne",
    zoneId: "play",
    cardType: "character",
    loreValue: 2,
    facePresentation: "faceUp",
    ...overrides,
  };
}

function createMove(move: ExecutableMoveEntry): ExecutableMoveEntry {
  return move;
}

describe("buildCardActionViews", () => {
  it("preserves quest lore detail without surfacing eager target counts", () => {
    const card = createCard();
    const questMove = createMove({
      id: "quest:card-1",
      label: "Quest with Moana",
      moveId: "quest",
      params: { cardId: card.cardId },
      presentation: {
        kind: "targeted",
        categoryId: "quest",
        categoryLabel: "Quest",
        optionLabel: card.label,
      },
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [questMove],
      ownerSide: "playerOne",
      challengeReadyCardIds: [card.cardId],
      movableToLocationCardIds: [card.cardId],
    });

    expect(actions).toEqual([
      {
        id: `quest:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "quest",
        label: "Quest for 2 lore",
        interaction: "execute-or-select",
        enabled: true,
        moves: [questMove],
      },
      {
        id: `challenge:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "challenge",
        label: "Challenge",
        interaction: "expand-on-click",
        enabled: true,
        moves: [],
      },
      {
        id: `move-to-location:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "move-to-location",
        label: "Move to Location",
        interaction: "expand-on-click",
        enabled: true,
        moves: [],
      },
    ]);
  });

  it("keeps activate-ability aggregated while leaving deferred actions empty", () => {
    const card = createCard({
      textEntries: [{ title: "{E} Encore", description: "Draw a card." }],
    });
    const abilityMove = createMove({
      id: "activateAbility:card-1:0",
      label: "Moana - Determined Explorer: {E} Encore",
      moveId: "activateAbility",
      params: { cardId: card.cardId, abilityIndex: 0 },
      presentation: {
        kind: "targeted",
        categoryId: "activate-ability",
        categoryLabel: "Activate Ability",
        optionLabel: "Moana - Determined Explorer: {E} Encore",
      },
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [abilityMove],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    expect(actions.at(-1)).toEqual({
      id: `activate-ability:${card.cardId}`,
      cardId: card.cardId,
      categoryId: "activate-ability",
      label: "Activate Ability",
      interaction: "execute-or-select",
      enabled: true,
      moves: [abilityMove],
    });
    expect(actions.some((action) => action.detail?.includes("target"))).toBe(false);
    expect(actions.some((action) => action.detail?.includes("location"))).toBe(false);
  });

  it("keeps bodyguard play-state variants grouped under one play action", () => {
    const card = createCard({
      zoneId: "hand",
      label: "Bodyguard Ally",
      playCost: 3,
      keywords: ["Bodyguard"],
    });
    const readyMove = createMove({
      id: "playCard:card-1:ready",
      label: "Play Ready (Bodyguard Ally)",
      moveId: "playCard",
      params: { cardId: card.cardId },
      presentation: {
        kind: "targeted",
        categoryId: "play-card",
        categoryLabel: "Play",
        optionLabel: "Play Ready",
      },
    });
    const exertedMove = createMove({
      id: "playCard:card-1:exerted",
      label: "Play Exerted (Bodyguard Ally)",
      moveId: "playCard",
      params: { cardId: card.cardId, resolveOptional: true },
      presentation: {
        kind: "targeted",
        categoryId: "play-card",
        categoryLabel: "Play",
        optionLabel: "Play Exerted",
      },
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [readyMove, exertedMove],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    expect(actions[0]).toEqual({
      id: `play-card:${card.cardId}`,
      cardId: card.cardId,
      categoryId: "play-card",
      label: "Play",
      detail: "3 ink",
      interaction: "execute-or-select",
      enabled: true,
      moves: [readyMove, exertedMove],
    });
  });

  it("shows discounted payable cost for a normal play action", () => {
    const card = createCard({
      zoneId: "hand",
      cost: 4,
      playCost: 3,
    });
    const playMove = createMove({
      id: "playCard:card-1",
      label: "Play Moana - Determined Explorer",
      moveId: "playCard",
      params: { cardId: card.cardId },
      presentation: {
        kind: "targeted",
        categoryId: "play-card",
        categoryLabel: "Play",
        optionLabel: card.label,
      },
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [playMove],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    expect(actions[0]).toEqual({
      id: `play-card:${card.cardId}`,
      cardId: card.cardId,
      categoryId: "play-card",
      label: "Play",
      detail: "3 ink",
      interaction: "execute-or-select",
      enabled: true,
      moves: [playMove],
    });
  });

  it("shows a disabled shift action for hand cards with Shift when no legal shift move exists", () => {
    const card = createCard({
      zoneId: "hand",
      label: "Stitch - Rock Star",
      keywords: ["Shift"],
      shiftInkCost: 4,
      shiftPlayCost: 4,
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    expect(actions).toEqual([
      {
        id: `disabled:play-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "play-card",
        label: "Play",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be played right now.",
        moves: [],
      },
      {
        id: `disabled:shift-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "shift-card",
        label: "Shift",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be shifted right now.",
        moves: [],
      },
      {
        id: `disabled:ink-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "ink-card",
        label: "Ink",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be inked right now.",
        moves: [],
      },
    ]);
  });

  it("shows a disabled shift action for discard-cost Shift cards", () => {
    const card = createCard({
      zoneId: "hand",
      label: "Ursula - Eric's Bride",
      keywords: ["Shift"],
      textEntries: [
        {
          title: "Shift: Discard a song card",
          description:
            "(You may discard a song card to play this on top of one of your characters named Ursula.)",
        },
      ],
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    expect(actions).toEqual([
      {
        id: `disabled:play-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "play-card",
        label: "Play",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be played right now.",
        moves: [],
      },
      {
        id: `disabled:shift-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "shift-card",
        label: "Shift",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be shifted right now.",
        moves: [],
      },
      {
        id: `disabled:ink-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "ink-card",
        label: "Ink",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be inked right now.",
        moves: [],
      },
    ]);
  });

  it("shows enabled move-to-location for exerted characters in movableToLocationCardIds", () => {
    const exertedCard = createCard({ readyState: "exerted" });

    const actions = buildCardActionViews({
      card: exertedCard,
      executableMoves: [],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [exertedCard.cardId],
    });

    const moveAction = actions.find((a) => a.categoryId === "move-to-location");
    expect(moveAction).toEqual({
      id: `move-to-location:${exertedCard.cardId}`,
      cardId: exertedCard.cardId,
      categoryId: "move-to-location",
      label: "Move to Location",
      interaction: "expand-on-click",
      enabled: true,
      moves: [],
    });
  });

  it("does not claim exerted blocks move-to-location when no locations available", () => {
    const exertedCard = createCard({ readyState: "exerted" });

    const actions = buildCardActionViews({
      card: exertedCard,
      executableMoves: [],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    const moveAction = actions.find((a) => a.categoryId === "move-to-location");
    expect(moveAction?.enabled).toBe(false);
    expect(moveAction?.reason).toBe("No legal locations to move to right now.");
  });

  it("shows an enabled shift action with discounted payable cost detail", () => {
    const card = createCard({
      zoneId: "hand",
      label: "Stitch - Rock Star",
      shiftInkCost: 4,
      shiftPlayCost: 3,
    });
    const shiftMove = createMove({
      id: "shiftCard:card-1:target-1",
      label: "Shift onto Stitch - Naughty Experiment",
      moveId: "playCard",
      params: { cardId: card.cardId, cost: "shift", targets: ["target-1"] },
      presentation: {
        kind: "targeted",
        categoryId: "shift-card",
        categoryLabel: "Shift",
        optionLabel: "Shift onto Stitch - Naughty Experiment",
      },
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [shiftMove],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    expect(actions).toEqual([
      {
        id: `disabled:play-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "play-card",
        label: "Play",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be played right now.",
        moves: [],
      },
      {
        id: `shift-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "shift-card",
        label: "Shift",
        detail: "Pay 3 ink (4 base)",
        interaction: "execute-or-select",
        enabled: true,
        moves: [shiftMove],
      },
      {
        id: `disabled:ink-card:${card.cardId}`,
        cardId: card.cardId,
        categoryId: "ink-card",
        label: "Ink",
        interaction: "execute-or-select",
        enabled: false,
        reason: "This card cannot be inked right now.",
        moves: [],
      },
    ]);
  });

  describe("disabledReasonAccessors — structured tooltips on blocked actions", () => {
    function makeAccessors(opts: {
      standard?: PlayCardDisabledReason | null;
      shift?: PlayCardDisabledReason | null;
      sing?: PlayCardDisabledReason | null;
      ink?: string | null;
    }) {
      return {
        getStandardPlayDisabledReason: () => opts.standard ?? null,
        getShiftPlayDisabledReason: () => opts.shift ?? null,
        getSingPlayDisabledReason: () => opts.sing ?? null,
        getInkActionDisabledReason: () => opts.ink ?? null,
      };
    }

    it("renders the localized standard-cost reason on a blocked Play chip", () => {
      const card = createCard({ zoneId: "hand", label: "Some Card" });
      const actions = buildCardActionViews({
        card,
        executableMoves: [],
        ownerSide: "playerOne",
        challengeReadyCardIds: [],
        movableToLocationCardIds: [],
        disabledReasonAccessors: makeAccessors({
          standard: { code: "INSUFFICIENT_INK", params: { needed: 3, available: 1 } },
        }),
      });

      const play = actions.find((a) => a.categoryId === "play-card");
      expect(play?.enabled).toBe(false);
      // Wording is engine-agnostic; we just assert the substituted values
      // show up. The exact template lives in messages/en.json.
      expect(play?.reason).toContain("3");
      expect(play?.reason).toContain("1");
    });

    it("renders the SHIFT_NO_DISCARD_AVAILABLE reason on a blocked Shift chip (Devoted Herald case)", () => {
      const card = createCard({
        zoneId: "hand",
        label: "Diablo - Devoted Herald",
        keywords: ["Shift"],
      });
      const actions = buildCardActionViews({
        card,
        executableMoves: [],
        ownerSide: "playerOne",
        challengeReadyCardIds: [],
        movableToLocationCardIds: [],
        disabledReasonAccessors: makeAccessors({
          shift: {
            code: "SHIFT_NO_DISCARD_AVAILABLE",
            params: { discardCardType: "action", count: 1 },
          },
        }),
      });

      const shift = actions.find((a) => a.categoryId === "shift-card");
      expect(shift?.enabled).toBe(false);
      expect(shift?.reason).toContain("action");
    });

    it("renders SHIFT_NO_TARGET on a blocked Shift chip when no matching-named target is on board", () => {
      const card = createCard({
        zoneId: "hand",
        label: "Stitch - Rock Star",
        keywords: ["Shift"],
      });
      const actions = buildCardActionViews({
        card,
        executableMoves: [],
        ownerSide: "playerOne",
        challengeReadyCardIds: [],
        movableToLocationCardIds: [],
        disabledReasonAccessors: makeAccessors({
          shift: { code: "SHIFT_NO_TARGET", params: { targetName: "Stitch" } },
        }),
      });

      const shift = actions.find((a) => a.categoryId === "shift-card");
      expect(shift?.reason).toContain("Stitch");
    });

    it("renders SONG_NO_SINGER on a blocked Sing chip for song cards", () => {
      const card = createCard({
        zoneId: "hand",
        cardType: "action",
        actionSubtype: "song",
        label: "Reflection",
      });
      const actions = buildCardActionViews({
        card,
        executableMoves: [],
        ownerSide: "playerOne",
        challengeReadyCardIds: [],
        movableToLocationCardIds: [],
        disabledReasonAccessors: makeAccessors({
          sing: { code: "SONG_NO_SINGER", params: { songCost: 4 } },
        }),
      });

      const sing = actions.find((a) => a.categoryId === "sing-card");
      expect(sing?.enabled).toBe(false);
      expect(sing?.reason).toContain("4");
    });

    it("falls back to generic strings when accessors are not provided (preserves current behavior)", () => {
      const card = createCard({ zoneId: "hand", keywords: ["Shift"] });
      const actions = buildCardActionViews({
        card,
        executableMoves: [],
        ownerSide: "playerOne",
        challengeReadyCardIds: [],
        movableToLocationCardIds: [],
      });

      const play = actions.find((a) => a.categoryId === "play-card");
      const shift = actions.find((a) => a.categoryId === "shift-card");
      expect(play?.reason).toBe("This card cannot be played right now.");
      expect(shift?.reason).toBe("This card cannot be shifted right now.");
    });

    it("renders the ink action reason when the player already used their ink action", () => {
      const card = createCard({ zoneId: "hand" });
      const actions = buildCardActionViews({
        card,
        executableMoves: [],
        ownerSide: "playerOne",
        challengeReadyCardIds: [],
        movableToLocationCardIds: [],
        disabledReasonAccessors: makeAccessors({
          ink: "You already inked a card this turn.",
        }),
      });

      const ink = actions.find((a) => a.categoryId === "ink-card");
      expect(ink?.enabled).toBe(false);
      expect(ink?.reason).toBe("You already inked a card this turn.");
    });
  });

  it("splits put-on-deck-bottom alternative cost into a separate action chip", () => {
    const card = createCard({
      zoneId: "hand",
      cardType: "character",
      label: "Hand-in-the-Box - Sid's Toy",
      cost: 2,
      playCost: 2,
    });
    const standardMove = createMove({
      id: "playCard:card-1",
      label: "Hand-in-the-Box - Sid's Toy",
      moveId: "playCard",
      params: { cardId: card.cardId, cost: "standard" },
      presentation: {
        kind: "targeted",
        categoryId: "play-card",
        categoryLabel: "Play",
        optionLabel: card.label,
      },
    });
    const putOnDeckBottomMove = createMove({
      id: "playCard:card-1:put-on-deck-bottom",
      label: "Hand-in-the-Box - Sid's Toy (Put Toy on Deck Bottom)",
      moveId: "playCard",
      params: { cardId: card.cardId, cost: "put-on-deck-bottom" },
      presentation: {
        kind: "targeted",
        categoryId: "play-card",
        categoryLabel: "Play",
        optionLabel: "Put Toy on Deck Bottom",
        selectableCosts: [
          {
            kind: "putOnDeckBottom" as const,
            count: 1,
            candidateCardIds: ["toy-discard-id" as CardInstanceId],
            zone: "discard" as const,
          },
        ],
      },
    });

    const actions = buildCardActionViews({
      card,
      executableMoves: [standardMove, putOnDeckBottomMove],
      ownerSide: "playerOne",
      challengeReadyCardIds: [],
      movableToLocationCardIds: [],
    });

    const playCardActions = actions.filter((a) => a.categoryId === "play-card");
    expect(playCardActions).toHaveLength(2);

    // Standard play action
    const standardAction = playCardActions.find((a) => a.id === `play-card:${card.cardId}`);
    expect(standardAction).toBeDefined();
    expect(standardAction?.moves).toEqual([standardMove]);

    // Alternative cost action — separate chip
    const altAction = playCardActions.find(
      (a) => a.id === `play-card:${card.cardId}:put-on-deck-bottom`,
    );
    expect(altAction).toBeDefined();
    expect(altAction?.moves).toEqual([putOnDeckBottomMove]);
  });
});
