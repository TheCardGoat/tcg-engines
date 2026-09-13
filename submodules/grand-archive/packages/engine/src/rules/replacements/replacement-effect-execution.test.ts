import {
  assassinsMantle,
  astarteCelestialDawn,
  falseStep,
  frozenDivinity,
  fulguriteCoordinator,
  infernalVessel,
  poisonousBreezecap,
  poisonedDagger,
  spellshieldArcane,
  transfusiveAura,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveActivationState,
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveObjectState,
  GrandArchiveReplacementEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchiveObjectFace } from "../../game/card-runtime.ts";
import {
  grandArchiveObjectId,
  grandArchivePlayerId,
  grandArchiveStackItemId,
  type GrandArchiveObjectId,
} from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../../game/model.ts";
import { composeGrandArchiveCardResolution } from "../../procedures/activation/play-restrictions.ts";
import {
  collectGrandArchiveReplacementCandidates,
  chooseGrandArchiveReplacement,
} from "./replacements.ts";
import { grandArchiveObjectPower } from "../../procedures/combat/combat.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { collectGrandArchiveActionRules } from "../state/rule-modifications.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../abilities/triggers.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "ATTACK" | "CHAMPION" | "ITEM",
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["ARCANE"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { life: 5, power: 3 }
              : type === "ATTACK"
                ? { power: 3 }
                : {},
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("replacement-execution-champion", "CHAMPION");
const ally = card("replacement-execution-ally", "ALLY");
const filler = card("replacement-execution-filler", "ACTION");
const damageItem = card("replacement-execution-damage-item", "ITEM", [
  {
    id: "replacementExecutionDamageItem-a1",
    kind: "activated",
    activation: "ability",
    cost: { kind: "pay-reserve", amount: 0 },
    text: "Deal 3 damage to target unit, then put a resolved counter on this item.",
    targets: [
      {
        id: "damage-target",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        candidates: { kind: "object", zones: ["field"] },
      },
    ],
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "deal-damage",
          recipient: { kind: "bound", binding: "damage-target" },
          amount: 3,
        },
        {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "resolved" },
          amount: 1,
        },
      ],
    },
  },
]);
const replacementAttack = card("replacement-characteristic-attack", "ATTACK");
const characteristicSource = card("replacement-characteristic-source", "ITEM", [
  {
    id: "replacementCharacteristicSource-a1",
    kind: "static",
    staticKind: "effects",
    text: "Attack cards enter the intent with +2 power.",
    effects: [
      {
        kind: "replacement",
        event: {
          name: "card-activated",
          subject: { kind: "event-object", filter: { kind: "type", oneOf: ["ATTACK"] } },
        },
        operation: {
          kind: "modify-characteristic",
          change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
        },
        duration: { kind: "while-source-in-functional-zone" },
      },
      {
        kind: "replacement",
        event: {
          name: "object-entered-field",
          subject: { kind: "event-object", filter: { kind: "type", oneOf: ["ALLY"] } },
        },
        operation: {
          kind: "modify-characteristic",
          change: {
            kind: "grant-ability",
            ability: {
              id: "replacementGrantedOnEnter-a1",
              kind: "triggered",
              text: "On Enter: Put a marked counter on this object.",
              trigger: {
                kind: "event",
                event: { name: "object-entered-field", subject: { kind: "ability-bearer" } },
              },
              effect: {
                kind: "add-counter",
                subject: { kind: "ability-bearer" },
                counter: { named: "marked" },
                amount: 1,
              },
            },
          },
        },
        duration: { kind: "while-source-in-functional-zone" },
      },
      {
        kind: "rule-modification",
        mode: "forbid",
        action: "activate",
        subject: {
          kind: "each",
          collection: {
            zones: ["main-deck"],
            player: "controller",
            filter: { kind: "type", oneOf: ["ATTACK"] },
          },
        },
        duration: { kind: "while-source-in-functional-zone" },
      },
    ],
  },
  {
    id: "replacementCharacteristicSource-a2",
    kind: "card-resolution",
    text: "Draw a card.",
    effect: { kind: "draw", player: "controller", amount: 1 },
  },
]);

function championCard(id: string, level: number) {
  const definition = card(id, "CHAMPION");
  if (definition.layout.kind !== "single-faced") throw new Error("Synthetic champion layout");
  return {
    ...definition,
    layout: {
      ...definition.layout,
      face: {
        ...definition.layout.face,
        cost: { kind: "memory" as const, amount: level },
        stats: { ...definition.layout.face.stats, level },
      },
    },
  };
}

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    damageItem,
    ally,
    filler,
    replacementAttack,
    characteristicSource,
    assassinsMantle,
    astarteCelestialDawn,
    falseStep,
    poisonousBreezecap,
    poisonedDagger,
    fulguriteCoordinator,
    infernalVessel,
    spellshieldArcane,
    transfusiveAura,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 2 },
      { definitionId: filler.canonicalId, count: 6 },
      { definitionId: falseStep.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: assassinsMantle.canonicalId, count: 1 },
            { definitionId: astarteCelestialDawn.canonicalId, count: 1 },
            { definitionId: damageItem.canonicalId, count: 1 },
            { definitionId: replacementAttack.canonicalId, count: 1 },
            { definitionId: characteristicSource.canonicalId, count: 1 },
            { definitionId: poisonousBreezecap.canonicalId, count: 1 },
            { definitionId: poisonedDagger.canonicalId, count: 1 },
            { definitionId: fulguriteCoordinator.canonicalId, count: 1 },
            { definitionId: infernalVessel.canonicalId, count: 1 },
            { definitionId: spellshieldArcane.canonicalId, count: 1 },
            { definitionId: transfusiveAura.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 991,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

function objectId(
  state: GrandArchiveMatchState,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing replacement object ${definitionId}`);
  return object.id;
}

function rulesKernel(fixture: ReturnType<typeof setup>, forceOptional = false) {
  return new GrandArchiveTransactionKernel({
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(fixture.program, state, event),
    chooseReplacement: (candidates) =>
      forceOptional ? candidates[0] : chooseGrandArchiveReplacement(candidates),
  });
}

function spellshieldReplacement(): GrandArchiveReplacementEffect {
  const layout = spellshieldArcane.layout;
  if (layout.kind !== "single-faced") throw new Error("Spellshield: Arcane must be single-faced");
  const ability = layout.face.abilities[1];
  if (ability?.kind !== "card-resolution" || ability.effect.kind !== "replacement") {
    throw new Error("Missing Spellshield: Arcane replacement");
  }
  return ability.effect;
}

function falseStepReplacement(): GrandArchiveReplacementEffect {
  const layout = falseStep.layout;
  if (layout.kind !== "single-faced") throw new Error("False Step must be single-faced");
  const ability = layout.face.abilities[0];
  if (ability?.kind !== "card-resolution" || ability.effect.kind !== "replacement") {
    throw new Error("Missing False Step replacement");
  }
  return ability.effect;
}

describe("Grand Archive replacement effect execution", () => {
  it("applies printed recovery-amount replacements and suppresses recovery reduced to zero", () => {
    const auraFixture = setup();
    const auraId = objectId(auraFixture.state, auraFixture.p1, transfusiveAura.canonicalId);
    const auraChampionId = auraFixture.state.zones[auraFixture.p1].field[0]!;
    const auraReady = rulesKernel(auraFixture).transact(auraFixture.state, [
      {
        type: "object-moved",
        objectId: auraId,
        from: auraFixture.state.objects[auraId]!.zone,
        to: "field",
      },
      { type: "damage-marked", objectId: auraChampionId, amount: 20 },
    ]).state;

    const amplified = rulesKernel(auraFixture).transact(auraReady, [
      {
        type: "damage-removed",
        objectId: auraChampionId,
        amount: 3,
        actorId: auraFixture.p1,
        cause: { kind: "rule", rule: "recover-effect" },
      },
    ]);

    expect(amplified.state.objects[auraChampionId]?.damage).toBe(15);
    expect(amplified.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-removed", amount: 5 }),
    );

    const vesselFixture = setup();
    const vesselId = objectId(vesselFixture.state, vesselFixture.p1, infernalVessel.canonicalId);
    const vesselChampionId = vesselFixture.state.zones[vesselFixture.p1].field[0]!;
    const vesselReady = rulesKernel(vesselFixture).transact(vesselFixture.state, [
      {
        type: "object-moved",
        objectId: vesselId,
        from: vesselFixture.state.objects[vesselId]!.zone,
        to: "field",
      },
      { type: "damage-marked", objectId: vesselChampionId, amount: 5 },
    ]).state;

    const reducedToZero = rulesKernel(vesselFixture).transact(vesselReady, [
      {
        type: "damage-removed",
        objectId: vesselChampionId,
        amount: 2,
        actorId: vesselFixture.p1,
        cause: { kind: "rule", rule: "recover-effect" },
      },
    ]);
    expect(reducedToZero.state.objects[vesselChampionId]?.damage).toBe(5);
    expect(reducedToZero.result.events).not.toContainEqual(
      expect.objectContaining({ type: "damage-removed" }),
    );

    const reduced = rulesKernel(vesselFixture).transact(reducedToZero.state, [
      {
        type: "damage-removed",
        objectId: vesselChampionId,
        amount: 5,
        actorId: vesselFixture.p1,
        cause: { kind: "rule", rule: "recover-effect" },
      },
    ]);
    expect(reduced.state.objects[vesselChampionId]?.damage).toBe(3);
    expect(reduced.result.events).toContainEqual(
      expect.objectContaining({ type: "damage-removed", amount: 2 }),
    );
  });

  it("applies printed state and counter replacements to cards entering the field", () => {
    const fixture = setup();
    const daggerId = objectId(fixture.state, fixture.p1, poisonedDagger.canonicalId);
    const coordinatorId = objectId(fixture.state, fixture.p1, fulguriteCoordinator.canonicalId);

    const entered = rulesKernel(fixture).transact(fixture.state, [
      {
        type: "object-moved",
        objectId: daggerId,
        from: fixture.state.objects[daggerId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: coordinatorId,
        from: fixture.state.objects[coordinatorId]!.zone,
        to: "field",
      },
    ]);

    expect(entered.state.objects[daggerId]?.states.has("rested")).toBe(true);
    expect(entered.state.objects[coordinatorId]?.counters.static).toBe(1);
    expect(
      entered.result.events.find(
        (event) => event.type === "object-moved" && event.objectId === daggerId,
      ),
    ).toMatchObject({ entryStates: ["rested"] });
    expect(
      entered.result.events.find(
        (event) => event.type === "object-moved" && event.objectId === coordinatorId,
      ),
    ).toMatchObject({ initialCounters: { static: 1 } });
  });

  it("applies a generated object's own static entry replacement before creation", () => {
    const fixture = setup();
    const printedId = objectId(fixture.state, fixture.p1, poisonedDagger.canonicalId);
    const printed = fixture.state.objects[printedId]!;
    const generatedId = grandArchiveObjectId("generated-poisoned-dagger");
    const generated = {
      ...printed,
      id: generatedId,
      isToken: true,
      zone: "field" as const,
      states: new Set<GrandArchiveObjectState>(),
      activationStates: new Set<GrandArchiveActivationState>(),
      counters: {},
      damage: 0,
    };

    const created = rulesKernel(fixture).transact(fixture.state, [
      { type: "object-created", object: generated },
    ]);

    expect(created.state.objects[generatedId]?.states.has("rested")).toBe(true);
    const creation = created.result.events.find((event) => event.type === "object-created");
    expect(creation?.type === "object-created" && creation.object.states.has("rested")).toBe(true);
  });

  it("carries a replacement power modifier from activation into the intent", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, characteristicSource.canonicalId);
    const attackId = objectId(fixture.state, fixture.p1, replacementAttack.canonicalId);
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: sourceId,
        from: fixture.state.objects[sourceId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: attackId,
        from: fixture.state.objects[attackId]!.zone,
        to: "effects-stack",
      },
    ]).state;
    const item: GrandArchiveStackItem = {
      id: grandArchiveStackItemId(`stack-${staged.nextStackOrdinal}`),
      kind: "card-activation",
      controllerId: fixture.p1,
      sourceId: attackId,
      selectedModeIds: [],
      targets: [],
      cardId: attackId,
      originZone: fixture.state.objects[attackId]!.zone,
      paidCostKind: "none",
      elysianAuraActiveAtAnnouncement: false,
      announcedCardResolutionAbilities: [],
      createdAtVersion: staged.stateVersion,
      activationPhase: staged.turn.phase,
      isCopy: false,
      negated: false,
      opportunityPolicy: "normal",
      activationStates: [],
      activationPayment: [],
      championLevelModifier: 0,
      variables: {},
      bindings: {},
    };

    const activated = rulesKernel(fixture).transact(staged, [
      { type: "stack-item-added", item },
    ]).state;
    const intent = rulesKernel(fixture).transact(activated, [
      {
        type: "object-moved",
        objectId: attackId,
        from: "effects-stack",
        to: "intent",
        hostId: fixture.state.zones[fixture.p1].field[0]!,
        cause: { kind: "stack-item", stackItemId: item.id },
      },
    ]).state;

    expect(grandArchiveObjectPower(fixture.program, intent, intent.objects[attackId]!)).toBe(5);
  });

  it("removes static replacements, action rules, and card resolution text in layer D", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, characteristicSource.canonicalId);
    const attackId = objectId(fixture.state, fixture.p1, replacementAttack.canonicalId);
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: sourceId,
        from: fixture.state.objects[sourceId]!.zone,
        to: "field",
      },
    ]).state;
    const actionRequest = (state: GrandArchiveMatchState) => ({
      action: "activate" as const,
      activationKind: "card" as const,
      playerId: fixture.p1,
      candidateId: attackId,
      fromZone: state.objects[attackId]!.zone,
      evaluation: {
        program: fixture.program,
        state,
        controllerId: fixture.p1,
        sourceId: attackId,
        abilityBearerId: attackId,
        bindings: {},
      },
    });
    const sourceFace = grandArchiveObjectFace(fixture.program, staged.objects[sourceId]!);
    const sourceEvaluation = {
      program: fixture.program,
      state: staged,
      controllerId: fixture.p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings: { silencedSource: [sourceId] },
    };
    expect(collectGrandArchiveActionRules(actionRequest(staged))).toHaveLength(1);
    expect(composeGrandArchiveCardResolution(sourceFace, sourceEvaluation)).toBeDefined();

    const baseKernel = new GrandArchiveTransactionKernel();
    const silenced = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "silencedSource" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "remove-abilities" },
      },
      sourceEvaluation,
      (state, events) => {
        const transaction = baseKernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    expect(collectGrandArchiveActionRules(actionRequest(silenced))).toHaveLength(0);
    expect(
      composeGrandArchiveCardResolution(sourceFace, { ...sourceEvaluation, state: silenced }),
    ).toBeUndefined();

    const attackOnStack = new GrandArchiveTransactionKernel().transact(silenced, [
      {
        type: "object-moved",
        objectId: attackId,
        from: silenced.objects[attackId]!.zone,
        to: "effects-stack",
      },
    ]).state;
    const item: GrandArchiveStackItem = {
      id: grandArchiveStackItemId(`stack-${attackOnStack.nextStackOrdinal}`),
      kind: "card-activation",
      controllerId: fixture.p1,
      sourceId: attackId,
      selectedModeIds: [],
      targets: [],
      cardId: attackId,
      originZone: silenced.objects[attackId]!.zone,
      paidCostKind: "none",
      elysianAuraActiveAtAnnouncement: false,
      announcedCardResolutionAbilities: [],
      createdAtVersion: attackOnStack.stateVersion,
      activationPhase: attackOnStack.turn.phase,
      isCopy: false,
      negated: false,
      opportunityPolicy: "normal",
      activationStates: [],
      activationPayment: [],
      championLevelModifier: 0,
      variables: {},
      bindings: {},
    };
    expect(
      collectGrandArchiveReplacementCandidates(fixture.program, attackOnStack, {
        type: "stack-item-added",
        item,
      }),
    ).toHaveLength(0);
  });

  it("discovers an On Enter ability granted by the entry replacement itself", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, characteristicSource.canonicalId);
    const allyId = objectId(fixture.state, fixture.p1, ally.canonicalId);
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: sourceId,
        from: fixture.state.objects[sourceId]!.zone,
        to: "field",
      },
    ]).state;
    const entered = rulesKernel(fixture).transact(staged, [
      {
        type: "object-moved",
        objectId: allyId,
        from: staged.objects[allyId]!.zone,
        to: "field",
      },
    ]);

    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      entered.state,
      entered.result.events,
    );
    expect(
      triggerEvents.some(
        (event) =>
          event.type === "pending-trigger-added" &&
          event.trigger.sourceId === allyId &&
          event.trigger.ability.id === "replacementGrantedOnEnter-a1",
      ),
    ).toBe(true);
  });

  it("executes Spellshield: Arcane's post-prevention effect with the prevented amount", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, spellshieldArcane.canonicalId);
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const baseKernel = new GrandArchiveTransactionKernel();
    const created = executeGrandArchiveEffect(
      spellshieldReplacement(),
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId,
        abilityBearerId: sourceId,
        bindings: {},
      },
      (state, events) => {
        const transaction = baseKernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    const result = rulesKernel(fixture).transact(created, [
      { type: "damage-marked", objectId: championId, amount: 5 },
    ]);
    expect(result.state.objects[championId]?.damage).toBe(0);
    expect(result.state.objects[championId]?.counters.enlighten).toBe(5);
    expect(result.state.replacementEffects).toEqual([]);
    expect(result.result.events.map((event) => event.type)).toEqual([
      "damage-prevented",
      "counter-changed",
      "replacement-effect-consumed",
    ]);
  });

  it("replaces Astarte's opponent field entry with a face-down banishment", () => {
    const fixture = setup();
    const astarteId = objectId(fixture.state, fixture.p1, astarteCelestialDawn.canonicalId);
    const opponentAllyId = objectId(fixture.state, fixture.p2, ally.canonicalId);
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: astarteId, from: "main-deck", to: "field" },
    ]).state;
    const result = rulesKernel(fixture).transact(staged, [
      { type: "object-moved", objectId: opponentAllyId, from: "main-deck", to: "field" },
    ]);
    expect(result.state.objects[opponentAllyId]).toMatchObject({
      zone: "banishment",
      facing: "face-down",
    });
    expect(
      result.result.events.some(
        (event) =>
          event.type === "object-moved" &&
          event.objectId === opponentAllyId &&
          event.to === "field",
      ),
    ).toBe(false);
  });

  it("performs Assassin's Mantle's cost before damage and then applies its preparation effect", () => {
    const fixture = setup();
    const mantleId = objectId(fixture.state, fixture.p1, assassinsMantle.canonicalId);
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: mantleId, from: "main-deck", to: "field" },
    ]).state;
    const result = rulesKernel(fixture, true).transact(staged, [
      { type: "damage-marked", objectId: championId, amount: 3 },
    ]);
    expect(result.state.objects[mantleId]).toMatchObject({ zone: "banishment" });
    expect(result.state.objects[championId]?.damage).toBe(2);
    expect(result.state.objects[championId]?.counters.preparation).toBe(1);
    expect(result.result.events.map((event) => event.type)).toEqual([
      "object-moved",
      "damage-marked",
      "damage-prevented",
      "counter-changed",
    ]);
  });

  it("resolves Poisonous Breezecap's random linked effect as part of its replacement", () => {
    const fixture = setup();
    const breezecapId = objectId(fixture.state, fixture.p1, poisonousBreezecap.canonicalId);
    const opponentMemoryCardId = objectId(fixture.state, fixture.p2, filler.canonicalId);
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: breezecapId, from: "main-deck", to: "field" },
      {
        type: "object-moved",
        objectId: opponentMemoryCardId,
        from: "main-deck",
        to: "memory",
      },
    ]).state;

    const result = rulesKernel({ ...fixture, state: staged }, true).transact(staged, [
      {
        type: "keyword-action-performed",
        action: "suppress",
        playerId: fixture.p1,
        objectIds: [breezecapId],
        actorId: fixture.p1,
      },
    ]);

    expect(result.state.objects[breezecapId]?.zone).toBe("graveyard");
    expect(result.state.objects[opponentMemoryCardId]?.zone).toBe("banishment");
    expect(result.result.events.map((event) => event.type)).toEqual([
      "object-moved",
      "random-state-changed",
      "object-moved",
    ]);
  });

  it("pauses and resumes False Step's optional linked effect without granting Opportunity", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p2, falseStep.canonicalId);
    const attackerId = objectId(fixture.state, fixture.p1, ally.canonicalId);
    const championId = fixture.state.zones[fixture.p2].field[0]!;
    const created = executeGrandArchiveEffect(
      falseStepReplacement(),
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p2,
        sourceId,
        abilityBearerId: sourceId,
        bindings: {},
      },
      (state, events) => {
        const transaction = new GrandArchiveTransactionKernel().transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const onField = new GrandArchiveTransactionKernel().transact(created, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
    ]).state;
    const prepared: GrandArchiveMatchState = {
      ...onField,
      players: {
        ...onField.players,
        [fixture.p1]: { ...onField.players[fixture.p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    expect(
      runtime.execute(
        { move: "declare-attack", attackerId, targetIds: [championId] },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    for (const playerId of [fixture.p1, fixture.p2, fixture.p1, fixture.p2]) {
      expect(runtime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
    }

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-optional-effect") {
      throw new Error("Expected False Step's optional payment decision");
    }
    expect(runtime.state.objects[championId]?.damage).toBe(1);
    expect(runtime.state.objects[championId]?.states.has("distant")).toBe(true);
    expect(runtime.state.opportunity).toBeNull();
    expect(runtime.state.stack.at(-1)?.kind).toBe("replacement-follow-up");
    expect(
      projectGrandArchiveViewerState(fixture.program, runtime.state, fixture.p2).stack,
    ).toEqual([]);

    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: false,
        },
        { playerId: fixture.p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.stack).toHaveLength(0);
  });

  it("resumes the parent ability after an interactive replacement follow-up", () => {
    const fixture = setup();
    const replacementSourceId = objectId(fixture.state, fixture.p2, falseStep.canonicalId);
    const damageItemId = objectId(fixture.state, fixture.p1, damageItem.canonicalId);
    const championId = fixture.state.zones[fixture.p2].field[0]!;
    const created = executeGrandArchiveEffect(
      falseStepReplacement(),
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p2,
        sourceId: replacementSourceId,
        abilityBearerId: replacementSourceId,
        bindings: {},
      },
      (state, events) => {
        const transaction = new GrandArchiveTransactionKernel().transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const prepared = new GrandArchiveTransactionKernel().transact(created, [
      { type: "object-moved", objectId: damageItemId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: damageItemId,
          abilityId: "replacementExecutionDamageItem-a1",
          targets: { "damage-target": [championId] },
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-optional-effect") {
      throw new Error("Expected nested False Step decision");
    }
    expect(runtime.state.objects[championId]?.damage).toBe(1);
    expect(runtime.state.objects[damageItemId]?.counters["named:resolved"]).toBeUndefined();
    expect(runtime.state.resolution?.stackItemId).toBe(runtime.state.stack.at(-1)?.id);

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );
    expect(
      restored.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: false,
        },
        { playerId: fixture.p2 },
      ).ok,
    ).toBe(true);
    expect(restored.state.objects[damageItemId]?.counters["named:resolved"]).toBe(1);
    expect(restored.state.resolution).toBeNull();
    expect(restored.state.stack).toHaveLength(0);
  });

  it("binds Frozen Divinity's level-up card and checks the previous champion before replacing", () => {
    const baseChampion = championCard("replacement-level-zero", 0);
    const levelTwo = championCard("replacement-level-two", 2);
    const levelThree = championCard("replacement-level-three", 3);
    const program = createGrandArchiveMatchProgram([
      baseChampion,
      levelTwo,
      levelThree,
      ally,
      filler,
      frozenDivinity,
    ]);
    const player = (
      id: "p1" | "p2",
      includeFrozenDivinity: boolean,
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ally.canonicalId, count: 2 },
        { definitionId: filler.canonicalId, count: 6 },
        ...(includeFrozenDivinity ? [{ definitionId: frozenDivinity.canonicalId, count: 1 }] : []),
      ],
      materialDeck: [
        { definitionId: baseChampion.canonicalId, count: 1 },
        { definitionId: levelTwo.canonicalId, count: 1 },
        { definitionId: levelThree.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: baseChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1", true), player("p2", false)],
        firstPlayerId: "p1",
        randomSeed: 997,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = objectId(initial, p1, frozenDivinity.canonicalId);
    const championId = initial.zones[p2].field[0]!;
    const levelTwoId = objectId(initial, p2, levelTwo.canonicalId);
    const levelThreeId = objectId(initial, p2, levelThree.canonicalId);
    const staged = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
    ]).state;
    const kernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const levelTwoResult = kernel.transact(staged, [
      { type: "champion-leveled-up", championId, cardId: levelTwoId, actorId: p2 },
    ]);
    expect(levelTwoResult.result.events).toEqual([
      expect.objectContaining({
        type: "champion-leveled-up",
        championId,
        cardId: levelTwoId,
        previousActiveDefinitionId: undefined,
      }),
    ]);
    expect(levelTwoResult.state.objects[championId]?.activeDefinitionId).toBe(levelTwo.canonicalId);

    const result = kernel.transact(levelTwoResult.state, [
      { type: "champion-leveled-up", championId, cardId: levelThreeId, actorId: p2 },
    ]);
    const levelThreeBefore = levelTwoResult.state.objects[levelThreeId]!;
    expect(result.result.events).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: levelThreeId,
        from: "material-deck",
        to: "material-deck",
      }),
    ]);
    expect(result.state.objects[championId]?.activeDefinitionId).toBe(levelTwo.canonicalId);
    expect(result.state.objects[levelThreeId]?.zone).toBe("material-deck");
    expect(result.state.objects[levelThreeId]).toEqual(levelThreeBefore);
  });
});
