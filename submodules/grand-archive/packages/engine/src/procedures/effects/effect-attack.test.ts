import { sliceAndDice, tristanAscendantShadow } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { deriveGrandArchiveNumericProperty } from "../../rules/state/continuous.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchivePendingTrigger } from "../../game/model.ts";
import { openGrandArchiveOpportunity } from "../game-flow/opportunity.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import { createGrandArchiveTriggeredStackItem } from "../../rules/abilities/triggers.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["ASSASSIN"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 2, life: 10 }
              : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("effect-attack-champion", "CHAMPION");
const ally = card("effect-attack-ally", "ALLY", { subtypes: ["PHANTASIA"] });
const filler = card("effect-attack-filler", "ACTION");

function singleFaceAbilities(
  definition: typeof sliceAndDice | typeof tristanAscendantShadow,
): readonly GrandArchiveAbilityDefinition[] {
  if (definition.layout.kind !== "single-faced") throw new Error("Expected a single-faced card");
  return definition.layout.face.abilities;
}

function sliceTrigger() {
  const ability = singleFaceAbilities(sliceAndDice).find(
    (candidate) => candidate.kind === "triggered",
  );
  if (!ability || ability.kind !== "triggered") throw new Error("Missing Slice and Dice trigger");
  return ability;
}

function tristanGrantedEffect(): GrandArchiveEffect {
  const activated = singleFaceAbilities(tristanAscendantShadow).find(
    (ability) => ability.kind === "activated",
  );
  const effect = activated?.kind === "activated" ? activated.effect : undefined;
  if (!effect || effect.kind !== "sequence") {
    throw new Error("Missing Tristan activation");
  }
  const continuous = effect.effects.find((entry) => entry.kind === "continuous");
  if (
    !continuous ||
    continuous.kind !== "continuous" ||
    continuous.change.kind !== "grant-ability" ||
    continuous.change.ability.kind !== "triggered" ||
    !continuous.change.ability.effect
  ) {
    throw new Error("Missing Tristan granted On Hit ability");
  }
  return continuous.change.ability.effect;
}

function setup(definitions: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[]) {
  const program = createGrandArchiveMatchProgram([champion, ally, filler, ...definitions]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      ...definitions.map((definition) => ({
        definitionId: definition.canonicalId,
        count: id === "p1" ? 1 : 0,
      })),
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initialized = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 991,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const state = new GrandArchiveTransactionKernel().transact(initialized, [
    { type: "player-first-turn-completed", playerId: p1 },
  ]).state;
  const find = (ownerId: typeof p1, definitionId: string, field = false): GrandArchiveObjectId => {
    const object = Object.values(state.objects).find(
      (candidate) =>
        candidate.ownerId === ownerId &&
        candidate.definitionId === definitionId &&
        (!field || candidate.zone === "field"),
    );
    if (!object) throw new Error(`Missing ${ownerId} ${definitionId}`);
    return object.id;
  };
  return {
    program,
    state,
    p1,
    p2,
    allyId: find(p1, ally.canonicalId),
    p1ChampionId: find(p1, champion.canonicalId, true),
    p2ChampionId: find(p2, champion.canonicalId, true),
    find,
  };
}

function answer(runtime: GrandArchiveMatchRuntime, value: unknown) {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a decision");
  return runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: value,
    },
    { playerId: decision.playerId },
  );
}

function resolveTop(
  runtime: GrandArchiveMatchRuntime,
  p1: ReturnType<typeof grandArchivePlayerId>,
  p2: ReturnType<typeof grandArchivePlayerId>,
) {
  const first = runtime.execute({ move: "pass" }, { playerId: p1 });
  if (!first.ok) throw new Error(first.message);
  const second = runtime.execute({ move: "pass" }, { playerId: p2 });
  if (!second.ok) throw new Error(second.message);
}

describe("Grand Archive effect-driven attack declarations", () => {
  it("resolves Slice and Dice's additional attack after cleaning up the hit combat", () => {
    const fixture = setup([sliceAndDice]);
    const sourceId = fixture.find(fixture.p1, sliceAndDice.canonicalId);
    const kernel = new GrandArchiveTransactionKernel();
    const combatState = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.allyId,
        from: fixture.state.objects[fixture.allyId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: sourceId,
        from: fixture.state.objects[sourceId]!.zone,
        to: "intent",
        hostId: fixture.allyId,
        entryStates: ["prepared"],
      },
      { type: "object-state-changed", objectId: fixture.allyId, state: "rested", value: true },
      { type: "object-state-changed", objectId: fixture.allyId, state: "attacking", value: true },
      {
        type: "object-state-changed",
        objectId: fixture.p2ChampionId,
        state: "defending",
        value: true,
      },
      {
        type: "combat-started",
        combat: {
          attackerId: fixture.allyId,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [fixture.p2ChampionId],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [sourceId],
          step: "end",
        },
      },
      { type: "opportunity-closed" },
    ]).state;
    const source = combatState.objects[sourceId]!;
    const pending: GrandArchivePendingTrigger = {
      id: "slice-and-dice-on-hit",
      batchId: "slice-and-dice-on-hit-batch",
      orderingConfirmed: true,
      sourceId,
      sourceIncarnation: source.incarnation,
      controllerId: fixture.p1,
      ability: sliceTrigger(),
      selectedModeIds: [],
      bindings: {
        eventAttacker: [fixture.allyId],
        eventSource: [sourceId],
        eventSubject: [sourceId],
      },
      variables: source.activationVariables,
      activationPayment: source.activationPayment,
      createdAtVersion: combatState.stateVersion,
    };
    const item = createGrandArchiveTriggeredStackItem(combatState, pending, []);
    const ready = kernel.transact(combatState, [
      { type: "stack-item-added", item },
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(combatState, fixture.p1, "stack-item-added"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);

    resolveTop(runtime, fixture.p1, fixture.p2);
    expect(runtime.state.decision?.kind).toBe("resolve-optional-effect");
    expect(answer(runtime, true).ok).toBe(true);
    expect(runtime.state.decision).toMatchObject({
      kind: "announce-effect-attack",
      attackerId: fixture.allyId,
      additional: true,
    });
    expect(runtime.state.resolution?.pendingEffectAttack?.ifDeclared).toBeDefined();
    const invalid = answer(runtime, { targetIds: [fixture.p1ChampionId] });
    expect(invalid.ok).toBe(false);
    expect(runtime.state.decision?.kind).toBe("announce-effect-attack");
    const declared = answer(runtime, { targetIds: [fixture.p2ChampionId] });
    if (!declared.ok) throw new Error(declared.message);

    expect(runtime.state.combat).toMatchObject({
      attackerId: fixture.allyId,
      targetIds: [fixture.p2ChampionId],
      step: "retaliation",
    });
    expect(runtime.state.objects[sourceId]?.zone).toBe("graveyard");
    const copy = Object.values(runtime.state.objects).find(
      (object) => object.copy?.sourceObjectId === sourceId && object.zone === "intent",
    );
    expect(copy).toBeDefined();
    expect(copy?.hostId).toBe(fixture.allyId);
    expect(copy?.states.has("prepared")).toBe(false);
    expect(runtime.state.combat?.intentIds).toContain(copy?.id);
    if (!copy) throw new Error("Missing Slice and Dice intent copy");
    expect(
      deriveGrandArchiveNumericProperty(copy, "power", {
        program: fixture.program,
        state: runtime.state,
        controllerId: fixture.p1,
        sourceId: copy.id,
        abilityBearerId: copy.id,
        bindings: {},
      }),
    ).toBe(6);
  });

  it("pays Tristan's rest cost before declaring and tracks the moved card as new intent", () => {
    const source = card("tristan-granted-attack-harness", "ACTION", {
      abilities: [
        {
          id: "tristanGrantedAttackHarness-a1",
          kind: "card-resolution",
          text: "Resolve Tristan's granted On Hit ability.",
          effect: tristanGrantedEffect(),
        },
      ],
    });
    const fixture = setup([source]);
    const sourceId = fixture.find(fixture.p1, source.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: sourceId,
        from: fixture.state.objects[sourceId]!.zone,
        to: "hand",
      },
      {
        type: "object-moved",
        objectId: fixture.allyId,
        from: fixture.state.objects[fixture.allyId]!.zone,
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);
    const activated = runtime.execute(
      { move: "activate-card", cardId: sourceId },
      { playerId: fixture.p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    resolveTop(runtime, fixture.p1, fixture.p2);
    expect(runtime.state.decision?.kind).toBe("resolve-optional-effect");
    expect(answer(runtime, true).ok).toBe(true);
    expect(runtime.state.decision?.kind).toBe("resolve-effect-choice");
    expect(answer(runtime, [fixture.allyId]).ok).toBe(true);
    expect(runtime.state.decision).toMatchObject({
      kind: "announce-effect-attack",
      attackerId: fixture.allyId,
      cost: { kind: "rest" },
    });
    const declared = answer(runtime, { targetIds: [fixture.p2ChampionId] });
    if (!declared.ok) throw new Error(declared.message);

    expect(runtime.state.objects[fixture.allyId]?.states.has("rested")).toBe(true);
    expect(runtime.state.combat?.attackerId).toBe(fixture.allyId);
    expect(runtime.state.objects[sourceId]).toMatchObject({
      zone: "intent",
      hostId: fixture.allyId,
    });
    expect(runtime.state.combat?.intentIds).toContain(sourceId);
  });
});
