import { seiryuusCommand, shadowsTwin } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveTriggerMultiplierEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "./triggers.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["RANGER"],
          subtypes: type === "ALLY" ? ["BEAST"] : [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 30 } : { life: 5, power: 1 },
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("trigger-multiplier-champion", "CHAMPION");
const filler = card("trigger-multiplier-filler", "ACTION");
const beast = card("trigger-multiplier-beast", "ALLY", [
  {
    id: "triggerMultiplierBeast-a1",
    kind: "triggered",
    text: "On Attack: Put a charge counter on this object.",
    trigger: { kind: "event", event: { name: "attack-declared", subject: { kind: "source" } } },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "charge" },
      amount: 1,
    },
  },
  {
    id: "triggerMultiplierBeast-a2",
    kind: "triggered",
    text: "On Hit: Put a hit counter on this object.",
    trigger: { kind: "event", event: { name: "attack-hit", subject: { kind: "source" } } },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "hit" },
      amount: 1,
    },
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    beast,
    seiryuusCommand,
    shadowsTwin,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: beast.canonicalId, count: 1 },
            { definitionId: seiryuusCommand.canonicalId, count: 1 },
            { definitionId: shadowsTwin.canonicalId, count: 1 },
          ]
        : []),
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
      randomSeed: 867,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (ownerId: typeof p1, definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing trigger multiplier object ${definitionId}`);
    return object.id;
  };
  const beastId = find(p1, beast.canonicalId);
  const shadowId = find(p1, shadowsTwin.canonicalId);
  const commandId = find(p1, seiryuusCommand.canonicalId);
  const defenderId = find(p2, champion.canonicalId);
  const state = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: beastId, from: initial.objects[beastId]!.zone, to: "field" },
    {
      type: "object-moved",
      objectId: shadowId,
      from: initial.objects[shadowId]!.zone,
      to: "field",
    },
  ]).state;
  return { program, state, p1, p2, beastId, shadowId, commandId, defenderId };
}

function seiryuusMultiplier(): GrandArchiveTriggerMultiplierEffect {
  if (seiryuusCommand.layout.kind !== "single-faced") {
    throw new Error("Seiryuu's Command must be single-faced");
  }
  const ability = seiryuusCommand.layout.face.abilities[1];
  if (ability?.kind !== "card-resolution" || ability.effect.kind !== "trigger-multiplier") {
    throw new Error("Missing Seiryuu's Command trigger multiplier");
  }
  return ability.effect;
}

function executeMultiplier(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
): GrandArchiveMatchState {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    seiryuusMultiplier(),
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      sourceId: fixture.commandId,
      abilityBearerId: fixture.commandId,
      abilityId: "v9d2242357-a2",
      bindings: { "target-beast": [fixture.beastId] },
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  ).state;
}

function triggerAbilityIds(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  events: GrandArchiveMatchState["eventHistory"],
): readonly string[] {
  return collectGrandArchiveTriggeredAbilityEvents(fixture.program, state, events).flatMap(
    (event) => (event.type === "pending-trigger-added" ? [event.trigger.ability.id] : []),
  );
}

describe("Grand Archive trigger multipliers", () => {
  it("uses Shadow's Twin to add an instance of each matching On Hit ability", () => {
    const fixture = setup();
    const transaction = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "damage-marked",
        objectId: fixture.defenderId,
        amount: 1,
        sourceId: fixture.beastId,
        combatDamage: true,
        combatParticipantIds: [fixture.beastId, fixture.shadowId],
      },
    ]);
    expect(
      triggerAbilityIds(fixture, transaction.state, transaction.result.events).filter(
        (abilityId) => abilityId === "triggerMultiplierBeast-a2",
      ),
    ).toHaveLength(2);
  });

  it("persists Seiryuu's set-total multiplier and triggers the target Beast twice", () => {
    const fixture = setup();
    const multiplied = executeMultiplier(fixture, fixture.state);
    expect(multiplied.continuousEffects.at(-1)?.effect.kind).toBe("trigger-multiplier");
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(multiplied))),
    );
    const transaction = new GrandArchiveTransactionKernel().transact(restored, [
      {
        type: "combat-started",
        combat: {
          attackerId: fixture.beastId,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [fixture.defenderId],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [],
          step: "declaration",
        },
      },
    ]);
    expect(
      triggerAbilityIds(fixture, transaction.state, transaction.result.events).filter(
        (abilityId) => abilityId === "triggerMultiplierBeast-a1",
      ),
    ).toHaveLength(2);
  });
});
