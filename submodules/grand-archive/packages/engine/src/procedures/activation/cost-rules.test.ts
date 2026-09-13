import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
  GrandArchivePrintedCost,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import {
  collectExpiredGrandArchiveRuleModifications,
  collectGrandArchiveCostRules,
} from "../../rules/state/rule-modifications.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  cost: GrandArchivePrintedCost,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  supertypes: readonly GrandArchiveSupertype[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost,
        typeLine: {
          supertypes,
          types: [type],
          classes: ["MAGE"],
          subtypes: [],
        },
        elements: ["NORM"],
        speed: type === "ACTION" ? "fast" : undefined,
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 15 }
            : type === "ALLY"
              ? { power: 1, life: 1 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("cost-rules-champion", "CHAMPION", { kind: "none" });
const filler = card("cost-rules-filler", "ACTION", { kind: "none" });

function player(
  id: string,
  mainDeck: readonly { readonly definitionId: string; readonly count: number }[],
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck,
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function initialRuntime(
  cards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  p1Deck: readonly { readonly definitionId: string; readonly count: number }[],
) {
  const program = createGrandArchiveMatchProgram([champion, filler, ...cards]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        player("p1", p1Deck),
        player("p2", [{ definitionId: filler.canonicalId, count: 12 }]),
      ],
      firstPlayerId: "p1",
      randomSeed: 91,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, initial };
}

function objectId(
  state: ReturnType<typeof createGrandArchiveMatchInitialState>,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
  occurrence = 0,
) {
  return Object.values(state.objects).filter(
    (object) => object.ownerId === ownerId && object.definitionId === definitionId,
  )[occurrence]!.id;
}

describe("Grand Archive cost-modifying rules", () => {
  it("combines a restricted self discount, an external increase, and an additional cost", () => {
    const paymentCard = card("cost-rules-extra-payment", "ACTION", { kind: "none" });
    const discountedAction = card(
      "cost-rules-discounted-action",
      "ACTION",
      {
        kind: "reserve",
        amount: 5,
      },
      [
        {
          id: "costRulesDiscountedAction-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: { kind: "champion-matches-source", characteristic: "class" },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: { kind: "source" },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: { kind: "while-source-in-functional-zone" },
            },
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: { kind: "source" },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "hand",
                to: "banishment",
                count: { kind: "exactly", amount: 1 },
                filter: { kind: "name", value: paymentCard.canonicalId, match: "exact" },
              },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
    );
    const tax = card("cost-rules-tax", "ITEM", { kind: "none" }, [
      {
        id: "cost-rules-tax-a1",
        kind: "static",
        staticKind: "effects",
        text: "Action cards cost 1 more to activate.",
        effects: [
          {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            filter: { kind: "type", oneOf: ["ACTION"] },
            costKind: "reserve",
            costOperation: "add",
            amount: 1,
            duration: { kind: "while-source-on-field" },
          },
        ],
      },
    ]);
    const { program, initial } = initialRuntime(
      [paymentCard, discountedAction, tax],
      [
        { definitionId: discountedAction.canonicalId, count: 1 },
        { definitionId: paymentCard.canonicalId, count: 1 },
        { definitionId: tax.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 8 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const actionId = objectId(initial, p1, discountedAction.canonicalId);
    const extraId = objectId(initial, p1, paymentCard.canonicalId);
    const taxId = objectId(initial, p1, tax.canonicalId);
    const fillerIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: extraId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: taxId, from: "main-deck", to: "field" },
      ...fillerIds.slice(0, 4).map((id) => ({
        type: "object-moved" as const,
        objectId: id,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const beforeInvalid = runtime.state;
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          reservePayment: fillerIds.slice(0, 3).map((cardId) => ({ kind: "card", cardId })),
          costSelections: [[extraId]],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(runtime.state).toBe(beforeInvalid);

    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: actionId,
        reservePayment: fillerIds.slice(0, 4).map((cardId) => ({ kind: "card", cardId })),
        costSelections: [[extraId]],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.zones[p1].memory).toHaveLength(4);
    expect(runtime.state.objects[extraId]?.zone).toBe("banishment");
    expect(runtime.state.stack.at(-1)?.activationPayment).toHaveLength(5);
  });

  it("applies cost setters before simultaneous modifiers and clamps the payment at zero", () => {
    const freeAction = card(
      "cost-rules-set-and-floor",
      "ACTION",
      {
        kind: "reserve",
        amount: 7,
      },
      [
        {
          id: "costRulesSetAndFloor-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card's reserve cost becomes 2, then it costs 5 less and 1 more.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: { kind: "source" },
              costKind: "reserve",
              costOperation: "set",
              amount: 2,
              duration: { kind: "while-source-in-functional-zone" },
            },
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: { kind: "source" },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 5,
              duration: { kind: "while-source-in-functional-zone" },
            },
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: { kind: "source" },
              costKind: "reserve",
              costOperation: "add",
              amount: 1,
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
    );
    const { program, initial } = initialRuntime(
      [freeAction],
      [
        { definitionId: freeAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const actionId = objectId(initial, p1, freeAction.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.stack.at(-1)?.activationPayment).toEqual([]);
    expect(runtime.state.zones[p1].memory).toHaveLength(0);
  });

  it("allows a declared alternative payment to replace the reserve cost", () => {
    const stone = card("cost-rules-stone", "ITEM", { kind: "none" });
    const alternativeAction = card(
      "cost-rules-alternative-action",
      "ACTION",
      {
        kind: "reserve",
        amount: 3,
      },
      [
        {
          id: "costRulesAlternativeAction-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may rest two items you control rather than pay this card's reserve cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: { kind: "source" },
              costKind: "reserve",
              cost: {
                kind: "select-and-rest",
                player: "controller",
                count: { kind: "exactly", amount: 2 },
                filter: { kind: "type", oneOf: ["ITEM"] },
              },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
    );
    const { program, initial } = initialRuntime(
      [stone, alternativeAction],
      [
        { definitionId: alternativeAction.canonicalId, count: 1 },
        { definitionId: stone.canonicalId, count: 2 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const actionId = objectId(initial, p1, alternativeAction.canonicalId);
    const stoneIds = [
      objectId(initial, p1, stone.canonicalId),
      objectId(initial, p1, stone.canonicalId, 1),
    ];
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      ...stoneIds.map((id) => ({
        type: "object-moved" as const,
        objectId: id,
        from: "main-deck" as const,
        to: "field" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: actionId,
        costOptionIndex: 1,
        costSelections: [stoneIds],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(stoneIds.every((id) => runtime.state.objects[id]?.states.has("rested"))).toBe(true);
    expect(runtime.state.zones[p1].memory).toHaveLength(0);
  });

  it("applies static additional costs to activated abilities", () => {
    const ally = card("cost-rules-ability-ally", "ALLY", { kind: "reserve", amount: 1 }, [
      {
        id: "costRulesAbilityAlly-a1",
        kind: "activated",
        activation: "ability",
        text: "(1): Do nothing.",
        label: { name: "cardistry" },
        cost: { kind: "pay-reserve", amount: 1 },
        effect: { kind: "no-op" },
      },
    ]);
    const abilityTax = card("cost-rules-ability-tax", "ITEM", { kind: "none" }, [
      {
        id: "costRulesAbilityTax-a1",
        kind: "static",
        staticKind: "effects",
        text: "Activated abilities of allies you control cost (2) more to activate.",
        effects: [
          {
            kind: "rule-modification",
            mode: "add-cost",
            action: "activate",
            activationKind: "ability",
            abilityFilter: { keyword: "cardistry" },
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
            cost: { kind: "pay-reserve", amount: 2 },
            duration: { kind: "while-source-on-field" },
          },
        ],
      },
    ]);
    const { program, initial } = initialRuntime(
      [ally, abilityTax],
      [
        { definitionId: ally.canonicalId, count: 1 },
        { definitionId: abilityTax.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 6 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const allyId = objectId(initial, p1, ally.canonicalId);
    const taxId = objectId(initial, p1, abilityTax.canonicalId);
    const fillerIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: taxId, from: "main-deck", to: "field" },
      ...fillerIds.slice(0, 3).map((id) => ({
        type: "object-moved" as const,
        objectId: id,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const result = runtime.execute(
      {
        move: "activate-ability",
        sourceId: allyId,
        abilityId: "costRulesAbilityAlly-a1",
        reservePayment: fillerIds.slice(0, 3).map((cardId) => ({ kind: "card", cardId })),
      },
      { playerId: p1 },
    );
    if (!result.ok) throw new Error(result.message);
    expect(runtime.state.zones[p1].memory).toHaveLength(3);
    expect(runtime.state.stack.at(-1)?.activationPayment).toHaveLength(3);
  });

  it("applies self cost modifiers while naturally materializing from the material deck", () => {
    const regalia = card(
      "cost-rules-material-regalia",
      "ITEM",
      {
        kind: "memory",
        amount: 3,
      },
      [
        {
          id: "costRulesMaterialRegalia-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to materialize.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: { kind: "source" },
              costKind: "memory",
              costOperation: "subtract",
              amount: 2,
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
      ["REGALIA"],
    );
    const program = createGrandArchiveMatchProgram([champion, filler, regalia]);
    const setup = (id: string, includeRegalia: boolean): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: filler.canonicalId, count: 8 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        ...(includeRegalia ? [{ definitionId: regalia.canonicalId, count: 1 }] : []),
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [setup("p1", true), setup("p2", false)],
        firstPlayerId: "p1",
        randomSeed: 92,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const regaliaId = objectId(initial, p1, regalia.canonicalId);
    const memoryCardId = objectId(initial, p1, filler.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: memoryCardId, from: "main-deck", to: "memory" },
      { type: "opportunity-closed" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const materialization = runtime.execute(
      { move: "materialize", cardId: regaliaId },
      { playerId: p1 },
    );
    if (!materialization.ok) throw new Error(materialization.message);
    expect(runtime.state.objects[memoryCardId]?.zone).toBe("banishment");
    expect(runtime.state.stack.at(-1)?.activationPayment).toEqual([
      { objectId: memoryCardId, from: "memory", to: "banishment" },
    ]);
  });

  it("consumes a resolved next-event modifier only on the next matching activation", () => {
    const source = card("cost-rules-next-source", "ITEM", { kind: "none" }, [
      {
        id: "costRulesNextSource-a1",
        kind: "activated",
        activation: "ability",
        text: "Banish this object: Your next Action costs 2 less this turn.",
        cost: { kind: "banish-self" },
        effect: {
          kind: "rule-modification",
          mode: "modify-cost",
          action: "activate",
          subject: { kind: "player", player: "controller" },
          filter: { kind: "type", oneOf: ["ACTION"] },
          costKind: "reserve",
          costOperation: "subtract",
          amount: 2,
          duration: {
            kind: "for-next-event",
            event: "card-activated",
            expires: { kind: "this-turn" },
          },
        },
      },
    ]);
    const nonmatchingAlly = card("cost-rules-next-ally", "ALLY", {
      kind: "reserve",
      amount: 1,
    });
    const matchingAction = card("cost-rules-next-action", "ACTION", {
      kind: "reserve",
      amount: 3,
    });
    const { program, initial } = initialRuntime(
      [source, nonmatchingAlly, matchingAction],
      [
        { definitionId: source.canonicalId, count: 1 },
        { definitionId: nonmatchingAlly.canonicalId, count: 1 },
        { definitionId: matchingAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = objectId(initial, p1, source.canonicalId);
    const allyId = objectId(initial, p1, nonmatchingAlly.canonicalId);
    const actionId = objectId(initial, p1, matchingAction.canonicalId);
    const fillerIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      ...fillerIds.slice(0, 2).map((id) => ({
        type: "object-moved" as const,
        objectId: id,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "costRulesNextSource-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.ruleModifications).toHaveLength(1);

    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: allyId,
          reservePayment: [{ kind: "card", cardId: fillerIds[0]! }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.ruleModifications).toHaveLength(1);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: actionId,
        reservePayment: [{ kind: "card", cardId: fillerIds[1]! }],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.ruleModifications).toHaveLength(0);
    expect(runtime.state.stack.at(-1)?.activationPayment).toEqual([
      { objectId: fillerIds[1], from: "hand", to: "memory" },
    ]);
  });

  it("keeps next-turn rules pending and resolves their captured event bindings", () => {
    const action = card("cost-rules-bound-next-turn", "ACTION", {
      kind: "reserve",
      amount: 1,
    });
    const { program, initial } = initialRuntime(
      [action],
      [
        { definitionId: action.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const actionId = objectId(initial, p1, action.canonicalId);
    const championId = initial.zones[p1].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const withCard = kernel.transact(initial, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
    ]).state;
    const pending = kernel.transact(withCard, [
      {
        type: "rule-modification-created",
        modification: {
          id: "rule-modification-bound-next-turn",
          controllerId: p2,
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: { kind: "player", player: "event-recipient-controller" },
            costKind: "reserve",
            costOperation: "add",
            amount: 2,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              starts: { kind: "next-turn", whose: "event-recipient-controller" },
            },
          },
          bindings: { eventRecipient: [championId] },
          variables: {},
          durationAnchors: { startsPlayerIds: [p1] },
          createdAtVersion: withCard.stateVersion,
          createdTurnNumber: withCard.turn.number,
          createdPhase: withCard.turn.phase,
        },
      },
    ]).state;
    const rules = (state: typeof pending) =>
      collectGrandArchiveCostRules({
        action: "activate",
        activationKind: "card",
        playerId: p1,
        candidateId: actionId,
        fromZone: "hand",
        evaluation: {
          program,
          state,
          controllerId: p1,
          sourceId: actionId,
          candidateId: actionId,
          bindings: {},
        },
      });
    expect(rules(pending)).toHaveLength(0);
    expect(collectExpiredGrandArchiveRuleModifications(program, pending)).toEqual([]);

    const started = kernel.transact(pending, [
      { type: "turn-started", playerId: p1, turnNumber: pending.turn.number + 1 },
    ]).state;
    expect(rules(started).map((rule) => rule.effect.amount)).toEqual([2]);
  });
});
