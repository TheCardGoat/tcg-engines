import { manaLimiter } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { payGrandArchiveAbilityCost } from "./costs.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("payment-method-champion", "CHAMPION");
const filler = card("payment-method-filler", "ACTION");
const reservableChampion = card("payment-order-reservable-champion", "CHAMPION", [
  {
    id: "paymentOrderReservableChampion-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Reservable",
    keyword: { name: "reservable" },
  },
]);

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: manaLimiter.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 4 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive payment-method restrictions", () => {
  it("prevents Mana Limiter's controller from spending champion enlighten counters", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, manaLimiter]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 6001,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const championId = initial.zones[p1].field[0]!;
    const limiterId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === manaLimiter.canonicalId,
    )?.id;
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    )?.id;
    if (!limiterId || !sourceId) throw new Error("Payment-method fixture is incomplete");
    const kernel = new GrandArchiveTransactionKernel();
    const restricted = kernel.transact(initial, [
      { type: "object-moved", objectId: limiterId, from: "main-deck", to: "field" },
      { type: "counter-changed", objectId: championId, counter: "enlighten", delta: 2 },
      { type: "counter-changed", objectId: championId, counter: "preparation", delta: 1 },
    ]).state;
    const evaluation = {
      program,
      state: restricted,
      controllerId: p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: {},
    };

    expect(() =>
      payGrandArchiveAbilityCost(
        {
          kind: "remove-counter",
          subject: { kind: "champion", player: "controller" },
          counter: "enlighten",
          amount: 1,
        },
        {},
        evaluation,
      ),
    ).toThrow("Counter removal is forbidden as a cost payment method");

    expect(
      payGrandArchiveAbilityCost(
        {
          kind: "remove-counter",
          subject: { kind: "champion", player: "controller" },
          counter: "preparation",
          amount: 1,
        },
        {},
        evaluation,
      ).events,
    ).toEqual([
      expect.objectContaining({
        type: "counter-changed",
        objectId: championId,
        counter: "preparation",
        delta: -1,
      }),
    ]);

    const unrestricted = kernel.transact(restricted, [
      { type: "object-moved", objectId: limiterId, from: "field", to: "banishment" },
    ]).state;
    expect(
      payGrandArchiveAbilityCost(
        {
          kind: "remove-counter",
          subject: { kind: "champion", player: "controller" },
          counter: "enlighten",
          amount: 1,
        },
        {},
        { ...evaluation, state: unrestricted },
      ).events,
    ).toEqual([
      expect.objectContaining({
        type: "counter-changed",
        objectId: championId,
        counter: "enlighten",
        delta: -1,
      }),
    ]);
  });

  it("pays nested compound costs in each explicitly declared order", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, manaLimiter]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 6002,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const championId = initial.zones[p1].field[0]!;
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    )!.id;
    const evaluation = {
      program,
      state: initial,
      controllerId: p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: {},
    };
    const cost = {
      kind: "all" as const,
      costs: [
        {
          kind: "rest" as const,
          subject: { kind: "champion" as const, player: "controller" as const },
        },
        {
          kind: "all" as const,
          costs: [
            {
              kind: "add-counter" as const,
              subject: { kind: "champion" as const, player: "controller" as const },
              counter: "preparation" as const,
              amount: 1,
            },
            {
              kind: "add-counter" as const,
              subject: { kind: "champion" as const, player: "controller" as const },
              counter: "enlighten" as const,
              amount: 1,
            },
          ] as const,
        },
      ] as const,
    };

    const payment = payGrandArchiveAbilityCost(
      cost,
      {
        costPaymentOrders: [
          { path: [], order: [1, 0] },
          { path: [1], order: [1, 0] },
        ],
      },
      evaluation,
    );

    expect(payment.events).toEqual([
      expect.objectContaining({
        type: "counter-changed",
        objectId: championId,
        counter: "enlighten",
      }),
      expect.objectContaining({
        type: "counter-changed",
        objectId: championId,
        counter: "preparation",
      }),
      expect.objectContaining({
        type: "object-state-changed",
        objectId: championId,
        state: "rested",
      }),
    ]);
  });

  it("validates each ordered cost component against the preceding payment state", () => {
    const program = createGrandArchiveMatchProgram([reservableChampion, filler]);
    const setup = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: filler.canonicalId, count: 4 }],
      materialDeck: [{ definitionId: reservableChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: reservableChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [setup("p1"), setup("p2")],
        firstPlayerId: "p1",
        randomSeed: 6004,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const championId = initial.zones[p1].field[0]!;
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    )!.id;
    const evaluation = {
      program,
      state: initial,
      controllerId: p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: {},
    };
    const cost = {
      kind: "all" as const,
      costs: [
        { kind: "pay-reserve" as const, amount: 1 },
        {
          kind: "sacrifice" as const,
          subject: { kind: "champion" as const, player: "controller" as const },
        },
      ] as const,
    };
    const reservePayment = [{ kind: "reservable" as const, objectId: championId }];

    expect(
      payGrandArchiveAbilityCost(
        cost,
        { reservePayment, costPaymentOrders: [{ path: [], order: [0, 1] }] },
        evaluation,
      ).events,
    ).toEqual([
      expect.objectContaining({
        type: "object-state-changed",
        objectId: championId,
        state: "rested",
        value: true,
      }),
      expect.objectContaining({
        type: "object-moved",
        objectId: championId,
        from: "field",
        to: "graveyard",
      }),
    ]);
    expect(initial.objects[championId]).toMatchObject({ zone: "field" });
    expect(initial.objects[championId]?.states.has("rested")).toBe(false);

    expect(() =>
      payGrandArchiveAbilityCost(
        cost,
        { reservePayment, costPaymentOrders: [{ path: [], order: [1, 0] }] },
        evaluation,
      ),
    ).toThrow("Reservable payment sources must be ready field objects");
  });

  it("rejects partial, duplicate, and non-payable cost order declarations", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, manaLimiter]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 6003,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    )!.id;
    const evaluation = {
      program,
      state: initial,
      controllerId: p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: {},
    };
    const cost = {
      kind: "all" as const,
      costs: [
        { kind: "pay-reserve" as const, amount: 0 },
        { kind: "pay-memory" as const, amount: 0 },
      ] as const,
    };

    expect(() =>
      payGrandArchiveAbilityCost(
        cost,
        { costPaymentOrders: [{ path: [], order: [1] }] },
        evaluation,
      ),
    ).toThrow("exact permutation");
    expect(() =>
      payGrandArchiveAbilityCost(
        cost,
        {
          costPaymentOrders: [
            { path: [], order: [0, 1] },
            { path: [], order: [1, 0] },
          ],
        },
        evaluation,
      ),
    ).toThrow("duplicated");
    expect(() =>
      payGrandArchiveAbilityCost(
        cost,
        { costPaymentOrders: [{ path: [0], order: [] }] },
        evaluation,
      ),
    ).toThrow("does not address a payable compound cost");
  });
});
