import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchiveStackItemId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "../../rules/state/state-based.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  subtypes: readonly string[] = [],
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
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 2 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("stack-copy-champion", "CHAMPION");
const filler = card("stack-copy-filler", "ACTION");
const copiedPermanent = card("stack-copy-permanent", "ALLY");
const copiedAction = card(
  "stack-copy-action",
  "ACTION",
  [
    {
      id: "stackCopyAction-a1",
      kind: "card-resolution",
      text: "Deal X damage to target champion.",
      variables: [{ symbol: "X", kind: "chosen", minimum: 1, maximum: 3 }],
      modes: {
        declared: "announcement",
        choose: { kind: "exactly", amount: 1 },
        modes: [
          {
            id: "bonus-one",
            text: "Deal 1 additional damage.",
            effect: {
              kind: "deal-damage",
              recipient: { kind: "bound", binding: "damage-target" },
              amount: 1,
            },
          },
          {
            id: "bonus-two",
            text: "Deal 2 additional damage.",
            effect: {
              kind: "deal-damage",
              recipient: { kind: "bound", binding: "damage-target" },
              amount: 2,
            },
          },
        ],
      },
      targets: [
        {
          id: "damage-target",
          kind: "target",
          declared: "announcement",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          unique: true,
          candidates: {
            kind: "object",
            zones: ["field"],
            filter: { kind: "type", oneOf: ["CHAMPION"] },
          },
        },
      ],
      effect: {
        kind: "deal-damage",
        recipient: { kind: "bound", binding: "damage-target" },
        amount: { kind: "variable", symbol: "X" },
      },
    },
    {
      id: "stackCopyAction-a2",
      kind: "static",
      staticKind: "intrinsic",
      text: "Prepare 1",
      keyword: { name: "prepare", value: 1 },
    },
    {
      id: "stackCopyAction-a3",
      kind: "static",
      staticKind: "intrinsic",
      text: "Aenean Progression",
      keyword: { name: "aenean-progression" },
    },
  ],
  ["SPELL"],
);
const copier = card("stack-copy-copier", "ALLY", [
  {
    id: "stackCopyCopier-a1",
    kind: "triggered",
    text: "Whenever an opponent activates a card, copy that activation.",
    trigger: {
      kind: "event",
      event: { name: "card-activated", actor: "opponent" },
    },
    effect: {
      kind: "copy",
      subject: { kind: "event-subject" },
      copy: "card-activation",
      mayChooseNewTargets: true,
      mayChooseNewModes: true,
      bindResultAs: "copied-activation",
    },
  },
  {
    id: "stackCopyCopier-a2",
    kind: "triggered",
    text: "Whenever an opponent activates an ability, copy that ability.",
    trigger: {
      kind: "event",
      event: { name: "ability-activated", actor: "opponent" },
    },
    effect: {
      kind: "copy",
      subject: { kind: "event-subject" },
      copy: "ability",
      bindResultAs: "copied-ability",
    },
  },
]);
const abilityBearer = card("stack-copy-ability-bearer", "ALLY", [
  {
    id: "stackCopyAbilityBearer-a1",
    kind: "activated",
    activation: "ability",
    text: "Reserve 0: Deal 1 damage to target champion.",
    cost: { kind: "pay-reserve", amount: 0 },
    targets: [
      {
        id: "ability-target",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        unique: true,
        candidates: {
          kind: "object",
          zones: ["field"],
          filter: { kind: "type", oneOf: ["CHAMPION"] },
        },
      },
    ],
    effect: {
      kind: "deal-damage",
      source: { kind: "source" },
      recipient: { kind: "bound", binding: "ability-target" },
      amount: 1,
    },
  },
  {
    id: "stackCopyAbilityBearer-a2",
    kind: "activated",
    activation: "ability",
    text: "Cascade",
    cost: { kind: "pay-reserve", amount: 0 },
    cascade: {
      kind: "cascade",
      advanceOn: "activation",
      tracking: {
        scope: "source-instance",
        includesCurrent: true,
        advancesIfStackEntryFailsToResolve: true,
      },
      copiedAbility: "repeat-pending-effect-without-advancing",
      modes: [
        {
          id: "cascade-1",
          text: "Put a buff counter on this.",
          counts: [1],
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "cascade-2",
          text: "Put a debuff counter on this.",
          counts: [2],
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: "debuff",
            amount: 1,
          },
        },
      ],
    },
  },
]);

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly actionId: GrandArchiveObjectId;
  readonly permanentId: GrandArchiveObjectId;
  readonly abilityBearerId: GrandArchiveObjectId;
  readonly targetId: GrandArchiveObjectId;
  readonly alternateTargetId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    copiedAction,
    copiedPermanent,
    copier,
    abilityBearer,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: copiedAction.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: copiedPermanent.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: abilityBearer.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: copier.canonicalId, count: id === "p2" ? 1 : 0 },
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
      randomSeed: 701,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const action = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === copiedAction.canonicalId,
  )!;
  const copierObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === copier.canonicalId,
  )!;
  const permanent = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === copiedPermanent.canonicalId,
  )!;
  const abilityBearerObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === abilityBearer.canonicalId,
  )!;
  const target = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === champion.canonicalId,
  )!;
  const alternateTarget = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === champion.canonicalId,
  )!;
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    ...[action, permanent]
      .filter((object) => object.zone !== "hand")
      .map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "hand" as const,
      })),
    {
      type: "object-moved",
      objectId: abilityBearerObject.id,
      from: abilityBearerObject.zone,
      to: "field",
    },
    {
      type: "object-moved",
      objectId: copierObject.id,
      from: copierObject.zone,
      to: "field",
    },
    {
      type: "counter-changed",
      objectId: alternateTarget.id,
      counter: "preparation",
      delta: 1,
    },
    { type: "player-state-changed", playerId: p1, state: "empower", value: 2 },
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    actionId: action.id,
    permanentId: permanent.id,
    abilityBearerId: abilityBearerObject.id,
    targetId: target.id,
    alternateTargetId: alternateTarget.id,
  };
}

function resolveStackItem(
  runtime: GrandArchiveMatchRuntime,
  itemId: GrandArchiveStackItemId,
): void {
  for (
    let pass = 0;
    pass < 8 && runtime.state.stack.some((item) => item.id === itemId);
    pass += 1
  ) {
    const decision = runtime.state.decision;
    if (decision) {
      if (decision.kind !== "resolve-optional-effect") {
        throw new Error(`Unexpected decision while resolving stack item: ${decision.kind}`);
      }
      const declined = runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: false,
        },
        { playerId: decision.playerId },
      );
      if (!declined.ok) throw new Error(declined.message);
      continue;
    }
    const holder = runtime.state.opportunity?.holderId;
    if (!holder) throw new Error("Resolving a stack item requires an Opportunity holder");
    const result = runtime.execute({ move: "pass" }, { playerId: holder });
    if (!result.ok) throw new Error(result.message);
  }
  expect(runtime.state.stack.some((item) => item.id === itemId)).toBe(false);
}

function passUntilDecision(
  runtime: GrandArchiveMatchRuntime,
  itemId: GrandArchiveStackItemId,
): void {
  for (let pass = 0; pass < 8 && !runtime.state.decision; pass += 1) {
    if (!runtime.state.stack.some((item) => item.id === itemId)) break;
    const holder = runtime.state.opportunity?.holderId;
    if (!holder) throw new Error("Waiting for a decision requires an Opportunity holder");
    const result = runtime.execute({ move: "pass" }, { playerId: holder });
    if (!result.ok) throw new Error(result.message);
  }
  expect(runtime.state.decision).not.toBeNull();
}

describe("Grand Archive Effects Stack copies", () => {
  it("copies a card activation with its choices and resolves from the copying player", () => {
    const { program, runtime: initialRuntime, actionId, targetId, alternateTargetId } = setup();
    let runtime = initialRuntime;
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          targets: { "damage-target": [targetId] },
          variables: { X: 2 },
          modeIds: ["bonus-one"],
          prepareAbilityIndexes: [0],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const original = runtime.state.stack.find((item) => item.kind === "card-activation")!;
    const trigger = runtime.state.stack.at(-1)!;
    expect(trigger.kind).toBe("triggered-ability");
    passUntilDecision(runtime, trigger.id);
    const remode = runtime.state.decision;
    if (!remode || remode.kind !== "remode-stack-item") {
      throw new Error("Copy mode permission must request the copied instance's modes");
    }
    const remodeSnapshot = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    const remodingRuntime = new GrandArchiveMatchRuntime(program, remodeSnapshot);
    expect(
      remodingRuntime.execute(
        {
          move: "answer-decision",
          decisionId: remode.id,
          stateVersion: remode.stateVersion,
          answer: { modeIds: ["bonus-two"] },
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    runtime = remodingRuntime;
    const optional = runtime.state.decision;
    if (!optional || optional.kind !== "resolve-optional-effect") {
      throw new Error("Copy retargeting must first offer the optional choice");
    }
    const declineSnapshot = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    const decliningRuntime = new GrandArchiveMatchRuntime(program, declineSnapshot);
    expect(
      decliningRuntime.execute(
        {
          move: "answer-decision",
          decisionId: optional.id,
          stateVersion: optional.stateVersion,
          answer: false,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(decliningRuntime.state.stack.at(-1)?.targets).toEqual(original.targets);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: optional.id,
          stateVersion: optional.stateVersion,
          answer: true,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    const retarget = runtime.state.decision;
    if (!retarget || retarget.kind !== "retarget-stack-item") {
      throw new Error("Accepting copy retargeting must request new targets");
    }
    const suspendedSnapshot = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    const retargetingRuntime = new GrandArchiveMatchRuntime(program, suspendedSnapshot);
    expect(
      retargetingRuntime.execute(
        {
          move: "answer-decision",
          decisionId: retarget.id,
          stateVersion: retarget.stateVersion,
          answer: { targets: { "damage-target": [alternateTargetId] } },
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    runtime = retargetingRuntime;

    const copy = runtime.state.stack.at(-1)!;
    expect(copy).toMatchObject({
      kind: "card-activation",
      controllerId: p2,
      isCopy: true,
      selectedModeIds: ["bonus-two"],
      targets: [{ binding: "damage-target", targetIds: [alternateTargetId], required: true }],
      variables: original.variables,
      activationStates: ["prepared", "empowered"],
      activationPayment: original.activationPayment,
      championLevelModifier: 2,
    });
    if (copy.kind !== "card-activation") throw new Error("Expected copied card activation");
    expect(copy.cardId).not.toBe(original.kind === "card-activation" ? original.cardId : undefined);
    expect(runtime.state.objects[copy.cardId]).toMatchObject({
      zone: "effects-stack",
      controllerId: p2,
      isToken: false,
      copy: expect.objectContaining({ expires: "when-unassociated" }),
    });

    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    const resumed = new GrandArchiveMatchRuntime(program, restored);
    resolveStackItem(resumed, copy.id);
    expect(resumed.state.objects[copy.cardId]).toBeUndefined();
    expect(resumed.state.objects[alternateTargetId]?.damage).toBe(4);
    expect(resumed.state.objects[targetId]?.damage).toBe(0);
    expect(resumed.state.players[p2]?.states.aeneanProgressionResolved).toBe(1);
    expect(resumed.state.players[p1]?.states.aeneanProgressionResolved).toBeUndefined();
    resolveStackItem(resumed, original.id);
    expect(resumed.state.objects[targetId]?.damage).toBe(3);
    expect(resumed.state.players[p1]?.states.aeneanProgressionResolved).toBe(1);
  });

  it("resolves a copied permanent activation as a clean token object", () => {
    const { runtime, permanentId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute({ move: "activate-card", cardId: permanentId }, { playerId: p1 }).ok,
    ).toBe(true);
    const original = runtime.state.stack.find(
      (item) => item.kind === "card-activation" && item.cardId === permanentId,
    )!;
    const trigger = runtime.state.stack.at(-1)!;
    expect(trigger.kind).toBe("triggered-ability");
    resolveStackItem(runtime, trigger.id);
    const copy = runtime.state.stack.at(-1)!;
    if (copy.kind !== "card-activation") throw new Error("Expected copied card activation");
    const transientCardId = copy.cardId;
    resolveStackItem(runtime, copy.id);
    expect(runtime.state.objects[transientCardId]).toBeUndefined();
    const copiedToken = Object.values(runtime.state.objects).find(
      (object) =>
        object.definitionId === copiedPermanent.canonicalId &&
        object.ownerId === p2 &&
        object.isToken,
    );
    expect(copiedToken).toMatchObject({
      zone: "field",
      controllerId: p2,
      damage: 0,
      counters: {},
      copy: { sourceObjectId: permanentId, expires: "when-unassociated" },
    });
    expect([...(copiedToken?.states ?? [])]).toEqual([]);
    resolveStackItem(runtime, original.id);
    expect(runtime.state.objects[permanentId]).toMatchObject({
      zone: "field",
      controllerId: p1,
      isToken: false,
    });
  });

  it("fizzles copied card instances when their original source card leaves the Effects Stack", () => {
    const { program, runtime, permanentId } = setup();
    const p1 = grandArchivePlayerId("p1");
    expect(
      runtime.execute({ move: "activate-card", cardId: permanentId }, { playerId: p1 }).ok,
    ).toBe(true);
    const original = runtime.state.stack.find(
      (item) => item.kind === "card-activation" && item.cardId === permanentId,
    )!;
    const copierTrigger = runtime.state.stack.at(-1)!;
    resolveStackItem(runtime, copierTrigger.id);
    const copy = runtime.state.stack.at(-1)!;
    if (copy.kind !== "card-activation") throw new Error("Expected copied card activation");

    const sourceRemoved = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "object-moved",
        objectId: permanentId,
        from: "effects-stack",
        to: "graveyard",
      },
    ]).state;
    const stateBased = collectGrandArchiveStateBasedEvents(program, sourceRemoved);

    expect(stateBased).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          item: expect.objectContaining({ id: original.id }),
        }),
        expect.objectContaining({
          type: "stack-item-fizzled",
          item: expect.objectContaining({ id: copy.id }),
        }),
      ]),
    );
  });

  it("copies an ability with the original source and announcement choices", () => {
    const { runtime, abilityBearerId, targetId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: abilityBearerId,
          abilityId: "stackCopyAbilityBearer-a1",
          targets: { "ability-target": [targetId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const original = runtime.state.stack.find((item) => item.kind === "activated-ability")!;
    const trigger = runtime.state.stack.at(-1)!;
    expect(trigger.kind).toBe("triggered-ability");
    resolveStackItem(runtime, trigger.id);
    const copy = runtime.state.stack.at(-1)!;
    expect(copy).toMatchObject({
      kind: "activated-ability",
      sourceId: abilityBearerId,
      controllerId: p2,
      isCopy: true,
      targets: original.targets,
      selectedModeIds: original.selectedModeIds,
      variables: original.variables,
    });
    resolveStackItem(runtime, copy.id);
    expect(runtime.state.objects[targetId]?.damage).toBe(1);
    resolveStackItem(runtime, original.id);
    expect(runtime.state.objects[targetId]?.damage).toBe(2);
  });

  it("copies the pending Cascade effect without advancing the source count", () => {
    const { runtime, abilityBearerId } = setup();
    const p1 = grandArchivePlayerId("p1");

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: abilityBearerId,
          abilityId: "stackCopyAbilityBearer-a2",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const original = runtime.state.stack.find((item) => item.kind === "activated-ability")!;
    expect(original.selectedModeIds).toEqual(["cascade-1"]);
    expect(runtime.state.objects[abilityBearerId]?.cascadeCounts["stackCopyAbilityBearer-a2"]).toBe(
      1,
    );

    const trigger = runtime.state.stack.at(-1)!;
    expect(trigger.kind).toBe("triggered-ability");
    resolveStackItem(runtime, trigger.id);
    const copy = runtime.state.stack.at(-1)!;
    expect(copy).toMatchObject({
      kind: "activated-ability",
      sourceId: abilityBearerId,
      isCopy: true,
      selectedModeIds: ["cascade-1"],
    });
    expect(runtime.state.objects[abilityBearerId]?.cascadeCounts["stackCopyAbilityBearer-a2"]).toBe(
      1,
    );

    resolveStackItem(runtime, copy.id);
    resolveStackItem(runtime, original.id);
    expect(runtime.state.objects[abilityBearerId]?.counters.buff).toBe(2);
    expect(runtime.state.objects[abilityBearerId]?.cascadeCounts["stackCopyAbilityBearer-a2"]).toBe(
      1,
    );

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: abilityBearerId,
          abilityId: "stackCopyAbilityBearer-a2",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const secondOriginal = runtime.state.stack.find(
      (item) => item.kind === "activated-ability" && !item.isCopy,
    )!;
    expect(secondOriginal.selectedModeIds).toEqual(["cascade-2"]);
    expect(runtime.state.objects[abilityBearerId]?.cascadeCounts["stackCopyAbilityBearer-a2"]).toBe(
      2,
    );
  });
});
