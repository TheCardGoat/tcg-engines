import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveTargetDeclaration,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "../../rules/state/state-based.ts";
import { evaluateGrandArchiveAmount } from "./evaluation.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  options: { readonly speed?: "fast" | "slow" } = {},
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: options.speed ?? ("slow" as const) } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("stack-target-champion", "CHAMPION", [
  {
    id: "stackTargetChampion-a1",
    kind: "activated",
    activation: "ability",
    text: "Reserve 0: Deal 1 damage to this champion.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: {
      kind: "deal-damage",
      source: { kind: "source" },
      recipient: { kind: "source" },
      amount: 1,
    },
  },
]);
const filler = card("stack-target-filler", "ACTION");
const ally = card("stack-target-ally", "ALLY");

const championTarget: GrandArchiveTargetDeclaration = {
  id: "target-champion",
  kind: "target",
  declared: "announcement",
  chooser: "controller",
  count: { kind: "exactly", amount: 1 },
  unique: true,
  candidates: {
    kind: "object",
    zones: ["field"],
    player: "opponent",
    relationship: "controlled-by",
    filter: { kind: "type", oneOf: ["CHAMPION"] },
  },
};

const targetedAction = card("stack-target-action", "ACTION", [
  {
    id: "stackTargetAction-a1",
    kind: "card-resolution",
    text: "Target opposing champion.",
    targets: [championTarget],
    effect: { kind: "no-op" },
  },
]);

const multiTargetAction = card("stack-target-multiple", "ACTION", [
  {
    id: "stackTargetMultiple-a1",
    kind: "card-resolution",
    text: "Deal 1 damage to two target opposing allies.",
    targets: [
      {
        id: "target-allies",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 2 },
        unique: true,
        candidates: {
          kind: "object",
          zones: ["field"],
          player: "opponent",
          relationship: "controlled-by",
          filter: { kind: "type", oneOf: ["ALLY"] },
        },
      },
    ],
    effect: {
      kind: "deal-damage",
      source: { kind: "source" },
      recipient: { kind: "bound", binding: "target-allies" },
      amount: 1,
    },
  },
]);

const stackTarget: GrandArchiveTargetDeclaration = {
  id: "target-stack-item",
  kind: "target",
  declared: "announcement",
  chooser: "controller",
  count: { kind: "exactly", amount: 1 },
  unique: true,
  candidates: {
    kind: "stack-item",
    anyOf: [
      {
        itemTypes: ["card-activation"],
        sourceFilter: { kind: "type", oneOf: ["ACTION"] },
      },
      { itemTypes: ["ability"], abilityKinds: ["triggered"] },
    ],
    controller: "opponent",
    activationFrom: ["hand"],
    targeting: {
      player: "controller",
      filter: { kind: "type", oneOf: ["CHAMPION"] },
    },
  },
};

const counterAction = card(
  "stack-target-counter",
  "ACTION",
  [
    {
      id: "stackTargetCounter-a1",
      kind: "card-resolution",
      text: "Target an opposing action activation targeting your champion.",
      targets: [stackTarget],
      effect: {
        kind: "negate",
        subject: { kind: "bound", binding: "target-stack-item" },
        bindResultAs: "negated-stack-item",
      },
    },
  ],
  { speed: "fast" },
);

const abilityCounter = card(
  "stack-target-ability-counter",
  "ACTION",
  [
    {
      id: "stackTargetAbilityCounter-a1",
      kind: "card-resolution",
      text: "Negate target activated ability.",
      targets: [
        {
          id: "target-ability",
          kind: "target",
          declared: "announcement",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          unique: true,
          candidates: {
            kind: "stack-item",
            itemTypes: ["ability"],
            abilityKinds: ["activated"],
            controller: "opponent",
          },
        },
      ],
      effect: {
        kind: "negate",
        subject: { kind: "bound", binding: "target-ability" },
      },
    },
  ],
  { speed: "fast" },
);

const sourceBanishAction = card(
  "stack-target-source-banish",
  "ACTION",
  [
    {
      id: "stackTargetSourceBanish-a1",
      kind: "card-resolution",
      text: "Banish target opposing action card from the Effects Stack.",
      targets: [
        {
          id: "target-source-card",
          kind: "target",
          declared: "announcement",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          unique: true,
          candidates: {
            kind: "stack-item",
            itemTypes: ["card-activation"],
            controller: "opponent",
            sourceFilter: { kind: "type", oneOf: ["ACTION"] },
          },
        },
      ],
      effect: {
        kind: "banish-object",
        subject: { kind: "stack-source", binding: "target-source-card" },
      },
    },
  ],
  { speed: "fast" },
);

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly targetActionId: GrandArchiveObjectId;
  readonly counterActionId: GrandArchiveObjectId;
  readonly abilityCounterId: GrandArchiveObjectId;
  readonly sourceBanishActionId: GrandArchiveObjectId;
  readonly multiTargetActionId: GrandArchiveObjectId;
  readonly p2AllyIds: readonly [GrandArchiveObjectId, GrandArchiveObjectId];
  readonly p1ChampionId: GrandArchiveObjectId;
  readonly p2ChampionId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    targetedAction,
    counterAction,
    abilityCounter,
    sourceBanishAction,
    multiTargetAction,
    ally,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: targetedAction.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: counterAction.canonicalId, count: id === "p2" ? 1 : 0 },
      { definitionId: abilityCounter.canonicalId, count: id === "p2" ? 1 : 0 },
      { definitionId: sourceBanishAction.canonicalId, count: id === "p2" ? 1 : 0 },
      { definitionId: multiTargetAction.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: ally.canonicalId, count: id === "p2" ? 2 : 0 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 614,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const targetAction = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === targetedAction.canonicalId,
  )!;
  const counter = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === counterAction.canonicalId,
  )!;
  const abilityCounterObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === abilityCounter.canonicalId,
  )!;
  const sourceBanish = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === sourceBanishAction.canonicalId,
  )!;
  const multiTarget = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === multiTargetAction.canonicalId,
  )!;
  const p2Allies = Object.values(initial.objects).filter(
    (object) => object.ownerId === p2 && object.definitionId === ally.canonicalId,
  );
  if (!p2Allies[0] || !p2Allies[1]) throw new Error("Missing target allies");
  const p1Champion = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p1 &&
      object.definitionId === champion.canonicalId &&
      object.zone === "field",
  )!;
  const p2Champion = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p2 &&
      object.definitionId === champion.canonicalId &&
      object.zone === "field",
  )!;
  const handEvents = [targetAction, counter, abilityCounterObject, sourceBanish, multiTarget]
    .filter((object) => object.zone !== "hand")
    .map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: object.zone,
      to: "hand" as const,
    }));
  const state = new GrandArchiveTransactionKernel().transact(initial, [
    ...handEvents,
    ...p2Allies.map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: object.zone,
      to: "field" as const,
    })),
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, state),
    targetActionId: targetAction.id,
    counterActionId: counter.id,
    abilityCounterId: abilityCounterObject.id,
    sourceBanishActionId: sourceBanish.id,
    multiTargetActionId: multiTarget.id,
    p2AllyIds: [p2Allies[0].id, p2Allies[1].id],
    p1ChampionId: p1Champion.id,
    p2ChampionId: p2Champion.id,
  };
}

describe("Grand Archive Effects Stack targeting", () => {
  it("counts the targets declared by a bound event stack item", () => {
    const { runtime, multiTargetActionId, p1ChampionId, p2AllyIds } = setup();
    const p1 = grandArchivePlayerId("p1");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: multiTargetActionId,
          targets: { "target-allies": p2AllyIds },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const stackItemId = runtime.state.stack.at(-1)!.id;
    expect(
      evaluateGrandArchiveAmount(
        { kind: "target-count", ability: "event-stack-item" },
        {
          program: runtime.program,
          state: runtime.state,
          controllerId: p1,
          sourceId: p1ChampionId,
          abilityBearerId: p1ChampionId,
          bindings: { eventStackItem: [stackItemId] },
        },
      ),
    ).toBe(2);
  });

  it("accepts a stack identity only when every classification and targeting predicate matches", () => {
    const { runtime, targetActionId, counterActionId, p2ChampionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: targetActionId,
          targets: { "target-champion": [p2ChampionId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const targetedStackItemId = runtime.state.stack[0]!.id;
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const activated = runtime.execute(
      {
        move: "activate-card",
        cardId: counterActionId,
        targets: { "target-stack-item": [targetedStackItemId] },
      },
      { playerId: p2 },
    );
    expect(activated.ok).toBe(true);
    expect(runtime.state.stack.at(-1)?.targets).toEqual([
      {
        binding: "target-stack-item",
        targetIds: [targetedStackItemId],
        targetObjectIncarnations: {},
        required: true,
      },
    ]);
    for (let pass = 0; pass < 4 && runtime.state.stack.length > 0; pass += 1) {
      const holder = runtime.state.opportunity?.holderId;
      if (!holder) throw new Error("Negation resolution requires an Opportunity holder");
      expect(runtime.execute({ move: "pass" }, { playerId: holder }).ok).toBe(true);
    }
    expect(runtime.state.stack).toEqual([]);
    expect(runtime.state.objects[targetActionId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[counterActionId]?.zone).toBe("graveyard");
    expect(runtime.state.eventHistory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-negated",
          item: expect.objectContaining({ id: targetedStackItemId, negated: true }),
        }),
      ]),
    );
  });

  it("fizzles when any selected target in a required quantified declaration becomes illegal", () => {
    const { program, runtime, multiTargetActionId, p2AllyIds } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: multiTargetActionId,
          targets: { "target-allies": p2AllyIds },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const departed = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "object-moved",
        objectId: p2AllyIds[0],
        from: "field",
        to: "graveyard",
      },
    ]).state;
    const stateBasedEvents = collectGrandArchiveStateBasedEvents(program, departed);
    expect(stateBasedEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          reason: "required-target-invalid",
          item: expect.objectContaining({
            targets: [
              expect.objectContaining({ binding: "target-allies", targetIds: [p2AllyIds[1]] }),
            ],
          }),
        }),
      ]),
    );
    const fizzled = new GrandArchiveTransactionKernel().transact(departed, stateBasedEvents);
    expect(fizzled.result.events.flatMap(observeGrandArchiveCommittedEvent)).toEqual([]);
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fizzled.state))),
    );
    expect(restored.stack).toEqual([]);
    expect(restored.objects[p2AllyIds[1]]?.damage).toBe(0);
  });

  it("does not follow a declared target across a zone-change incarnation", () => {
    const { program, runtime, multiTargetActionId, p2AllyIds } = setup();
    const p1 = grandArchivePlayerId("p1");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: multiTargetActionId,
          targets: { "target-allies": p2AllyIds },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const originalIncarnation = runtime.state.objects[p2AllyIds[0]]!.incarnation;
    const returned = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "object-moved",
        objectId: p2AllyIds[0],
        from: "field",
        to: "graveyard",
      },
      {
        type: "object-moved",
        objectId: p2AllyIds[0],
        from: "graveyard",
        to: "field",
      },
    ]).state;
    expect(returned.objects[p2AllyIds[0]]?.incarnation).toBe(originalIncarnation + 2);
    expect(collectGrandArchiveStateBasedEvents(program, returned)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          reason: "required-target-invalid",
        }),
      ]),
    );
  });

  it("fizzles a pending activation when its only required target gains Omnishroud", () => {
    const { program, runtime, targetActionId, p2ChampionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: targetActionId,
          targets: { "target-champion": [p2ChampionId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);

    const protectedState = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "continuous-effect-created",
        effect: {
          id: `continuous-${runtime.state.nextContinuousOrdinal}`,
          controllerId: p2,
          effect: {
            kind: "continuous",
            subjects: { kind: "source" },
            affectedSet: "locked",
            duration: { kind: "permanent" },
            layer: { layer: "D", modifies: "ability" },
            change: { kind: "grant-keyword", keyword: { name: "omnishroud" } },
          },
          affectedObjectIds: [p2ChampionId],
          affectedObjectIncarnations: {
            [p2ChampionId]: runtime.state.objects[p2ChampionId]!.incarnation,
          },
          bindings: {},
          variables: {},
          durationAnchors: {},
          createdAtVersion: runtime.state.stateVersion,
          createdTurnNumber: runtime.state.turn.number,
          createdPhase: runtime.state.turn.phase,
        },
      },
    ]).state;

    expect(collectGrandArchiveStateBasedEvents(program, protectedState)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          reason: "required-target-invalid",
          item: expect.objectContaining({
            kind: "card-activation",
            cardId: targetActionId,
          }),
        }),
      ]),
    );
  });

  it("fizzles in the same state-based pass after every required target becomes illegal", () => {
    const { program, runtime, multiTargetActionId, p2AllyIds } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: multiTargetActionId,
          targets: { "target-allies": p2AllyIds },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const departed = new GrandArchiveTransactionKernel().transact(
      runtime.state,
      p2AllyIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "field" as const,
        to: "graveyard" as const,
      })),
    ).state;
    const kernel = new GrandArchiveTransactionKernel();
    const fizzleEvents = collectGrandArchiveStateBasedEvents(program, departed);
    expect(fizzleEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          item: expect.objectContaining({ kind: "card-activation", cardId: multiTargetActionId }),
          reason: "required-target-invalid",
        }),
        expect.objectContaining({
          type: "opportunity-opened",
          window: expect.objectContaining({
            passedPlayerIds: [],
            reason: "state-based-stack-change",
          }),
        }),
      ]),
    );
    const fizzled = kernel.transact(departed, fizzleEvents);
    expect(fizzled.state.stack).toEqual([]);
    expect(fizzled.result.events.flatMap(observeGrandArchiveCommittedEvent)).toEqual([]);
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fizzled.state))),
    );
    expect(restored.eventHistory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          reason: "required-target-invalid",
          item: expect.objectContaining({ cardId: multiTargetActionId }),
        }),
      ]),
    );
    const orphanEvents = collectGrandArchiveStateBasedEvents(program, restored);
    expect(orphanEvents).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: multiTargetActionId,
        from: "effects-stack",
        to: "graveyard",
      }),
    ]);
    const cleaned = kernel.transact(restored, orphanEvents).state;
    expect(cleaned.objects[multiTargetActionId]?.zone).toBe("graveyard");
  });

  it("fizzles a pending card immediately when its source leaves the Effects Stack", () => {
    const { program, runtime, targetActionId, p2ChampionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: targetActionId,
          targets: { "target-champion": [p2ChampionId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const kernel = new GrandArchiveTransactionKernel();
    const sourceRemoved = kernel.transact(runtime.state, [
      {
        type: "object-moved",
        objectId: targetActionId,
        from: "effects-stack",
        to: "banishment",
        cause: { kind: "rule", rule: "test-source-removal" },
      },
    ]).state;
    const fizzleEvents = collectGrandArchiveStateBasedEvents(program, sourceRemoved);
    expect(fizzleEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          item: expect.objectContaining({ kind: "card-activation", cardId: targetActionId }),
          reason: "source-card-missing",
        }),
        expect.objectContaining({
          type: "opportunity-opened",
          window: expect.objectContaining({
            passedPlayerIds: [],
            reason: "state-based-stack-change",
          }),
        }),
      ]),
    );
    const fizzled = kernel.transact(sourceRemoved, fizzleEvents);
    expect(fizzled.state.stack).toEqual([]);
    expect(fizzled.state.objects[targetActionId]?.zone).toBe("banishment");
    expect(fizzled.result.events.flatMap(observeGrandArchiveCommittedEvent)).toEqual([]);
    expect(collectGrandArchiveStateBasedEvents(program, fizzled.state)).toEqual([]);
  });

  it("automatically fizzles a lower activation when a response banishes its source", () => {
    const { runtime, targetActionId, sourceBanishActionId, p2ChampionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: targetActionId,
          targets: { "target-champion": [p2ChampionId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const doomedStackItemId = runtime.state.stack[0]!.id;
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: sourceBanishActionId,
          targets: { "target-source-card": [doomedStackItemId] },
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const result = runtime.execute({ move: "pass" }, { playerId: p1 });
    if (!result.ok) throw new Error(result.message);
    expect(result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          item: expect.objectContaining({ id: doomedStackItemId, cardId: targetActionId }),
          reason: "source-card-missing",
        }),
      ]),
    );
    expect(runtime.state.stack).toEqual([]);
    expect(runtime.state.objects[targetActionId]?.zone).toBe("banishment");
    expect(runtime.state.objects[sourceBanishActionId]?.zone).toBe("graveyard");
    expect(
      result.events
        .flatMap(observeGrandArchiveCommittedEvent)
        .filter(
          (event) => event.name === "effect-resolved" && event.stackItemId === doomedStackItemId,
        ),
    ).toEqual([]);
  });

  it("rejects object identities for stack declarations and preserves stack targets in snapshots", () => {
    const { program, runtime, targetActionId, counterActionId, p2ChampionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: targetActionId,
          targets: { "target-champion": [p2ChampionId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const targetedStackItemId = runtime.state.stack[0]!.id;
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: counterActionId,
          targets: { "target-stack-item": [p2ChampionId] },
        },
        { playerId: p2 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: counterActionId,
          targets: { "target-stack-item": [targetedStackItemId] },
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    expect(restored.stack.at(-1)?.targets[0]?.targetIds).toEqual([targetedStackItemId]);
  });

  it("removes a negated ability without moving its source object", () => {
    const { runtime, abilityCounterId, p1ChampionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: p1ChampionId,
          abilityId: "stackTargetChampion-a1",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const abilityItemId = runtime.state.stack[0]!.id;
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: abilityCounterId,
          targets: { "target-ability": [abilityItemId] },
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    for (let pass = 0; pass < 4 && runtime.state.stack.length > 0; pass += 1) {
      const holder = runtime.state.opportunity?.holderId;
      if (!holder) throw new Error("Ability negation requires an Opportunity holder");
      expect(runtime.execute({ move: "pass" }, { playerId: holder }).ok).toBe(true);
    }
    expect(runtime.state.stack).toEqual([]);
    expect(runtime.state.objects[p1ChampionId]).toMatchObject({ zone: "field", damage: 0 });
    expect(runtime.state.objects[abilityCounterId]?.zone).toBe("graveyard");
    expect(runtime.state.eventHistory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-negated",
          item: expect.objectContaining({ id: abilityItemId, kind: "activated-ability" }),
        }),
      ]),
    );
  });
});
