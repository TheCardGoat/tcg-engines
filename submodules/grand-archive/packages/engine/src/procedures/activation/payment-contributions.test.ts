import {
  eightOfHearts,
  evaporationSynchron,
  fastCure,
  orchestratedSeizure,
  piccardaNightRider,
  veltechPresidentialCard,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePrintedCost,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { applyGrandArchivePaymentContributions } from "./payment-contributions.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import { collectGrandArchivePaymentContributionRules } from "../../rules/state/rule-modifications.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  cost: GrandArchivePrintedCost,
  options: {
    readonly elements?: readonly GrandArchiveElement[];
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly supertypes?: readonly import("@tcg/grand-archive-types").GrandArchiveSupertype[];
    readonly subtypes?: readonly string[];
  } = {},
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
          supertypes: options.supertypes ?? [],
          types: [type],
          classes: ["MAGE"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 2 }
              : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card(
  "contribution-champion",
  "CHAMPION",
  { kind: "memory", amount: 0 },
  {
    elements: ["FIRE", "ARCANE"],
  },
);
const filler = card("contribution-filler", "ACTION", { kind: "reserve", amount: 0 });
const suitedAlly = card(
  "contribution-suited-ally",
  "ALLY",
  { kind: "reserve", amount: 4 },
  {
    subtypes: ["SUITED"],
  },
);
const veltechMaterial = card(
  "contribution-veltech-material",
  "ITEM",
  { kind: "memory", amount: 3 },
  { supertypes: ["REGALIA"], subtypes: ["VELTECH"] },
);
const memoryAbilityItem = card(
  "contribution-memory-ability-item",
  "ITEM",
  { kind: "reserve", amount: 0 },
  {
    abilities: [
      {
        id: "contributionMemoryAbility-a1",
        kind: "activated",
        text: "(MEMORY 2): Test a memory-cost contribution.",
        activation: "ability",
        cost: { kind: "pay-memory", amount: 2 },
        effect: { kind: "no-op" },
      },
    ],
  },
);

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: eightOfHearts.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: piccardaNightRider.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: suitedAlly.canonicalId, count: id === "p1" ? 2 : 0 },
      { definitionId: filler.canonicalId, count: 12 },
      { definitionId: orchestratedSeizure.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: fastCure.canonicalId, count: id === "p2" ? 1 : 0 },
      { definitionId: memoryAbilityItem.canonicalId, count: id === "p1" ? 1 : 0 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: veltechPresidentialCard.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: veltechMaterial.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: evaporationSynchron.canonicalId, count: id === "p1" ? 1 : 0 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function fixture(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly initial: ReturnType<typeof createGrandArchiveMatchInitialState>;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    suitedAlly,
    veltechMaterial,
    memoryAbilityItem,
    fastCure,
    orchestratedSeizure,
    evaporationSynchron,
    eightOfHearts,
    piccardaNightRider,
    veltechPresidentialCard,
  ]);
  return {
    program,
    initial: createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 7101,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    ),
  };
}

function ownedIds(
  state: ReturnType<typeof createGrandArchiveMatchInitialState>,
  definitionId: string,
): readonly import("../../game/identity.ts").GrandArchiveObjectId[] {
  const p1 = grandArchivePlayerId("p1");
  return Object.values(state.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === definitionId)
    .map((object) => object.id);
}

describe("Grand Archive payment contributions", () => {
  it("sacrifices catalog-eligible allies before paying Eight of Hearts' remaining reserve cost", () => {
    const { program, initial } = fixture();
    const p1 = grandArchivePlayerId("p1");
    const sourceId = ownedIds(initial, eightOfHearts.canonicalId)[0]!;
    const sacrificeIds = ownedIds(initial, suitedAlly.canonicalId);
    const reserveIds = ownedIds(initial, filler.canonicalId).slice(0, 2);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "hand" },
      ...sacrificeIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
      ...reserveIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: sourceId,
        reservePayment: reserveIds.map((cardId) => ({ kind: "card", cardId })),
        paymentContributions: [
          {
            ruleId: `static:${sourceId}:YGz8gN8M69-a1:0`,
            costSelections: [sacrificeIds],
          },
        ],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);

    expect(sacrificeIds.map((id) => runtime.state.objects[id]?.zone)).toEqual([
      "graveyard",
      "graveyard",
    ]);
    expect(reserveIds.map((id) => runtime.state.objects[id]?.zone)).toEqual(["memory", "memory"]);
    expect(runtime.state.stack.at(-1)?.activationPayment).toHaveLength(4);
  });

  it("counts repeated object ids as individual counters for Piccarda's reserve contribution", () => {
    const { program, initial } = fixture();
    const p1 = grandArchivePlayerId("p1");
    const sourceId = ownedIds(initial, piccardaNightRider.canonicalId)[0]!;
    const championId = initial.zones[p1].field[0]!;
    const reserveIds = ownedIds(initial, filler.canonicalId).slice(0, 3);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "hand" },
      ...reserveIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
      { type: "counter-changed", objectId: championId, counter: "static", delta: 4 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: sourceId,
        reservePayment: reserveIds.map((cardId) => ({ kind: "card", cardId })),
        paymentContributions: [
          {
            ruleId: `static:${sourceId}:ooGvrzxTmr-a1:0`,
            costSelections: [[championId, championId, championId, championId]],
          },
        ],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);

    expect(runtime.state.objects[championId]?.counters.static).toBe(0);
    expect(runtime.state.zones[p1].memory).toEqual(expect.arrayContaining(reserveIds));
  });

  it("banishes VelTech Presidential Card before randomly paying the remaining memory cost", () => {
    const { program, initial } = fixture();
    const p1 = grandArchivePlayerId("p1");
    const sourceId = ownedIds(initial, veltechPresidentialCard.canonicalId)[0]!;
    const targetId = ownedIds(initial, veltechMaterial.canonicalId)[0]!;
    const memoryIds = ownedIds(initial, filler.canonicalId).slice(0, 2);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      ...memoryIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
      { type: "opportunity-closed" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const materialization = runtime.execute(
      {
        move: "materialize",
        cardId: targetId,
        paymentContributions: [{ ruleId: `static:${sourceId}:S84TY03uxj-a3:0` }],
      },
      { playerId: p1 },
    );
    if (!materialization.ok) throw new Error(materialization.message);

    expect(runtime.state.objects[sourceId]?.zone).toBe("banishment");
    expect(memoryIds.map((id) => runtime.state.objects[id]?.zone)).toEqual([
      "banishment",
      "banishment",
    ]);
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(targetId);
    expect(runtime.state.stack.at(-1)?.activationPayment).toHaveLength(3);
  });

  it("uses an opponent's catalog Floating Memory card through Orchestrated Seizure", () => {
    const { program, initial } = fixture();
    const p1 = grandArchivePlayerId("p1");
    const sourceId = ownedIds(initial, orchestratedSeizure.canonicalId)[0]!;
    const paymentId = Object.values(initial.objects).find(
      (object) => object.definitionId === fastCure.canonicalId,
    )?.id;
    if (!paymentId) throw new Error("Orchestrated Seizure fixture is incomplete");
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "graveyard" },
    ]).state;
    if (orchestratedSeizure.layout.kind !== "single-faced") {
      throw new Error("Orchestrated Seizure must be single-faced");
    }
    const ability = orchestratedSeizure.layout.face.abilities.find(
      (candidate) => candidate.id === "pwscn0esog-a2",
    );
    if (ability?.kind !== "card-resolution" || ability.effect.kind !== "rule-modification") {
      throw new Error("Orchestrated Seizure contribution ability is missing");
    }
    const evaluation = {
      program,
      state: prepared,
      controllerId: p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: {},
    };

    const payment = applyGrandArchivePaymentContributions(
      { kind: "pay-memory", amount: 3 },
      [
        {
          id: "instance:orchestrated-seizure-test",
          effect: ability.effect,
          evaluation,
          timestamp: 1,
          order: 0,
        },
      ],
      [
        {
          ruleId: "instance:orchestrated-seizure-test",
          paymentSourceIds: [paymentId],
        },
      ],
      evaluation,
      {},
    );

    expect(payment.cost).toEqual({ kind: "pay-memory", amount: 2 });
    expect(payment.events).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: paymentId,
        from: "graveyard",
        to: "banishment",
      }),
    ]);
  });

  it("removes Evaporation Synchron counters to pay an activated ability's memory cost", () => {
    const { program, initial } = fixture();
    const p1 = grandArchivePlayerId("p1");
    const synchronId = ownedIds(initial, evaporationSynchron.canonicalId)[0]!;
    const abilitySourceId = ownedIds(initial, memoryAbilityItem.canonicalId)[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: synchronId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: abilitySourceId, from: "main-deck", to: "field" },
      { type: "counter-changed", objectId: synchronId, counter: "named:refinement", delta: 2 },
    ]).state;
    const collected = collectGrandArchivePaymentContributionRules({
      action: "pay-cost",
      activationKind: "ability",
      playerId: p1,
      candidateId: abilitySourceId,
      fromZone: "field",
      abilityIdentity: {},
      evaluation: {
        program,
        state: prepared,
        controllerId: p1,
        sourceId: abilitySourceId,
        abilityBearerId: abilitySourceId,
        bindings: {},
      },
    });
    expect(
      collected.find((rule) => rule.id === `static:${synchronId}:rAiEX6Ra4p-a2:0`)?.evaluation
        .sourceId,
    ).toBe(synchronId);
    expect(prepared.objects[synchronId]?.counters["named:refinement"]).toBe(2);
    expect(
      applyGrandArchivePaymentContributions(
        { kind: "pay-memory", amount: 2 },
        collected,
        [
          {
            ruleId: `static:${synchronId}:rAiEX6Ra4p-a2:0`,
            costSelections: [[synchronId, synchronId]],
          },
        ],
        {
          program,
          state: prepared,
          controllerId: p1,
          sourceId: abilitySourceId,
          abilityBearerId: abilitySourceId,
          bindings: {},
        },
        {},
      ).contributed.memory,
    ).toBe(2);
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const activation = runtime.execute(
      {
        move: "activate-ability",
        sourceId: abilitySourceId,
        abilityId: "contributionMemoryAbility-a1",
        paymentContributions: [
          {
            ruleId: `static:${synchronId}:rAiEX6Ra4p-a2:0`,
            costSelections: [[synchronId, synchronId]],
          },
        ],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);

    expect(runtime.state.objects[synchronId]?.counters["named:refinement"]).toBe(0);
    expect(runtime.state.zones[p1].memory).toHaveLength(0);
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(abilitySourceId);
  });
});
