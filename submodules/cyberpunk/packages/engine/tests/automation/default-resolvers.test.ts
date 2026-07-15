import { describe, expect, test } from "vite-plus/test";
import {
  chooseCardToMoveResolver,
  chooseCardToPlayResolver,
  chooseEffectResolver,
  chooseGigsToStealResolver,
  chooseTargetResolver,
  defaultChoiceResolvers,
  revealDestinationResolver,
  scryResolver,
} from "../../src/automation/index.ts";
import type { DecisionContext } from "../../src/automation/index.ts";
import type {
  ChooseCardToMoveChoicePrompt,
  ChooseCardToPlayChoicePrompt,
  ChooseEffectChoicePrompt,
  ChooseGigsToStealChoicePrompt,
  ChooseTargetChoicePrompt,
  RevealDestinationChoicePrompt,
  ScryChoicePrompt,
} from "../../src/view/player-prompt.ts";
import type { FilteredCardView } from "../../src/view/filter.ts";
import type { CardColor } from "@tcg/cyberpunk-types";
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
              cardName: "Unit 1",
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
              hasLag: false,
              hasAttackedThisTurn: false,
              grantedRules: [],
              keywords: [],
              triggerHints: [],
              abilityHints: [],
            },
            {
              instanceId: "h-2",
              definitionId: "unit-2",
              cardName: "Unit 2",
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
              hasLag: false,
              hasAttackedThisTurn: false,
              grantedRules: [],
              keywords: [],
              triggerHints: [],
              abilityHints: [],
            },
          ],
        },
        eddies: 0,
        availableEddies: 0,
        gigCount: 0,
        fixerCount: 6,
        streetCred: 0,
      },
    },
    gamePhase: "main",
    turnNumber: 1,
    activePlayerId: "p1",
    playedCardTypesThisTurn: {},
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
    cardName: id,
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
    hasLag: false,
    hasAttackedThisTurn: false,
    grantedRules: [],
    keywords: [],
    triggerHints: [],
    abilityHints: [],
  };
}

function makeGig(id: string, dieType: "d4" | "d6" | "d8", value: number): FilteredCardView {
  return {
    ...makeRevealed(id),
    definitionId: dieType,
    zone: "gigArea",
    effectivePower: value,
    power: value,
    type: null,
    cost: null,
  };
}

function withGigs(p1: FilteredCardView[], p2: FilteredCardView[] = []): DecisionContext {
  return {
    ...stubCtx,
    view: {
      ...stubCtx.view,
      players: {
        p1: {
          ...stubCtx.view.players.p1!,
          zones: { ...stubCtx.view.players.p1!.zones, gigArea: p1 },
          gigCount: p1.length,
          streetCred: p1.reduce((total, gig) => total + gig.effectivePower, 0),
        },
        p2: {
          zones: { gigArea: p2 },
          eddies: 0,
          availableEddies: 0,
          gigCount: p2.length,
          fixerCount: 6,
          streetCred: p2.reduce((total, gig) => total + gig.effectivePower, 0),
        },
      },
    },
  };
}

function colorSource(color: CardColor) {
  return {
    cardId: `source-${color}`,
    definitionId: `definition-${color}`,
    displayName: `${color} source`,
    cardType: "program" as const,
    color,
  };
}

describe("scryResolver", () => {
  test("picks first N revealed cards (sorted by id) when no filter is set", () => {
    const choice: ScryChoicePrompt = {
      type: "scry",
      chooserId: "p1",
      payload: {
        player: "p1",
        amount: 3,
        destinations: [{ zone: "hand", min: 0, max: 2, reveal: false, target: null }],
        revealedCardIds: ["c", "a", "b"],
        revealedCards: [makeRevealed("c"), makeRevealed("a"), makeRevealed("b")],
      },
    };
    const result = scryResolver(choice, stubCtx);
    expect(result).toEqual({
      kind: "command",
      move: "resolveScry",
      args: { destinations: [{ zone: "hand", cardIds: ["a", "b"] }] },
    });
  });

  test("respects unbounded destination by selecting every revealed card", () => {
    const choice: ScryChoicePrompt = {
      type: "scry",
      chooserId: "p1",
      payload: {
        player: "p1",
        amount: 3,
        destinations: [{ zone: "hand", reveal: false, target: null }],
        revealedCardIds: ["a", "b", "c"],
        revealedCards: [makeRevealed("a"), makeRevealed("b"), makeRevealed("c")],
      },
    };
    const result = scryResolver(choice, stubCtx);
    expect(result).toEqual({
      kind: "command",
      move: "resolveScry",
      args: { destinations: [{ zone: "hand", cardIds: ["a", "b", "c"] }] },
    });
  });

  test("filters revealed cards by cardTypes before selecting", () => {
    const choice: ScryChoicePrompt = {
      type: "scry",
      chooserId: "p1",
      payload: {
        player: "p1",
        amount: 3,
        destinations: [
          { zone: "hand", min: 0, max: 2, reveal: false, target: { cardTypes: ["program"] } },
        ],
        revealedCardIds: ["a", "b", "c"],
        revealedCards: [
          makeRevealed("a", { type: "unit" }),
          makeRevealed("b", { type: "program" }),
          makeRevealed("c", { type: "program" }),
        ],
      },
    };
    expect(scryResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveScry",
      args: { destinations: [{ zone: "hand", cardIds: ["b", "c"] }] },
    });
  });

  test("filters by maxCost and classifications", () => {
    const choice: ScryChoicePrompt = {
      type: "scry",
      chooserId: "p1",
      payload: {
        player: "p1",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: false,
            target: { maxCost: 2, classifications: ["Netrunner"] },
          },
        ],
        revealedCardIds: ["a", "b", "c", "d"],
        revealedCards: [
          makeRevealed("a", { cost: 5, classifications: ["Netrunner"] }),
          makeRevealed("b", { cost: 1, classifications: ["Corpo"] }),
          makeRevealed("c", { cost: 2, classifications: ["Netrunner"] }),
          makeRevealed("d", { cost: 1, classifications: ["Netrunner"] }),
        ],
      },
    };
    expect(scryResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveScry",
      args: { destinations: [{ zone: "hand", cardIds: ["c"] }] },
    });
  });

  test("returns an empty selection when no revealed card matches the filter", () => {
    const choice: ScryChoicePrompt = {
      type: "scry",
      chooserId: "p1",
      payload: {
        player: "p1",
        amount: 2,
        destinations: [
          { zone: "hand", min: 0, max: 1, reveal: false, target: { cardTypes: ["legend"] } },
        ],
        revealedCardIds: ["a", "b"],
        revealedCards: [
          makeRevealed("a", { type: "unit" }),
          makeRevealed("b", { type: "program" }),
        ],
      },
    };
    expect(scryResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveScry",
      args: { destinations: [{ zone: "hand", cardIds: [] }] },
    });
  });

  test("filters by minCost / maxCost range", () => {
    const choice: ScryChoicePrompt = {
      type: "scry",
      chooserId: "p1",
      payload: {
        player: "p1",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 2,
            reveal: false,
            target: { minCost: 2, maxCost: 4 },
          },
        ],
        revealedCardIds: ["a", "b", "c", "d"],
        revealedCards: [
          { ...makeRevealed("a", { cost: 1 }) },
          { ...makeRevealed("b", { cost: 2 }) },
          { ...makeRevealed("c", { cost: 4 }) },
          { ...makeRevealed("d", { cost: 5 }) },
        ],
      },
    };
    expect(scryResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveScry",
      args: { destinations: [{ zone: "hand", cardIds: ["b", "c"] }] },
    });
  });

  test("filters by minPower / maxPower bounds", () => {
    const choice: ScryChoicePrompt = {
      type: "scry",
      chooserId: "p1",
      payload: {
        player: "p1",
        amount: 3,
        destinations: [{ zone: "hand", reveal: false, target: { minPower: 3, maxPower: 5 } }],
        revealedCardIds: ["a", "b", "c"],
        revealedCards: [
          { ...makeRevealed("a"), effectivePower: 2 },
          { ...makeRevealed("b"), effectivePower: 4 },
          { ...makeRevealed("c"), effectivePower: 6 },
        ],
      },
    };
    expect(scryResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveScry",
      args: { destinations: [{ zone: "hand", cardIds: ["b"] }] },
    });
  });
});

describe("revealDestinationResolver", () => {
  test("chooses trash when available", () => {
    const choice: RevealDestinationChoicePrompt = {
      type: "revealDestination",
      chooserId: "p2",
      payload: {
        player: "p1",
        destinations: ["hand", "trash"],
        revealedCardIds: ["a", "b"],
        revealedCards: [makeRevealed("a"), makeRevealed("b")],
        drawIfDestination: {
          destination: "trash",
          player: "p1",
          amount: 2,
        },
      },
    };

    expect(revealDestinationResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveRevealDestination",
      args: { destination: "trash" },
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

  test("discardFromHand picks the cheapest eligible hand card", () => {
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "discardFromHand",
        amount: 1,
        player: "p1",
        eligibleIds: ["h-2"],
      },
    };
    const result = chooseTargetResolver(choice, stubCtx);
    expect(result).toEqual({
      kind: "command",
      move: "resolveDiscardFromHand",
      args: { cardIds: ["h-2"] },
    });
  });

  test("effectTarget hand bindings pick the highest-cost card", () => {
    const hand = stubCtx.view.players.p1!.zones.hand;
    if (!Array.isArray(hand)) throw new Error("Expected p1 hand fixture");
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "effectTarget",
        targetKind: "card",
        eligibleIds: ["h-1", "h-2"],
        min: 1,
        max: 1,
        canDecline: false,
        cards: [hand[0]!, hand[1]!],
      },
    };

    expect(chooseTargetResolver(choice, stubCtx)).toEqual({
      kind: "command",
      move: "resolveEffectTarget",
      args: { targetIds: ["h-2"] },
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
        source: colorSource("red"),
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

  test("Yellow disrupts a rival Gig instead of widening Street Cred in the rival's favor", () => {
    const ctx = withGigs(
      [makeGig("friendly", "d6", 5)],
      [makeGig("rival-target", "d8", 4), makeGig("rival-other", "d6", 6)],
    );
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "either",
        maxAmount: 2,
        dieId: "rival-target",
        currentValue: 4,
        maxFaceValue: 8,
        dieOwnerId: "p2",
        source: colorSource("yellow"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toMatchObject({
      kind: "command",
      args: { value: 2 },
    });
  });

  test("rival disruption breaks aligned values when lowering Street Cred", () => {
    const ctx = withGigs(
      [makeGig("friendly", "d6", 3)],
      [makeGig("rival-target", "d8", 4), makeGig("rival-pair", "d6", 4)],
    );
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "either",
        maxAmount: 1,
        dieId: "rival-target",
        currentValue: 4,
        maxFaceValue: 8,
        dieOwnerId: "p2",
        source: colorSource("green"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toMatchObject({
      kind: "command",
      args: { value: 3 },
    });
  });

  test("adjustGig target selection chooses the rival Gig with the largest disruption", () => {
    const ctx = withGigs(
      [makeGig("friendly", "d6", 3)],
      [makeGig("small-rival", "d4", 2), makeGig("large-rival", "d8", 6)],
    );
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        eligibleIds: ["small-rival", "large-rival"],
        adjustGig: { direction: "either", maxAmount: 2, chooseUpTo: true },
        min: 0,
        max: 1,
        canDecline: true,
        source: colorSource("yellow"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toEqual({
      kind: "command",
      move: "resolveEffectTarget",
      args: { targetIds: ["large-rival"] },
    });
  });

  test("Blue decreases a friendly Gig to its minimum value", () => {
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "decrease",
        maxAmount: 5,
        dieId: "blue-target",
        currentValue: 4,
        maxFaceValue: 6,
        dieOwnerId: "p1",
        source: colorSource("blue"),
      },
    };

    expect(chooseTargetResolver(choice, stubCtx)).toMatchObject({
      kind: "command",
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

  test("Green adjusts a friendly Gig to align with another value", () => {
    const ctx = withGigs([makeGig("green-target", "d8", 2), makeGig("green-pair", "d6", 4)]);
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "either",
        maxAmount: 3,
        dieId: "green-target",
        currentValue: 2,
        maxFaceValue: 8,
        dieOwnerId: "p1",
        source: colorSource("green"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toMatchObject({
      kind: "command",
      args: { value: 4 },
    });
  });

  test("Yellow preserves distinct friendly values instead of forcing an adjustment", () => {
    const ctx = withGigs([makeGig("yellow-target", "d6", 3), makeGig("yellow-other", "d6", 4)]);
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "adjustGig",
        direction: "either",
        maxAmount: 1,
        dieId: "yellow-target",
        currentValue: 3,
        maxFaceValue: 6,
        dieOwnerId: "p1",
        source: colorSource("yellow"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toMatchObject({
      kind: "command",
      args: { value: 3 },
    });
  });

  test("color-aware adjustGig target selection chooses the Gig that improves the plan", () => {
    const ctx = withGigs([
      makeGig("already-distinct", "d6", 2),
      makeGig("duplicate", "d6", 3),
      makeGig("matching", "d8", 3),
    ]);
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        eligibleIds: ["already-distinct", "duplicate", "matching"],
        adjustGig: { direction: "either", maxAmount: 1, chooseUpTo: true },
        min: 0,
        max: 1,
        canDecline: true,
        source: colorSource("yellow"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toEqual({
      kind: "command",
      move: "resolveEffectTarget",
      args: { targetIds: ["duplicate"] },
    });
  });

  test("color-aware adjustGig target selection handles direct selectable effects", () => {
    const ctx = withGigs([
      makeGig("already-distinct", "d6", 2),
      makeGig("duplicate", "d6", 3),
      makeGig("matching", "d8", 3),
    ]);
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        eligibleIds: ["already-distinct", "duplicate", "matching"],
        effect: {
          effect: "adjustGig",
          target: { selector: "gig", controller: "friendly" },
          direction: "either",
          maxAmount: 1,
          chooseUpTo: true,
        },
        min: 0,
        max: 1,
        canDecline: true,
        source: colorSource("yellow"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toEqual({
      kind: "command",
      move: "resolveEffectTarget",
      args: { targetIds: ["duplicate"] },
    });
  });

  test("optional adjustGig selection declines when no color objective improves", () => {
    const ctx = withGigs([makeGig("min-blue", "d4", 1)]);
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        eligibleIds: ["min-blue"],
        adjustGig: { direction: "decrease", maxAmount: 2, chooseUpTo: true },
        min: 0,
        max: 1,
        canDecline: true,
        source: colorSource("blue"),
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toEqual({
      kind: "command",
      move: "resolveEffectTarget",
      args: { pass: true },
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

  test("chooseTarget picks a payable card for paid play-card bindings", () => {
    const choice: ChooseTargetChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "effectTarget",
        targetKind: "card",
        eligibleIds: ["expensive", "payable"],
        min: 1,
        max: 1,
        targetPurpose: "playCard",
        effectiveCostsByCardId: { expensive: 3, payable: 1 },
        cards: [
          { ...makeRevealed("expensive"), zone: "trash", cost: 3 },
          { ...makeRevealed("payable"), zone: "trash", cost: 1 },
        ],
      },
    };
    const ctx: DecisionContext = {
      ...stubCtx,
      view: {
        ...stubCtx.view,
        players: {
          ...stubCtx.view.players,
          p1: {
            ...stubCtx.view.players.p1!,
            eddies: 0,
            availableEddies: 1,
          },
        },
      },
    };

    expect(chooseTargetResolver(choice, ctx)).toEqual({
      kind: "command",
      move: "resolveEffectTarget",
      args: { targetIds: ["payable"] },
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
        "chooseCardType",
        "chooseEffect",
        "chooseGigsToSteal",
        "chooseTrigger",
        "chooseTarget",
        "gainGig",
        "revealDestination",
        "scry",
      ].sort(),
    );
  });
});
