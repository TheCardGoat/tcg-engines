import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAbilityId,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
  GrandArchiveTriggeredAbility,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { resolveGrandArchivePlayers } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "./triggers.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" || type === "ATTACK" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20, power: 1 }
            : type === "ALLY"
              ? { life: 5, power: 1 }
              : type === "WEAPON"
                ? { durability: 1, power: 1 }
                : type === "ATTACK"
                  ? { power: 1 }
                  : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

function trigger(
  id: GrandArchiveAbilityId,
  name: string,
  event: NonNullable<GrandArchiveTriggeredAbility["trigger"]>,
): GrandArchiveTriggeredAbility {
  return {
    id,
    kind: "triggered",
    text: name,
    trigger: event,
    effect: { kind: "no-op" },
  };
}

const champion = card("named-trigger-champion", "CHAMPION");
const filler = card("named-trigger-filler", "ACTION");
const attacker = card("named-trigger-attacker", "ALLY", [
  trigger("attackerOnAttack-a1", "On Attack", {
    kind: "event",
    event: { name: "attack-declared", subject: { kind: "source" } },
  }),
  trigger("attackerOnHit-a2", "On Hit", {
    kind: "event",
    event: { name: "attack-hit", subject: { kind: "source" } },
  }),
  trigger("attackerOnKill-a3", "On Kill", {
    kind: "event",
    event: { name: "object-killed", subject: { kind: "source" } },
  }),
]);
const attack = card("named-trigger-attack", "ATTACK", [
  trigger("intentOnAttack-a1", "On Attack", {
    kind: "event",
    event: { name: "attack-declared", subject: { kind: "source" } },
  }),
  trigger("intentOnHit-a2", "On Hit", {
    kind: "event",
    event: { name: "attack-hit", subject: { kind: "source" } },
  }),
  trigger("intentOnKill-a3", "On Kill", {
    kind: "event",
    event: { name: "object-killed", subject: { kind: "source" } },
  }),
]);
const weapon = card("named-trigger-weapon", "WEAPON", [
  trigger("weaponOnAttack-a1", "On Attack", {
    kind: "event",
    event: { name: "attack-declared", subject: { kind: "source" } },
  }),
  trigger("weaponOnHit-a2", "On Hit", {
    kind: "event",
    event: { name: "attack-hit", subject: { kind: "source" } },
  }),
  trigger("weaponOnKill-a3", "On Kill", {
    kind: "event",
    event: { name: "object-killed", subject: { kind: "source" } },
  }),
]);
const departingAlly = card("named-trigger-departing-ally", "ALLY", [
  trigger("departingOnBanish-a1", "On Banish", {
    kind: "event",
    event: { name: "card-banished", subject: { kind: "source" } },
  }),
  trigger("departingOnDeath-a2", "On Death", {
    kind: "event",
    event: { name: "object-died", subject: { kind: "source" } },
  }),
  trigger("departingOnEnter-a3", "On Enter", {
    kind: "event",
    event: { name: "object-entered-field", subject: { kind: "source" } },
  }),
  trigger("departingOnLeave-a4", "On Leave", {
    kind: "event",
    event: { name: "object-left-field", subject: { kind: "source" } },
  }),
]);

interface Fixture {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly p1: ReturnType<typeof grandArchivePlayerId>;
  readonly p2: ReturnType<typeof grandArchivePlayerId>;
  readonly attackerId: GrandArchiveObjectId;
  readonly attackId: GrandArchiveObjectId;
  readonly weaponId: GrandArchiveObjectId;
  readonly defenderId: GrandArchiveObjectId;
}

function setup(): Fixture {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    attacker,
    attack,
    weapon,
    departingAlly,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: attacker.canonicalId, count: 1 },
            { definitionId: attack.canonicalId, count: 1 },
          ]
        : [{ definitionId: departingAlly.canonicalId, count: 1 }]),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: weapon.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
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
  const find = (ownerId: typeof p1, definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing named-trigger object ${definitionId}`);
    return object.id;
  };
  const attackerId = find(p1, attacker.canonicalId);
  const attackId = find(p1, attack.canonicalId);
  const weaponId = find(p1, weapon.canonicalId);
  const defenderId = find(p2, departingAlly.canonicalId);
  const state = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
    {
      type: "object-moved",
      objectId: attackId,
      from: "main-deck",
      to: "intent",
      hostId: attackerId,
    },
    {
      type: "object-moved",
      objectId: weaponId,
      from: "material-deck",
      to: "field",
      initialCounters: { durability: 1 },
    },
    { type: "object-moved", objectId: defenderId, from: "main-deck", to: "field" },
  ]).state;
  return { program, state, p1, p2, attackerId, attackId, weaponId, defenderId };
}

function triggeredAbilityIds(
  fixture: Fixture,
  transaction: ReturnType<GrandArchiveTransactionKernel["transact"]>,
): readonly string[] {
  return collectGrandArchiveTriggeredAbilityEvents(
    fixture.program,
    transaction.state,
    transaction.result.events,
  ).flatMap((event) => (event.type === "pending-trigger-added" ? [event.trigger.ability.id] : []));
}

function ruleKernel(program: Fixture["program"]): GrandArchiveTransactionKernel {
  return new GrandArchiveTransactionKernel({
    prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
  });
}

describe("Grand Archive named trigger keywords", () => {
  it("emits On Attack for the attacking unit, each intent card, and each wielded weapon", () => {
    const fixture = setup();
    const transaction = ruleKernel(fixture.program).transact(fixture.state, [
      {
        type: "combat-started",
        combat: {
          attackerId: fixture.attackerId,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [fixture.defenderId],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [fixture.weaponId],
          intentIds: [fixture.attackId],
          step: "declaration",
        },
      },
    ]);

    expect([...triggeredAbilityIds(fixture, transaction)].sort()).toEqual(
      ["attackerOnAttack-a1", "intentOnAttack-a1", "weaponOnAttack-a1"].sort(),
    );
  });

  it("emits On Hit for the damage source and every intent or weapon used", () => {
    const fixture = setup();
    const transaction = ruleKernel(fixture.program).transact(fixture.state, [
      {
        type: "damage-marked",
        objectId: fixture.defenderId,
        amount: 1,
        sourceId: fixture.attackerId,
        combatDamage: true,
        combatParticipantIds: [fixture.attackerId, fixture.attackId, fixture.weaponId],
      },
    ]);

    const pendingEvents = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      transaction.state,
      transaction.result.events,
    );
    expect(
      pendingEvents
        .flatMap((event) =>
          event.type === "pending-trigger-added" ? [event.trigger.ability.id] : [],
        )
        .sort(),
    ).toEqual(["attackerOnHit-a2", "intentOnHit-a2", "weaponOnHit-a2"].sort());
    const attackerTrigger = pendingEvents.find(
      (event) =>
        event.type === "pending-trigger-added" && event.trigger.ability.id === "attackerOnHit-a2",
    );
    if (!attackerTrigger || attackerTrigger.type !== "pending-trigger-added") {
      throw new Error("Missing attacker On Hit trigger");
    }
    expect(
      resolveGrandArchivePlayers("event-recipient-controller", {
        program: fixture.program,
        state: transaction.state,
        controllerId: fixture.p1,
        sourceId: fixture.attackerId,
        abilityBearerId: fixture.attackerId,
        bindings: attackerTrigger.trigger.bindings,
      }),
    ).toEqual([fixture.p2]);
  });

  it("emits On Kill only for combat participants credited with the lethal field departure", () => {
    const fixture = setup();
    const transaction = ruleKernel(fixture.program).transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.defenderId,
        from: "field",
        to: "graveyard",
        killedByIds: [fixture.attackerId, fixture.attackId, fixture.weaponId],
        cause: { kind: "rule", rule: "lethal-damage-state-check" },
      },
    ]);

    expect(
      triggeredAbilityIds(fixture, transaction)
        .filter((abilityId) => abilityId.includes("OnKill"))
        .sort(),
    ).toEqual(["attackerOnKill-a3", "intentOnKill-a3", "weaponOnKill-a3"].sort());
  });

  it("distinguishes direct banishment, death, entry, and all field departures", () => {
    const fixture = setup();
    const kernel = ruleKernel(fixture.program);
    const banished = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.defenderId,
        from: "field",
        to: "banishment",
      },
    ]);
    expect([...triggeredAbilityIds(fixture, banished)].sort()).toEqual(
      ["departingOnBanish-a1", "departingOnLeave-a4"].sort(),
    );

    const died = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.defenderId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "lethal-damage-state-check" },
      },
    ]);
    expect([...triggeredAbilityIds(fixture, died)].sort()).toEqual(
      ["departingOnDeath-a2", "departingOnLeave-a4"].sort(),
    );

    const entered = kernel.transact(died.state, [
      {
        type: "object-moved",
        objectId: fixture.defenderId,
        from: "graveyard",
        to: "field",
      },
    ]);
    expect(triggeredAbilityIds(fixture, entered)).toEqual(["departingOnEnter-a3"]);
  });
});
