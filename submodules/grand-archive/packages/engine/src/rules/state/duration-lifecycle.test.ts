import {
  auspiciousManifestation,
  augustineVotaryOfYore,
  blessedClergy,
  freezingHail,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveContinuousEffect,
  GrandArchiveEffect,
  GrandArchiveRuleModification,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveContinuousEffectIsActive } from "./continuous.ts";
import {
  createGrandArchiveDelayedTrigger,
  grandArchiveDelayedTriggerIsActive,
} from "../abilities/delayed-triggers.ts";
import { anchorGrandArchiveDuration, grandArchiveDurationStatus } from "./durations.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import type { GrandArchiveExecutionBinding } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { grandArchiveRuleModificationIsActive } from "./rule-modifications.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "./state-based.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        elements: ["WATER"],
        stats: type === "CHAMPION" ? { level: 0, life: 30 } : { power: 1, life: 5 },
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("duration-champion", "CHAMPION");
const ally = card("duration-ally", "ALLY");
const filler = card("duration-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ally,
    filler,
    auspiciousManifestation,
    augustineVotaryOfYore,
    blessedClergy,
    freezingHail,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 2 },
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: auspiciousManifestation.canonicalId, count: 1 },
            { definitionId: augustineVotaryOfYore.canonicalId, count: 1 },
            { definitionId: blessedClergy.canonicalId, count: 1 },
            { definitionId: freezingHail.canonicalId, count: 1 },
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
      randomSeed: 811,
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
  if (!object) throw new Error(`Missing duration test object ${definitionId}`);
  return object.id;
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  sourceId: GrandArchiveObjectId,
  bindings: Readonly<Record<string, GrandArchiveExecutionBinding>> = {},
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      sourceId,
      abilityBearerId: sourceId,
      bindings,
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  ).state;
}

function settle(fixture: ReturnType<typeof setup>, state: GrandArchiveMatchState) {
  const kernel = new GrandArchiveTransactionKernel();
  let current = state;
  for (let pass = 0; pass < 32; pass += 1) {
    const events = collectGrandArchiveStateBasedEvents(fixture.program, current);
    if (events.length === 0) return current;
    current = kernel.transact(current, events).state;
  }
  throw new Error("Duration state-based settlement did not converge");
}

describe("Grand Archive phase duration boundaries", () => {
  it("expires an until-end-of-phase effect as the next phase begins", () => {
    const fixture = setup();
    const duration = { kind: "until-end-of-phase", phase: "main" } as const;
    const instance = {
      createdAtVersion: fixture.state.stateVersion,
      createdTurnNumber: fixture.state.turn.number,
      createdPhase: fixture.state.turn.phase,
      durationAnchors: {},
    };
    expect(grandArchiveDurationStatus(duration, instance, { state: fixture.state })).toBe("active");

    const nextPhase = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "phase-changed", phase: "end" },
    ]).state;
    expect(grandArchiveDurationStatus(duration, instance, { state: nextPhase })).toBe("expired");
  });

  it("expires turn-scoped effects when End cleanup begins", () => {
    const fixture = setup();
    const instance = {
      createdAtVersion: fixture.state.stateVersion,
      createdTurnNumber: fixture.state.turn.number,
      createdPhase: fixture.state.turn.phase,
      durationAnchors: { whosePlayerIds: [fixture.p1] },
    };
    expect(
      grandArchiveDurationStatus({ kind: "until-end-of-turn", whose: "controller" }, instance, {
        state: fixture.state,
      }),
    ).toBe("active");
    expect(
      grandArchiveDurationStatus({ kind: "this-turn" }, instance, { state: fixture.state }),
    ).toBe("active");

    const cleanup = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "phase-changed", phase: "end" },
      { type: "turn-cleanup-pending-changed", value: true },
    ]).state;
    expect(
      grandArchiveDurationStatus({ kind: "until-end-of-turn", whose: "controller" }, instance, {
        state: cleanup,
      }),
    ).toBe("expired");
    expect(grandArchiveDurationStatus({ kind: "this-turn" }, instance, { state: cleanup })).toBe(
      "expired",
    );
  });
});

function augustineContinuousEffect(): GrandArchiveContinuousEffect {
  const layout = augustineVotaryOfYore.layout;
  if (layout.kind !== "single-faced") throw new Error("Augustine must be single-faced");
  const face = layout.face;
  const ability = face.abilities[0];
  if (ability?.kind !== "activated" || !ability.cascade)
    throw new Error("Missing Augustine cascade");
  const mode = ability.cascade.modes[0];
  if (!mode || mode.effect.kind !== "sequence") throw new Error("Missing Augustine first mode");
  const effect = mode.effect.effects[0];
  if (effect?.kind !== "continuous") throw new Error("Missing Augustine continuous effect");
  return effect;
}

function blessedClergyRule(): GrandArchiveRuleModification {
  const layout = blessedClergy.layout;
  if (layout.kind !== "single-faced") throw new Error("Blessed Clergy must be single-faced");
  const ability = layout.face.abilities[1];
  if (ability?.kind !== "triggered" || !ability.effect || ability.effect.kind !== "conditional") {
    throw new Error("Missing Blessed Clergy trigger");
  }
  if (ability.effect.then.kind !== "rule-modification") throw new Error("Missing Clergy limit");
  return ability.effect.then;
}

function freezingHailRule(): GrandArchiveRuleModification {
  const layout = freezingHail.layout;
  if (layout.kind !== "single-faced") throw new Error("Freezing Hail must be single-faced");
  const ability = layout.face.abilities[0];
  if (ability?.kind !== "card-resolution" || ability.effect.kind !== "sequence") {
    throw new Error("Missing Freezing Hail resolution");
  }
  const effect = ability.effect.effects[1];
  if (effect?.kind !== "rule-modification") throw new Error("Missing Freezing Hail wake rule");
  return effect;
}

function auspiciousDelayedEffect(): Extract<
  GrandArchiveEffect,
  { readonly kind: "create-delayed-trigger" }
> {
  const layout = auspiciousManifestation.layout;
  if (layout.kind !== "single-faced") {
    throw new Error("Auspicious Manifestation must be single-faced");
  }
  const ability = layout.face.abilities[0];
  if (ability?.kind !== "card-resolution" || ability.effect.kind !== "choose") {
    throw new Error("Missing Auspicious Manifestation resolution");
  }
  if (!ability.effect.effect || ability.effect.effect.kind !== "sequence") {
    throw new Error("Missing Auspicious sequence");
  }
  const effect = ability.effect.effect.effects[1];
  if (effect?.kind !== "create-delayed-trigger") throw new Error("Missing Auspicious trigger");
  return effect;
}

function modificationContext(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  sourceId: GrandArchiveObjectId,
  bindings: Readonly<Record<string, GrandArchiveExecutionBinding>>,
) {
  return {
    program: fixture.program,
    state,
    controllerId: fixture.p1,
    sourceId,
    abilityBearerId: sourceId,
    bindings,
  };
}

describe("Grand Archive duration lifecycle", () => {
  it("keeps Augustine's effect through the controller's next turn and snapshots its boundary", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, augustineVotaryOfYore.canonicalId);
    const targetId = objectId(fixture.state, fixture.p2, ally.canonicalId);
    const onField = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const created = execute(fixture, onField, augustineContinuousEffect(), sourceId, {
      "stripped-object": [targetId],
    });
    expect(created.continuousEffects).toHaveLength(1);

    const opponentTurn = settle(
      fixture,
      new GrandArchiveTransactionKernel().transact(created, [
        { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      ]).state,
    );
    expect(opponentTurn.continuousEffects).toHaveLength(1);
    const controllerTurn = settle(
      fixture,
      new GrandArchiveTransactionKernel().transact(opponentTurn, [
        { type: "turn-started", playerId: fixture.p1, turnNumber: 3 },
      ]).state,
    );
    expect(controllerTurn.continuousEffects).toHaveLength(1);
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(controllerTurn))),
    );
    expect(
      grandArchiveContinuousEffectIsActive(restored.continuousEffects[0]!, {
        program: fixture.program,
        state: restored,
        controllerId: fixture.p1,
        sourceId,
        abilityBearerId: sourceId,
        bindings: { "stripped-object": [targetId] },
      }),
    ).toBe(true);

    const ended = settle(
      fixture,
      new GrandArchiveTransactionKernel().transact(restored, [
        { type: "turn-started", playerId: fixture.p2, turnNumber: 4 },
      ]).state,
    );
    expect(ended.continuousEffects).toEqual([]);
  });

  it("keeps Blessed Clergy's rule pending, active only during the chosen player's next turn", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, blessedClergy.canonicalId);
    const effect = blessedClergyRule();
    const bindings = { "target-player": [fixture.p2] };
    const context = modificationContext(fixture, fixture.state, sourceId, bindings);
    const created = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "rule-modification-created",
        modification: {
          id: "blessed-clergy-next-turn-limit",
          sourceId,
          controllerId: fixture.p1,
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          effect,
          bindings,
          variables: {},
          durationAnchors: anchorGrandArchiveDuration(effect.duration, context),
          createdAtVersion: fixture.state.stateVersion,
          createdTurnNumber: fixture.state.turn.number,
          createdPhase: fixture.state.turn.phase,
        },
      },
    ]).state;
    const pending = settle(fixture, created);
    expect(pending.ruleModifications).toHaveLength(1);
    expect(
      grandArchiveRuleModificationIsActive(
        pending.ruleModifications[0]!,
        { ...context, state: pending },
        fixture.p2,
      ),
    ).toBe(false);

    const targetTurn = settle(
      fixture,
      new GrandArchiveTransactionKernel().transact(pending, [
        { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      ]).state,
    );
    expect(
      grandArchiveRuleModificationIsActive(
        targetTurn.ruleModifications[0]!,
        { ...context, state: targetTurn },
        fixture.p2,
      ),
    ).toBe(true);

    const ended = settle(
      fixture,
      new GrandArchiveTransactionKernel().transact(targetTurn, [
        { type: "turn-started", playerId: fixture.p1, turnNumber: 3 },
      ]).state,
    );
    expect(ended.ruleModifications).toEqual([]);
  });

  it("anchors Freezing Hail to the target's controller and waits through skipped wake-up phases", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, freezingHail.canonicalId);
    const targetId = objectId(fixture.state, fixture.p2, ally.canonicalId);
    const onField = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const created = execute(fixture, onField, freezingHailRule(), sourceId, {
      "target-1": [targetId],
    });
    expect(created.ruleModifications[0]?.durationAnchors.whosePlayerIds).toEqual([fixture.p2]);
    const changedController = new GrandArchiveTransactionKernel().transact(created, [
      { type: "object-controller-changed", objectId: targetId, controllerId: fixture.p1 },
      { type: "phase-skip-added", playerId: fixture.p2, phase: "wake-up" },
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      { type: "phase-skip-consumed", playerId: fixture.p2, phase: "wake-up" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    expect(settle(fixture, changedController).ruleModifications).toHaveLength(1);

    const otherWakeUp = new GrandArchiveTransactionKernel().transact(changedController, [
      { type: "turn-started", playerId: fixture.p1, turnNumber: 3 },
      { type: "phase-changed", phase: "wake-up" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    expect(settle(fixture, otherWakeUp).ruleModifications).toHaveLength(1);
    const targetWakeUp = new GrandArchiveTransactionKernel().transact(otherWakeUp, [
      { type: "turn-started", playerId: fixture.p2, turnNumber: 4 },
      { type: "phase-changed", phase: "wake-up" },
    ]).state;
    expect(settle(fixture, targetWakeUp).ruleModifications).toHaveLength(1);
    const afterWakeUp = new GrandArchiveTransactionKernel().transact(targetWakeUp, [
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    expect(settle(fixture, afterWakeUp).ruleModifications).toEqual([]);
  });

  it("does not expire Auspicious Manifestation's delayed trigger when the next end phase is skipped", () => {
    const fixture = setup();
    const sourceId = objectId(fixture.state, fixture.p1, auspiciousManifestation.canonicalId);
    const targetId = objectId(fixture.state, fixture.p1, ally.canonicalId);
    const effect = auspiciousDelayedEffect();
    const context = modificationContext(fixture, fixture.state, sourceId, {
      "shenju-ally": [targetId],
    });
    const trigger = createGrandArchiveDelayedTrigger(effect, context);
    const created = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "delayed-trigger-created", trigger },
    ]).state;
    const skipped = settle(
      fixture,
      new GrandArchiveTransactionKernel().transact(created, [
        { type: "phase-skip-added", playerId: fixture.p1, phase: "end" },
        { type: "phase-skip-consumed", playerId: fixture.p1, phase: "end" },
        { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
      ]).state,
    );
    expect(skipped.delayedTriggers).toHaveLength(1);
    expect(grandArchiveDelayedTriggerIsActive(skipped.delayedTriggers[0]!, skipped)).toBe(true);
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(skipped))),
    );
    const inEnd = new GrandArchiveTransactionKernel().transact(restored, [
      { type: "phase-changed", phase: "end" },
    ]).state;
    expect(grandArchiveDelayedTriggerIsActive(inEnd.delayedTriggers[0]!, inEnd)).toBe(true);
    const ended = settle(
      fixture,
      new GrandArchiveTransactionKernel().transact(inEnd, [
        { type: "turn-started", playerId: fixture.p1, turnNumber: 3 },
      ]).state,
    );
    expect(ended.delayedTriggers).toEqual([]);
  });
});
