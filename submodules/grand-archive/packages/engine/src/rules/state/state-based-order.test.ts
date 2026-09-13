import { seekersAetherwing, stiflingAethercharge } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveObjectId, grandArchivePlayerId } from "../../game/identity.ts";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../replacements/replacements.ts";
import { collectGrandArchiveStateBasedEvents } from "./state-based.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  stats: {
    readonly level?: number;
    readonly life?: number;
    readonly power?: number;
    readonly durability?: number;
  } = {},
  supertypes: readonly GrandArchiveSupertype[] = [],
  speed?: "fast",
  subtypes: readonly string[] = [],
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
        typeLine: { supertypes, types: [type], classes: ["MAGE"], subtypes },
        elements: ["NORM"],
        ...(speed ? { speed } : {}),
        stats,
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("state-order-champion", "CHAMPION", { level: 0, life: 20 });
const ally = card("state-order-ally", "ALLY", { life: 2, power: 1 });
const uniqueItem = card("state-order-unique-item", "ITEM", {}, ["UNIQUE"]);
const regaliaItem = card("state-order-regalia-item", "ITEM", {}, ["REGALIA"]);
const filler = card("state-order-filler", "ACTION");
const fastAction = card("state-order-fast-action", "ACTION", {}, [], "fast");
const siegeableDomain = card(
  "state-order-siegeable-domain",
  "DOMAIN",
  { durability: 1 },
  [],
  undefined,
  ["SIEGEABLE"],
);

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ally,
    uniqueItem,
    regaliaItem,
    filler,
    fastAction,
    siegeableDomain,
    seekersAetherwing,
    stiflingAethercharge,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: uniqueItem.canonicalId, count: 2 },
      { definitionId: fastAction.canonicalId, count: 1 },
      { definitionId: siegeableDomain.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: stiflingAethercharge.canonicalId, count: 2 }] : []),
      { definitionId: filler.canonicalId, count: 4 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: regaliaItem.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: seekersAetherwing.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1051,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1") };
}

describe("Grand Archive ordered state-based checks", () => {
  it("cleans every object-specific zone when its host leaves the field", () => {
    const fixture = setup();
    const host = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === seekersAetherwing.canonicalId,
    );
    const loadedCard = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === stiflingAethercharge.canonicalId,
    );
    const lineageCard = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === uniqueItem.canonicalId,
    );
    const regaliaCard = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === regaliaItem.canonicalId,
    );
    if (!host || !loadedCard || !lineageCard || !regaliaCard) {
      throw new Error("Missing object-specific-zone fixture");
    }
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: host.id,
        from: host.zone,
        to: "field",
        initialCounters: { durability: 3 },
      },
      {
        type: "object-moved",
        objectId: loadedCard.id,
        from: loadedCard.zone,
        to: "loaded",
        hostId: host.id,
      },
      {
        type: "object-moved",
        objectId: lineageCard.id,
        from: lineageCard.zone,
        to: "inner-lineage",
        hostId: host.id,
      },
      {
        type: "object-moved",
        objectId: regaliaCard.id,
        from: regaliaCard.zone,
        to: "loaded",
        hostId: host.id,
      },
      { type: "object-moved", objectId: host.id, from: "field", to: "banishment" },
    ]).state;

    const cleanupEvents = collectGrandArchiveStateBasedEvents(fixture.program, positioned);
    expect(cleanupEvents).toHaveLength(3);
    expect(cleanupEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "object-moved",
          objectId: loadedCard.id,
          from: "loaded",
          to: "graveyard",
          cause: { kind: "rule", rule: "object-specific-zone-host-left-field" },
        }),
        expect.objectContaining({
          type: "object-moved",
          objectId: lineageCard.id,
          from: "inner-lineage",
          to: "graveyard",
          cause: { kind: "rule", rule: "object-specific-zone-host-left-field" },
        }),
        expect.objectContaining({
          type: "object-moved",
          objectId: regaliaCard.id,
          from: "loaded",
          to: "banishment",
          cause: { kind: "rule", rule: "object-specific-zone-host-left-field" },
        }),
      ]),
    );
  });

  it("does not preserve object-specific zones when the same host id re-enters the field", () => {
    const fixture = setup();
    const host = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === seekersAetherwing.canonicalId,
    );
    const loadedCard = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === stiflingAethercharge.canonicalId,
    );
    const laterLoadedCard = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 &&
        object.definitionId === stiflingAethercharge.canonicalId &&
        object.id !== loadedCard?.id,
    );
    if (!host || !loadedCard || !laterLoadedCard) {
      throw new Error("Missing re-entered host fixture");
    }

    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: host.id,
        from: host.zone,
        to: "field",
        initialCounters: { durability: 3 },
      },
      {
        type: "object-moved",
        objectId: loadedCard.id,
        from: loadedCard.zone,
        to: "loaded",
        hostId: host.id,
      },
      { type: "object-moved", objectId: host.id, from: "field", to: "banishment" },
      {
        type: "object-moved",
        objectId: host.id,
        from: "banishment",
        to: "field",
        initialCounters: { durability: 3 },
      },
      {
        type: "object-moved",
        objectId: laterLoadedCard.id,
        from: laterLoadedCard.zone,
        to: "loaded",
        hostId: host.id,
      },
    ]).state;

    expect(positioned.objects[host.id]).toMatchObject({ zone: "field" });
    expect(collectGrandArchiveStateBasedEvents(fixture.program, positioned)).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: loadedCard.id,
        from: "loaded",
        to: "graveyard",
        cause: { kind: "rule", rule: "object-specific-zone-host-left-field" },
      }),
    ]);
    expect(positioned.objects[laterLoadedCard.id]).toMatchObject({
      zone: "loaded",
      hostId: host.id,
    });
  });

  it("performs lethal-damage checks before a departed token ceases", () => {
    const fixture = setup();
    const allyObject = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === ally.canonicalId,
    );
    if (!allyObject) throw new Error("Missing state-order ally");
    const token = {
      ...allyObject,
      id: grandArchiveObjectId(`object-${fixture.state.nextObjectOrdinal}`),
      isToken: true,
      zone: "field" as const,
      objectVersion: 1,
    };
    const kernel = new GrandArchiveTransactionKernel();
    const simultaneousState = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: allyObject.id, from: allyObject.zone, to: "field" },
      { type: "object-created", object: token },
      { type: "object-moved", objectId: token.id, from: "field", to: "graveyard" },
      { type: "damage-marked", objectId: allyObject.id, amount: 2 },
    ]).state;

    const damagePass = collectGrandArchiveStateBasedEvents(fixture.program, simultaneousState);
    expect(damagePass).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: allyObject.id,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "lethal-damage-state-check" },
      }),
    ]);
    const afterDamage = kernel.transact(simultaneousState, damagePass).state;
    expect(collectGrandArchiveStateBasedEvents(fixture.program, afterDamage)).toEqual([
      expect.objectContaining({
        type: "object-ceased",
        objectId: token.id,
        from: "graveyard",
      }),
    ]);
  });

  it("performs lethal-damage checks before zero-durability checks", () => {
    const fixture = setup();
    const allyObject = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === ally.canonicalId,
    );
    const domainObject = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === siegeableDomain.canonicalId,
    );
    if (!allyObject || !domainObject) throw new Error("Missing damage/durability order fixture");
    const kernel = new GrandArchiveTransactionKernel({
      prepareEvent: (state, event) =>
        prepareGrandArchiveRuleBoundEvent(fixture.program, state, event),
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(fixture.program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const simultaneousState = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: allyObject.id, from: allyObject.zone, to: "field" },
      { type: "object-moved", objectId: domainObject.id, from: domainObject.zone, to: "field" },
      { type: "damage-marked", objectId: allyObject.id, amount: 2 },
      { type: "counter-changed", objectId: domainObject.id, counter: "durability", delta: -1 },
    ]).state;

    const damagePass = collectGrandArchiveStateBasedEvents(fixture.program, simultaneousState);
    expect(damagePass).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: allyObject.id,
        cause: { kind: "rule", rule: "lethal-damage-state-check" },
      }),
    ]);
    const afterDamage = kernel.transact(simultaneousState, damagePass).state;
    expect(collectGrandArchiveStateBasedEvents(fixture.program, afterDamage)).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: domainObject.id,
        cause: { kind: "rule", rule: "zero-durability-state-check" },
      }),
    ]);
  });

  it("requires a Unique choice before a departed token ceases", () => {
    const fixture = setup();
    const uniqueObjects = Object.values(fixture.state.objects).filter(
      (object) => object.ownerId === fixture.p1 && object.definitionId === uniqueItem.canonicalId,
    );
    const allyObject = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === ally.canonicalId,
    );
    if (uniqueObjects.length !== 2 || !allyObject) throw new Error("Missing Unique fixture");
    const departedToken = {
      ...allyObject,
      id: grandArchiveObjectId(`object-${fixture.state.nextObjectOrdinal}`),
      isToken: true,
      zone: "graveyard" as const,
      objectVersion: 1,
    };
    const state = new GrandArchiveTransactionKernel().transact(fixture.state, [
      ...uniqueObjects.map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "field" as const,
      })),
      { type: "object-created", object: departedToken },
    ]).state;

    expect(collectGrandArchiveStateBasedEvents(fixture.program, state)).toEqual([
      expect.objectContaining({
        type: "decision-created",
        decision: expect.objectContaining({
          kind: "choose-unique-object",
          playerId: fixture.p1,
          candidates: uniqueObjects.map((object) => object.id),
        }),
      }),
    ]);
  });

  it("clears an invalid combat role before removing an orphaned Effects Stack card", () => {
    const fixture = setup();
    const p2 = grandArchivePlayerId("p2");
    const attacker = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === ally.canonicalId,
    );
    const defender = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === ally.canonicalId,
    );
    const action = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === fastAction.canonicalId,
    );
    if (!attacker || !defender || !action) throw new Error("Missing combat-order fixture");
    const kernel = new GrandArchiveTransactionKernel();
    const prepared = kernel.transact(fixture.state, [
      { type: "player-first-turn-completed", playerId: fixture.p1 },
      { type: "player-first-turn-completed", playerId: p2 },
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "object-moved", objectId: defender.id, from: defender.zone, to: "field" },
      { type: "object-moved", objectId: action.id, from: action.zone, to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);
    const declared = runtime.execute(
      { move: "declare-attack", attackerId: attacker.id, targetIds: [defender.id] },
      { playerId: fixture.p1 },
    );
    if (!declared.ok) throw new Error(declared.message);
    expect(
      runtime.execute({ move: "activate-card", cardId: action.id }, { playerId: fixture.p1 }).ok,
    ).toBe(true);
    const actionItem = runtime.state.stack.find(
      (item) => item.kind === "card-activation" && item.cardId === action.id,
    );
    if (!actionItem) throw new Error("Missing fast-action stack item");
    const withoutPendingAction = {
      ...runtime.state,
      stack: runtime.state.stack.filter((item) => item.id !== actionItem.id),
    };
    const invalidDefender = kernel.transact(withoutPendingAction, [
      {
        type: "object-controller-changed",
        objectId: defender.id,
        controllerId: fixture.p1,
      },
    ]).state;

    const combatRolePass = collectGrandArchiveStateBasedEvents(fixture.program, invalidDefender);
    expect(combatRolePass).toEqual([
      expect.objectContaining({
        type: "object-state-changed",
        objectId: defender.id,
        state: "defending",
        value: false,
        cause: { kind: "rule", rule: "invalid-defender-state-check" },
      }),
    ]);
    const afterCombatRole = kernel.transact(invalidDefender, combatRolePass).state;
    expect(collectGrandArchiveStateBasedEvents(fixture.program, afterCombatRole)).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: action.id,
        from: "effects-stack",
        to: "graveyard",
        cause: { kind: "rule", rule: "card-without-pending-stack-instance" },
      }),
    ]);
  });
});
