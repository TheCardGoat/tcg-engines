import { cardinalOfDivineRite } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
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
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly cost?: number;
    readonly elements?: readonly GrandArchiveElement[];
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly subtypes?: readonly string[];
  } = {},
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
        cost:
          options.cost === undefined ? { kind: "none" } : { kind: "reserve", amount: options.cost },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 5 }
              : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("imbue-champion", "CHAMPION");
const normFuel = card("imbue-norm-fuel", "ACTION");
const fireFuel = card("imbue-fire-fuel", "ACTION", { elements: ["FIRE"] });
const advancedFuel = card("imbue-advanced-fuel", "ACTION", { elements: ["ARCANE"] });
const filler = card("imbue-filler", "ACTION");

const modalAction = card("imbue-modal-action", "ACTION", {
  cost: 3,
  subtypes: ["ANGEL"],
  abilities: [
    {
      id: "imbueModalAction-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Imbue 2",
      keyword: { name: "imbue", value: 2, elementRequirement: "source-elements" },
    },
    {
      id: "imbueModalAction-a2",
      kind: "card-resolution",
      text: "Choose one, or two if this is imbued.",
      effect: {
        kind: "select-modes",
        choose: {
          kind: "exactly",
          amount: {
            kind: "conditional",
            condition: { kind: "activation-state", state: "imbued" },
            then: 2,
            else: 1,
          },
        },
        modes: [
          { id: "first", text: "First.", effect: { kind: "no-op" } },
          { id: "second", text: "Second.", effect: { kind: "no-op" } },
          { id: "third", text: "Third.", effect: { kind: "no-op" } },
        ],
      },
    },
  ],
});

const variableAlly = card("imbue-variable-ally", "ALLY", {
  cost: 3,
  abilities: [
    {
      id: "imbueVariableAlly-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Imbue 3",
      keyword: { name: "imbue", value: 3, elementRequirement: "source-elements" },
    },
    {
      id: "imbueVariableAlly-a2",
      kind: "static",
      staticKind: "intrinsic",
      text: "Advanced Imbue X",
      variables: [{ symbol: "X", kind: "chosen", minimum: 0 }],
      keyword: {
        name: "imbue",
        value: { kind: "variable", symbol: "X" },
        elementRequirement: "advanced",
      },
    },
    {
      id: "imbueVariableAlly-a3",
      kind: "triggered",
      text: "On Enter: If this was imbued, put X buff counters on it.",
      trigger: {
        kind: "event",
        event: { name: "object-entered-field", subject: { kind: "source" } },
      },
      effect: {
        kind: "conditional",
        condition: { kind: "activation-state", state: "imbued" },
        then: {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: "buff",
          amount: { kind: "variable", symbol: "X" },
        },
      },
    },
  ],
});

const mixedThresholdAction = card("imbue-mixed-threshold-action", "ACTION", {
  cost: 2,
  abilities: [
    {
      id: "imbueMixedThresholdAction-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "Norm Imbue 2",
      keyword: { name: "imbue", value: 2, elementRequirement: { element: "NORM" } },
    },
    {
      id: "imbueMixedThresholdAction-a2",
      kind: "static",
      staticKind: "intrinsic",
      text: "Advanced Imbue 4",
      keyword: { name: "imbue", value: 4, elementRequirement: "advanced" },
    },
    {
      id: "imbueMixedThresholdAction-a3",
      kind: "card-resolution",
      text: "Resolve.",
      effect: { kind: "no-op" },
    },
  ],
});

function setup() {
  const cards = [
    champion,
    normFuel,
    fireFuel,
    advancedFuel,
    filler,
    modalAction,
    variableAlly,
    mixedThresholdAction,
    cardinalOfDivineRite,
  ];
  const program = createGrandArchiveMatchProgram(cards);
  const player = (id: string, withImbueCards: boolean): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: withImbueCards
      ? [
          { definitionId: modalAction.canonicalId, count: 1 },
          { definitionId: variableAlly.canonicalId, count: 1 },
          { definitionId: mixedThresholdAction.canonicalId, count: 1 },
          { definitionId: normFuel.canonicalId, count: 2 },
          { definitionId: fireFuel.canonicalId, count: 1 },
          { definitionId: advancedFuel.canonicalId, count: 2 },
          { definitionId: filler.canonicalId, count: 4 },
        ]
      : [
          { definitionId: filler.canonicalId, count: 9 },
          { definitionId: cardinalOfDivineRite.canonicalId, count: 1 },
        ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: 223,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1") };
}

function objectIds(
  state: ReturnType<typeof setup>["state"],
  playerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
) {
  return Object.values(state.objects)
    .filter((object) => object.ownerId === playerId && object.definitionId === definitionId)
    .map((object) => object.id);
}

function passUntilSettled(runtime: GrandArchiveMatchRuntime): void {
  for (let index = 0; index < 12 && runtime.state.stack.length > 0; index += 1) {
    if (runtime.state.decision)
      throw new Error(`Unexpected decision: ${runtime.state.decision.kind}`);
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Resolving Imbue test stack requires Opportunity");
    const result = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!result.ok) throw new Error(result.message);
  }
  if (runtime.state.stack.length > 0) throw new Error("Imbue test stack did not settle");
}

describe("Grand Archive Imbue", () => {
  it("uses the smallest threshold with any listed Imbue characteristic", () => {
    const fixture = setup();
    const sourceId = objectIds(fixture.state, fixture.p1, mixedThresholdAction.canonicalId)[0]!;
    const advancedIds = objectIds(fixture.state, fixture.p1, advancedFuel.canonicalId);
    const hand = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "hand" },
      ...advancedIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, hand);

    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: sourceId,
        reservePayment: advancedIds.map((cardId) => ({ kind: "card", cardId })),
        revealForImbue: true,
      },
      { playerId: fixture.p1 },
    );

    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.stack.at(-1)?.activationStates).toContain("imbued");
  });

  it("requires the reveal declaration and fixes Imbue before modal announcement", () => {
    const fixture = setup();
    const sourceId = objectIds(fixture.state, fixture.p1, modalAction.canonicalId)[0]!;
    const normIds = objectIds(fixture.state, fixture.p1, normFuel.canonicalId);
    const fireId = objectIds(fixture.state, fixture.p1, fireFuel.canonicalId)[0]!;
    const hand = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "hand" },
      ...[...normIds, fireId].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
      { type: "object-facing-changed", objectId: fireId, facing: "face-up" },
    ]).state;
    const payment = [...normIds, fireId].map((cardId) => ({ kind: "card" as const, cardId }));

    const undeclared = new GrandArchiveMatchRuntime(fixture.program, hand).execute(
      {
        move: "activate-card",
        cardId: sourceId,
        modeIds: ["first", "second"],
        reservePayment: payment,
      },
      { playerId: fixture.p1 },
    );
    expect(undeclared.ok).toBe(false);

    const runtime = new GrandArchiveMatchRuntime(fixture.program, hand);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: sourceId,
        modeIds: ["first", "second"],
        reservePayment: payment,
        revealForImbue: true,
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.stack.at(-1)?.activationStates).toContain("imbued");
    expect(
      activation.events
        .filter((event) => event.type === "card-revealed")
        .map((event) => event.objectId),
    ).toEqual([...normIds, fireId]);
    expect([...normIds, fireId].every((id) => runtime.state.objects[id]?.zone === "memory")).toBe(
      true,
    );
    expect(
      [...normIds, fireId].every((id) => runtime.state.objects[id]?.facing === "face-down"),
    ).toBe(true);
  });

  it("uses any qualifying Imbue characteristic and carries X into the resulting On Enter trigger", () => {
    const fixture = setup();
    const allyId = objectIds(fixture.state, fixture.p1, variableAlly.canonicalId)[0]!;
    const advancedIds = objectIds(fixture.state, fixture.p1, advancedFuel.canonicalId);
    const normId = objectIds(fixture.state, fixture.p1, normFuel.canonicalId)[0]!;
    const hand = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "hand" },
      ...[...advancedIds, normId].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, hand);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: allyId,
        reservePayment: [...advancedIds, normId].map((cardId) => ({ kind: "card", cardId })),
        revealForImbue: true,
        variables: { X: 2 },
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    passUntilSettled(runtime);
    expect(runtime.state.objects[allyId]?.zone).toBe("field");
    expect(runtime.state.objects[allyId]?.activationStates.has("imbued")).toBe(true);
    expect(runtime.state.objects[allyId]?.activationVariables).toEqual({ X: 2 });
    expect(runtime.state.objects[allyId]?.counters.buff).toBe(2);
  });

  it("enforces Cardinal of Divine Rite's prohibition on Angel cards becoming imbued", () => {
    const fixture = setup();
    const p2 = grandArchivePlayerId("p2");
    const sourceId = objectIds(fixture.state, fixture.p1, modalAction.canonicalId)[0]!;
    const normIds = objectIds(fixture.state, fixture.p1, normFuel.canonicalId);
    const fireId = objectIds(fixture.state, fixture.p1, fireFuel.canonicalId)[0]!;
    const cardinalId = objectIds(fixture.state, p2, cardinalOfDivineRite.canonicalId)[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "hand" },
      ...[...normIds, fireId].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
      { type: "object-moved", objectId: cardinalId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: sourceId,
        modeIds: ["first"],
        reservePayment: [...normIds, fireId].map((cardId) => ({ kind: "card", cardId })),
        revealForImbue: true,
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.stack.at(-1)?.activationStates).not.toContain("imbued");
    expect(runtime.state.objects[sourceId]?.activationStates.has("imbued")).toBe(false);
    expect(
      [...normIds, fireId].every(
        (objectId) =>
          runtime.state.objects[objectId]?.zone === "memory" &&
          runtime.state.objects[objectId]?.facing === "face-down",
      ),
    ).toBe(true);
  });
});
