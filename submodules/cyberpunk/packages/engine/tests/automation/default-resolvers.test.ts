import { describe, expect, test } from "vite-plus/test";
import {
  chooseCardToMoveResolver,
  chooseCardToPlayResolver,
  chooseEffectResolver,
  chooseGigsToStealResolver,
  chooseTargetResolver,
  defaultChoiceResolvers,
  searchDeckResolver,
} from "../../src/automation/index.ts";
import type { DecisionContext } from "../../src/automation/index.ts";
import type {
  ChooseCardToMoveChoicePrompt,
  ChooseCardToPlayChoicePrompt,
  ChooseEffectChoicePrompt,
  ChooseGigsToStealChoicePrompt,
  ChooseTargetChoicePrompt,
  SearchDeckChoicePrompt,
} from "../../src/view/player-prompt.ts";
import type { FilteredCardView } from "../../src/view/filter.ts";
import { createPlayerId } from "../../src/types/branded.ts";

const stubCtx: DecisionContext = {
  view: {
    players: {
      p1: {
        zones: {
          hand: [
            {
              instanceId: "h-1",
              definitionId: "unit-1",
              zone: "hand",
              faceDown: false,
              spent: false,
              damage: 0,
              power: 1,
              effectivePower: 1,
              cost: 1,
              type: "unit",
              classifications: [],
              hasSellTag: false,
              attachedGearIds: [],
              attachedToId: null,
              playedThisTurn: false,
              hasAttackedThisTurn: false,
              grantedRules: [],
              keywords: [],
            },
            {
              instanceId: "h-2",
              definitionId: "unit-2",
              zone: "hand",
              faceDown: false,
              spent: false,
              damage: 0,
              power: 2,
              effectivePower: 2,
              cost: 5,
              type: "unit",
              classifications: [],
              hasSellTag: false,
              attachedGearIds: [],
              attachedToId: null,
              playedThisTurn: false,
              hasAttackedThisTurn: false,
              grantedRules: [],
              keywords: [],
            },
          ],
        },
        eddies: 0,
        gigCount: 0,
        fixerCount: 6,
        streetCred: 0,
      },
    },
    gamePhase: "main",
    turnNumber: 1,
    activePlayerId: "p1",
    attackState: null,
    gameEnded: false,
    winnerId: null,
    winReason: null,
    stateID: 0,
    prompt: { status: "choice", availableMoves: [], choice: null },
  },
  playerId: createPlayerId("p1"),
  prompt: { status: "choice", availableMoves: [], choice: null },
  rng: () => 0.5,
};

function makeRevealed(
  id: string,
  overrides: Partial<{
    type: FilteredCardView["type"];
    cost: number;
    classifications: FilteredCardView["classifications"];
  }> = {},
): FilteredCardView {
  return {
    instanceId: id,
    definitionId: `def-${id}`,
    zone: "deck",
    faceDown: false,
    spent: false,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost: overrides.cost ?? 1,
    type: overrides.type ?? "unit",
    classifications: overrides.classifications ?? [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    playedThisTurn: false,
    hasAttackedThisTurn: false,
    grantedRules: [],
    keywords: [],
  };
}

describe("searchDeckResolver", () => {
  test("picks first N revealed cards (sorted by id) when no filter is set", () => {
    const choice: SearchDeckChoicePrompt = {
      type: "searchDeck",
      chooserId: "p1",
      payload: {
        player: "p1",
        lookCount: 3,
        reveal: false,
        destination: "hand",
        target: null,
        select: { kind: "upTo", max: 2 },
        remainder: { zone: "deck" },
        revealedCardIds: ["c", "a", "b"],
        revealedCards: [makeRevealed("c"), makeRevealed("a"), makeRevealed("b")],
      },
    };
    const result = searchDeckResolver(choice, stubCtx);
    expect(result).toEqual({
      kind: "command",
      move: "resolveSearchDeck",
      args: { selectedCardIds: ["a", "b"] },
    });
  });

  test("respects allMatching by selecting every revealed card", () => {
    const choice: SearchDeckChoicePrompt = {
      type: "searchDeck",
      chooserId: "p1",
      payload: {
        player: "p1",
        lookCount: 3,
        reveal: false,
        destination: "hand",
        target: null,
        select: { kind: "all" },
        remainder: { zone: "deck" },
        revealedCardIds: ["a", "b", "c"],
        revealedCards: [makeRevealed("a"), makeRevealed("b"), makeRevealed("c")],
      },
    };
    const result = searchDeckResolver(choice, stubCtx);
    expect(result).toEqual({
      kind: "command",
      move: "resolveSearchDeck",
      args: { selectedCardIds: ["a", "b", "c"] },
    });
  });

  test("filters revealed cards by cardTypes before selecting", () => {
    const choice: SearchDeckChoicePrompt = {
      type: "searchDeck",
      chooserId: "p1",
      payload: {
        player: "p1",
        lookCount: 3,
        reveal: false,
        destination: "hand",
        target: { cardTypes: ["program"] },
        select: { kind: "upTo", max: 2 },
        remainder: { zone: "deck" },
        revealedCardIds: ["a", "b", "c"],
        revealedCards: [
          makeRevealed("a", { type: "unit" }),
          makeRevealed("b", { type: "program" }),
          makeRevealed("c", { type: "program" }),
        ],
      },
    };
    expect(searchDeckResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveSearchDeck",
      args: { selectedCardIds: ["b", "c"] },
    });
  });

  test("filters by maxCost and classifications", () => {
    const choice: SearchDeckChoicePrompt = {
      type: "searchDeck",
      chooserId: "p1",
      payload: {
        player: "p1",
        lookCount: 4,
        reveal: false,
        destination: "hand",
        target: { maxCost: 2, classifications: ["Netrunner"] },
        select: { kind: "upTo", max: 1 },
        remainder: { zone: "deck" },
        revealedCardIds: ["a", "b", "c", "d"],
        revealedCards: [
          makeRevealed("a", { cost: 5, classifications: ["Netrunner"] }),
          makeRevealed("b", { cost: 1, classifications: ["Corpo"] }),
          makeRevealed("c", { cost: 2, classifications: ["Netrunner"] }),
          makeRevealed("d", { cost: 1, classifications: ["Netrunner"] }),
        ],
      },
    };
    expect(searchDeckResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveSearchDeck",
      args: { selectedCardIds: ["c"] },
    });
  });

  test("returns an empty selection when no revealed card matches the filter", () => {
    const choice: SearchDeckChoicePrompt = {
      type: "searchDeck",
      chooserId: "p1",
      payload: {
        player: "p1",
        lookCount: 2,
        reveal: false,
        destination: "hand",
        target: { cardTypes: ["legend"] },
        select: { kind: "upTo", max: 1 },
        remainder: { zone: "deck" },
        revealedCardIds: ["a", "b"],
        revealedCards: [
          makeRevealed("a", { type: "unit" }),
          makeRevealed("b", { type: "program" }),
        ],
      },
    };
    expect(searchDeckResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveSearchDeck",
      args: { selectedCardIds: [] },
    });
  });

  test("filters by minCost / maxCost range", () => {
    const choice: SearchDeckChoicePrompt = {
      type: "searchDeck",
      chooserId: "p1",
      payload: {
        player: "p1",
        lookCount: 4,
        reveal: false,
        destination: "hand",
        target: { minCost: 2, maxCost: 4 },
        select: { kind: "upTo", max: 2 },
        remainder: { zone: "deck" },
        revealedCardIds: ["a", "b", "c", "d"],
        revealedCards: [
          { ...makeRevealed("a", { cost: 1 }) },
          { ...makeRevealed("b", { cost: 2 }) },
          { ...makeRevealed("c", { cost: 4 }) },
          { ...makeRevealed("d", { cost: 5 }) },
        ],
      },
    };
    expect(searchDeckResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveSearchDeck",
      args: { selectedCardIds: ["b", "c"] },
    });
  });

  test("filters by minPower / maxPower bounds", () => {
    const choice: SearchDeckChoicePrompt = {
      type: "searchDeck",
      chooserId: "p1",
      payload: {
        player: "p1",
        lookCount: 3,
        reveal: false,
        destination: "hand",
        target: { minPower: 3, maxPower: 5 },
        select: { kind: "all" },
        remainder: { zone: "deck" },
        revealedCardIds: ["a", "b", "c"],
        revealedCards: [
          { ...makeRevealed("a"), effectivePower: 2 },
          { ...makeRevealed("b"), effectivePower: 4 },
          { ...makeRevealed("c"), effectivePower: 6 },
        ],
      },
    };
    expect(searchDeckResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveSearchDeck",
      args: { selectedCardIds: ["b"] },
    });
  });
});

describe("chooseTargetResolver", () => {
  test("discardFromHand picks the cheapest hand card", () => {
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: { type: "discardFromHand", amount: 1, player: "p1" },
    };
    const result = chooseTargetResolver(choice, stubCtx);
    expect(result).toEqual({
      kind: "command",
      move: "resolveDiscardFromHand",
      args: { cardIds: ["h-1"] },
    });
  });

  test("adjustGig increases own die toward maxFaceValue", () => {
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "increase",
        maxAmount: 3,
        dieId: "d-1",
        currentValue: 4,
        maxFaceValue: 6,
        dieOwnerId: "p1",
      },
    };
    expect(chooseTargetResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveAdjustGig",
      args: { value: 6 },
    });
  });

  test("adjustGig decreases rival die toward 1", () => {
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "decrease",
        maxAmount: 5,
        dieId: "d-2",
        currentValue: 4,
        maxFaceValue: 6,
        dieOwnerId: "p2",
      },
    };
    expect(chooseTargetResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveAdjustGig",
      args: { value: 1 },
    });
  });

  test("adjustGig with direction=either favors the chooser", () => {
    const ownDie: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "either",
        maxAmount: 2,
        dieId: "d-3",
        currentValue: 3,
        maxFaceValue: 8,
        dieOwnerId: "p1",
      },
    };
    expect(chooseTargetResolver(ownDie, stubCtx)).toMatchObject({
      kind: "command",
      args: { value: 5 },
    });

    const rivalDie: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "either",
        maxAmount: 2,
        dieId: "d-4",
        currentValue: 5,
        maxFaceValue: 8,
        dieOwnerId: "p2",
      },
    };
    expect(chooseTargetResolver(rivalDie, stubCtx)).toMatchObject({
      kind: "command",
      args: { value: 3 },
    });
  });

  test("adjustGig is stuck when die context is missing", () => {
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: { type: "adjustGig", direction: "increase", maxAmount: 1 },
    };
    expect(chooseTargetResolver(choice, stubCtx).kind).toBe("stuck");
  });
});

describe("simple resolvers", () => {
  test("chooseCardToPlay picks the highest-effectivePower candidate", () => {
    const choice: ChooseCardToPlayChoicePrompt = {
      type: "chooseCardToPlay",
      chooserId: "p1",
      payload: {
        cardIds: ["zeta", "alpha", "beta"],
        cards: [
          { ...makeRevealed("zeta"), effectivePower: 3, cost: 4 },
          { ...makeRevealed("alpha"), effectivePower: 5, cost: 2 },
          { ...makeRevealed("beta"), effectivePower: 5, cost: 4 },
        ],
      },
    };
    expect(chooseCardToPlayResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveCardToPlay",
      args: { cardId: "beta" }, // tie on power → higher cost wins
    });
  });

  test("chooseCardToMove with favourable destination moves the strongest card", () => {
    const choice: ChooseCardToMoveChoicePrompt = {
      type: "chooseCardToMove",
      chooserId: "p1",
      payload: {
        cardIds: ["a", "b"],
        cards: [
          { ...makeRevealed("a"), effectivePower: 3 },
          { ...makeRevealed("b"), effectivePower: 6 },
        ],
        destination: "field",
      },
    };
    expect(chooseCardToMoveResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveCardToMove",
      args: { cardId: "b" },
    });
  });

  test("chooseCardToMove with unfavourable destination sacrifices the weakest card", () => {
    const choice: ChooseCardToMoveChoicePrompt = {
      type: "chooseCardToMove",
      chooserId: "p1",
      payload: {
        cardIds: ["a", "b"],
        cards: [
          { ...makeRevealed("a"), effectivePower: 3 },
          { ...makeRevealed("b"), effectivePower: 6 },
        ],
        destination: "trash",
      },
    };
    expect(chooseCardToMoveResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveCardToMove",
      args: { cardId: "a" },
    });
  });

  test("chooseCardToMove falls back to pass when no candidates", () => {
    const choice: ChooseCardToMoveChoicePrompt = {
      type: "chooseCardToMove",
      chooserId: "p1",
      payload: { cardIds: [], cards: [] },
    };
    expect(chooseCardToMoveResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveCardToMove",
      args: { pass: true },
    });
  });

  test("chooseEffect with no options reports a stuck-bug reason", () => {
    const choice: ChooseEffectChoicePrompt = {
      type: "chooseEffect",
      chooserId: "p1",
      payload: { options: [] },
    };
    const result = chooseEffectResolver(choice, stubCtx);
    expect(result.kind).toBe("stuck");
    if (result.kind === "stuck") {
      expect(result.reason).toContain("emitted with no options");
    }
  });

  test("chooseEffect with options reports stuck pending engine resolver", () => {
    // CONTRACT(chooseEffect): until a modal-effect card lands, the resolver
    // is correct to return stuck even when options are populated. The
    // reason string surfaces the option ids so the failure is debuggable.
    const choice: ChooseEffectChoicePrompt = {
      type: "chooseEffect",
      chooserId: "p1",
      payload: {
        options: [
          { id: "deal-damage", label: "Deal 1 damage", effects: [] },
          { id: "draw-card", label: "Draw a card", effects: [] },
        ],
      },
    };
    const result = chooseEffectResolver(choice, stubCtx);
    expect(result.kind).toBe("stuck");
    if (result.kind === "stuck") {
      expect(result.reason).toContain("CONTRACT(chooseEffect)");
      expect(result.reason).toContain("deal-damage");
      expect(result.reason).toContain("draw-card");
    }
  });

  test("chooseGigsToSteal picks the highest-face dice (ties broken by id)", () => {
    const choice: ChooseGigsToStealChoicePrompt = {
      type: "chooseGigsToSteal",
      chooserId: "p1",
      payload: {
        count: 2,
        attackerId: "atk",
        rivalId: "p2",
        eligibleDice: [
          { dieId: "d-a", faceValue: 3 },
          { dieId: "d-b", faceValue: 6 },
          { dieId: "d-c", faceValue: 5 },
          { dieId: "d-d", faceValue: 6 },
        ],
      },
    };
    expect(chooseGigsToStealResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveStealGigs",
      args: { dieIds: ["d-b", "d-d"] },
    });
  });

  test("chooseGigsToSteal is stuck when fewer dice than required", () => {
    const choice: ChooseGigsToStealChoicePrompt = {
      type: "chooseGigsToSteal",
      chooserId: "p1",
      payload: {
        count: 3,
        attackerId: "atk",
        rivalId: "p2",
        eligibleDice: [
          { dieId: "d-a", faceValue: 3 },
          { dieId: "d-b", faceValue: 6 },
        ],
      },
    };
    expect(chooseGigsToStealResolver(choice, stubCtx).kind).toBe("stuck");
  });
});

describe("defaultChoiceResolvers map", () => {
  test("contains exactly one resolver per pending-choice variant", () => {
    expect(Object.keys(defaultChoiceResolvers).sort()).toEqual(
      [
        "chooseCardToMove",
        "chooseCardToPlay",
        "chooseEffect",
        "chooseGigsToSteal",
        "chooseTrigger",
        "chooseTarget",
        "gainGig",
        "searchDeck",
      ].sort(),
    );
  });
});
