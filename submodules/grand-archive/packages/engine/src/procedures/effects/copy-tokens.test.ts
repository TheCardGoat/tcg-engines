import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { grandArchiveObjectFace } from "../../game/card-runtime.ts";
import { matchesGrandArchiveCardFilter } from "./evaluation.ts";
import { grandArchiveObjectId, grandArchivePlayerId } from "../../game/identity.ts";
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
import { collectGrandArchiveTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  stats: { readonly level?: number; readonly power?: number; readonly life?: number } = {},
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats,
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("copy-test-champion", "CHAMPION", [], { level: 0, life: 15 });
const copiedAlly = card(
  "copy-test-ally",
  "ALLY",
  [
    {
      id: "copyTestAlly-a1",
      kind: "triggered",
      text: "On Enter: Draw a card.",
      trigger: {
        kind: "event",
        event: { name: "object-entered-field", subject: { kind: "source" } },
      },
      effect: { kind: "draw", player: "controller", amount: 1 },
    },
  ],
  { power: 1, life: 3 },
);
const filler = card("copy-test-filler", "ACTION");
const optionAllyA = card("summon-option-a", "ALLY", [], { power: 1, life: 2 });
const optionAllyB = card("summon-option-b", "ALLY", [], { power: 1, life: 4 });
const summonChoiceAction = card("summon-choice-action", "ACTION", [
  {
    id: "summonChoiceAction-a1",
    kind: "card-resolution",
    text: "Choose one token to summon.",
    effect: {
      kind: "summon-one-of",
      chooser: "controller",
      controller: "controller",
      objects: [optionAllyA.canonicalId, optionAllyB.canonicalId],
      bindResultAs: "summoned-choice",
    },
  },
]);
const temporaryCopiedAction = card("temporary-copied-action", "ACTION", [
  {
    id: "temporaryCopiedAction-a1",
    kind: "card-resolution",
    text: "Put a charge counter on your champion.",
    effect: {
      kind: "add-counter",
      subject: { kind: "champion", player: "controller" },
      counter: { named: "charge" },
      amount: 1,
    },
  },
]);
const copyAndActivateAction = card("copy-and-activate-action", "ACTION", [
  {
    id: "copyAndActivateAction-a1",
    kind: "card-resolution",
    text: "Copy target banished action and activate the copy without paying its reserve cost.",
    targets: [
      {
        id: "copied-card",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        candidates: {
          kind: "card",
          zones: ["banishment"],
          filter: { kind: "type", oneOf: ["ACTION"] },
        },
      },
    ],
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "copy",
          subject: { kind: "bound", binding: "copied-card" },
          copy: "object",
          bindResultAs: "temporary-copy",
        },
        {
          kind: "activate-card",
          subject: { kind: "bound", binding: "temporary-copy" },
          payCosts: false,
        },
      ],
    },
  },
]);

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: copiedAlly.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 5 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive object copies", () => {
  it("treats a non-field copy as a temporary card that can be activated and then ceases", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      temporaryCopiedAction,
      copyAndActivateAction,
    ]);
    const setupPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: temporaryCopiedAction.canonicalId, count: 1 },
        { definitionId: copyAndActivateAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 6 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [setupPlayer("p1"), setupPlayer("p2")],
        firstPlayerId: "p1",
        randomSeed: 39,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const source = Object.values(initial.objects).find(
      (object) =>
        object.ownerId === p1 && object.definitionId === temporaryCopiedAction.canonicalId,
    )!;
    const copier = Object.values(initial.objects).find(
      (object) =>
        object.ownerId === p1 && object.definitionId === copyAndActivateAction.canonicalId,
    )!;
    const championId = initial.zones[p1].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: source.id, from: source.zone, to: "banishment" },
      { type: "object-moved", objectId: copier.id, from: copier.zone, to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: copier.id,
          targets: { "copied-card": [source.id] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    for (
      let pass = 0;
      pass < 8 && runtime.state.stack.some((item) => "cardId" in item && item.cardId === copier.id);
      pass += 1
    ) {
      const decision = runtime.state.decision;
      if (decision) {
        if (decision.kind !== "announce-effect-activation") {
          throw new Error(`Unexpected copy activation decision: ${decision.kind}`);
        }
        const answered = runtime.execute(
          {
            move: "answer-decision",
            decisionId: decision.id,
            stateVersion: decision.stateVersion,
            answer: {},
          },
          { playerId: decision.playerId },
        );
        if (!answered.ok) throw new Error(answered.message);
        continue;
      }
      const holder = runtime.state.opportunity?.holderId;
      if (!holder) throw new Error("Resolving the copy effect requires Opportunity");
      const result = runtime.execute({ move: "pass" }, { playerId: holder });
      if (!result.ok) throw new Error(result.message);
    }
    const copiedActivation = runtime.state.stack.find(
      (item) => item.kind === "card-activation" && item.cardId !== source.id,
    );
    if (!copiedActivation || copiedActivation.kind !== "card-activation") {
      throw new Error("The temporary copied card must be activatable");
    }
    const copiedCardId = copiedActivation.cardId;
    expect(runtime.state.objects[copiedCardId]).toMatchObject({
      definitionId: temporaryCopiedAction.canonicalId,
      zone: "effects-stack",
      isToken: false,
      copy: { sourceObjectId: source.id, expires: "when-unassociated" },
    });
    for (
      let pass = 0;
      pass < 8 && runtime.state.stack.some((item) => item.id === copiedActivation.id);
      pass += 1
    ) {
      const holder = runtime.state.opportunity?.holderId;
      if (!holder) throw new Error("Resolving the copied card requires Opportunity");
      const result = runtime.execute({ move: "pass" }, { playerId: holder });
      if (!result.ok) throw new Error(result.message);
    }
    expect(runtime.state.objects[copiedCardId]).toBeUndefined();
    expect(runtime.state.objects[championId]?.counters["named:charge"]).toBe(1);
    expect(runtime.state.objects[source.id]?.zone).toBe("banishment");
  });

  it("copies base characteristics into a fresh token and ceases after leaving the field", () => {
    const program = createGrandArchiveMatchProgram([champion, copiedAlly, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 40,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const originalId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === copiedAlly.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const modifiedOriginal = kernel.transact(initial, [
      { type: "object-moved", objectId: originalId, from: "main-deck", to: "field" },
      { type: "object-state-changed", objectId: originalId, state: "rested", value: true },
      { type: "counter-changed", objectId: originalId, counter: "buff", delta: 3 },
      { type: "damage-marked", objectId: originalId, amount: 2 },
    ]).state;

    const summoned = executeGrandArchiveEffect(
      {
        kind: "copy",
        subject: { kind: "bound", binding: "copied-object" },
        copy: "object",
        bindResultAs: "summoned-token",
      },
      {
        program,
        state: modifiedOriginal,
        controllerId: p1,
        bindings: { "copied-object": [originalId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const copyId = summoned.resultObjectIds[0]!;
    const copy = summoned.state.objects[copyId]!;
    expect(copy).toMatchObject({
      definitionId: copiedAlly.canonicalId,
      ownerId: p1,
      controllerId: p1,
      zone: "field",
      face: "default",
      isToken: true,
      damage: 0,
    });
    expect([...copy.states]).toEqual([]);
    expect(copy.counters).toEqual({});
    expect(summoned.bindings["summoned-token"]).toEqual([copyId]);
    expect(
      matchesGrandArchiveCardFilter(
        copy,
        { kind: "token", value: true },
        {
          program,
          state: summoned.state,
          controllerId: p1,
          bindings: {},
        },
      ),
    ).toBe(true);
    expect(
      matchesGrandArchiveCardFilter(
        summoned.state.objects[originalId]!,
        { kind: "token", value: false },
        { program, state: summoned.state, controllerId: p1, bindings: {} },
      ),
    ).toBe(true);

    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      program,
      summoned.state,
      summoned.events,
    );
    expect(triggerEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "pending-trigger-added",
          trigger: expect.objectContaining({
            sourceId: copyId,
            ability: expect.objectContaining({ id: "copyTestAlly-a1" }),
          }),
        }),
      ]),
    );
    const projected = projectGrandArchiveViewerState(program, summoned.state, p1);
    const projectedField = projected.players.find((projectedPlayer) => projectedPlayer.id === p1)
      ?.zones.field;
    if (projectedField?.visibility !== "visible") {
      throw new Error("The copied token must be visible on its controller's field");
    }
    expect(projectedField.objects.find((object) => object.id === copyId)?.isToken).toBe(true);
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(summoned.state),
    );
    expect(restored.objects[copyId]?.isToken).toBe(true);

    const leftField = kernel.transact(restored, [
      { type: "object-moved", objectId: copyId, from: "field", to: "graveyard" },
    ]).state;
    const ceaseEvents = collectGrandArchiveStateBasedEvents(program, leftField);
    expect(ceaseEvents).toEqual([
      expect.objectContaining({ type: "object-ceased", objectId: copyId, from: "graveyard" }),
    ]);
    const ceased = kernel.transact(leftField, ceaseEvents).state;
    expect(ceased.objects[copyId]).toBeUndefined();
    expect(ceased.zones[p1].graveyard).not.toContain(copyId);
  });

  it("creates intent copies as non-token cards that persist only through combat", () => {
    const program = createGrandArchiveMatchProgram([champion, copiedAlly, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 43,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const original = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === copiedAlly.canonicalId,
    )!;
    const attacker = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === champion.canonicalId,
    )!;
    const defender = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === champion.canonicalId,
    )!;
    const kernel = new GrandArchiveTransactionKernel();
    const inCombat = kernel.transact(initial, [
      {
        type: "object-moved",
        objectId: original.id,
        from: original.zone,
        to: "intent",
        hostId: attacker.id,
      },
      {
        type: "combat-started",
        combat: {
          attackerId: attacker.id,
          attackingPlayerId: p1,
          defendingPlayerIds: [p2],
          targetIds: [defender.id],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [original.id],
          step: "declaration",
        },
      },
    ]).state;
    const copied = executeGrandArchiveEffect(
      {
        kind: "copy",
        subject: { kind: "bound", binding: "intent-card" },
        copy: "object",
        amount: 2,
        bindResultAs: "intent-copies",
      },
      {
        program,
        state: inCombat,
        controllerId: p1,
        bindings: { "intent-card": [original.id] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const copyIds = copied.resultObjectIds;
    expect(copyIds).toHaveLength(2);
    expect(copied.bindings["intent-copies"]).toEqual(copyIds);
    for (const copyId of copyIds) {
      expect(copied.state.objects[copyId]).toMatchObject({
        zone: "intent",
        hostId: attacker.id,
        ownerId: p1,
        controllerId: p1,
        isToken: false,
        copy: { sourceObjectId: original.id, expires: "end-of-combat" },
      });
    }
    expect(collectGrandArchiveStateBasedEvents(program, copied.state)).toEqual([]);
    const afterCombat = kernel.transact(copied.state, [{ type: "combat-ended" }]).state;
    const ceaseEvents = collectGrandArchiveStateBasedEvents(program, afterCombat);
    expect(ceaseEvents).toEqual(
      copyIds.map((objectId) =>
        expect.objectContaining({ type: "object-ceased", objectId, from: "intent" }),
      ),
    );
    const ceased = kernel.transact(afterCombat, ceaseEvents).state;
    for (const copyId of copyIds) expect(ceased.objects[copyId]).toBeUndefined();
  });

  it("lets an existing object permanently become a clean base copy while retaining its modifiers", () => {
    const program = createGrandArchiveMatchProgram([champion, copiedAlly, optionAllyB, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 44,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const target = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === copiedAlly.canonicalId,
    )!;
    const kernel = new GrandArchiveTransactionKernel();
    const source = {
      ...target,
      id: grandArchiveObjectId(`object-${initial.nextObjectOrdinal}`),
      definitionId: optionAllyB.canonicalId,
      zone: "field" as const,
      objectVersion: 1,
    };
    const prepared = kernel.transact(initial, [
      { type: "object-moved", objectId: target.id, from: target.zone, to: "field" },
      { type: "object-created", object: source },
      { type: "object-state-changed", objectId: target.id, state: "rested", value: true },
      { type: "counter-changed", objectId: target.id, counter: "buff", delta: 3 },
      { type: "damage-marked", objectId: target.id, amount: 2 },
    ]).state;
    const copied = executeGrandArchiveEffect(
      {
        kind: "become-copy",
        subject: { kind: "bound", binding: "copy-target" },
        copyOf: { kind: "bound", binding: "copy-source" },
        exceptName: "Retained Copy Name",
        duration: { kind: "permanent" },
      },
      {
        program,
        state: prepared,
        controllerId: p1,
        bindings: { "copy-target": [target.id], "copy-source": [source.id] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const changed = copied.state.objects[target.id]!;
    expect(changed).toMatchObject({
      definitionId: copiedAlly.canonicalId,
      activeDefinitionId: optionAllyB.canonicalId,
      nameOverride: "Retained Copy Name",
      damage: 2,
      counters: { buff: 3 },
      isToken: false,
    });
    expect([...changed.states]).toEqual(["rested"]);
    expect(grandArchiveObjectFace(program, changed)).toMatchObject({
      name: "Retained Copy Name",
      stats: { life: 4 },
      abilities: [],
    });
    const leftField = kernel.transact(copied.state, [
      { type: "object-moved", objectId: target.id, from: "field", to: "graveyard" },
    ]).state;
    expect(leftField.objects[target.id]?.activeDefinitionId).toBeUndefined();
    expect(leftField.objects[target.id]?.nameOverride).toBeUndefined();
    expect(grandArchiveObjectFace(program, leftField.objects[target.id]!).name).toBe(
      copiedAlly.layout.kind === "single-faced" ? copiedAlly.layout.face.name : "",
    );
  });

  it("summons a token copy of every resolved subject and binds the complete batch", () => {
    const program = createGrandArchiveMatchProgram([champion, copiedAlly, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 41,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const originalIds = Object.values(initial.objects)
      .filter((object) => object.definitionId === copiedAlly.canonicalId)
      .map((object) => object.id);
    const kernel = new GrandArchiveTransactionKernel();
    const originalsOnField = kernel.transact(
      initial,
      originalIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
    ).state;
    const summoned = executeGrandArchiveEffect(
      {
        kind: "summon-copies",
        controller: "controller",
        subjects: { kind: "bound", binding: "copied-objects" },
        token: true,
        bindResultAs: "summoned-copies",
      },
      {
        program,
        state: originalsOnField,
        controllerId: p1,
        bindings: { "copied-objects": originalIds },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(summoned.resultObjectIds).toHaveLength(2);
    expect(summoned.bindings["summoned-copies"]).toEqual(summoned.resultObjectIds);
    for (const copyId of summoned.resultObjectIds) {
      const sourceId = originalIds[summoned.resultObjectIds.indexOf(copyId)]!;
      expect(summoned.state.objects[copyId]).toMatchObject({
        definitionId: copiedAlly.canonicalId,
        ownerId: p1,
        controllerId: p1,
        zone: "field",
        isToken: true,
        copy: { sourceObjectId: sourceId, expires: "when-unassociated" },
      });
    }
  });

  it("pauses resolution for a summon-one-of choice and resumes with the selected token", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      optionAllyA,
      optionAllyB,
      summonChoiceAction,
    ]);
    const choicePlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: summonChoiceAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [choicePlayer("p1"), choicePlayer("p2")],
        firstPlayerId: "p1",
        randomSeed: 42,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const actionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === summonChoiceAction.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const withAction = kernel.transact(initial, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, withAction);
    expect(runtime.execute({ move: "activate-card", cardId: actionId }, { playerId: p1 }).ok).toBe(
      true,
    );
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.decision).toMatchObject({
      kind: "resolve-effect-choice",
      playerId: p1,
    });
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    const resumed = new GrandArchiveMatchRuntime(program, restored);
    const decision = resumed.state.decision;
    if (!decision) throw new Error("The summon choice decision must survive snapshot restoration");
    expect(
      resumed.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: optionAllyB.canonicalId,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const selectedToken = Object.values(resumed.state.objects).find(
      (object) => object.definitionId === optionAllyB.canonicalId && object.ownerId === p1,
    );
    expect(selectedToken).toMatchObject({ zone: "field", isToken: true, controllerId: p1 });
    expect(
      Object.values(resumed.state.objects).some(
        (object) => object.definitionId === optionAllyA.canonicalId && object.ownerId === p1,
      ),
    ).toBe(false);
    expect(resumed.state.decision).toBeNull();
    expect(resumed.state.stack).toEqual([]);
  });
});
