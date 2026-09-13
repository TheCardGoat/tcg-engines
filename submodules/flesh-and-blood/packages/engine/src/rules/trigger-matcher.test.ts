import type {
  FabEffect,
  FabSingleTriggerEventPattern,
  FabTrigger,
  FabZone,
} from "@tcg/flesh-and-blood-types";
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { normalizeBaseObjectProperties } from "../cards.ts";
import type { FabMatchState } from "../state.ts";
import type { CommittedEvent, FabCommittedEventBatch, FabObjectSnapshot } from "./events.ts";
import {
  matchesTriggerEvent,
  collectEventTriggers,
  collectStateTriggers,
  type FabTriggerSource,
} from "./trigger-matcher.ts";
import { createSyntheticFabObjectSnapshot } from "./snapshots.ts";
import { matchesFabSnapshotFilter } from "./state-rules-view.ts";
import { fabPlayerId } from "../game/identity.ts";

const effect: FabEffect = {
  type: "gain-life",
  amount: 1,
  target: { selector: "controller" },
};

function createState(): FabMatchState {
  return FabTestEngine.createStateForRulesTest({
    seed: "trigger-matcher",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
}

function card(
  instanceId: string,
  controllerId: string,
  zone = "hand",
  name = "Test Attack",
): FabObjectSnapshot {
  return createSyntheticFabObjectSnapshot({
    ref: { instanceId, incarnation: 1 },
    canonicalId: `canonical-${instanceId}`,
    objectKind: "catalog-card",
    baseSource: { kind: "registered" },
    ownerId: controllerId,
    controllerId,
    zone: zone === "arena" ? "arena" : "hand",
    zoneRef: {
      playerId: fabPlayerId(controllerId),
      zone: zone === "arena" ? "arena" : "hand",
    },
    base: normalizeBaseObjectProperties({
      canonicalId: `canonical-${instanceId}`,
      name,
      types: ["Brute", "Action", "Attack"],
      color: "Red",
      cost: 2,
      pitch: 1,
      power: 6,
      defense: 3,
    }),
    counters: {},
  });
}

function weapon(instanceId: string, controllerId: string): FabObjectSnapshot {
  return createSyntheticFabObjectSnapshot({
    ref: { instanceId, incarnation: 1 },
    canonicalId: `canonical-${instanceId}`,
    objectKind: "catalog-card",
    baseSource: { kind: "registered" },
    ownerId: controllerId,
    controllerId,
    zone: "arena",
    zoneRef: { playerId: fabPlayerId(controllerId), zone: "arena" },
    base: normalizeBaseObjectProperties({
      canonicalId: `canonical-${instanceId}`,
      name: "Test Weapon",
      types: ["Warrior", "Weapon", "Sword", "2H"],
      power: 3,
    }),
    counters: {},
  });
}

function committedMetadata(
  id: number,
  actorId: string | null,
  combatStep: "reaction" | null = null,
) {
  return {
    actorId,
    occurrence: {
      occurrenceId: `occurrence-event-${id}` as const,
      kind: "single" as const,
      index: 0,
      size: 1,
      namedEvent: null,
    },
    context: {
      phase: "action" as const,
      combatStep,
      turnNumber: 1,
      combatNumber: null,
      chainLinkNumber: null,
    },
  };
}

function pitchEvent(id: number, object = card(`pitched-${id}`, "p1")): CommittedEvent<"pitch"> {
  return {
    ...committedMetadata(id, object.controllerId ?? object.ownerId),
    name: "pitch",
    processId: "process-1",
    cause: {
      kind: "player-command",
      actorId: object.controllerId ?? object.ownerId,
      command: "pitch",
    },
    controllerId: object.controllerId ?? object.ownerId,
    source: object,
    affected: [object],
    bindings: {},
    data: {
      playerId: object.controllerId ?? object.ownerId,
      object,
      destinationRef: {
        instanceId: object.instanceId,
        incarnation: object.ref.incarnation + 1,
      },
      resourcesGenerated: object.current.numeric.pitch ?? 0,
    },
    eventId: `event-${id}`,
    batchId: "batch-1",
    batchIndex: id - 1,
    batchSize: 1,
    replacementIds: [],
    turnNumber: 1,
  };
}

function modifyPowerEvent(
  id: number,
  object: FabObjectSnapshot,
  from: number,
  to: number,
): CommittedEvent<"modify-power"> {
  return {
    ...committedMetadata(id, "p2", "reaction"),
    name: "modify-power",
    processId: "process-1",
    cause: { kind: "rule", rule: "continuous-effect-reconciliation", controllerId: "p2" },
    controllerId: "p2",
    source: card("pump-source", "p2", "arena"),
    affected: [object],
    bindings: {},
    data: { object, from, to },
    eventId: `event-${id}`,
    batchId: "batch-1",
    batchIndex: 0,
    batchSize: 1,
    replacementIds: [],
    turnNumber: 1,
  };
}

function dealtDamageEvent(id: number, amount: number): CommittedEvent<"dealt-damage"> {
  const attack = card("damage-source", "p1");
  return {
    ...committedMetadata(id, "p1"),
    name: "dealt-damage",
    processId: "process-1",
    cause: { kind: "layer", layerId: "layer-1", source: attack, controllerId: "p1" },
    controllerId: "p1",
    source: attack,
    affected: [attack],
    bindings: {},
    data: {
      source: attack,
      target: { kind: "hero", playerId: "p2" },
      amount,
      damageType: "physical",
    },
    eventId: `event-${id}`,
    batchId: "batch-1",
    batchIndex: 0,
    batchSize: 1,
    replacementIds: [],
    turnNumber: 1,
  };
}

function batch(...events: CommittedEvent[]): FabCommittedEventBatch {
  return { batchId: "batch-1", processId: "process-1", events };
}

function source(trigger: FabTrigger, overrides: Partial<FabTriggerSource> = {}): FabTriggerSource {
  return {
    abilityId: "ability-1",
    controllerId: "p1",
    source: card("source-1", "p1", "arena"),
    trigger,
    resolution: { kind: "effect", effect },
    layerKeywords: [],
    functionalZones: ["permanent"],
    origin: "static",
    ...overrides,
  };
}

const context = {
  evaluateStateCondition: () => true,
};

describe("canonical FAB trigger matcher", () => {
  it("locks the dealt-damage recipient for target-relative follow-up effects", () => {
    const triggerSource = source({
      kind: "event",
      event: {
        name: "dealt-damage",
        actor: { kind: "any" },
        observes: { kind: "none" },
        amount: { op: "gte", value: 4 },
        target: { kind: "hero" },
      },
    });

    const result = collectEventTriggers(
      createState(),
      batch(dealtDamageEvent(1, 4)),
      [triggerSource],
      context,
    );

    expect(result.pendingTriggers).toHaveLength(1);
    expect(result.pendingTriggers[0]?.bindings).toMatchObject({
      "trigger-event-damage": 4,
      "damage-target-controller": "p2",
    });
  });

  it("matches exact contribution delta, subject controller, and reaction step", () => {
    const state = createState();
    state.combat = {
      open: true,
      step: "reaction",
      activeLink: null,
      defenseDeclarationPending: false,
    };
    const attack = card("attack", "p1");
    const triggerSource = source({
      kind: "event",
      event: {
        name: "modify-power",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "event-object",
          selector: "modified-object",
          relationship: {
            kind: "controller",
            player: "ability-controller",
          },
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          bindAs: "it",
        },
        during: {
          kind: "combat-step",
          step: "reaction",
        },
        delta: { op: "eq", value: 1 },
      },
    });

    expect(
      collectEventTriggers(
        state,
        batch(modifyPowerEvent(1, attack, 5, 6)),
        [triggerSource],
        context,
      ).pendingTriggers,
    ).toHaveLength(1);
    expect(
      collectEventTriggers(
        state,
        batch(modifyPowerEvent(2, attack, 5, 7)),
        [triggerSource],
        context,
      ).pendingTriggers,
    ).toEqual([]);
    state.combat.step = "damage";
    const damageStepEvent = modifyPowerEvent(3, attack, 5, 6);
    expect(
      collectEventTriggers(
        state,
        batch({
          ...damageStepEvent,
          context: { ...damageStepEvent.context, combatStep: "damage" },
        }),
        [triggerSource],
        context,
      ).pendingTriggers,
    ).toEqual([]);
  });

  it("matches every listed event-name alternative only for the exact source object", () => {
    const state = createState();
    const self = card("source-1", "p1", "arena");
    const other = card("other", "p1", "arena");
    const triggerSource = source(
      {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "played-card",
              },
            },
            {
              name: "defend",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "defender",
              },
            },
          ],
        },
      },
      { source: self },
    );
    const selfPlay = {
      ...pitchEvent(1, self),
      name: "play" as const,
      data: {
        actorId: "p1",
        object: self,
        destinationRef: null,
        from: "hand" as const,
        role: "action" as const,
        playTiming: "action" as const,
        modes: [],
        targets: {},
        attackTarget: null,
        splitPlayMethod: null,
      },
    } satisfies CommittedEvent<"play">;
    const otherPlay = {
      ...selfPlay,
      data: { ...selfPlay.data, object: other },
      affected: [other],
    } satisfies CommittedEvent<"play">;
    const selfDefend = {
      ...pitchEvent(3, self),
      name: "defend" as const,
      data: {
        actorId: "p1",
        object: self,
        destinationRef: null,
        attack: other,
        from: "hand" as const,
        origin: "hand" as const,
      },
    } satisfies CommittedEvent<"defend">;

    expect(
      collectEventTriggers(state, batch(selfPlay), [triggerSource], context).pendingTriggers,
    ).toHaveLength(1);
    expect(
      collectEventTriggers(state, batch(otherPlay), [triggerSource], context).pendingTriggers,
    ).toEqual([]);
    expect(
      collectEventTriggers(state, batch(selfDefend), [triggerSource], context).pendingTriggers,
    ).toHaveLength(1);
  });

  it("matches filtered defend triggers against the persisted attack snapshot", () => {
    const state = createState();
    const defender = card("source-1", "p1", "arena");
    const actionAttack = card("action-attack", "p2");
    const weaponAttack = weapon("weapon-attack", "p2");
    const triggerSource = source(
      {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Weapon"],
              },
            },
            bindAs: "it",
          },
          target: {
            kind: "any",
          },
        },
      },
      { source: defender },
    );
    const defendEvent = (attack: FabObjectSnapshot) =>
      ({
        ...pitchEvent(1, defender),
        name: "defend" as const,
        affected: [defender],
        bindings: { defendingCard: defender, attack },
        data: {
          actorId: "p1",
          object: defender,
          destinationRef: null,
          attack,
          from: "hand" as const,
          origin: "hand" as const,
        },
      }) satisfies CommittedEvent<"defend">;

    // No live combat is required: the immutable defend receipt owns the
    // attack identity observed at declaration and survives chain closure.
    expect(state.combat).toBeNull();
    const matched = collectEventTriggers(
      state,
      batch(defendEvent(weaponAttack)),
      [triggerSource],
      context,
    ).pendingTriggers;
    expect(matched).toHaveLength(1);
    expect(matched[0]?.bindings.it).toEqual(weaponAttack);
    expect(
      collectEventTriggers(state, batch(defendEvent(actionAttack)), [triggerSource], context)
        .pendingTriggers,
    ).toEqual([]);
  });

  it("matches actor relationships, card filters, and event bindings", () => {
    const state = createState();
    const opponentCard = card("opponent-pitch", "p2");
    const result = collectEventTriggers(
      state,
      batch(pitchEvent(1, opponentCard)),
      [
        source({
          kind: "event",
          event: {
            name: "pitch",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "event-object",
              selector: "pitched-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
                numeric: [
                  {
                    property: "power",
                    basis: "current",
                    comparison: { op: "gte", value: 6 },
                  },
                ],
              },
              bindAs: "pitchedCard",
            },
          },
        }),
      ],
      context,
    );

    expect(result.pendingTriggers).toHaveLength(1);
    expect(result.pendingTriggers[0]!.bindings.pitchedCard).toEqual(opponentCard);
    expect(
      matchesFabSnapshotFilter(state, opponentCard, {
        color: ["red"],
        numeric: [
          {
            property: "cost",
            basis: "current",
            comparison: { op: "eq", value: 2 },
          },
        ],
      }),
    ).toBe(true);
    expect(
      matchesFabSnapshotFilter(state, card("heart", "p2", "hand", "Heart of Fyendal"), {
        name: "Heart of Fyendal",
      }),
    ).toBe(true);
  });

  it("preserves distinct base and current values when filtering immutable LKI", () => {
    const state = createState();
    const original = card("modified", "p1");
    const modified: FabObjectSnapshot = {
      ...original,
      current: {
        ...original.current,
        numeric: { ...original.current.numeric, power: 3 },
      },
    };

    expect(
      matchesFabSnapshotFilter(state, modified, {
        numeric: [
          {
            property: "power",
            basis: "base",
            comparison: { op: "eq", value: 6 },
          },
        ],
      }),
    ).toBe(true);
    expect(
      matchesFabSnapshotFilter(state, modified, {
        numeric: [
          {
            property: "power",
            basis: "current",
            comparison: { op: "eq", value: 3 },
          },
        ],
      }),
    ).toBe(true);
  });

  it("treats an event-scoped object-set binding as exact status provenance", () => {
    const state = createState();
    const revealed = card("revealed", "p2");
    const notRevealed = card("not-revealed", "p2");
    const bindings = { "revealed-this-way": [revealed] } as const;

    expect(
      matchesFabSnapshotFilter(state, revealed, { inObjectBinding: "revealed-this-way" }, bindings),
    ).toBe(true);
    expect(
      matchesFabSnapshotFilter(
        state,
        notRevealed,
        { inObjectBinding: "revealed-this-way" },
        bindings,
      ),
    ).toBe(false);
    expect(
      matchesFabSnapshotFilter(
        state,
        revealed,
        { hasStatus: "attacking" },
        {
          attacking: [revealed],
        },
      ),
    ).toBe(false);
  });

  it("creates one trigger for a multi-event and retains immutable source LKI", () => {
    const state = createState();
    const lki = card("source-1", "p1", "arena");
    const multiOccurrence = {
      occurrenceId: "occurrence-draw-two" as const,
      kind: "multi" as const,
      size: 2,
      namedEvent: "draw-two",
    };
    const result = collectEventTriggers(
      state,
      batch(
        { ...pitchEvent(1), occurrence: { ...multiOccurrence, index: 0 } },
        {
          ...pitchEvent(2),
          batchIndex: 1,
          batchSize: 2,
          occurrence: { ...multiOccurrence, index: 1 },
        },
      ),
      [
        source(
          {
            kind: "event",
            event: {
              name: "pitch",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          { source: lki },
        ),
      ],
      context,
    );

    expect(result.pendingTriggers).toHaveLength(1);
    expect(result.pendingTriggers[0]!.source).toEqual(lki);
    expect(result.pendingTriggers[0]!.simultaneousGroupId).toBe("batch-1");
  });

  it("tracks ordinals and limits by their rules window", () => {
    const state = createState();
    const triggerSource = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      { limit: { count: 1, per: "turn", ordinals: [2] } },
    );
    const first = collectEventTriggers(state, batch(pitchEvent(1)), [triggerSource], context);
    expect(first.pendingTriggers).toEqual([]);

    state.triggerLimitUsage = { ...first.triggerLimitUsage };
    const second = collectEventTriggers(state, batch(pitchEvent(2)), [triggerSource], context);
    expect(second.pendingTriggers).toHaveLength(1);

    state.triggerLimitUsage = { ...second.triggerLimitUsage };
    const third = collectEventTriggers(state, batch(pitchEvent(3)), [triggerSource], context);
    expect(third.pendingTriggers).toEqual([]);
  });

  it("scopes 'first time each hero' limits to the event actor", () => {
    const state = createState();
    const triggerSource = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: { kind: "any" },
          observes: { kind: "none" },
        },
      },
      { limit: { count: 1, per: "turn", ordinals: [1], scope: "actor" } },
    );

    const firstHero = collectEventTriggers(
      state,
      batch(pitchEvent(1, card("p1-first", "p1"))),
      [triggerSource],
      context,
    );
    expect(firstHero.pendingTriggers).toHaveLength(1);
    state.triggerLimitUsage = { ...firstHero.triggerLimitUsage };

    const secondHero = collectEventTriggers(
      state,
      batch(pitchEvent(2, card("p2-first", "p2"))),
      [triggerSource],
      context,
    );
    expect(secondHero.pendingTriggers).toHaveLength(1);
    state.triggerLimitUsage = { ...secondHero.triggerLimitUsage };

    const firstHeroAgain = collectEventTriggers(
      state,
      batch(pitchEvent(3, card("p1-second", "p1"))),
      [triggerSource],
      context,
    );
    expect(firstHeroAgain.pendingTriggers).toEqual([]);
  });

  it("CR 6.6.5d — a replacement source does not reset a controller-scoped 'first each turn' ordinal", () => {
    const state = createState();
    const firstSource = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      {
        limit: { count: 1, per: "turn", ordinals: [1] },
        source: card("early-source", "p1", "arena"),
        abilityId: "first-pitch",
      },
    );
    const replacement = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      {
        limit: { count: 1, per: "turn", ordinals: [1] },
        source: card("late-source", "p1", "arena"),
        abilityId: "first-pitch",
      },
    );

    const first = collectEventTriggers(state, batch(pitchEvent(1)), [firstSource], context);
    expect(first.pendingTriggers).toHaveLength(1);
    state.triggerLimitUsage = { ...first.triggerLimitUsage };

    const second = collectEventTriggers(state, batch(pitchEvent(2)), [replacement], context);
    expect(second.pendingTriggers).toEqual([]);

    state.turnNumber = 2;
    const nextTurn = collectEventTriggers(state, batch(pitchEvent(3)), [replacement], context);
    expect(nextTurn.pendingTriggers).toHaveLength(1);
  });

  it("counts a multi-event batch as one ordinal occurrence", () => {
    const state = createState();
    const triggerSource = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      { limit: { count: 1, per: "turn", ordinals: [1] } },
    );
    const result = collectEventTriggers(
      state,
      batch(pitchEvent(1), { ...pitchEvent(2), batchIndex: 1, batchSize: 2 }),
      [triggerSource],
      context,
    );
    expect(result.pendingTriggers).toHaveLength(1);
  });

  it("keeps subject:self ordinals per instance so two copies each fire once", () => {
    const state = createState();
    const kissA = card("kiss-a", "p1", "arena");
    const kissB = card("kiss-b", "p1", "arena");
    const triggerA = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "pitched-card",
          },
        },
      },
      { source: kissA, limit: { count: 1, per: "turn", ordinals: [1] }, abilityId: "kiss" },
    );
    const triggerB = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "pitched-card",
          },
        },
      },
      { source: kissB, limit: { count: 1, per: "turn", ordinals: [1] }, abilityId: "kiss" },
    );

    const first = collectEventTriggers(
      state,
      batch(pitchEvent(1, kissA)),
      [triggerA, triggerB],
      context,
    );
    expect(first.pendingTriggers.map((pending) => pending.source.instanceId)).toEqual(["kiss-a"]);
    state.triggerLimitUsage = { ...first.triggerLimitUsage };

    const second = collectEventTriggers(
      state,
      batch(pitchEvent(2, kissB)),
      [triggerA, triggerB],
      context,
    );
    expect(second.pendingTriggers.map((pending) => pending.source.instanceId)).toEqual(["kiss-b"]);
  });

  it("does not share ordinals across distinct trigger-condition fingerprints", () => {
    const state = createState();
    const yours = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      { limit: { count: 1, per: "turn", ordinals: [1] }, abilityId: "yours" },
    );
    const theirs = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
      },
      { limit: { count: 1, per: "turn", ordinals: [1] }, abilityId: "theirs" },
    );
    const opponentCard = card("opp-pitch", "p2");

    const first = collectEventTriggers(state, batch(pitchEvent(1)), [yours, theirs], context);
    expect(first.pendingTriggers.map((pending) => pending.abilityId)).toEqual(["yours"]);
    state.triggerLimitUsage = { ...first.triggerLimitUsage };

    const second = collectEventTriggers(
      state,
      batch(pitchEvent(2, opponentCard)),
      [yours, theirs],
      context,
    );
    expect(second.pendingTriggers.map((pending) => pending.abilityId)).toEqual(["theirs"]);
  });

  it("does not consume an ordinal when only the event pattern matches", () => {
    const state = createState();
    let allowState = false;
    const gated = {
      evaluateStateCondition: () => allowState,
    };
    const triggerSource = source(
      {
        kind: "event-and-state",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: { type: "performed-this-turn", event: "hit", player: "controller" },
      },
      { limit: { count: 1, per: "turn", ordinals: [1] } },
    );

    const first = collectEventTriggers(state, batch(pitchEvent(1)), [triggerSource], gated);
    expect(first.pendingTriggers).toEqual([]);
    state.triggerLimitUsage = { ...first.triggerLimitUsage };

    allowState = true;
    const second = collectEventTriggers(state, batch(pitchEvent(2)), [triggerSource], gated);
    expect(second.pendingTriggers).toHaveLength(1);
  });

  it("CR 6.6.2/6.6.2a — an inline-triggered effect triggers only in its generation window", () => {
    const state = createState();
    const inline = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      { origin: "inline", source: card("inline-source", "p1", "arena") },
    );
    // Generation window: the first batch the inline effect exists in does NOT
    // meet its condition (a non-pitch event) → no trigger, and the discrete
    // effect's window closes for good.
    const nonMatching = batch({ ...pitchEvent(1), name: "draw" as never });
    const first = collectEventTriggers(state, nonMatching, [inline], context);
    expect(first.pendingTriggers).toEqual([]);

    // CR 6.6.2a: a LATER matching event does not retroactively fire it.
    state.triggerLimitUsage = { ...first.triggerLimitUsage };
    const later = collectEventTriggers(state, batch(pitchEvent(2)), [inline], context);
    expect(later.pendingTriggers).toEqual([]);
  });

  it("CR 6.6.2 — an inline-triggered effect DOES fire when its generation window meets the condition", () => {
    const state = createState();
    const inline = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      { origin: "inline", source: card("inline-source", "p1", "arena") },
    );
    const immediate = collectEventTriggers(state, batch(pitchEvent(1)), [inline], context);
    expect(immediate.pendingTriggers).toHaveLength(1);
    // The discrete effect is spent after its generation-window trigger.
    state.triggerLimitUsage = { ...immediate.triggerLimitUsage };
    const again = collectEventTriggers(state, batch(pitchEvent(2)), [inline], context);
    expect(again.pendingTriggers).toEqual([]);
  });

  it("CR 6.6.2 contrast — a static-triggered effect keeps firing at later boundaries", () => {
    const state = createState();
    const stat = source({
      kind: "event",
      event: {
        name: "pitch",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "none",
        },
      },
    });
    const first = collectEventTriggers(
      state,
      batch({ ...pitchEvent(1), name: "draw" as never }),
      [stat],
      context,
    );
    expect(first.pendingTriggers).toEqual([]);
    state.triggerLimitUsage = { ...first.triggerLimitUsage };
    const later = collectEventTriggers(state, batch(pitchEvent(2)), [stat], context);
    expect(later.pendingTriggers).toHaveLength(1);
  });

  it("CR 6.6.2a — an inline state-triggered effect does not fire when the state turns true after its window", () => {
    const state = createState();
    const inline = source(
      {
        kind: "state",
        state: { type: "turn-player", who: "self" },
      },
      { origin: "inline", source: card("inline-state-source", "p1", "arena") },
    );
    let conditionHolds = false;
    const mutableContext = {
      ...context,
      evaluateStateCondition: () => conditionHolds,
    };
    // Generation scan: the state condition does not hold → no trigger, window closes.
    const first = collectStateTriggers(state, [inline], new Set(), mutableContext, "scan-1");
    expect(first.pendingTriggers).toEqual([]);

    // The state later turns true — the discrete inline effect is gone (6.6.2a).
    conditionHolds = true;
    state.triggerLimitUsage = { ...first.triggerLimitUsage };
    const second = collectStateTriggers(state, [inline], new Set(), mutableContext, "scan-2");
    expect(second.pendingTriggers).toEqual([]);
  });

  it("counts a prevented trigger toward its limit", () => {
    const state = createState();
    const triggerSource = source(
      {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      { limit: { count: 1, per: "turn" }, origin: "delayed" },
    );
    const prevented = collectEventTriggers(state, batch(pitchEvent(1)), [triggerSource], {
      ...context,
      isTriggerPrevented: () => true,
    });
    expect(prevented.pendingTriggers).toEqual([]);

    state.triggerLimitUsage = { ...prevented.triggerLimitUsage };
    const next = collectEventTriggers(state, batch(pitchEvent(2)), [triggerSource], context);
    expect(next.pendingTriggers).toEqual([]);
  });

  it("first-class fused on-attack collects when the attack carries a fusion fact", () => {
    const state = createState();
    const attack = createSyntheticFabObjectSnapshot({
      ref: { instanceId: "shockwave", incarnation: 1 },
      canonicalId: "canonical-shockwave",
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: "p1",
      controllerId: "p1",
      zone: "combat-chain",
      zoneRef: { playerId: fabPlayerId("p1"), zone: "combatChain" },
      base: normalizeBaseObjectProperties({
        canonicalId: "canonical-shockwave",
        name: "Arcanic Shockwave",
        types: ["Elemental", "Runeblade", "Action", "Attack"],
      }),
      declarationFacts: [{ kind: "fusion", revealedSupertypes: ["Lightning"] }],
    });
    const attackEvent = {
      ...committedMetadata(1, "p1"),
      name: "attack",
      processId: "process-1",
      cause: { kind: "layer", layerId: "layer-1", source: attack, controllerId: "p1" },
      controllerId: "p1",
      source: attack,
      affected: [attack],
      bindings: {},
      data: {
        actorId: "p1",
        object: attack,
        target: { kind: "hero", playerId: fabPlayerId("p2") },
        defendingPlayerId: "p2",
      },
      eventId: "event-1",
      batchId: "batch-1",
      batchIndex: 0,
      batchSize: 1,
      replacementIds: [],
      turnNumber: 1,
    } satisfies CommittedEvent<"attack">;
    const triggerSource = source(
      {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          fused: true,
        },
      },
      {
        source: attack,
        abilityCondition: { type: "has-status", status: "fused" },
      },
    );
    expect(
      collectEventTriggers(state, batch(attackEvent), [triggerSource], {
        evaluateStateCondition: () => false,
      }).pendingTriggers,
    ).toHaveLength(1);
    const unfused = createSyntheticFabObjectSnapshot({
      ref: { instanceId: "shockwave", incarnation: 1 },
      canonicalId: "canonical-shockwave",
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: "p1",
      controllerId: "p1",
      zone: "combat-chain",
      zoneRef: { playerId: fabPlayerId("p1"), zone: "combatChain" },
      base: normalizeBaseObjectProperties({
        canonicalId: "canonical-shockwave",
        name: "Arcanic Shockwave",
        types: ["Elemental", "Runeblade", "Action", "Attack"],
      }),
    });
    const unfusedEvent = {
      ...attackEvent,
      source: unfused,
      affected: [unfused],
      data: { ...attackEvent.data, object: unfused },
    };
    expect(
      collectEventTriggers(state, batch(unfusedEvent), [triggerSource], {
        evaluateStateCondition: () => false,
      }).pendingTriggers,
    ).toEqual([]);
  });

  it("put-into-graveyard actor:opponent ignores combat-close rule events", () => {
    const state = createState();
    const cardInGy = card("nasty", "p1", "hand");
    const triggerSource = source(
      {
        kind: "event",
        event: {
          name: "put-into-graveyard",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      { source: cardInGy },
    );
    const ruleClose = {
      ...committedMetadata(1, null),
      name: "put-into-graveyard",
      processId: "process-1",
      cause: { kind: "rule", rule: "combat-chain-clears", controllerId: "p2" },
      controllerId: "p2",
      source: cardInGy,
      affected: [cardInGy],
      bindings: {},
      data: {
        object: cardInGy,
        destinationRef: { instanceId: "nasty", incarnation: 2 },
        from: "combat-chain",
        to: "graveyard",
        reason: "put-into-graveyard",
        transition: {
          before: cardInGy,
          after: cardInGy,
          identity: "reset",
        },
      },
      eventId: "event-1",
      batchId: "batch-1",
      batchIndex: 0,
      batchSize: 1,
      replacementIds: [],
      turnNumber: 1,
    } satisfies CommittedEvent<"put-into-graveyard">;
    expect(
      collectEventTriggers(state, batch(ruleClose), [triggerSource], context).pendingTriggers,
    ).toEqual([]);
    const effectDestroy = {
      ...ruleClose,
      actorId: "p2",
      cause: { kind: "layer", layerId: "layer-1", source: card("cnc", "p2"), controllerId: "p2" },
    } satisfies CommittedEvent<"put-into-graveyard">;
    expect(
      collectEventTriggers(state, batch(effectDestroy), [triggerSource], context).pendingTriggers,
    ).toHaveLength(1);
  });

  it("collects an eligible state trigger and suppresses the same pending layer", () => {
    const state = createState();
    const stateSource = source({
      kind: "state",
      state: { type: "turn-player", who: "self" },
    });
    const collected = collectStateTriggers(
      state,
      [stateSource],
      new Set(),
      context,
      "state-group-1",
    );

    expect(collected.pendingTriggers).toMatchObject([
      {
        abilityId: "ability-1",
        simultaneousGroupId: "state-group-1",
        trigger: { state: { type: "turn-player", who: "self" } },
      },
    ]);
    expect(
      collectStateTriggers(
        state,
        [stateSource],
        new Set(["source-1:ability-1"]),
        context,
        "state-group-2",
      ).pendingTriggers,
    ).toEqual([]);
  });
});

function moveZoneEvent(
  id: number,
  object: FabObjectSnapshot,
  zoneMove: {
    from: FabZone | "arena" | "unknown";
    to: FabZone | "arena" | "unknown";
    faceDown?: boolean;
  },
): CommittedEvent<"move-zone"> {
  return {
    ...committedMetadata(id, object.controllerId ?? object.ownerId),
    name: "move-zone",
    processId: "process-1",
    cause: { kind: "player-command", actorId: "p1", command: "play" },
    controllerId: object.controllerId ?? object.ownerId,
    source: object,
    affected: [object],
    bindings: {},
    data: {
      object,
      destinationRef: {
        instanceId: object.instanceId,
        incarnation: object.ref.incarnation + 1,
      },
      from: zoneMove.from,
      to: zoneMove.to,
      reason: "move",
      ...(zoneMove.faceDown === undefined ? {} : { faceDown: zoneMove.faceDown }),
    },
    eventId: `event-${id}`,
    batchId: "batch-1",
    batchIndex: id - 1,
    batchSize: 1,
    replacementIds: [],
    turnNumber: 1,
  };
}

describe("zone-move faceDown orientation gate", () => {
  const eventPattern = (faceDown: boolean | undefined): FabSingleTriggerEventPattern => ({
    name: "move-zone",
    actor: { kind: "any" },
    to: "arsenal",
    ...(faceDown === undefined ? {} : { faceDown }),
    observes: { kind: "source", selector: "moved-object" },
  });

  const arrow = card("arrow-1", "p1");

  it("a face-down arsenal put does not satisfy a face-up put trigger", () => {
    expect(
      matchesTriggerEvent(
        createState(),
        moveZoneEvent(1, arrow, { from: "hand", to: "arsenal", faceDown: true }),
        eventPattern(false),
        "p1",
        arrow,
      ),
    ).toBe(false);
  });

  it("an unflagged move is treated as face-up and satisfies the trigger", () => {
    expect(
      matchesTriggerEvent(
        createState(),
        moveZoneEvent(1, arrow, { from: "hand", to: "arsenal" }),
        eventPattern(false),
        "p1",
        arrow,
      ),
    ).toBe(true);
  });

  it("an explicit face-up put satisfies the trigger", () => {
    expect(
      matchesTriggerEvent(
        createState(),
        moveZoneEvent(1, arrow, { from: "deck", to: "arsenal", faceDown: false }),
        eventPattern(false),
        "p1",
        arrow,
      ),
    ).toBe(true);
  });

  it("patterns that omit the constraint stay unaffected by face-down moves", () => {
    expect(
      matchesTriggerEvent(
        createState(),
        moveZoneEvent(1, arrow, { from: "hand", to: "arsenal", faceDown: true }),
        eventPattern(undefined),
        "p1",
        arrow,
      ),
    ).toBe(true);
  });
});
